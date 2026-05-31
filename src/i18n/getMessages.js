import { ready as enReady } from './locales/en.js'
import * as en from './locales/en.js'
import * as fr from './locales/fr.js'

/**
 * Retourne les messages pour une locale (fr par défaut ; en si ready).
 */
export function getMessages(locale = 'fr') {
  if (locale === 'en' && enReady) {
    return en
  }
  return fr
}

export { DEFAULT_LOCALE, LOCALES } from './config.js'
