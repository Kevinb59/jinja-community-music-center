/**
 * URLs et constantes alignées sur le site statique (index.html, js/config.js).
 * Variables d’environnement optionnelles : VITE_DONATION_URL, VITE_GAS_CONTACT_URL, VITE_GAS_MATERIAL_URL.
 */
export const BRAND_NAME = 'PROJET JINJA COMMUNITY MUSIC CENTER - FRANCE'

export const DONATION_PAGE_URL =
  import.meta.env.VITE_DONATION_URL ?? 'https://example.com/donation'

const DEFAULT_GAS = 'https://script.google.com/macros/s/XXXXX/exec'

export const GAS_CONTACT_URL =
  import.meta.env.VITE_GAS_CONTACT_URL ?? DEFAULT_GAS

export const GAS_MATERIAL_URL =
  import.meta.env.VITE_GAS_MATERIAL_URL ?? GAS_CONTACT_URL

/** Préfixe dev : pages HTML/CSS du dépôt servies par Vite (voir vite.config.js). */
export function legacyPage(fileName) {
  return `/site/${fileName}`
}
