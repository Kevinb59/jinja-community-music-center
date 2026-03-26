# Jinja Community Music Center — France — Site web

Site du projet Jinja Community Music Center — France : lieu culturel qui forme des musiciens à Jinja (Ouganda).

## Structure du projet

```
jinja-community-music-center/
├── index.html              # Point d’entrée Vite (application React)
├── src/                    # Code React (App, styles Tailwind, données galerie)
├── public/                 # Fichiers servis tels quels (boutique, mentions légales, transparence, css/js legacy)
├── images/                 # Photos (galerie, hero, etc.)
├── gas/                    # Google Apps Script (formulaires)
├── scripts/                # Génération JSON de la galerie
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Développement

```bash
npm install
npm run dev
```

L’application est sur `http://localhost:5173`. Les images du dépôt sont servies sous `/images/…` (voir `vite.config.js`).

## Build et déploiement

```bash
npm run gallery    # optionnel : régénérer la galerie depuis images/
npm run build      # sortie dans dist/
```

Déployez le contenu de **`dist/`** sur votre hébergement statique. Le dossier **`public/`** est copié à la racine du build (ex. `/boutique.html`, `/js/…`). Le dossier **`images/`** à la racine du dépôt est recopié dans **`dist/images/`** au build (voir `vite.config.js`) pour que la galerie et les chemins `images/…` fonctionnent en production (ex. Vercel).

## Galerie photos

Les albums correspondent aux dossiers sous `images/` (concert, instrument-parc, vie-quotidienne, répétition, don). Voir **`scripts/README.md`** pour `generate-gallery.js` et `watch-gallery.js`.

## Configuration Google Apps Script

Les formulaires utilisent des URLs déployées (GAS). Pour l’app React, définissez **`GAS_URL_CONTACT`** (et optionnellement **`GAS_URL_MATERIAL`**) dans un **`.env`** local ou dans le tableau de bord Vercel au moment du build (voir **`.env.example`**). Les variables **`VITE_GAS_*`** restent acceptées en secours.  
Pour les pages dans **`public/`**, éditez **`public/js/config.js`** comme avant (fichiers non passés par Vite).

## Note

Si un dossier vide **`redesign-preview/`** apparaît encore après une migration, supprimez-le manuellement (Windows peut le verrouiller tant qu’un processus l’utilise).
