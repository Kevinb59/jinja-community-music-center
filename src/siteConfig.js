/**
 * URLs et constantes alignées sur le site statique (public/js/config.js pour les pages legacy).
 * Priorité : GAS_URL_CONTACT / GAS_URL_MATERIAL (injectées au build, voir vite.config.js),
 * puis les équivalents VITE_* pour compatibilité.
 */
export const BRAND_NAME = "PROJET JINJA COMMUNITY MUSIC CENTER - FRANCE"

export const DONATION_PAGE_URL =
  import.meta.env.VITE_DONATION_URL ?? 'https://example.com/donation'

const DEFAULT_GAS = 'https://script.google.com/macros/s/XXXXX/exec'

export const GAS_CONTACT_URL =
  import.meta.env.GAS_URL_CONTACT ||
  import.meta.env.VITE_GAS_CONTACT_URL ||
  DEFAULT_GAS

export const GAS_MATERIAL_URL =
  import.meta.env.GAS_URL_MATERIAL ||
  import.meta.env.VITE_GAS_MATERIAL_URL ||
  GAS_CONTACT_URL

/** Pages HTML encore en fichiers statiques : servies depuis `public/` à la racine de l’URL. */
export function legacyPage(fileName) {
  return `/${fileName}`
}

/**
 * Boutique en ligne (page boutique + CTA section « Nos créations »).
 * Mettre à `true` quand la boutique est ouverte ; `false` affiche la zone en flou + banderole.
 */
export const SHOP_OPEN = false
