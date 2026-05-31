# Jinja Community Music Center — France — Site web

Site du projet Jinja Community Music Center — France : lieu culturel qui forme des musiciens à Jinja (Ouganda).

Application **React + Vite**, déployée sur Vercel.

## Structure du projet

```
jinja-community-music-center/
├── index.html              # Point d’entrée Vite
├── src/                    # Application React
│   ├── i18n/               # Textes FR (+ EN à venir), paths images
│   ├── data/               # gallery-data.json
│   └── …
├── public/flags/           # Drapeaux SVG (donateurs)
├── images/                 # Photos et médias (galerie, hero, etc.)
├── api/                    # Routes serverless Vercel (Stripe)
├── server/                 # Logique Stripe partagée (dev + Vercel)
├── gas/                    # Google Apps Script (local, non versionné)
├── scripts/                # Génération JSON de la galerie
├── vite.config.js
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

Sur **Vercel**, le build produit le site statique dans `dist/` et active les fonctions dans `api/`. Le dossier **`images/`** à la racine est recopié dans **`dist/images/`** au build.

## Galerie photos

Les albums correspondent aux dossiers sous `images/` (concert, instrument-parc, vie-quotidienne, répétition, **dons** → onglet « Don »). Voir **`scripts/README.md`** pour `generate-gallery.js` et `watch-gallery.js`.

## Configuration Google Apps Script

Les formulaires utilisent des URLs déployées (GAS). Définissez **`GAS_URL_CONTACT`** (et optionnellement **`GAS_URL_MATERIAL`**) dans **`.env.local`** ou sur Vercel au build. Les variables **`VITE_GAS_*`** restent acceptées en secours.

Le code GAS local se trouve dans **`gas/mail-handler.gs`** (non versionné).

## Dons par carte (Stripe)

Le site propose un **Payment Element** dans la modale « Don financier » (montants 10 / 25 / 50 / 100 € ou montant libre).

### Schéma (important)

**Stripe n’appelle jamais Google Apps Script.** GAS ne peut pas recevoir de webhook Stripe (pas de POST signé côté GAS). Le flux est le suivant :

```
Visiteur → paiement Stripe (Payment Element)
         → navigateur appelle GAS en GET (comme contact / virement)
         → GAS vérifie le paiement via l’API Stripe (sk_… en Script Property)
         → GAS envoie les e-mails (association + remerciement)

Option secours en production :
Stripe → webhook Vercel (/api/stripe/webhook) → GET vers GAS (même e-mails, anti-doublon)
```

### Variables d’environnement (site / Vercel)

Voir **`.env.example`**. En local, créez un fichier **`.env.local`** à la racine :

| Variable | Rôle |
|----------|------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique (`pk_test_` / `pk_live_`) |
| `STRIPE_SECRET_KEY` | Création des PaymentIntent (serveur) |
| `GAS_URL_CONTACT` | URL du script `gas/mail-handler.gs` |

Après modification du `.env`, **relancez** `npm run dev`.

### Google Apps Script (e-mails après paiement)

1. Déployer **`gas/mail-handler.gs`** comme application web (accès : tout le monde).
2. Dans **Propriétés du script**, ajouter **`STRIPE_SECRET_KEY`** = votre clé secrète Stripe.
3. Optionnel (secours webhook Vercel) : **`STRIPE_NOTIFY_SECRET`**.

### Webhook Vercel (optionnel, secours)

- **URL** : `https://votre-domaine.vercel.app/api/stripe/webhook`
- **Événement** : `payment_intent.succeeded`

En local : `stripe listen --forward-to localhost:5173/api/stripe/webhook`

## Internationalisation

Voir **`src/i18n/README.md`**. Les textes français sont dans **`src/i18n/locales/fr.js`** ; l’anglais sera ajouté dans `locales/en.js`.

## Pages à venir

La **boutique** et les **mentions légales** dédiées seront intégrées dans l’application React (remplacement de l’ancien site statique HTML).
