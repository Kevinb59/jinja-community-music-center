import { cpSync, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Expose GAS_URL_* au client au build (comme sur Vercel : variables sans préfixe VITE_).
 * loadEnv charge .env, .env.local et les variables d’environnement du process (CI / Vercel).
 */
function gasEnvDefine(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  const contact =
    env.GAS_URL_CONTACT || env.VITE_GAS_CONTACT_URL || ''
  const material =
    env.GAS_URL_MATERIAL || env.VITE_GAS_MATERIAL_URL || ''
  return {
    'import.meta.env.GAS_URL_CONTACT': JSON.stringify(contact),
    'import.meta.env.GAS_URL_MATERIAL': JSON.stringify(material),
    'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(
      env.VITE_STRIPE_PUBLISHABLE_KEY || ''
    )
  }
}

/**
 * Injecte les URLs absolues og:image / og:url au build (VITE_SITE_URL ou VERCEL_URL).
 */
function injectSocialMeta(mode) {
  return {
    name: 'inject-social-meta',
    transformIndexHtml(html) {
      const env = loadEnv(mode, process.cwd(), '')
      const siteUrl = (
        env.VITE_SITE_URL ||
        (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : '')
      ).replace(/\/$/, '')
      const ogImage = siteUrl ? `${siteUrl}/og-image.jpg` : '/og-image.jpg'
      const ogUrl = siteUrl ? `${siteUrl}/` : '/'
      return html.replaceAll('__OG_IMAGE__', ogImage).replaceAll('__OG_URL__', ogUrl)
    }
  }
}

// Racine du dépôt : le projet Vite vit à la racine ; `images/` reste à côté de ce fichier.
const repoRoot = __dirname

// Purpose: MIME pour servir `images/` en dev (hors dossier `public/`) avec les bons en-têtes.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg'
}

/**
 * En développement : sert le dossier `images/` à la racine du dépôt sous `/images/`.
 */
function devSiteImages() {
  return {
    name: 'dev-site-images',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET') return next()
        const raw = req.url.split('?')[0]
        let filePath = null
        if (raw.startsWith('/images/')) {
          const rel = decodeURIComponent(raw.slice('/images/'.length))
          if (rel.includes('..') || path.isAbsolute(rel)) return next()
          filePath = path.join(repoRoot, 'images', rel)
        }
        if (!filePath) return next()
        const normalizedFile = path.normalize(filePath)
        const relToRoot = path.relative(repoRoot, normalizedFile)
        if (relToRoot.startsWith('..') || path.isAbsolute(relToRoot)) {
          return next()
        }
        try {
          const st = await fs.stat(normalizedFile)
          if (!st.isFile()) return next()
          const ext = path.extname(normalizedFile).toLowerCase()
          res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
          res.end(await fs.readFile(normalizedFile))
        } catch {
          next()
        }
      })
    }
  }
}

/**
 * Production (Vercel, etc.) : Vite ne met dans dist/ que public/ + le bundle.
 * Ce plugin recopie le dossier `images/` à la racine du dépôt vers `dist/images/`
 * pour que les URLs `/images/...` (galerie, siteCopy) fonctionnent après build.
 */
function copySiteImagesToDist() {
  return {
    name: 'copy-site-images-to-dist',
    apply: 'build',
    closeBundle() {
      const src = path.join(repoRoot, 'images')
      const dest = path.join(repoRoot, 'dist', 'images')
      if (!existsSync(src)) return
      cpSync(src, dest, { recursive: true })
    }
  }
}

/**
 * Dev local : routes /api/stripe/* (même logique que les fonctions Vercel).
 * Nécessite STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET dans .env.
 */
function stripeDevApi(mode) {
  return {
    name: 'stripe-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (req.method !== 'POST' || !url?.startsWith('/api/stripe/')) {
          return next()
        }

        const chunks = []
        req.on('data', (c) => chunks.push(c))
        req.on('end', async () => {
          const raw = Buffer.concat(chunks)
          try {
            if (url === '/api/stripe/create-payment-intent') {
              const { createPaymentIntent } = await import(
                './server/stripe/create-payment-intent.mjs'
              )
              const body = JSON.parse(raw.toString('utf8') || '{}')
              const result = await createPaymentIntent(body)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(result))
              return
            }
            if (url === '/api/stripe/webhook') {
              const { handleStripeWebhook } = await import('./server/stripe/webhook.mjs')
              const result = await handleStripeWebhook(raw, req.headers['stripe-signature'])
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(result))
              return
            }
            next()
          } catch (err) {
            const status = err.statusCode || 500
            res.statusCode = status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Erreur serveur' }))
          }
        })
      })
    }
  }
}

export default defineConfig(({ mode }) => ({
  define: gasEnvDefine(mode),
  plugins: [react(), devSiteImages(), copySiteImagesToDist(), stripeDevApi(mode), injectSocialMeta(mode)]
}))
