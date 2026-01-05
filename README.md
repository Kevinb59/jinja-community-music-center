# Jinja Community Music Center - France - Site Web

Site web pour le projet Jinja Community Music Center - France, un lieu culturel qui forme des musiciens à Jinja (Ouganda).

## 📁 Structure du projet

```
jinja-community-music-center/
├── index.html          # Page principale HTML
├── css/
│   └── style.css      # Feuille de style principale
├── js/
│   ├── config.js      # Configuration Google Apps Script
│   └── script.js      # Script JavaScript principal
├── images/             # Dossier pour les photos et images
│   └── .gitkeep       # Fichier pour versionner le dossier vide
├── gas/
│   └── mail-handler.gs # Script Google Apps Script pour l'envoi de mails
└── README.md          # Ce fichier
```

## 🚀 Installation

1. Clonez ou téléchargez ce projet
2. Ouvrez `index.html` dans votre navigateur pour tester localement
3. Pour déployer, uploadez tous les fichiers sur votre serveur web

## ⚙️ Configuration Google Apps Script (GAS)

Le site utilise Google Apps Script pour l'envoi de mails depuis les formulaires de contact et de don matériel.

### Étapes de configuration :

1. **Créer le script GAS**

   - Allez sur https://script.google.com
   - Créez un nouveau projet
   - Copiez le contenu de `gas/mail-handler.gs` dans l'éditeur
   - Remplacez `RECIPIENT_EMAIL` par votre adresse email de destination

2. **Déployer le script**

   - Cliquez sur "Déployer" > "Nouvelle version"
   - Type d'exécution : "Moi"
   - Qui a accès : "Tout le monde" (nécessaire pour les requêtes depuis le web)
   - Cliquez sur "Déployer"
   - Copiez l'URL de déploiement (format : `https://script.google.com/macros/s/XXXXX/exec`)

3. **Configurer le site**
   - Ouvrez `js/config.js`
   - Remplacez `XXXXX` par votre URL de déploiement GAS complète
   - Remplacez `votre-email@example.com` par votre adresse email

### Exemple de configuration :

```javascript
const GAS_CONFIG = {
  contactUrl: 'https://script.google.com/macros/s/AKfycby.../exec',
  materialUrl: 'https://script.google.com/macros/s/AKfycby.../exec',
  recipientEmail: 'contact@jinja-music-center.org'
}
```

## 🌐 Fonctionnalités

- **Internationalisation** : Support FR/EN avec basculement de langue
- **Formulaires** : Contact et don matériel avec envoi via GAS
- **Galerie** : Albums photos avec navigation par onglets
- **Responsive** : Design adaptatif pour mobile et desktop
- **Accessibilité** : Respect des standards ARIA

## 📸 Gestion des images

Le dossier `images/` est prévu pour stocker toutes les photos et images du site :

- Photos de la galerie (albums : centre, concert, vie, don)
- Images du hero
- Logos et icônes
- Autres ressources visuelles

### Organisation recommandée :

```
images/
├── gallery/
│   ├── centre/
│   ├── concert/
│   ├── vie/
│   └── don/
├── hero/
└── logos/
```

### Utilisation dans le code :

Pour référencer une image, utilisez le chemin relatif depuis `index.html` :

```html
<img src="images/gallery/centre/photo-01.jpg" alt="Description" />
```

## 📝 Notes techniques

- **CSS** : Tous les styles sont dans `css/style.css` (pas de CSS inline)
- **JavaScript** : Toute la logique est dans `js/script.js` (pas de JS inline)
- **GAS** : Utilisation de `mode: "no-cors"` pour contourner les restrictions CORS
- **Images** : Toutes les images sont dans le dossier `images/`

## 🔧 Personnalisation

### Modifier les couleurs

Éditez les variables CSS dans `css/style.css` :

```css
:root {
  --bg: #0b0d12;
  --accent: #7c5cff;
  --accent2: #25d366;
  /* ... */
}
```

### Ajouter des traductions

Modifiez l'objet `i18n` dans `js/script.js` pour ajouter de nouvelles langues ou modifier les textes.

## 📧 Support

Pour toute question ou problème, contactez via le formulaire du site.
