/** Purpose: clés localStorage — fermeture par type d’encart (indépendantes). */
export const LANG_BANNER_DISMISSED_SUGGEST_EN_KEY = 'jcmcc-lang-banner-dismissed-suggest-en'
export const LANG_BANNER_DISMISSED_SUGGEST_FR_KEY = 'jcmcc-lang-banner-dismissed-suggest-fr'

/** @deprecated Ancienne clé unique — traitée comme fermeture de l’encart « passer en anglais ». */
export const LANG_BANNER_DISMISSED_KEY = 'jcmcc-lang-banner-dismissed'

/**
 * Purpose: langues préférées du navigateur (navigator.languages ou language).
 */
function getBrowserLanguageTags() {
  if (typeof navigator === 'undefined') return []
  return navigator.languages?.length > 0 ? [...navigator.languages] : [navigator.language]
}

function primaryLangCode(tag) {
  return String(tag || '')
    .toLowerCase()
    .split('-')[0]
}

/** Purpose: au moins une langue du navigateur est le français. */
export function browserPrefersFrench() {
  return getBrowserLanguageTags().some((tag) => primaryLangCode(tag) === 'fr')
}

/**
 * Purpose: aucune langue du navigateur n’est le français.
 */
export function browserPrefersNonFrench() {
  return !browserPrefersFrench()
}

/**
 * Purpose: quel encart afficher selon la locale du site et le navigateur.
 * @returns {'suggest-en' | 'suggest-fr' | null}
 */
export function getActiveLangBannerSuggestion(locale) {
  if (locale === 'fr' && browserPrefersNonFrench() && !isSuggestEnBannerDismissed()) {
    return 'suggest-en'
  }
  if (locale === 'en' && browserPrefersFrench() && !isSuggestFrBannerDismissed()) {
    return 'suggest-fr'
  }
  return null
}

export function isSuggestEnBannerDismissed() {
  if (typeof window === 'undefined') return false
  return (
    window.localStorage.getItem(LANG_BANNER_DISMISSED_SUGGEST_EN_KEY) === '1' ||
    window.localStorage.getItem(LANG_BANNER_DISMISSED_KEY) === '1'
  )
}

export function isSuggestFrBannerDismissed() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(LANG_BANNER_DISMISSED_SUGGEST_FR_KEY) === '1'
}

/** Purpose: ne plus proposer le passage à l’anglais. */
export function dismissSuggestEnBanner() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANG_BANNER_DISMISSED_SUGGEST_EN_KEY, '1')
  }
}

/** Purpose: ne plus proposer le passage au français. */
export function dismissSuggestFrBanner() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANG_BANNER_DISMISSED_SUGGEST_FR_KEY, '1')
  }
}
