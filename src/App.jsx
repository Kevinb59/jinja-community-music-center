/**
 * Page refonte Jinja Community Music Center — contenu aligné sur index.html + script.js (FR).
 * Images : préfixe /images/ (dossier `images/` à la racine ; copié dans dist au build, servi en dev par vite.config.js).
 * Page boutique : fichier dans `public/` (URL racine, ex. /boutique.html).
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Drum,
  FileText,
  HandCoins,
  House,
  Image as ImageIcon,
  Mail,
  MapPin,
  Menu,
  Music2,
  Package,
  Play,
  Shield,
  ShoppingBag,
  X
} from 'lucide-react'
import galleryData from './data/gallery-data.json'
import DonationStripeForm from './DonationStripeForm'
import { submitToGas } from './gasSubmit'
import {
  BRAND_NAME,
  DONATION_BANK_DETAILS,
  legacyPage,
  SHOP_OPEN
} from './siteConfig'
import {
  copy,
  DONOR_COUNTRY_LABELS,
  DONORS_DEMO,
  INSTRUMENTS_NEEDED,
  legalModalBodyHtml,
  paths,
  transparencyModalBodyHtml
} from './siteCopy'

/**
 * Retour à la ligne du slogan officiel après le mot « COMMUNITY » (ligne 1 + ligne 2 dans le menu).
 */
function splitBrandAfterCommunity(brandName) {
  const upper = brandName.toUpperCase()
  const needle = 'COMMUNITY'
  const idx = upper.indexOf(needle)
  if (idx === -1) {
    return { line1: brandName, line2: '' }
  }
  const end = idx + needle.length
  return {
    line1: brandName.slice(0, end).trimEnd(),
    line2: brandName.slice(end).trimStart()
  }
}

const BRAND_SLOGAN_LINES = splitBrandAfterCommunity(BRAND_NAME)

const GALLERY_TABS = [
  { key: 'concert', label: 'Concert' },
  { key: 'centre', label: 'Parc instrumental' },
  { key: 'vie', label: 'Vie' },
  { key: 'repetition', label: 'Répétition' },
  { key: 'creations', label: 'Créations' },
  { key: 'don', label: 'Don' }
]

const NAV_LINKS = [
  { label: 'Le projet', href: '#projet' },
  { label: 'Nos besoins', href: '#besoins' },
  { label: 'Aider', href: '#aider' },
  { label: 'Donner', href: '#don' },
  { label: 'Nos créations', href: '#creations' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Contact', href: '#contact' },
  { label: 'Nos donateurs', href: '#donateurs' }
]

/** ids des sections alignés sur NAV_LINKS (scroll spy + ancres). */
const NAV_TARGET_IDS = NAV_LINKS.map((item) => item.href.replace(/^#/, ''))

const values = [
  {
    icon: Music2,
    accent: 'emerald',
    title: copy.musicTitle,
    text: copy.musicText
  },
  {
    icon: Shield,
    accent: 'sky',
    title: 'Un lieu gratuit et sécurisé',
    text: copy.contextText1 + ' ' + copy.contextText2
  },
  {
    icon: House,
    accent: 'amber',
    title: 'Accueil au quotidien',
    text:
      "Pour de nombreux enfants, le centre est bien plus qu'un lieu d'apprentissage musical. C'est un espace de vie où ils trouvent une présence bienveillante, un accompagnement quotidien et, lorsque les moyens le permettent, des repas et une aide concrète face aux difficultés rencontrées par leurs familles."
  }
]

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Accents icônes cartes : fond pastel + teinte icône assortie. */
const CARD_ICON_ACCENTS = {
  emerald: { box: 'bg-emerald-50', icon: 'text-emerald-600' },
  sky: { box: 'bg-sky-50', icon: 'text-sky-600' },
  violet: { box: 'bg-violet-50', icon: 'text-violet-600' },
  amber: { box: 'bg-amber-50', icon: 'text-amber-600' },
  rose: { box: 'bg-rose-50', icon: 'text-rose-600' },
  teal: { box: 'bg-teal-50', icon: 'text-teal-600' },
  indigo: { box: 'bg-indigo-50', icon: 'text-indigo-600' },
  orange: { box: 'bg-orange-50', icon: 'text-orange-600' }
}

/** Encart icône carré arrondi (cartes valeurs, donner, etc.). */
function CardIconBox({ accent = 'emerald', className = '', children }) {
  const tone = CARD_ICON_ACCENTS[accent] ?? CARD_ICON_ACCENTS.emerald
  return (
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', tone.box, className)}>
      {children}
    </div>
  )
}

function cardIconClass(accent = 'emerald') {
  return CARD_ICON_ACCENTS[accent]?.icon ?? CARD_ICON_ACCENTS.emerald.icon
}

/**
 * Interpolation RGB pour la couleur du texte du header (blanc hero → teinte cible en fin de 1re section).
 */
function lerpHeaderRgb(from, to, progress) {
  const t = Math.min(1, Math.max(0, progress))
  const r = Math.round(from[0] + (to[0] - from[0]) * t)
  const g = Math.round(from[1] + (to[1] - from[1]) * t)
  const b = Math.round(from[2] + (to[2] - from[2]) * t)
  return `rgb(${r}, ${g}, ${b})`
}

/** Valeur numérique interpolée selon la progression du scroll dans le hero (0 → 1). */
function lerpNumber(from, to, progress) {
  const t = Math.min(1, Math.max(0, progress))
  return from + (to - from) * t
}

/** Fond overlay noir → teinte cible (ex. blanc/5) selon le scroll. */
function lerpOverlayRgba(fromRgb, fromAlpha, toRgb, toAlpha, progress) {
  const t = Math.min(1, Math.max(0, progress))
  const r = Math.round(fromRgb[0] + (toRgb[0] - fromRgb[0]) * t)
  const g = Math.round(fromRgb[1] + (toRgb[1] - fromRgb[1]) * t)
  const b = Math.round(fromRgb[2] + (toRgb[2] - fromRgb[2]) * t)
  const a = fromAlpha + (toAlpha - fromAlpha) * t
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

/** Style bouton transparent hero / menu : blanc + overlay discret en haut → teinte cible en fin de section. */
function getTransparentHeroControlStyle(progress, endTextRgb, endBorderRgb) {
  return {
    color: lerpHeaderRgb([255, 255, 255], endTextRgb, progress),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: lerpOverlayRgba([255, 255, 255], 0.35, endBorderRgb, 1, progress),
    backgroundColor: lerpOverlayRgba([0, 0, 0], 0.28, [0, 0, 0], 0, progress)
  }
}

/**
 * Ligne de séparation entre sections : dégradé gris/noir discret.
 * aria-hidden : élément purement décoratif.
 */
function SectionNeonDivider() {
  return (
    <div className="w-full px-4 py-10 md:py-14" aria-hidden="true">
      <div className="relative mx-auto max-w-4xl overflow-visible px-6 sm:px-10">
        {/* Halo gris léger — extrémités estompées. */}
        <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-slate-900/20 via-50% to-transparent blur-sm" />
        {/* Trait central gris → noir → gris. */}
        <div className="relative mx-auto h-px max-w-2xl rounded-full bg-gradient-to-r from-transparent via-slate-700/70 to-transparent shadow-[0_0_10px_rgba(15,23,42,0.12)]" />
      </div>
    </div>
  )
}

function assetUrl(relativePath) {
  if (!relativePath) return ''
  const clean = relativePath.replace(/^\/+/, '')
  return `/${clean}`
}

/**
 * Fond fixe de la première section (V2) : image plein viewport, object-fit cover.
 * Reste en position fixed pendant le scroll ; les sections suivantes le recouvrent via leur fond opaque.
 */
function HeroFixedBackground({ src }) {
  if (!src) return null
  return (
    <div className="hero-v2-fixed-bg" aria-hidden="true">
      <img
        src={assetUrl(src)}
        alt=""
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}

/**
 * Fond image fixe pour une section pleine largeur (ex. Aider).
 * Le parent doit avoir clip-path:inset(0) pour limiter l'image à la zone de la section au scroll.
 */
function SectionFixedBackground({ src }) {
  if (!src) return null
  return (
    <div className="section-fixed-bg" aria-hidden="true">
      <img src={assetUrl(src)} alt="" decoding="async" loading="lazy" />
    </div>
  )
}

/**
 * Section « Aider » : fond fixe aider.webp pleine largeur, voile sombre, cartes blanches par-dessus.
 */
function HelpSection() {
  return (
    <section
      id="aider"
      className="relative w-full scroll-mt-24 py-14 md:py-20 [clip-path:inset(0)]"
      aria-label="Comment aider"
    >
      {/* Purpose: calque image fixe — même logique que le hero, rogné à cette section. */}
      <SectionFixedBackground src={paths.aiderBackground} />

      {/* Purpose: voile pour lisibilité du titre et contraste avec les cartes. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07111f]/35 via-[#07111f]/20 to-[#07111f]/40"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <SectionTitle
          onDark
          eyebrow={copy.helpEyebrow}
          title={copy.helpTitle}
          text={copy.helpLead}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { step: '01', accent: 'emerald', title: copy.help1Title, text: copy.help1Text },
            { step: '02', accent: 'violet', title: copy.help2Title, text: copy.help2Text },
            { step: '03', accent: 'teal', title: copy.help3Title, text: copy.help3Text }
          ].map((item) => (
            <Card key={item.step}>
              <CardContent className="p-6">
                <p className={cn('text-sm font-medium tracking-[0.25em]', cardIconClass(item.accent))}>
                  {item.step}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Section « Contact » : fond fixe contact.webp pleine largeur, voile léger, carte blanche par-dessus.
 * onOpenContact : ouvre la modale formulaire.
 */
function ContactSection({ onOpenContact }) {
  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-24 py-14 md:py-20 [clip-path:inset(0)]"
      aria-label="Contact"
    >
      {/* Purpose: calque image fixe — même logique que Aider, rogné à cette section. */}
      <SectionFixedBackground src={paths.contactBackground} />

      {/* Purpose: voile léger pour lisibilité du titre et de la carte. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07111f]/35 via-[#07111f]/20 to-[#07111f]/40"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <SectionTitle
          onDark
          eyebrow={copy.contactEyebrow}
          title={copy.contactTitle}
          text={copy.contactText}
        />
        <Card className="mt-8">
          <CardContent className="space-y-5 p-6 text-sm leading-7 text-slate-600 md:p-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <CardIconBox accent="sky" className="h-10 w-10">
                  <Mail className={cn('h-4 w-4', cardIconClass('sky'))} />
                </CardIconBox>
                <div>
                  <p className="text-base font-semibold text-slate-900">{copy.contactName}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{copy.contactRole}</p>
                </div>
              </div>
              <p className="text-slate-600">{copy.contactDesc}</p>
            </div>

            <Button className="mt-2" onClick={onOpenContact}>
              <Mail className="mr-2 h-4 w-4" /> {copy.contactFormOpenBtn}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Card({ className = '', children }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-200/60',
        className
      )}
    >
      {children}
    </div>
  )
}

function CardHeader({ className = '', children }) {
  return <div className={cn('p-6 pb-0', className)}>{children}</div>
}

function CardTitle({ className = '', children }) {
  return (
    <h3 className={cn('text-2xl font-semibold tracking-tight', className)}>
      {children}
    </h3>
  )
}

function CardContent({ className = '', children }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

function Badge({ className = '', children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700',
        className
      )}
    >
      {children}
    </span>
  )
}

/**
 * Bouton : soit lien (<a>), soit <button>. Même styles pour les CTA.
 */
function Button({ className = '', variant = 'solid', children, href, type = 'button', ...rest }) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5'
  const styles =
    variant === 'outline'
      ? 'border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100'
      : 'bg-emerald-600 text-white hover:bg-emerald-700'
  const cls = cn(base, styles, className)
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}

function SectionTitle({ eyebrow, title, text, onDark = false }) {
  return (
    <div className="max-w-3xl space-y-3">
      <Badge
        className={cn(
          onDark
            ? 'hero-v2-text-shadow w-fit !border-emerald-400/30 !bg-emerald-400/15 !text-emerald-300 backdrop-blur-sm'
            : 'border-emerald-200 bg-emerald-50 text-emerald-800'
        )}
      >
        {eyebrow}
      </Badge>
      <h2
        className={cn(
          'text-3xl font-semibold tracking-tight md:text-5xl',
          onDark ? 'hero-v2-text-shadow text-white' : 'text-slate-900'
        )}
      >
        {title}
      </h2>
      {text ? (
        <p
          className={cn(
            'text-sm leading-7 md:text-base',
            onDark ? 'hero-v2-text-shadow text-slate-200' : 'text-slate-600'
          )}
        >
          {text}
        </p>
      ) : null}
    </div>
  )
}

function VisualPlaceholder({ label, tall = false, preserveAspect = false }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50',
        preserveAspect ? 'min-h-[200px]' : tall ? 'min-h-[420px]' : 'min-h-[260px]'
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_35%)]" />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-6">
        <div className="flex items-center gap-2 text-slate-500">
          <ImageIcon className="h-5 w-5" />
          <span className="text-sm">Image indisponible</span>
        </div>
        <div>
          <p className="text-lg font-medium text-slate-900">{label}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Ajoutez le fichier dans le dossier <code className="text-slate-500">images/</code> du
            projet pour l’afficher ici en mode développement.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Affiche une image du site ou retombe sur un placeholder si le fichier manque.
 * preserveAspect : pas de hauteur min ni recadrage — le cadre suit le ratio naturel (ex. hero brass1.jpg).
 */
function SiteImage({ src, alt, tall = false, preserveAspect = false, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <VisualPlaceholder label={alt || 'Photo'} tall={tall && !preserveAspect} preserveAspect={preserveAspect} />
    )
  }
  if (preserveAspect) {
    return (
      <div className={cn('relative overflow-hidden rounded-3xl border border-slate-200', className)}>
        <img
          src={assetUrl(src)}
          alt={alt}
          className="block h-auto w-full max-w-full align-middle"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </div>
    )
  }
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-slate-200',
        tall ? 'min-h-[420px]' : 'min-h-[260px]',
        className
      )}
    >
      <img
        src={assetUrl(src)}
        alt={alt}
        className="h-full min-h-[inherit] w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

/**
 * Vignette galerie : image ou vidéo (aperçu muet + icône lecture) ; clic → lightbox.
 * type : 'video' → balise video en miniature ; sinon img. failed : média illisible.
 */
function GalleryThumb({ src, alt, type = 'image', onPick }) {
  const [failed, setFailed] = useState(false)
  const isVideo = type === 'video'
  if (!src || failed) {
    return (
      <div
        className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-2 text-center"
        aria-hidden
      >
        <ImageIcon className="h-6 w-6 text-slate-500" />
        <span className="text-[11px] leading-tight text-slate-500">Indisponible</span>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={onPick}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-left transition hover:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
    >
      {isVideo ? (
        <>
          <video
            src={assetUrl(src)}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition group-hover:opacity-90"
            aria-hidden
            onError={() => setFailed(true)}
          />
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35"
            aria-hidden
          >
            <Play className="h-10 w-10 text-white drop-shadow-md" strokeWidth={1.5} />
          </span>
          <span className="sr-only">{alt || 'Vidéo'}</span>
        </>
      ) : (
        <img
          src={assetUrl(src)}
          alt={alt || 'Galerie'}
          className="h-full w-full object-cover transition group-hover:opacity-90"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </button>
  )
}

/**
 * Lightbox galerie : image ou vidéo avec contrôles ; swipe / flèches ; clic fond ferme (pas sur la vidéo).
 * videoRef : pause au changement d’index ou à la fermeture pour éviter lecture en arrière-plan.
 */
function GalleryLightbox({ open, images, index, onClose, onNavigate }) {
  const touchStartRef = useRef(null)
  const skipClickRef = useRef(false)
  const videoRef = useRef(null)
  const SWIPE_MIN = 50

  const total = images.length
  const safeIndex = total > 0 ? Math.min(Math.max(0, index), total - 1) : 0
  const current = images[safeIndex]

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onNavigate(Math.max(0, safeIndex - 1))
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNavigate(Math.min(total - 1, safeIndex + 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, safeIndex, total, onNavigate])

  // Pause la vidéo quand on change de média ou qu’on ferme le lightbox
  useEffect(() => {
    videoRef.current?.pause?.()
  }, [safeIndex, open])

  if (!open || !current || total === 0) return null

  const src = current.src
  const alt = current.alt || 'Galerie'
  const isVideo =
    current.type === 'video' || /\.(mp4|webm|ogg)$/i.test(String(current.src || ''))

  function onTouchStart(e) {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }

  function onTouchEnd(e) {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 0.75) return
    skipClickRef.current = true
    if (dx < 0) {
      onNavigate(Math.min(safeIndex + 1, total - 1))
    } else {
      onNavigate(Math.max(safeIndex - 1, 0))
    }
  }

  function handleOverlayClick() {
    if (skipClickRef.current) {
      skipClickRef.current = false
      return
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex cursor-zoom-out touch-manipulation flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Média ${safeIndex + 1} sur ${total}`}
      onClick={handleOverlayClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {isVideo ? (
        <div
          className="pointer-events-auto max-h-[min(90dvh,100%)] max-w-[min(95dvw,100%)] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <video
            ref={videoRef}
            src={assetUrl(src)}
            controls
            playsInline
            className="max-h-[min(90dvh,100%)] max-w-[min(95dvw,100%)] object-contain"
          >
            {alt}
          </video>
        </div>
      ) : (
        <img
          src={assetUrl(src)}
          alt={alt}
          className="pointer-events-none max-h-[min(90dvh,100%)] max-w-[min(95dvw,100%)] object-contain shadow-2xl"
        />
      )}
      {total > 1 ? (
        <p className="pointer-events-none mt-4 text-sm text-white/60" aria-hidden="true">
          {safeIndex + 1} / {total}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Drapeau pays (ISO2) : SVG dans `public/flags/{code}.svg` — même origine que le site (aperçu Cursor, hors-ligne, pas de CDN).
 * Variables : code ISO2 ; libellé accessibilité depuis DONOR_COUNTRY_LABELS.
 */
function DonorFlagIcon({ code }) {
  const label = DONOR_COUNTRY_LABELS[code]
  if (!code || !label) return null
  const iso = String(code).toLowerCase()
  return (
    <span role="img" aria-label={label} className="inline-flex h-6 w-8 shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-slate-200">
      <img
        src={`/flags/${iso}.svg`}
        alt=""
        width={32}
        height={24}
        className="h-full w-full object-contain object-center"
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}

/**
 * Tuile « carrousel » : photo pleine lumière quand repliée ; titre + CTA dans un bloc bas sombre
 * seul ; au clic, texte en surimpression avec voile + blur.
 * Key variables : expanded (affichage du panneau texte), imgFailed (repli visuel si fichier absent).
 * focusImageTop : object-cover centré en haut (50 % 0 %) — portraits mieux cadrés.
 */
function ProjectImageTile({
  id: tileId,
  images,
  title,
  content,
  imageAlts = [],
  focusImageTop = false,
  carousel = false,
  onExpandedChange
}) {
  const [expanded, setExpanded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const safeImages = (images || []).filter(Boolean)
  const imgObjectClass = cn('object-cover', focusImageTop && 'object-top')

  // Purpose: informer le carrousel parent si le panneau « en savoir plus » est ouvert (pause auto-play).
  const setExpandedWithNotify = useCallback(
    (next) => {
      setExpanded(next)
      onExpandedChange?.(next)
    },
    [onExpandedChange]
  )

  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => {
      if (e.key === 'Escape') setExpandedWithNotify(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded, setExpandedWithNotify])

  return (
    <article
      id={tileId}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 scroll-mt-24"
      aria-expanded={expanded}
    >
      <div
        className={cn(
          'relative',
          carousel ? 'min-h-[360px] md:min-h-[440px]' : 'min-h-[280px] md:min-h-[320px]'
        )}
      >
        {!imgFailed && safeImages.length > 0 ? (
          safeImages.length === 1 ? (
            <img
              src={assetUrl(safeImages[0])}
              alt={imageAlts[0] || title}
              className={cn('absolute inset-0 h-full w-full', imgObjectClass)}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 grid grid-cols-2">
              {safeImages.map((src, i) => (
                <img
                  key={src}
                  src={assetUrl(src)}
                  alt={imageAlts[i] || `${title} — ${i + 1}`}
                  className={cn('h-full w-full', imgObjectClass)}
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                />
              ))}
            </div>
          )
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950"
            aria-hidden
          />
        )}

        {!expanded ? (
          /* Encart ancré en bas de la tuile, pleine largeur sur l'image (sans marge ni effet flottant). */
          <div className="pointer-events-none absolute inset-x-0 bottom-0">
            <div className="pointer-events-auto w-full border-t border-white/25 bg-gradient-to-t from-slate-950/95 via-slate-950/88 to-slate-950/75 px-4 py-3 backdrop-blur-sm md:px-5 md:py-3.5">
              <h3 className="text-base font-semibold leading-snug text-white md:text-[1.05rem]">{title}</h3>
              <button
                type="button"
                onClick={() => setExpandedWithNotify(true)}
                className="mt-2 w-fit text-left text-xs font-medium text-emerald-300 underline decoration-emerald-400/50 underline-offset-4 transition hover:text-emerald-200 md:text-sm"
              >
                {copy.projectExpandHint}
              </button>
            </div>
          </div>
        ) : (
          /* Voile ~86 % + blur xl (un cran au-dessus de lg, sans aller jusqu’au 2xl « trop flou »). */
          <div className="absolute inset-0 z-10 flex max-h-[min(85vh,520px)] flex-col bg-black/86 p-4 shadow-[inset_0_0_80px_rgba(0,0,0,0.28)] backdrop-blur-xl ring-1 ring-inset ring-white/10 md:max-h-[560px] md:p-5">
            <h3 className="shrink-0 text-base font-semibold text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.85)] md:text-[1.05rem]">
              {title}
            </h3>
            {/* Ombres sur les blocs typographiques : le contenu (HTML ou React) reste lisible sur photo claire. */}
            <div
              className="mt-2.5 min-h-0 flex-1 overflow-y-auto text-xs leading-6 text-slate-200 [text-shadow:0_1px_14px_rgba(0,0,0,0.92)] md:text-sm md:leading-7 [&_a]:[text-shadow:0_1px_12px_rgba(0,0,0,0.9)] [&_li]:[text-shadow:0_1px_12px_rgba(0,0,0,0.92)] [&_p]:[text-shadow:0_1px_14px_rgba(0,0,0,0.92)] [&_strong]:text-white [&_strong]:[text-shadow:0_1px_12px_rgba(0,0,0,0.95)]"
            >
              {content}
            </div>
            <button
              type="button"
              onClick={() => setExpandedWithNotify(false)}
              className="mt-3 shrink-0 text-xs font-medium text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 [text-shadow:0_1px_14px_rgba(0,0,0,0.92)] hover:text-emerald-200 md:text-sm"
            >
              {copy.projectCollapseHint}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

/** Contenu des 6 tuiles « Le projet » pour le carrousel. */
function buildProjectTiles() {
  return [
    {
      focusImageTop: true,
      images: [paths.founder],
      title: copy.whoTitle,
      imageAlts: ['Bwiire JohnBosco — fondateur'],
      content: <div dangerouslySetInnerHTML={{ __html: copy.whoHtml }} />
    },
    {
      focusImageTop: true,
      images: [paths.emilie],
      title: copy.teamTitle,
      imageAlts: ['Emilie Empis'],
      content: <div dangerouslySetInnerHTML={{ __html: copy.teamHtml }} />
    },
    {
      images: [paths.equipe],
      title: copy.teamOtherTitle,
      imageAlts: ["Équipe — autres membres de l'association"],
      content: <div dangerouslySetInnerHTML={{ __html: copy.teamOtherHtml }} />
    },
    {
      images: [paths.context],
      title: copy.contextTitle,
      imageAlts: ['Contexte à Jinja'],
      content: (
        <div className="space-y-4">
          <p>{copy.contextText1}</p>
          <p>{copy.contextText2}</p>
        </div>
      )
    },
    {
      images: [paths.avenir],
      title: copy.musicTitle,
      imageAlts: ["La musique comme outil d'avenir"],
      content: (
        <>
          <p>{copy.musicText}</p>
          <ul className="mt-3 list-inside list-disc space-y-1">
            {copy.musicBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: 'vie',
      images: [paths.vieDaily],
      title: copy.dayTitle,
      imageAlts: ['Vie quotidienne au centre'],
      content: (
        <div
          className="[&_a]:font-medium [&_a]:text-emerald-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: copy.dayHtml }}
        />
      )
    }
  ]
}

/**
 * Carrousel des tuiles « Le projet » : une tuile visible, flèches + pastilles.
 * Variables : activeIndex (slide courante), tiles (liste des 6 contenus).
 */
function ProjectTilesCarousel() {
  const tiles = useMemo(() => buildProjectTiles(), [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTileExpanded, setIsTileExpanded] = useState(false)
  const total = tiles.length

  // Purpose: index circulaire pour précédent / suivant.
  const goTo = useCallback(
    (index) => {
      setActiveIndex((index + total) % total)
    },
    [total]
  )

  // Purpose: changement de slide → tuile repliée, auto-play peut reprendre.
  useEffect(() => {
    setIsTileExpanded(false)
  }, [activeIndex])

  // Purpose: défilement automatique toutes les 3 s tant qu'aucun panneau n'est ouvert.
  useEffect(() => {
    if (isTileExpanded) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = window.setInterval(() => {
      goTo(activeIndex + 1)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [activeIndex, goTo, isTileExpanded])

  const slide = tiles[activeIndex]

  return (
    <div className="relative mt-10" aria-roledescription="carousel" aria-label="Le projet — diapositives">
      {/* Tuile centrée, largeur proche d'une colonne de l'ancienne grille (pas pleine largeur). */}
      <div className="relative mx-auto max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <ProjectImageTile
          key={activeIndex}
          carousel
          onExpandedChange={setIsTileExpanded}
          {...slide}
        />

        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          className="absolute -left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition hover:bg-white sm:-left-4 md:h-11 md:w-11 lg:-left-14"
          aria-label="Tuile précédente"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          className="absolute -right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition hover:bg-white sm:-right-4 md:h-11 md:w-11 lg:-right-14"
          aria-label="Tuile suivante"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {/* Pastilles + compteur */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Choisir une tuile">
          {tiles.map((tile, i) => (
            <button
              key={tile.title}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`${tile.title} — tuile ${i + 1} sur ${total}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === activeIndex ? 'w-7 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              )}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500" aria-live="polite">
          {activeIndex + 1} / {total}
        </p>
      </div>
    </div>
  )
}

/**
 * Localisation : carte OpenStreetMap en fond pleine largeur ; texte en panneau par-dessus.
 */
function ProjectLocationTile({ className = '' }) {
  return (
    <div
      className={cn(
        'relative mt-10 min-h-[min(420px,55vh)] w-full overflow-hidden',
        className
      )}
    >
      {/* Carte : calque de fond sur toute la section. */}
      <iframe
        title="Carte OpenStreetMap — Jinja"
        src={copy.mapIframeSrc}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
      />

      {/* Voile léger pour lisibilité du panneau texte (côté gauche). */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/20 md:via-white/60 md:to-transparent"
        aria-hidden="true"
      />

      {/* Contenu : titre, description et lien au-dessus de la carte. */}
      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-7xl items-center px-4 py-10 md:px-8 lg:px-10">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-200/60 backdrop-blur-sm md:p-8">
          <h3 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
            <MapPin className={cn('h-5 w-5 shrink-0', cardIconClass('rose'))} />
            {copy.locationTitle}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Le centre se trouve à <strong className="text-slate-900">Jinja, en Ouganda</strong>, une ville
            située à la source du Nil.
          </p>
          <a
            href={copy.mapLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm font-medium text-emerald-600 underline hover:text-emerald-700"
          >
            {copy.mapLinkLabel}
          </a>
        </div>
      </div>
    </div>
  )
}

function AccordionItem({ title, children, isOpen, onClick }) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-slate-900"
      >
        <span className="font-semibold">{title}</span>
        <span className="text-xl text-slate-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen ? (
        <div className="pb-4 text-sm leading-7 text-slate-600">{children}</div>
      ) : null}
    </div>
  )
}

/**
 * Fenêtre modale : même fond flouté / panneau arrondi que le menu mobile (cohérence visuelle).
 * wide : formulaires sur deux colonnes en largeur max plus grande.
 */
function ModalPanel({ open, onClose, title, wide, children }) {
  const titleId = useId()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        aria-label="Fermer la fenêtre"
        onClick={onClose}
      />
      {/* Colonne scrollable : wrapper sans pointer-events pour que le clic sur le fond ferme ; seule la carte capte les clics. */}
      <div className="pointer-events-none fixed inset-0 flex items-start justify-center overflow-y-auto px-3 pb-10 pt-16 sm:px-4 sm:pb-12 sm:pt-20">
        <div
          className={cn(
            'pointer-events-auto relative w-full rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50',
            wide ? 'max-w-2xl' : 'max-w-lg'
          )}
        >
          {/* En-tête fixe visuellement (bordure) + bouton fermer aligné menu mobile. */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[min(78dvh,calc(100dvh-7rem))] overflow-y-auto p-4 sm:p-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** Texte descriptif par album : affiché sous le titre « Galerie » ; chaîne vide = rien. */
function albumBlurb(tabKey) {
  if (tabKey === 'concert') return copy.galleryConcertDesc
  if (tabKey === 'centre') {
    return `Liste des instruments présents au centre : ${copy.inventoryLine.replace(/\s*\/\s*/g, ' · ')}`
  }
  return ''
}

export default function App() {
  const [logoFailed, setLogoFailed] = useState(false)
  const [activeTab, setActiveTab] = useState('concert')
  const [openAccordion, setOpenAccordion] = useState('finance')
  const [instrumentsOpen, setInstrumentsOpen] = useState(false)
  const [contactStatus, setContactStatus] = useState('')
  const [matStatus, setMatStatus] = useState('')
  const [contactBusy, setContactBusy] = useState(false)
  const [matBusy, setMatBusy] = useState(false)
  const [donationWireBusy, setDonationWireBusy] = useState(false)
  const [donationWireStatus, setDonationWireStatus] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [materialModalOpen, setMaterialModalOpen] = useState(false)
  const [donationModalOpen, setDonationModalOpen] = useState(false)
  /** Incrémenté à la fermeture de la modale don pour réinitialiser le formulaire Stripe. */
  const [donationStripeKey, setDonationStripeKey] = useState(0)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [transparencyModalOpen, setTransparencyModalOpen] = useState(false)
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [activeNavId, setActiveNavId] = useState('')
  /** 0 = haut du hero (menu transparent) → 1 = fin de la 1re section (menu opaque). */
  const [headerHeroProgress, setHeaderHeroProgress] = useState(0)
  const heroSectionRef = useRef(null)
  /** Index de la photo ouverte en plein écran dans l’album courant ; null si fermé. */
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState(null)

  // Changer d’album ferme le lightbox pour éviter un index hors plage.
  useEffect(() => {
    setGalleryLightboxIndex(null)
  }, [activeTab])

  const anyOverlayOpen =
    mobileMenuOpen ||
    materialModalOpen ||
    donationModalOpen ||
    contactModalOpen ||
    transparencyModalOpen ||
    legalModalOpen ||
    instrumentsOpen ||
    galleryLightboxIndex !== null

  // Purpose: une seule logique pour menu mobile + modales (scroll body, Échap ferme la couche du dessus).
  useEffect(() => {
    if (!anyOverlayOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (galleryLightboxIndex !== null) {
        setGalleryLightboxIndex(null)
        return
      }
      // Ordre : modale la plus « au-dessus » en premier (pile proche du bas du DOM).
      if (contactModalOpen) setContactModalOpen(false)
      else if (donationModalOpen) setDonationModalOpen(false)
      else if (materialModalOpen) setMaterialModalOpen(false)
      else if (transparencyModalOpen) setTransparencyModalOpen(false)
      else if (legalModalOpen) setLegalModalOpen(false)
      else if (instrumentsOpen) setInstrumentsOpen(false)
      else if (mobileMenuOpen) setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [
    anyOverlayOpen,
    mobileMenuOpen,
    materialModalOpen,
    contactModalOpen,
    donationModalOpen,
    transparencyModalOpen,
    legalModalOpen,
    instrumentsOpen,
    galleryLightboxIndex
  ])

  // Purpose: au passage en vue large, refermer les panneaux plein écran (menu + modales).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      setMobileMenuOpen(false)
      setMaterialModalOpen(false)
      setDonationModalOpen(false)
      setContactModalOpen(false)
      setTransparencyModalOpen(false)
      setLegalModalOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Purpose: liens profonds #materiel ouvrent directement le formulaire don matériel (comportement proche de l’ancienne ancre).
  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === '#materiel') setMaterialModalOpen(true)
      if (window.location.hash === '#don-financier') setDonationModalOpen(true)
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  // Purpose: chargement ou navigation par hash → scroll fluide vers la cible (complète scroll-behavior sur html).
  useEffect(() => {
    const scrollToHashTarget = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) return
      const el = document.getElementById(hash)
      if (!el) return
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
    scrollToHashTarget()
    window.addEventListener('hashchange', scrollToHashTarget)
    return () => window.removeEventListener('hashchange', scrollToHashTarget)
  }, [])

  // Purpose: dernière section dont le haut est au-dessus de la ligne de scroll (sous le header sticky) → lien menu actif.
  useEffect(() => {
    const ACTIVATION_OFFSET = 96
    let rafId = 0
    const updateActiveSection = () => {
      rafId = 0
      const y = window.scrollY + ACTIVATION_OFFSET
      let active = ''
      for (const id of NAV_TARGET_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const docTop = el.getBoundingClientRect().top + window.scrollY
        if (docTop <= y) active = id
      }
      setActiveNavId((prev) => (prev === active ? prev : active))
    }
    const onScrollOrResize = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateActiveSection)
    }
    updateActiveSection()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  // Purpose: progresser le fond/contour du header de transparent à opaque pendant le scroll dans la 1re section.
  // Variables : heroSectionRef (hauteur section #top), scrollY → ratio clampé [0, 1].
  useEffect(() => {
    let rafId = 0
    const updateHeaderHeroProgress = () => {
      rafId = 0
      const hero = heroSectionRef.current
      if (!hero) return
      const heroHeight = hero.offsetHeight
      if (heroHeight <= 0) return
      const progress = Math.min(1, Math.max(0, window.scrollY / heroHeight))
      setHeaderHeroProgress((prev) => (Math.abs(prev - progress) < 0.002 ? prev : progress))
    }
    const onScrollOrResize = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateHeaderHeroProgress)
    }
    updateHeaderHeroProgress()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  // Purpose: styles interpolés du bandeau menu (fond blanc/85, contour slate-200, blur-xl à progress = 1).
  const headerSurfaceStyle = useMemo(() => {
    const p = headerHeroProgress
    const blurPx = Math.round(24 * p)
    return {
      backgroundColor: `rgba(255, 255, 255, ${0.85 * p})`,
      borderColor: `rgba(226, 232, 240, ${p})`,
      backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
      WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : 'none'
    }
  }, [headerHeroProgress])

  const headerMobileBtnStyle = useMemo(() => {
    const p = headerHeroProgress
    return {
      color: '#0f172a',
      borderColor: '#0f172a',
      backgroundColor: lerpOverlayRgba([255, 255, 255], 0.2, [255, 255, 255], 0.05, p)
    }
  }, [headerHeroProgress])

  // Purpose: titre blanc sur le hero → slate-900 ; slogan blanc → slate-500.
  const headerBrandTitleStyle = useMemo(
    () => ({ color: lerpHeaderRgb([255, 255, 255], [15, 23, 42], headerHeroProgress) }),
    [headerHeroProgress]
  )
  const headerBrandSloganStyle = useMemo(
    () => ({ color: lerpHeaderRgb([255, 255, 255], [100, 116, 139], headerHeroProgress) }),
    [headerHeroProgress]
  )

  // Purpose: liens menu — texte seul, ligne de soulignement sur la section active (couleur interpolée hero → clair).
  const getHeaderNavLinkStyle = useCallback(
    (isActive) => {
      const p = headerHeroProgress
      return {
        color: isActive
          ? lerpHeaderRgb([255, 255, 255], [5, 150, 105], p)
          : lerpHeaderRgb([255, 255, 255], [71, 85, 105], p)
      }
    },
    [headerHeroProgress]
  )

  // Purpose: bouton hero « Voir les besoins » — même logique visuelle que les liens menu transparents.
  const heroBesoinsBtnStyle = useMemo(
    () => ({
      ...getTransparentHeroControlStyle(headerHeroProgress, [30, 41, 59], [203, 213, 225]),
      textShadow:
        headerHeroProgress < 0.2 ? '0 1px 10px rgba(0, 0, 0, 0.65)' : 'none',
      boxShadow:
        headerHeroProgress < 0.2
          ? '0 4px 22px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.4)'
          : 'none'
    }),
    [headerHeroProgress]
  )

  // Liste complète des images de l’album actif (onglets → clés de gallery-data.json).
  const galleryImages = useMemo(() => {
    const list = galleryData[activeTab]
    return Array.isArray(list) ? list : []
  }, [activeTab])

  async function onContactSubmit(e) {
    e.preventDefault()
    const form = e.target
    const fd = new FormData(form)
    const params = new URLSearchParams()
    params.append('name', fd.get('name') || '')
    params.append('email', fd.get('email') || '')
    params.append('subject', fd.get('subject') || '')
    params.append('message', fd.get('message') || '')
    setContactBusy(true)
    setContactStatus('Envoi…')
    try {
      await submitToGas('contact', params)
      form.reset()
      setContactStatus('Message envoyé ✅')
    } catch {
      setContactStatus("Erreur d'envoi. Veuillez réessayer ultérieurement.")
    } finally {
      setContactBusy(false)
      setTimeout(() => setContactStatus(''), 6000)
    }
  }

  async function onMaterialSubmit(e) {
    e.preventDefault()
    const form = e.target
    const fd = new FormData(form)
    const params = new URLSearchParams()
    params.append('name', fd.get('name') || '')
    params.append('email', fd.get('email') || '')
    params.append('subject', 'Don matériel')
    params.append('message', fd.get('message') || '')
    params.append('item', fd.get('item') || '')
    params.append('instrument', fd.get('instrument') || '')
    params.append('brand', fd.get('brand') || '')
    params.append('serial', fd.get('serial') || '')
    params.append('qty', fd.get('qty') || '')
    params.append('condition', fd.get('condition') || '')
    params.append('location', fd.get('location') || '')
    params.append('photo', '')
    setMatBusy(true)
    setMatStatus('Envoi…')
    try {
      await submitToGas('material', params)
      form.reset()
      setMatStatus('Proposition envoyée ✅')
    } catch {
      setMatStatus("Erreur d'envoi. Veuillez réessayer ultérieurement.")
    } finally {
      setMatBusy(false)
      setTimeout(() => setMatStatus(''), 6000)
    }
  }

  // Purpose: notification virement — envoi via GAS contact (sujet « Don financier — virement »).
  async function onDonationWireSubmit(e) {
    e.preventDefault()
    const form = e.target
    const fd = new FormData(form)
    const amount = String(fd.get('amount') || '').trim()
    const note = String(fd.get('message') || '').trim()
    const body = [
      amount ? `Montant indiqué : ${amount}` : null,
      note || null
    ]
      .filter(Boolean)
      .join('\n\n')

    const params = new URLSearchParams()
    params.append('name', fd.get('name') || '')
    params.append('email', fd.get('email') || '')
    params.append('subject', 'Don financier — virement')
    params.append('message', body || '—')
    setDonationWireBusy(true)
    setDonationWireStatus('Envoi…')
    try {
      await submitToGas('contact', params)
      form.reset()
      setDonationWireStatus('Notification envoyée ✅')
    } catch {
      setDonationWireStatus(copy.formErrorSend)
    } finally {
      setDonationWireBusy(false)
      setTimeout(() => setDonationWireStatus(''), 6000)
    }
  }

  const bankIbanConfigured = Boolean(String(DONATION_BANK_DETAILS.iban || '').trim())

  const inputClass =
    'mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30'
  const labelClass = 'block text-sm font-medium text-slate-700'

  return (
    <div className="min-h-screen overflow-x-clip bg-site text-slate-900">
      {/* Image V2 : calque fixed plein écran (recouvert au scroll par le fond des sections suivantes). */}
      <HeroFixedBackground src={paths.heroBackground} />

      {/* Header fixe au-dessus du hero — reste visible pendant tout le défilement. */}
      <header className="fixed top-4 left-0 right-0 z-40 px-4 md:px-8 lg:px-10">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border px-4 py-3 md:px-6"
          style={headerSurfaceStyle}
        >
          <a href="#top" className="flex min-w-0 flex-1 items-center gap-3 text-left lg:flex-none">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/20">
              {!logoFailed ? (
                <img
                  src={assetUrl(paths.logo)}
                  alt="Logo"
                  className="h-full w-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <Music2 className="h-5 w-5 text-emerald-300" aria-hidden />
              )}
            </div>
            <div className="min-w-0">
              <p
                className="text-lg font-semibold tracking-wide md:text-xl lg:text-2xl"
                style={headerBrandTitleStyle}
              >
                PROJET JINJA
              </p>
              <p
                className="mt-1 max-w-xl text-[0.625rem] font-normal uppercase leading-snug tracking-[0.14em] sm:text-[0.6875rem] md:max-w-2xl"
                style={headerBrandSloganStyle}
              >
                <span className="block">{BRAND_SLOGAN_LINES.line1}</span>
                {BRAND_SLOGAN_LINES.line2 ? (
                  <span className="block">{BRAND_SLOGAN_LINES.line2}</span>
                ) : null}
              </p>
            </div>
          </a>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition hover:bg-black/5 lg:hidden"
            style={headerMobileBtnStyle}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
          </button>

          <nav
            className="hidden flex-wrap items-center gap-2 text-sm lg:flex"
            aria-label="Principal"
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeNavId === item.href.slice(1)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'px-2 py-1.5 text-sm font-medium transition-all decoration-2 underline-offset-[7px]',
                    isActive
                      ? 'underline font-semibold'
                      : 'no-underline hover:underline hover:decoration-current/45'
                  )}
                  style={getHeaderNavLinkStyle(isActive)}
                >
                  {item.label}
                </a>
              )
            })}
            <Button
              className="px-4 py-2"
              onClick={() => setDonationModalOpen(true)}
            >
              Faire un don
            </Button>
          </nav>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            aria-label="Fermer le menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav
            id="mobile-menu"
            className="absolute left-3 right-3 top-[4.5rem] max-h-[min(calc(100dvh-6rem),32rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/40 sm:left-4 sm:right-4"
            aria-label="Navigation mobile"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => {
                const isActive = activeNavId === item.href.slice(1)
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'block border-b border-slate-100 px-4 py-3 text-base transition last:border-b-0',
                        isActive
                          ? 'font-semibold text-emerald-700 underline decoration-2 underline-offset-4'
                          : 'text-slate-700 hover:text-slate-900'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
            <a
              href="#don"
              className="mt-4 flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              onClick={(e) => {
                e.preventDefault()
                setMobileMenuOpen(false)
                setDonationModalOpen(true)
              }}
            >
              Faire un don
            </a>
          </nav>
        </div>
      ) : null}

      {/* Première section : hauteur viewport complète, contenu centré sur le fond fixe. */}
      <section
        ref={heroSectionRef}
        id="top"
        className="relative z-10 flex min-h-[100dvh] min-h-[100svh] min-h-screen flex-col"
        aria-label="Accueil"
      >
        {/* Voile sombre local (défile avec la section) pour lisibilité du texte. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07111f]/70 via-[#07111f]/45 to-[#07111f]/85"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-10">
          <Badge className="hero-v2-text-shadow w-fit !border-emerald-400/30 !bg-emerald-400/15 !text-emerald-300 backdrop-blur-sm">
            {copy.pill}
          </Badge>
          <h1 className="hero-v2-text-shadow mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.05]">
            {copy.heroTitle}
          </h1>
          <p className="hero-v2-text-shadow mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
            {copy.heroSubtitle}
          </p>
          <p className="hero-v2-text-shadow mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            {copy.heroNote}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="hero-v2-btn-shadow px-6" onClick={() => setDonationModalOpen(true)}>
              Faire un don <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-solid px-6 hover:brightness-110"
              style={heroBesoinsBtnStyle}
              href="#besoins"
            >
              Voir les besoins
            </Button>
          </div>
        </div>
      </section>

      {/* Sections suivantes : fond opaque recouvre l'image fixe au défilement. */}
      <div className="relative z-10 overflow-x-clip bg-site">
        <main>
          <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-10">
            <section className="mt-0 grid gap-6 lg:grid-cols-3" id="valeurs" aria-label="Valeurs">
            {values.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title}>
                  <CardContent className="p-6">
                    <CardIconBox accent={item.accent} className="mb-4">
                      <Icon className={cn('h-5 w-5', cardIconClass(item.accent))} />
                    </CardIconBox>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </CardContent>
                </Card>
              )
            })}
          </section>

          <SectionNeonDivider />

          <section className="mt-0 scroll-mt-24" id="projet">
            <SectionTitle
              eyebrow={copy.projectEyebrow}
              title={copy.projectSectionTitle}
              text={copy.projectSectionLead}
            />

            <ProjectTilesCarousel />
          </section>
          </div>

          {/* Carte pleine largeur : hors conteneur max-w pour éviter w-screen / 100vw (scroll horizontal). */}
          <ProjectLocationTile />

          <div className="relative mx-auto max-w-7xl px-4 pb-6 md:px-8 lg:px-10">
          <section className="mt-12 scroll-mt-24 md:mt-16" id="besoins">
            <SectionTitle eyebrow={copy.needsEyebrow} title={copy.needsTitle} text={copy.needsLead} />

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Colonne gauche : instruments + partitions. */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Music2 className={cn('h-5 w-5 shrink-0', cardIconClass('emerald'))} />
                      {copy.needsInstrumentsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-slate-500">{copy.needsInstrumentsIntro}</p>
                    <div className="flex flex-wrap gap-2">
                      {INSTRUMENTS_NEEDED.map((name) => (
                        <Badge key={name} className="border-emerald-200 bg-emerald-50 py-2 text-sm text-emerald-800">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <FileText className={cn('h-5 w-5 shrink-0', cardIconClass('violet'))} />
                      {copy.needsPartitionsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
                    <p>{copy.needsPartitionsText}</p>
                    <p className="text-slate-500">{copy.needsPartitionsDigital}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite : soutien financier + parc instrumental. */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <HandCoins className={cn('h-5 w-5 shrink-0', cardIconClass('amber'))} />
                      {copy.needsFinanceTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-slate-600">
                    <p>{copy.needsFinanceText}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Drum className={cn('h-5 w-5 shrink-0', cardIconClass('indigo'))} />
                      {copy.inventoryTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {copy.inventoryLine.split(/\s*\/\s*/).map((item) => (
                      <Badge key={item} className="border-slate-200 bg-white text-slate-700">
                        {item.trim()}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          </div>

          <HelpSection />

          <div className="relative mx-auto max-w-7xl px-4 pb-6 md:px-8 lg:px-10">
          <section className="mt-12 scroll-mt-24 space-y-8 md:mt-16" id="don">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <SectionTitle eyebrow={copy.donateEyebrow} title={copy.donateTitle} text={copy.donateLead} />
              <Button
                variant="outline"
                type="button"
                onClick={() => setTransparencyModalOpen(true)}
                className="shrink-0 border-violet-300 bg-violet-50 text-violet-800 hover:bg-violet-100"
              >
                {copy.transparencyBtn}
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardContent className="p-7 md:p-8">
                  <CardIconBox accent="emerald" className="mb-5">
                    <CircleDollarSign className={cn('h-5 w-5', cardIconClass('emerald'))} />
                  </CardIconBox>
                  <h3 className="text-2xl font-semibold">{copy.donateFinTitle}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{copy.donateFinText}</p>
                  <Button className="mt-6" onClick={() => setDonationModalOpen(true)}>
                    {copy.donateFinBtn}
                  </Button>
                </CardContent>
              </Card>

              <div id="materiel" className="contents">
                <Card className="scroll-mt-24">
                  <CardContent className="p-7 md:p-8">
                    <CardIconBox accent="orange" className="mb-5">
                      <Drum className={cn('h-5 w-5', cardIconClass('orange'))} />
                    </CardIconBox>
                    <h3 className="text-2xl font-semibold">{copy.donateMatTitle}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{copy.donateMatText}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button onClick={() => setMaterialModalOpen(true)}>{copy.donateMatBtn}</Button>
                      <Button variant="outline" onClick={() => setInstrumentsOpen(true)}>
                        {copy.donateMatList}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comment ça fonctionne ?</CardTitle>
              </CardHeader>
              <CardContent>
                <AccordionItem
                  title={copy.donateInfoFinTitle}
                  isOpen={openAccordion === 'finance'}
                  onClick={() => setOpenAccordion(openAccordion === 'finance' ? '' : 'finance')}
                >
                  {copy.donateInfoFinText}
                </AccordionItem>
                <AccordionItem
                  title={copy.donateInfoMatTitle}
                  isOpen={openAccordion === 'material'}
                  onClick={() => setOpenAccordion(openAccordion === 'material' ? '' : 'material')}
                >
                  {copy.donateInfoMatText}
                </AccordionItem>
              </CardContent>
            </Card>
          </section>

          <SectionNeonDivider />

          {/* Nos créations : grille 2 col comme avant (texte + carte à gauche, image à droite). Flou / banderole si SHOP_OPEN === false. */}
          <section className="relative mt-0 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start" id="creations">
            <div className="min-w-0 space-y-6">
              <div className="relative z-[3]">
                <SectionTitle eyebrow={copy.creationsEyebrow} title={copy.creationsTitle} text={copy.creationsText} />
              </div>
              <div
                className={cn(
                  'space-y-6',
                  !SHOP_OPEN && 'pointer-events-none select-none blur-[3px] opacity-[0.82]'
                )}
              >
                <Card>
                  <CardContent className="p-6">
                    <CardIconBox accent="teal" className="mb-4">
                      <ShoppingBag className={cn('h-5 w-5', cardIconClass('teal'))} />
                    </CardIconBox>
                    <p className="text-sm font-semibold text-slate-900">{copy.creationsOrderTitle}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{copy.creationsOrderHtml}</p>
                    <a
                      href={legacyPage('boutique.html')}
                      className="mt-3 inline-block text-sm font-medium text-emerald-600 underline hover:text-emerald-700"
                    >
                      {copy.creationsBtnShop} →
                    </a>
                  </CardContent>
                </Card>
                <div className="flex flex-wrap gap-3">
                  <Button href={legacyPage('boutique.html')}>
                    <ShoppingBag className="mr-2 h-4 w-4" /> {copy.creationsBtnShop}
                  </Button>
                  <Button variant="outline" onClick={() => setContactModalOpen(true)}>
                    Commander via le contact
                  </Button>
                </div>
              </div>
            </div>
            <div
              className={cn(
                'relative z-[1] min-w-0',
                !SHOP_OPEN && 'pointer-events-none select-none blur-[3px] opacity-[0.82]'
              )}
            >
              <SiteImage src={paths.creations} alt="Créations des enfants" tall />
            </div>
            {!SHOP_OPEN ? (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center px-4 pb-6 pt-4 sm:px-6"
                style={{ top: 'clamp(10.5rem, 32vw, 17rem)' }}
                aria-hidden="true"
              >
                <p className="max-w-md text-center rounded-full border border-slate-200 bg-white/95 px-6 py-3 text-sm font-semibold text-slate-800 shadow-lg shadow-slate-300/40 backdrop-blur-sm">
                  {copy.shopClosedBanner}
                </p>
              </div>
            ) : null}
          </section>

          <SectionNeonDivider />

          <section className="mt-0" id="galerie">
            <SectionTitle
              eyebrow={copy.galleryEyebrow}
              title={copy.galleryTitle}
              text={albumBlurb(activeTab)}
            />
            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Albums">
                {GALLERY_TABS.map(({ key, label }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      activeTab === key
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {galleryImages.length === 0 ? (
                <p className="mt-6 px-2 text-sm text-slate-500">Aucun média dans cet album pour le moment.</p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {galleryImages.map((img, idx) => (
                    <GalleryThumb
                      key={`${img.src}-${idx}`}
                      src={img.src}
                      alt={img.alt || 'Galerie'}
                      type={img.type === 'video' ? 'video' : 'image'}
                      onPick={() => setGalleryLightboxIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
          </div>

          <ContactSection onOpenContact={() => setContactModalOpen(true)} />

          <div className="relative mx-auto max-w-7xl px-4 pb-6 md:px-8 lg:px-10">
          <section className="mt-12 scroll-mt-24 md:mt-16" id="donateurs">
            <SectionTitle eyebrow={copy.donorsEyebrow} title={copy.donorsTitle} text={copy.donorsText} />
            <p className="mt-4 max-w-2xl text-sm text-slate-500">{copy.donorsDemoNote}</p>
            {/* Grille type cartes du site principal : financial = emerald/sky, material = ambre/rose. */}
            <div
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
              aria-label="Liste des donateurs"
            >
              {DONORS_DEMO.map((row, i) => {
                const isFin = row.type === 'financial'
                return (
                  <article
                    key={`${row.name}-${i}`}
                    role="listitem"
                    className={cn(
                      'group relative overflow-hidden rounded-[24px] border p-5 shadow-md shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-lg',
                      isFin
                        ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 hover:border-emerald-300'
                        : 'border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 hover:border-amber-300'
                    )}
                  >
                    <div className="relative flex gap-4">
                      <div
                        className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                          isFin ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        )}
                      >
                        {isFin ? (
                          <CircleDollarSign className="h-5 w-5" strokeWidth={2} />
                        ) : (
                          <Package className="h-5 w-5" strokeWidth={2} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-base font-semibold leading-snug text-slate-900">
                          {row.country && DONOR_COUNTRY_LABELS[row.country] ? (
                            <DonorFlagIcon code={row.country} />
                          ) : null}
                          <span className="min-w-0">{row.name}</span>
                        </p>
                        <p className="text-slate-700">
                          <span className="text-slate-500">{copy.donorsColGift} · </span>
                          {row.gift}
                        </p>
                        <p className="text-slate-600">
                          <span className="text-slate-500">{copy.donorsColType} · </span>
                          {isFin ? copy.donorsTypeFin : copy.donorsTypeMat}
                        </p>
                        <p className="text-slate-500">
                          <span className="text-slate-600">{copy.donorsColDate} · </span>
                          {row.date}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <SectionNeonDivider />

          <footer className="mt-0 pb-10 pt-4 text-center text-sm text-slate-500">
            <span className="text-slate-400">
              © {new Date().getFullYear()} {copy.footerCopyrightEntity}
            </span>
            <span className="mx-2">·</span>
            <button
              type="button"
              onClick={() => setLegalModalOpen(true)}
              className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-emerald-600 underline hover:text-emerald-700"
            >
              {copy.footerLegal}
            </button>
          </footer>
          </div>
        </main>
      </div>

      <ModalPanel
        open={donationModalOpen}
        onClose={() => {
          setDonationModalOpen(false)
          setDonationStripeKey((k) => k + 1)
        }}
        title={copy.donateFinModalTitle}
        wide
      >
        <p className="mb-6 text-sm leading-7 text-slate-600">{copy.donateFinModalIntro}</p>

        {/* Purpose: paiement Stripe intégré — montants suggérés, montant libre, Payment Element. */}
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <CircleDollarSign className={cn('h-5 w-5', cardIconClass('emerald'))} />
            {copy.donateFinModalStripeTitle}
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{copy.donateFinModalStripeText}</p>

          <div className="mt-4">
            <DonationStripeForm
              key={donationStripeKey}
              inputClass={inputClass}
              labelClass={labelClass}
            />
          </div>
        </section>

        {/* Purpose: virement bancaire — coordonnées + formulaire de notification. */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <HandCoins className={cn('h-5 w-5', cardIconClass('amber'))} />
            {copy.donateFinModalWireTitle}
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{copy.donateFinModalWireText}</p>

          {bankIbanConfigured ? (
            <dl className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bénéficiaire</dt>
                <dd className="mt-0.5 font-medium text-slate-900">{DONATION_BANK_DETAILS.beneficiary}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">IBAN</dt>
                <dd className="mt-0.5 font-mono text-sm">{DONATION_BANK_DETAILS.iban}</dd>
              </div>
              {DONATION_BANK_DETAILS.bic ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">BIC</dt>
                  <dd className="mt-0.5 font-mono text-sm">{DONATION_BANK_DETAILS.bic}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Référence</dt>
                <dd className="mt-0.5">{DONATION_BANK_DETAILS.reference}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-500">{copy.donateFinModalWireMissing}</p>
          )}

          <div className="mt-5 border-t border-slate-200 pt-5">
            <h4 className="text-sm font-semibold text-slate-900">{copy.donateFinModalWireNotifyTitle}</h4>
            <p className="mt-1 text-sm text-slate-500">{copy.donateFinModalWireNotifyText}</p>
            <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onDonationWireSubmit}>
              <label className={labelClass}>
                Nom
                <input className={inputClass} name="name" required placeholder="Ex : Marie Dupont" />
              </label>
              <label className={labelClass}>
                Email
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  required
                  placeholder="ex : marie@mail.com"
                />
              </label>
              <label className={labelClass}>
                Montant (facultatif)
                <input className={inputClass} name="amount" placeholder="Ex : 50 €" />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                Message (facultatif)
                <textarea
                  className={cn(inputClass, 'min-h-[100px] resize-y')}
                  name="message"
                  rows={3}
                  placeholder="Date du virement, précisions…"
                />
              </label>
              <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                <Button type="submit" disabled={donationWireBusy}>
                  {copy.donateFinModalWireSend}
                </Button>
                {donationWireStatus ? (
                  <span className="text-sm text-slate-600" role="status">
                    {donationWireStatus}
                  </span>
                ) : null}
              </div>
            </form>
          </div>
        </section>

        <button
          type="button"
          onClick={() => {
            setDonationModalOpen(false)
            setTransparencyModalOpen(true)
          }}
          className="mt-6 text-sm font-medium text-violet-700 underline decoration-violet-300 underline-offset-4 hover:text-violet-800"
        >
          {copy.donateFinModalTransparencyLink}
        </button>
      </ModalPanel>

      <ModalPanel
        open={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        title={copy.matTitle}
        wide
      >
        <p className="mb-3 text-sm leading-7 text-slate-600">{copy.matIntro}</p>
        <p className="mb-5 text-sm text-slate-500">{copy.matDigitalNote}</p>
        {/* Don matériel : champs texte pour objet / instrument (GAS : item, instrument) ; état inclut Neuf/ve. */}
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onMaterialSubmit}>
          <label className={labelClass}>
            Nom
            <input className={inputClass} name="name" required placeholder="Ex : Marie Dupont" />
          </label>
          <label className={labelClass}>
            Email
            <input
              className={inputClass}
              type="email"
              name="email"
              required
              placeholder="ex : marie@mail.com"
            />
          </label>

          <label className={labelClass}>
            Objet du don
            <input
              className={inputClass}
              name="item"
              required
              placeholder="Ex : instruments, partitions, pupitres, accessoires…"
            />
          </label>
          <label className={labelClass}>
            Instrument (si concerné)
            <input
              className={inputClass}
              name="instrument"
              placeholder="Ex : trombone, tuba, trompette…"
            />
          </label>

          <label className={labelClass}>
            Marque
            <input className={inputClass} name="brand" placeholder="Ex : Yamaha, Bach…" />
          </label>
          <label className={labelClass}>
            Numéro de série
            <input className={inputClass} name="serial" placeholder="Ex : SN123456" />
          </label>

          <label className={labelClass}>
            Quantité
            <input className={inputClass} type="number" min="1" name="qty" placeholder="1" />
          </label>
          <label className={labelClass}>
            État du matériel
            <select className={inputClass} name="condition" required defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              <option value="neuf_ve">Neuf/ve</option>
              <option value="excellent">Excellent</option>
              <option value="tres_bon">Très bon</option>
              <option value="bon">Bon</option>
              <option value="correct">Correct</option>
              <option value="a_reparer">À réparer</option>
            </select>
          </label>

          <label className={`${labelClass} md:col-span-2`}>
            Ville / Pays
            <input className={inputClass} name="location" placeholder="Ex : Nice, France" />
          </label>

          <label className={`${labelClass} md:col-span-2`}>
            Message
            <textarea
              className={cn(inputClass, 'min-h-[140px] resize-y')}
              name="message"
              required
              rows={5}
              placeholder={copy.matMessagePlaceholder}
            />
          </label>

          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <Button type="submit" disabled={matBusy}>
              {copy.matSend}
            </Button>
            {matStatus ? (
              <span className="text-sm text-slate-600" role="status">
                {matStatus}
              </span>
            ) : null}
          </div>
        </form>
      </ModalPanel>

      <ModalPanel
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={copy.contactTitle}
        wide
      >
        {/* Champs name, email, subject, message → submitToGas('contact'). */}
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onContactSubmit}>
          <label className={labelClass}>
            Nom
            <input className={inputClass} name="name" required placeholder="Ex : Marie Dupont" />
          </label>
          <label className={labelClass}>
            Email
            <input
              className={inputClass}
              type="email"
              name="email"
              required
              placeholder="ex : marie@mail.com"
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Sujet
            <input
              className={inputClass}
              name="subject"
              required
              placeholder="Ex : Question / partenariat…"
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Message
            <textarea
              className={cn(inputClass, 'min-h-[160px] resize-y')}
              name="message"
              required
              rows={6}
              placeholder={copy.contactMessagePlaceholder}
            />
          </label>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <Button type="submit" disabled={contactBusy}>
              <Mail className="mr-2 h-4 w-4" /> {copy.formSend}
            </Button>
            {contactStatus ? (
              <span className="text-sm text-slate-600" role="status">
                {contactStatus}
              </span>
            ) : null}
          </div>
        </form>
      </ModalPanel>

      <ModalPanel
        open={transparencyModalOpen}
        onClose={() => setTransparencyModalOpen(false)}
        title={copy.transparencyBtn}
        wide
      >
        {/* Contenu transparence directement intégré dans la modale. */}
        <div dangerouslySetInnerHTML={{ __html: transparencyModalBodyHtml }} />
      </ModalPanel>

      <ModalPanel
        open={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        title={copy.footerLegal}
        wide
      >
        <div dangerouslySetInnerHTML={{ __html: legalModalBodyHtml }} />
      </ModalPanel>

      <ModalPanel
        open={instrumentsOpen}
        onClose={() => setInstrumentsOpen(false)}
        title={copy.instrumentsModalTitle}
      >
        <p className="text-sm text-slate-500">{copy.instrumentsModalIntro}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {INSTRUMENTS_NEEDED.map((name, i) => {
            const accents = ['emerald', 'sky', 'violet', 'amber', 'rose', 'teal', 'indigo']
            const accent = accents[i % accents.length]
            return (
            <li
              key={name}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <Music2 className={cn('h-4 w-4 shrink-0', cardIconClass(accent))} />
              {name}
            </li>
            )
          })}
        </ul>
      </ModalPanel>

      <GalleryLightbox
        open={galleryLightboxIndex !== null}
        images={galleryImages}
        index={galleryLightboxIndex ?? 0}
        onClose={() => setGalleryLightboxIndex(null)}
        onNavigate={setGalleryLightboxIndex}
      />
    </div>
  )
}
