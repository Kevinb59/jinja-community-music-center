/**
 * Point d’entrée i18n — réexporte la locale par défaut (fr).
 * À terme : useCopy() depuis LocaleContext pour basculer fr/en.
 */
import { getMessages } from './i18n/getMessages.js'
import { paths } from './i18n/paths.js'

const fr = getMessages('fr')

export { paths }
export const copy = fr.copy
export const transparencyModalBodyHtml = fr.transparencyModalBodyHtml
export const legalModalBodyHtml = fr.legalModalBodyHtml
export const LEGAL_CONTACT_EMAIL = fr.LEGAL_CONTACT_EMAIL
export const DONOR_COUNTRY_LABELS = fr.DONOR_COUNTRY_LABELS
export const DONORS_DEMO = fr.DONORS_DEMO
export const INSTRUMENTS_NEEDED = fr.INSTRUMENTS_NEEDED
