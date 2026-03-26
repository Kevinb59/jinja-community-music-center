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

Déployez le contenu de **`dist/`** sur votre hébergement statique. Le dossier **`public/`** est copié à la racine du build (ex. `/boutique.html`, `/js/…`).

## Galerie photos

Les albums correspondent aux dossiers sous `images/` (concert, instrument-parc, vie-quotidienne, répétition, don). Voir **`scripts/README.md`** pour `generate-gallery.js` et `watch-gallery.js`.

## Configuration Google Apps Script

Les formulaires utilisent des URLs déployées (GAS). Pour l’app React, utilisez un fichier **`.env`** à la racine (voir **`.env.example`**) avec `VITE_GAS_CONTACT_URL`, etc.  
Pour les pages dans **`public/`**, éditez **`public/js/config.js`** comme avant.

## Note

Si un dossier vide **`redesign-preview/`** apparaît encore après une migration, supprimez-le manuellement (Windows peut le verrouiller tant qu’un processus l’utilise).
