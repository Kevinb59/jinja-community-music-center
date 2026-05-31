/**
 * Encart bidirectionnel : propose EN si site FR + navigateur non-FR ; propose FR si site EN + navigateur FR.
 */
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useLocale } from '../i18n/LocaleContext.jsx'
import {
  dismissSuggestEnBanner,
  dismissSuggestFrBanner,
  getActiveLangBannerSuggestion
} from '../i18n/detectBrowserLocale.js'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Purpose: textes en anglais (visiteurs dont le navigateur n’est pas en français). */
const SUGGEST_EN_UI = {
  message: 'This site is also available in English. Would you like to view the English version?',
  switch: 'View in English',
  stay: 'Continue in French',
  regionLabel: 'Language suggestion',
  closeLabel: 'Dismiss language suggestion'
}

/** Purpose: textes en français (visiteurs dont le navigateur est en français). */
const SUGGEST_FR_UI = {
  message:
    'Ce site est aussi disponible en français. Souhaitez-vous afficher la version française ?',
  switch: 'Voir en français',
  stay: 'Rester en anglais',
  regionLabel: 'Suggestion de langue',
  closeLabel: 'Fermer la suggestion de langue'
}

export default function LocaleSuggestBanner({ onVisibilityChange }) {
  const { locale, setLocale } = useLocale()
  const [mode, setMode] = useState(null)

  // Purpose: recalculer l’encart à chaque changement de locale.
  useEffect(() => {
    setMode(getActiveLangBannerSuggestion(locale))
  }, [locale])

  const visible = mode !== null

  useEffect(() => {
    onVisibilityChange?.(visible)
  }, [visible, onVisibilityChange])

  if (!visible) return null

  const ui = mode === 'suggest-fr' ? SUGGEST_FR_UI : SUGGEST_EN_UI

  /** Purpose: fermer sans changer de langue. */
  function dismissStay() {
    if (mode === 'suggest-fr') dismissSuggestFrBanner()
    else dismissSuggestEnBanner()
    setMode(null)
  }

  /** Purpose: basculer vers la langue proposée. */
  function acceptSwitch() {
    if (mode === 'suggest-fr') {
      dismissSuggestFrBanner()
      setLocale('fr')
    } else {
      dismissSuggestEnBanner()
      setLocale('en')
    }
    setMode(null)
  }

  return (
    <div
      role="region"
      aria-label={ui.regionLabel}
      className="border-b border-emerald-200/80 bg-emerald-50/95 text-slate-800 shadow-sm backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-2.5 sm:justify-between sm:px-6 md:px-8 lg:px-10">
        <p className="text-center text-sm leading-snug sm:text-left">{ui.message}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={acceptSwitch}
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {ui.switch}
          </button>
          <button
            type="button"
            onClick={dismissStay}
            className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {ui.stay}
          </button>
          <button
            type="button"
            onClick={dismissStay}
            className={cn(
              'rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-800'
            )}
            aria-label={ui.closeLabel}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
