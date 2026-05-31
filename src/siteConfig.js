/**
 * URLs et constantes du site React (Vite).
 * Priorité : GAS_URL_CONTACT / GAS_URL_MATERIAL (injectées au build, voir vite.config.js),
 * puis les équivalents VITE_* pour compatibilité.
 */
export const BRAND_NAME = "PROJET JINJA COMMUNITY MUSIC CENTER - FRANCE"

/** Clé publique Stripe (Payment Element dans la modale don). */
export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ''

/** Montants suggérés (€) dans la modale don. */
export const DONATION_SUGGESTED_AMOUNTS = [10, 25, 50, 100]

/** Coordonnées bancaires (virement) — renseigner via VITE_DONATION_IBAN / VITE_DONATION_BIC. */
export const DONATION_BANK_DETAILS = {
  beneficiary: 'Jinja Community Music Center – France',
  iban: import.meta.env.VITE_DONATION_IBAN ?? '',
  bic: import.meta.env.VITE_DONATION_BIC ?? '',
  reference: 'Don Jinja CMF'
}

/** true si le paiement Stripe intégré est configuré (clé publique présente). */
export function isStripePaymentConfigured() {
  const key = String(STRIPE_PUBLISHABLE_KEY || '').trim()
  return key.startsWith('pk_test_') || key.startsWith('pk_live_')
}

const DEFAULT_GAS = 'https://script.google.com/macros/s/XXXXX/exec'

export const GAS_CONTACT_URL =
  import.meta.env.GAS_URL_CONTACT ||
  import.meta.env.VITE_GAS_CONTACT_URL ||
  DEFAULT_GAS

export const GAS_MATERIAL_URL =
  import.meta.env.GAS_URL_MATERIAL ||
  import.meta.env.VITE_GAS_MATERIAL_URL ||
  GAS_CONTACT_URL

/**
 * Boutique en ligne (section « Nos créations »).
 * Mettre à `true` quand la page boutique React sera prête ; `false` affiche la zone en flou + banderole.
 */
export const SHOP_OPEN = false
