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

Les albums correspondent aux dossiers sous `images/` (concert, instrument-parc, vie-quotidienne, répétition, **dons** → onglet « Don »). Voir **`scripts/README.md`** pour `generate-gallery.js` et `watch-gallery.js`.

## Configuration Google Apps Script

Les formulaires utilisent des URLs déployées (GAS). Pour l’app React, définissez **`GAS_URL_CONTACT`** (et optionnellement **`GAS_URL_MATERIAL`**) dans un **`.env`** local ou dans le tableau de bord Vercel au moment du build (voir **`.env.example`**). Les variables **`VITE_GAS_*`** restent acceptées en secours.  
Pour les pages dans **`public/`**, éditez **`public/js/config.js`** comme avant (fichiers non passés par Vite).

## Dons par carte (Stripe)

Le site propose un **Payment Element** dans la modale « Don financier » (montants 25 / 50 / 100 € ou montant libre).

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

Voir **`.env.example`**. En local, créez un fichier **`.env`** à la racine :

| Variable | Rôle |
|----------|------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique (`pk_test_` / `pk_live_`) — **sans elle, le formulaire s’affiche mais le paiement est désactivé** |
| `STRIPE_SECRET_KEY` | Création des PaymentIntent (serveur Vercel / dev) |
| `GAS_URL_CONTACT` | URL du script `gas/mail-handler.gs` |

Après modification du `.env`, **relancez** `npm run dev`.

### Google Apps Script (e-mails après paiement)

1. Déployer **`gas/mail-handler.gs`** comme application web (accès : tout le monde).
2. Dans **Propriétés du script**, ajouter **`STRIPE_SECRET_KEY`** = votre clé secrète Stripe (`sk_test_…` ou `sk_live_…`).
3. Optionnel (secours webhook Vercel) : **`STRIPE_NOTIFY_SECRET`** = même valeur que `STRIPE_GAS_NOTIFY_SECRET` sur Vercel.

Le navigateur envoie `type=stripe_donation&payment_id=pi_…` ; GAS interroge Stripe pour confirmer que le paiement a bien réussi avant d’envoyer les mails.

### Webhook Vercel (optionnel, secours)

Si l’utilisateur ferme l’onglet avant la notification navigateur, le webhook Vercel peut encore déclencher l’e-mail :

- **URL** : `https://votre-domaine.vercel.app/api/stripe/webhook`
- **Événement** : `payment_intent.succeeded`
- Variable `STRIPE_WEBHOOK_SECRET` sur Vercel

En local : `stripe listen --forward-to localhost:5173/api/stripe/webhook`

## Note

Si un dossier vide **`redesign-preview/`** apparaît encore après une migration, supprimez-le manuellement (Windows peut le verrouiller tant qu’un processus l’utilise).
