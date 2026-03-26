import { GAS_CONTACT_URL, GAS_MATERIAL_URL } from './siteConfig'

/**
 * Envoie les données vers Google Apps Script (GET + no-cors), comme sur script.js.
 * @param {'contact'|'material'} formType
 * @param {URLSearchParams} params
 */
export async function submitToGas(formType, params) {
  const base =
    formType === 'material' ? GAS_MATERIAL_URL : GAS_CONTACT_URL
  const url = `${base}?${params.toString()}`
  await fetch(url, { method: 'GET', mode: 'no-cors' })
}
