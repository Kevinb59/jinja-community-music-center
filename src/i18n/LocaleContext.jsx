import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LOCALE } from './config.js'
import { getMessages } from './getMessages.js'

const STORAGE_KEY = 'jcmcc-locale'

const LocaleContext = createContext(null)

/** Purpose: lire la locale persistée au chargement (navigateur uniquement). */
function readStoredLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : DEFAULT_LOCALE
}

/**
 * Fournit locale + messages à toute l’app (FR / EN).
 */
export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale)
  const messages = useMemo(() => getMessages(locale), [locale])

  const setLocale = (next) => {
    const value = next === 'en' ? 'en' : 'fr'
    setLocaleState(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
  }

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages,
      copy: messages.copy
    }),
    [locale, messages]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale doit être utilisé dans LocaleProvider')
  }
  return ctx
}

export function useCopy() {
  return useLocale().copy
}
