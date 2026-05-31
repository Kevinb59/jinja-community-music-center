# Internationalisation (i18n)

## Langues

| Code | Statut | Fichier |
|------|--------|---------|
| `fr` | Actif (défaut) | `locales/fr.js` |
| `en` | Actif | `locales/en.js` |

## Structure

```
src/i18n/
├── config.js
├── paths.js              # chemins images (non traduits)
├── getMessages.js
├── LocaleContext.jsx     # FR | EN + localStorage `jcmcc-locale`
└── locales/
    ├── fr.js
    ├── en.js
    ├── legal-fr.js       # mentions légales (FR, version de référence)
    └── legal-en.js       # encadré EN + texte FR intégral
```

## Mentions légales

- **FR** : texte complet dans `legal-fr.js`.
- **EN** : résumé en anglais + texte français (version juridiquement opposable).

## Encart langue (bidirectionnel)

| Site | Navigateur | Encart |
|------|------------|--------|
| FR | sans français | Propose **l’anglais** (texte EN) |
| EN | avec français | Propose **le français** (texte FR) |

Fermeture mémorisée séparément : `jcmcc-lang-banner-dismissed-suggest-en` / `…-suggest-fr`.

Fichiers : `LocaleSuggestBanner.jsx`, `detectBrowserLocale.js`.

## Règles

1. Aucune chaîne UI en dur dans les composants : tout dans `fr.js` / `en.js`.
2. Nouvelle clé : ajouter dans **les deux** locales.
3. `siteCopy.js` réexporte encore le FR pour compatibilité ; l’app utilise `LocaleContext`.
