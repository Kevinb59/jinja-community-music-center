/**
 * Page refonte Jinja Community Music Center — contenu aligné sur index.html + script.js (FR).
 * Images : préfixe /images/ (dossier `images/` à la racine ; copié dans dist au build, servi en dev par vite.config.js).
 * Page boutique : fichier dans `public/` (URL racine, ex. /boutique.html).
 */
import React, { useEffect, useId, useMemo, useState } from 'react'
import {
  ArrowRight,
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
  Shield,
  ShoppingBag,
  X
} from 'lucide-react'
import galleryData from './data/gallery-data.json'
import { submitToGas } from './gasSubmit'
import {
  BRAND_NAME,
  DONATION_PAGE_URL,
  legacyPage,
  SHOP_OPEN
} from './siteConfig'
import {
  copy,
  DONOR_COUNTRY_LABELS,
  donorCountryFlagEmoji,
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
    title: copy.musicTitle,
    text: copy.musicText
  },
  {
    icon: Shield,
    title: 'Un lieu gratuit et sécurisé',
    text: copy.contextText1 + ' ' + copy.contextText2
  },
  {
    icon: House,
    title: 'Accueil au quotidien',
    text:
      'Le centre accueille, enseigne, partage des repas quand c’est possible et héberge certains enfants en grande précarité.'
  }
]

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Ligne de séparation entre sections : dégradé emerald → cyan avec halo type néon (ombre portée).
 * aria-hidden : élément purement décoratif.
 */
function SectionNeonDivider() {
  return (
    <div className="w-full px-4 py-10 md:py-14" aria-hidden="true">
      {/* overflow-visible + marges latérales : le glow ne se fait pas trancher au bord du conteneur. */}
      <div className="relative mx-auto max-w-4xl overflow-visible px-6 sm:px-10">
        {/* Halo : même logique transparent → centre → transparent pour des extrémités douces. */}
        <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-emerald-400/45 via-50% to-transparent blur-md" />
        {/* Trait : début et fin identiques (fade vers transparent), plus un pic emerald/cyan au centre. */}
        <div
          className="relative mx-auto h-[2px] max-w-2xl rounded-full shadow-[0_0_12px_rgba(52,211,153,0.65),0_0_28px_rgba(110,231,183,0.35),0_0_44px_rgba(34,211,238,0.18)]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, transparent 12%, rgba(110,231,183,0.85) 46%, rgba(103,232,249,0.75) 54%, transparent 88%, transparent 100%)'
          }}
        />
      </div>
    </div>
  )
}

function assetUrl(relativePath) {
  if (!relativePath) return ''
  const clean = relativePath.replace(/^\/+/, '')
  return `/${clean}`
}

function Card({ className = '', children }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/10 bg-white/5 text-white shadow-xl shadow-black/10',
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
        'inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-medium',
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
      ? 'border border-white/15 bg-transparent text-white hover:bg-white/10'
      : 'bg-white text-slate-950 hover:bg-slate-200'
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

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl space-y-3">
      <Badge className="border-white/15 bg-white/10 text-white/80 backdrop-blur">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {text ? (
        <p className="text-sm leading-7 text-slate-300 md:text-base">{text}</p>
      ) : null}
    </div>
  )
}

function VisualPlaceholder({ label, tall = false, preserveAspect = false }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent',
        preserveAspect ? 'min-h-[200px]' : tall ? 'min-h-[420px]' : 'min-h-[260px]'
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_35%)]" />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-6">
        <div className="flex items-center gap-2 text-slate-300">
          <ImageIcon className="h-5 w-5" />
          <span className="text-sm">Image indisponible</span>
        </div>
        <div>
          <p className="text-lg font-medium text-white">{label}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
            Ajoutez le fichier dans le dossier <code className="text-slate-400">images/</code> du
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
      <div className={cn('relative overflow-hidden rounded-3xl border border-white/10', className)}>
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
        'relative overflow-hidden rounded-3xl border border-white/10',
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
 * Vignette galerie : cadre carré (aspect-square), image en couverture ; clic → agrandissement.
 * Variables : failed (image absente), onPick (ouvre le lightbox avec src/alt).
 */
function GalleryThumb({ src, alt, onPick }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-slate-900/50 p-2 text-center"
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
      className="group aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 text-left transition hover:border-emerald-400/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
    >
      <img
        src={assetUrl(src)}
        alt={alt || 'Galerie'}
        className="h-full w-full object-cover transition group-hover:opacity-90"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </button>
  )
}

/**
 * Lightbox galerie : plein écran, image limitée au viewport ; clic sur le voile ferme (Échap : App).
 */
function GalleryLightbox({ open, src, alt, onClose }) {
  if (!open || !src) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Photo en grand"
      onClick={onClose}
    >
      <img
        src={assetUrl(src)}
        alt={alt || ''}
        className="pointer-events-none max-h-[min(90dvh,100%)] max-w-[min(95dvw,100%)] object-contain shadow-2xl"
      />
    </div>
  )
}

/**
 * Tuile « carrousel » : photo pleine lumière quand repliée ; titre + CTA dans un bloc bas sombre
 * seul ; au clic, texte en surimpression avec voile + blur.
 * Key variables : expanded (affichage du panneau texte), imgFailed (repli visuel si fichier absent).
 * focusImageTop : object-cover centré en haut (50 % 0 %) — portraits mieux cadrés.
 */
function ProjectImageTile({ id: tileId, images, title, content, imageAlts = [], focusImageTop = false }) {
  const [expanded, setExpanded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const safeImages = (images || []).filter(Boolean)
  const imgObjectClass = cn('object-cover', focusImageTop && 'object-top')

  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  return (
    <article
      id={tileId}
      className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/40 shadow-xl shadow-black/20 scroll-mt-24"
      aria-expanded={expanded}
    >
      <div className="relative min-h-[280px] md:min-h-[320px]">
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
          /* Pas de voile sur la photo : seul un bloc bas porte titre + CTA (lisibilité sans assombrir l’image). */
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-stretch p-5 md:p-6">
            <div className="pointer-events-auto w-full rounded-2xl border border-white/15 bg-slate-950/92 p-4 shadow-xl shadow-black/30 backdrop-blur-sm md:p-5">
              <h3 className="text-lg font-semibold leading-snug text-white md:text-xl">{title}</h3>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mt-3 w-fit text-left text-sm font-medium text-emerald-300 underline decoration-emerald-400/50 underline-offset-4 transition hover:text-emerald-200"
              >
                {copy.projectExpandHint}
              </button>
            </div>
          </div>
        ) : (
          /* Voile ~86 % + blur xl (un cran au-dessus de lg, sans aller jusqu’au 2xl « trop flou »). */
          <div className="absolute inset-0 z-10 flex max-h-[min(85vh,520px)] flex-col bg-black/86 p-5 shadow-[inset_0_0_80px_rgba(0,0,0,0.28)] backdrop-blur-xl ring-1 ring-inset ring-white/10 md:max-h-[560px] md:p-6">
            <h3 className="shrink-0 text-lg font-semibold text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.95),0_1px_4px_rgba(0,0,0,0.85)]">
              {title}
            </h3>
            {/* Ombres sur les blocs typographiques : le contenu (HTML ou React) reste lisible sur photo claire. */}
            <div
              className="mt-3 min-h-0 flex-1 overflow-y-auto text-sm leading-7 text-slate-200 [text-shadow:0_1px_14px_rgba(0,0,0,0.92)] [&_a]:[text-shadow:0_1px_12px_rgba(0,0,0,0.9)] [&_li]:[text-shadow:0_1px_12px_rgba(0,0,0,0.92)] [&_p]:[text-shadow:0_1px_14px_rgba(0,0,0,0.92)] [&_strong]:text-white [&_strong]:[text-shadow:0_1px_12px_rgba(0,0,0,0.95)]"
            >
              {content}
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-4 shrink-0 text-sm font-medium text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 [text-shadow:0_1px_14px_rgba(0,0,0,0.92)] hover:text-emerald-200"
            >
              {copy.projectCollapseHint}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

/**
 * Slide sans visuel (ex. autres membres, besoin dans le carrousel) : simple encadré texte.
 */
function ProjectTextTile({ title, bodyHtml, className = '' }) {
  return (
    <Card className={cn('flex min-h-[220px] flex-col justify-center', className)}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent
        className="space-y-3 text-sm leading-7 text-slate-300 [&_strong]:text-white"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </Card>
  )
}

/**
 * Localisation : pas de grande photo de slide — carte + texte dans un cadre pleine largeur.
 */
function ProjectLocationTile({ className = '' }) {
  return (
    <Card className={cn('bg-gradient-to-b from-white/8 to-white/5', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-emerald-300" />
          {copy.locationTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-7 text-slate-300">
        <p>
          Le centre se trouve à <strong>Jinja, en Ouganda</strong>, une ville située à la source du Nil.
        </p>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
          <iframe
            title="Carte OpenStreetMap — Jinja"
            src={copy.mapIframeSrc}
            className="h-[240px] w-full border-0 md:h-[280px]"
            loading="lazy"
          />
        </div>
        <a
          href={copy.mapLinkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-medium text-emerald-300 underline hover:text-emerald-200"
        >
          {copy.mapLinkLabel}
        </a>
      </CardContent>
    </Card>
  )
}

function AccordionItem({ title, children, isOpen, onClick }) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-white"
      >
        <span className="font-semibold">{title}</span>
        <span className="text-xl text-slate-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen ? (
        <div className="pb-4 text-sm leading-7 text-slate-300">{children}</div>
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
            'pointer-events-auto relative w-full rounded-2xl border border-white/15 bg-slate-950/98 shadow-2xl backdrop-blur-xl',
            wide ? 'max-w-2xl' : 'max-w-lg'
          )}
        >
          {/* En-tête fixe visuellement (bordure) + bouton fermer aligné menu mobile. */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <h2 id={titleId} className="text-lg font-semibold text-white">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [materialModalOpen, setMaterialModalOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [transparencyModalOpen, setTransparencyModalOpen] = useState(false)
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [activeNavId, setActiveNavId] = useState('')
  /** { src, alt } quand une photo galerie est ouverte en plein écran ; null sinon. */
  const [galleryLightbox, setGalleryLightbox] = useState(null)

  const anyOverlayOpen =
    mobileMenuOpen ||
    materialModalOpen ||
    contactModalOpen ||
    transparencyModalOpen ||
    legalModalOpen ||
    instrumentsOpen ||
    galleryLightbox !== null

  // Purpose: une seule logique pour menu mobile + modales (scroll body, Échap ferme la couche du dessus).
  useEffect(() => {
    if (!anyOverlayOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (galleryLightbox) {
        setGalleryLightbox(null)
        return
      }
      // Ordre : modale la plus « au-dessus » en premier (pile proche du bas du DOM).
      if (contactModalOpen) setContactModalOpen(false)
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
    transparencyModalOpen,
    legalModalOpen,
    instrumentsOpen,
    galleryLightbox
  ])

  // Purpose: au passage en vue large, refermer les panneaux plein écran (menu + modales).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      setMobileMenuOpen(false)
      setMaterialModalOpen(false)
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
      setContactStatus("Erreur d'envoi. Réessaie plus tard.")
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
      setMatStatus("Erreur d'envoi. Réessaie plus tard.")
    } finally {
      setMatBusy(false)
      setTimeout(() => setMatStatus(''), 6000)
    }
  }

  const inputClass =
    'mt-1 w-full rounded-xl border border-white/15 bg-slate-950/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30'
  const labelClass = 'block text-sm font-medium text-slate-300'

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.14),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(250,204,21,0.10),transparent_18%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 lg:px-10">
        <header className="sticky top-4 z-30 mb-8 rounded-full border border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-3 lg:justify-between">
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
                <p className="text-lg font-semibold tracking-wide text-white md:text-xl lg:text-2xl">
                  PROJET JINJA
                </p>
                <p className="mt-1 max-w-xl text-[0.625rem] font-normal uppercase leading-snug tracking-[0.14em] text-slate-500 sm:text-[0.6875rem] md:max-w-2xl">
                  <span className="block">{BRAND_SLOGAN_LINES.line1}</span>
                  {BRAND_SLOGAN_LINES.line2 ? (
                    <span className="block">{BRAND_SLOGAN_LINES.line2}</span>
                  ) : null}
                </p>
              </div>
            </a>

            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>

            <nav
              className="hidden flex-wrap items-center gap-2 text-sm text-slate-300 lg:flex"
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
                      'rounded-full border px-3 py-1.5 text-sm transition',
                      isActive
                        ? 'border-emerald-400/55 bg-emerald-400/12 text-emerald-50 shadow-[0_0_20px_rgba(52,211,153,0.14)]'
                        : 'border-white/10 text-slate-300 hover:bg-white/10'
                    )}
                  >
                    {item.label}
                  </a>
                )
              })}
              <Button
                href="#don"
                className={cn(
                  'px-4 py-2',
                  activeNavId === 'don' &&
                    'ring-2 ring-emerald-400/55 ring-offset-2 ring-offset-[#07111f]'
                )}
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
              className="absolute left-3 right-3 top-[4.5rem] max-h-[min(calc(100dvh-6rem),32rem)] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/98 p-4 shadow-2xl backdrop-blur-xl sm:left-4 sm:right-4"
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
                          'block rounded-xl px-4 py-3 text-base transition',
                          isActive
                            ? 'border border-emerald-400/40 bg-emerald-400/12 text-emerald-50'
                            : 'text-slate-200 hover:bg-white/10'
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
                className={cn(
                  'mt-4 flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200',
                  activeNavId === 'don' && 'ring-2 ring-emerald-400/70 ring-offset-2 ring-offset-slate-950'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Faire un don
              </a>
            </nav>
          </div>
        ) : null}

        <main id="top">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8 lg:p-10">
              <Badge className="border-emerald-400/20 bg-emerald-400/15 text-emerald-200">
                {copy.pill}
              </Badge>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.05]">
                {copy.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                {copy.heroSubtitle}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                {copy.heroNote}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <Card className="rounded-3xl bg-slate-950/40">
                  <CardContent className="p-5">
                    <p className="text-3xl font-semibold">27</p>
                    <p className="mt-1 text-sm text-slate-400">{copy.countlineText}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl bg-slate-950/40">
                  <CardContent className="p-5">
                    <p className="text-3xl font-semibold">7</p>
                    <p className="mt-1 text-sm text-slate-400">{copy.needsInstrumentsIntro}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl bg-slate-950/40">
                  <CardContent className="p-5">
                    <p className="text-lg font-semibold leading-snug">{copy.countlineTag}</p>
                    <p className="mt-1 text-sm text-slate-400">{copy.visualText}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="px-6" href="#don">
                  Faire un don <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="px-6" href="#besoins">
                  Voir les besoins
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SiteImage src={paths.heroSide} alt="Instruments — répétition" preserveAspect />
              <Card className="rounded-3xl bg-slate-950/40">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-emerald-200">{copy.visualTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy.visualText}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <SectionNeonDivider />

          <section className="mt-0 grid gap-6 lg:grid-cols-3" id="valeurs" aria-label="Valeurs">
            {values.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
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

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <ProjectImageTile
                focusImageTop
                images={[paths.founder]}
                title={copy.whoTitle}
                imageAlts={['Bwiire JohnBosco — fondateur']}
                content={<div dangerouslySetInnerHTML={{ __html: copy.whoHtml }} />}
              />
              <ProjectImageTile
                focusImageTop
                images={[paths.emilie]}
                title={copy.teamTitle}
                imageAlts={['Emilie Empis']}
                content={<div dangerouslySetInnerHTML={{ __html: copy.teamHtml }} />}
              />

              <ProjectTextTile title={copy.teamOtherTitle} bodyHtml={copy.teamOtherHtml} />

              <ProjectImageTile
                images={[paths.context]}
                title={copy.contextTitle}
                imageAlts={['Contexte à Jinja']}
                content={
                  <div className="space-y-4">
                    <p>{copy.contextText1}</p>
                    <p>{copy.contextText2}</p>
                  </div>
                }
              />

              <ProjectImageTile
                images={[paths.avenir]}
                title={copy.musicTitle}
                imageAlts={["La musique comme outil d'avenir"]}
                content={
                  <>
                    <p>{copy.musicText}</p>
                    <ul className="mt-3 list-inside list-disc space-y-1">
                      {copy.musicBullets.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </>
                }
              />

              <ProjectImageTile
                id="vie"
                images={[paths.vieDaily]}
                title={copy.dayTitle}
                imageAlts={['Vie quotidienne au centre']}
                content={
                  <div
                    className="[&_a]:font-medium [&_a]:text-emerald-300 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: copy.dayHtml }}
                  />
                }
              />

              <ProjectLocationTile className="md:col-span-2" />
            </div>
          </section>

          <SectionNeonDivider />

          <section className="mt-0" id="besoins">
            <SectionTitle eyebrow={copy.needsEyebrow} title={copy.needsTitle} text={copy.needsLead} />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Music2 className="h-5 w-5 shrink-0 text-emerald-300" />
                    {copy.needsInstrumentsTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-slate-400">{copy.needsInstrumentsIntro}</p>
                  <div className="flex flex-wrap gap-2">
                    {INSTRUMENTS_NEEDED.map((name) => (
                      <Badge key={name} className="bg-white/10 py-2 text-sm text-slate-200">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-emerald-300" />
                      {copy.needsPartitionsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm leading-7 text-slate-300">
                    <p>{copy.needsPartitionsText}</p>
                    <p className="text-slate-400">{copy.needsPartitionsDigital}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <HandCoins className="h-5 w-5 text-emerald-300" />
                      {copy.needsFinanceTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-slate-300">
                    <p>{copy.needsFinanceText}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-950/50">
                  <CardHeader>
                    <CardTitle className="text-xl">{copy.inventoryTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {copy.inventoryLine.split(/\s*\/\s*/).map((item) => (
                      <Badge key={item} className="bg-white/10 text-slate-200">
                        {item.trim()}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <SectionNeonDivider />

          <section className="mt-0" id="aider">
            <SectionTitle eyebrow={copy.helpEyebrow} title={copy.helpTitle} text={copy.helpLead} />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { step: '01', title: copy.help1Title, text: copy.help1Text },
                { step: '02', title: copy.help2Title, text: copy.help2Text },
                { step: '03', title: copy.help3Title, text: copy.help3Text }
              ].map((item) => (
                <Card key={item.step}>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium tracking-[0.25em] text-emerald-300">{item.step}</p>
                    <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <SectionNeonDivider />

          <section className="mt-0 space-y-8" id="don">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <SectionTitle eyebrow={copy.donateEyebrow} title={copy.donateTitle} text={copy.donateLead} />
              <Button
                variant="outline"
                type="button"
                onClick={() => setTransparencyModalOpen(true)}
                className="shrink-0 border-violet-400/40 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20"
              >
                {copy.transparencyBtn}
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardContent className="p-7 md:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <CircleDollarSign className="h-5 w-5 text-emerald-300" />
                  </div>
                  <h3 className="text-2xl font-semibold">{copy.donateFinTitle}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{copy.donateFinText}</p>
                  <Button className="mt-6" href={DONATION_PAGE_URL} target="_blank" rel="noreferrer">
                    {copy.donateFinBtn}
                  </Button>
                </CardContent>
              </Card>

              <div id="materiel" className="contents">
                <Card className="scroll-mt-24">
                  <CardContent className="p-7 md:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Drum className="h-5 w-5 text-emerald-300" />
                    </div>
                    <h3 className="text-2xl font-semibold">{copy.donateMatTitle}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{copy.donateMatText}</p>
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
                    <p className="text-sm font-semibold text-white">{copy.creationsOrderTitle}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{copy.creationsOrderHtml}</p>
                    <a
                      href={legacyPage('boutique.html')}
                      className="mt-3 inline-block text-sm font-medium text-emerald-300 underline hover:text-emerald-200"
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
                <p className="max-w-md text-center rounded-full border border-white/20 bg-slate-950/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm">
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
            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-3">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Albums">
                {GALLERY_TABS.map(({ key, label }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      activeTab === key
                        ? 'bg-white text-slate-950'
                        : 'border border-white/10 bg-transparent text-white hover:bg-white/10'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {galleryImages.length === 0 ? (
                <p className="mt-6 px-2 text-sm text-slate-500">Aucune image dans cet album pour le moment.</p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {galleryImages.map((img, idx) => (
                    <GalleryThumb
                      key={`${img.src}-${idx}`}
                      src={img.src}
                      alt={img.alt || 'Galerie'}
                      onPick={() =>
                        setGalleryLightbox({ src: img.src, alt: img.alt || 'Galerie' })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <SectionNeonDivider />

          <section className="mt-0" id="contact">
            <SectionTitle
              eyebrow={copy.contactEyebrow}
              title={copy.contactTitle}
              text={copy.contactText}
            />
            <Card className="mt-8">
              <CardContent className="space-y-5 p-6 text-sm leading-7 text-slate-300 md:p-8">
                <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-base font-semibold text-white">{copy.contactTeamTitle}</p>
                  <p className="mt-2 font-semibold text-white">{copy.contactName}</p>
                  <p className="text-slate-300">{copy.contactRole}</p>
                  <p className="mt-3 text-slate-400">{copy.contactDesc}</p>
                </div>

                <Button className="mt-2" onClick={() => setContactModalOpen(true)}>
                  <Mail className="mr-2 h-4 w-4" /> {copy.contactFormOpenBtn}
                </Button>
              </CardContent>
            </Card>
          </section>

          <SectionNeonDivider />

          <section className="mt-0 scroll-mt-24" id="donateurs">
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
                      'group relative overflow-hidden rounded-[24px] border p-5 shadow-lg shadow-black/15 transition duration-300 hover:-translate-y-1 hover:shadow-xl',
                      isFin
                        ? 'border-emerald-400/35 bg-gradient-to-br from-emerald-500/18 to-sky-500/12 hover:border-emerald-400/50'
                        : 'border-amber-400/35 bg-gradient-to-br from-amber-500/14 to-rose-500/12 hover:border-amber-400/50'
                    )}
                  >
                    <div className="relative flex gap-4">
                      <div
                        className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                          isFin ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-200'
                        )}
                      >
                        {isFin ? (
                          <CircleDollarSign className="h-5 w-5" strokeWidth={2} />
                        ) : (
                          <Package className="h-5 w-5" strokeWidth={2} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2 text-sm">
                        <p className="flex items-baseline gap-2 text-base font-semibold leading-snug text-white">
                          {row.country && DONOR_COUNTRY_LABELS[row.country] ? (
                            <span
                              className="shrink-0 text-[1.35rem] leading-none"
                              style={{
                                fontFamily:
                                  '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif'
                              }}
                              role="img"
                              aria-label={DONOR_COUNTRY_LABELS[row.country]}
                            >
                              {donorCountryFlagEmoji(row.country)}
                            </span>
                          ) : null}
                          <span className="min-w-0">{row.name}</span>
                        </p>
                        <p className="text-slate-300">
                          <span className="text-slate-500">{copy.donorsColGift} · </span>
                          {row.gift}
                        </p>
                        <p className="text-slate-400">
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
              className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-emerald-400/80 underline hover:text-emerald-300"
            >
              {copy.footerLegal}
            </button>
          </footer>
        </main>
      </div>

      <ModalPanel
        open={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        title={copy.matTitle}
        wide
      >
        <p className="mb-3 text-sm leading-7 text-slate-300">{copy.matIntro}</p>
        <p className="mb-5 text-sm text-slate-400">{copy.matDigitalNote}</p>
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
              placeholder="Décris rapidement ce que tu proposes…"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <Button type="submit" disabled={matBusy}>
              {copy.matSend}
            </Button>
            {matStatus ? (
              <span className="text-sm text-slate-300" role="status">
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
              placeholder="Écris ton message…"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <Button type="submit" disabled={contactBusy}>
              <Mail className="mr-2 h-4 w-4" /> {copy.formSend}
            </Button>
            {contactStatus ? (
              <span className="text-sm text-slate-300" role="status">
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
        <p className="text-sm text-slate-400">{copy.instrumentsModalIntro}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-200">
          {INSTRUMENTS_NEEDED.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"
            >
              <Music2 className="h-4 w-4 shrink-0 text-emerald-400" />
              {name}
            </li>
          ))}
        </ul>
      </ModalPanel>

      <GalleryLightbox
        open={galleryLightbox !== null}
        src={galleryLightbox?.src}
        alt={galleryLightbox?.alt}
        onClose={() => setGalleryLightbox(null)}
      />
    </div>
  )
}
