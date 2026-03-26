import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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
  '.woff2': 'font/woff2'
}

/**
 * En développement : sert le dossier `images/` à la racine du dépôt sous `/images/`.
 * Les pages HTML legacy (boutique, etc.) sont dans `public/` et servies par Vite par défaut.
 */
function legacyDevAssets() {
  return {
    name: 'legacy-dev-assets',
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

export default defineConfig({
  plugins: [react(), legacyDevAssets()]
})
