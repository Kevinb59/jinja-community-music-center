import { GAS_CONTACT_URL, GAS_MATERIAL_URL } from './siteConfig'

/**
 * Envoie les données vers Google Apps Script (GET + no-cors), comme sur script.js.
 * @param {'contact'|'material'} formType
 * @param {URLSearchParams} params
 */
export async function submitToGas(formType, params) {
  const base =
    formType === 'material' ? GAS_MATERIAL_URL : GAS_CONTACT_URL

  // ---------------------------------------------------------------------------
  // Validation de la cible GAS
  // But: empêcher les faux positifs "envoyé" si l'URL est absente ou placeholder.
  // Variables clés: base (URL brute), looksLikeGas (forme attendue), hasPlaceholder.
  // Flux: on vérifie -> on lève une erreur explicite -> le formulaire affiche l'état d'échec.
  // ---------------------------------------------------------------------------
  const looksLikeGas = /^https:\/\/script\.google\.com\/macros\/s\/.+\/(exec|dev)$/i.test(
    String(base || '').trim()
  )
  const hasPlaceholder = String(base || '').includes('XXXXX')
  if (!base || hasPlaceholder || !looksLikeGas) {
    throw new Error(
      'URL GAS invalide: configure GAS_URL_CONTACT / GAS_URL_MATERIAL (format .../exec)'
    )
  }

  const url = `${base}?${params.toString()}`
  await fetch(url, { method: 'GET', mode: 'no-cors' })
}
