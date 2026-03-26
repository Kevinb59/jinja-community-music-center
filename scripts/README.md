# Scripts de génération de la galerie

## 🚀 Solution dynamique pour la galerie

La galerie est maintenant **100% dynamique** : ajoutez simplement des images dans les dossiers et elles apparaîtront automatiquement sur le site !

## 📋 Scripts disponibles

### 1. `generate-gallery.js` - Génération manuelle

Génère le fichier JSON de la galerie en scannant les dossiers d'images.

**Utilisation :**

```bash
node scripts/generate-gallery.js
```

**Quand l'utiliser ?**

- Une fois après avoir ajouté des images
- Avant de déployer le site
- Pour mettre à jour la galerie manuellement

### 2. `watch-gallery.js` - Surveillance automatique ⭐ RECOMMANDÉ

Surveille les dossiers d'images et régénère automatiquement la galerie quand des fichiers sont ajoutés/modifiés.

**Utilisation :**

```bash
node scripts/watch-gallery.js
```

**Avantages :**

- ✅ Surveillance en temps réel des dossiers
- ✅ Régénération automatique du JSON à chaque ajout/modification
- ✅ Plus besoin d'exécuter manuellement le script
- ✅ Workflow fluide : ajoutez une image → elle apparaît automatiquement

**Comment ça marche ?**

1. Lancez le script : `node scripts/watch-gallery.js`
2. Le script reste actif et surveille les dossiers
3. Ajoutez des images dans `images/concert/`, `images/vie-quotidienne/`, etc.
4. Le JSON est automatiquement régénéré
5. Rafraîchissez la page du site pour voir les nouvelles images

**Arrêter la surveillance :** Appuyez sur `Ctrl+C`

## 📁 Dossiers surveillés

Le système scanne automatiquement ces dossiers :

- `images/concert/` → Album "Concert"
- `images/instrument-parc/` → Album "Parc instrumental"
- `images/vie-quotidienne/` → Album "Vie"
- `images/repetition/` → Album "Répétition"
- `images/dons/` → Album « Don » dans la galerie (clé JSON : `don`)

## 🎯 Workflow recommandé

**Pour le développement :**

```bash
# Terminal 1 : Lancer la surveillance automatique
node scripts/watch-gallery.js

# Terminal 2 : Application React (Vite)
npm run dev
# Puis ajoutez simplement des images dans les dossiers !
```

**Pour la production :**

```bash
# Générer une fois avant le déploiement (ou : npm run gallery)
node scripts/generate-gallery.js
npm run build
```

## 📝 Format du fichier généré

Le script écrit **`src/data/gallery-data.json`** (application React) et une copie **`public/js/gallery-data.json`** pour les pages statiques qui chargent encore `js/script.js`. Structure :

```json
{
  "concert": [
    {
      "src": "images/concert/photo1.jpg",
      "alt": "Concert"
    }
  ],
  "centre": [...],
  "vie": [...],
  "repetition": [...],
  "don": [...]
}
```

## 💡 Notes

- Le script ignore automatiquement les fichiers non-images (extensions: .jpg, .jpeg, .png, .gif, .webp)
- Les images sont triées par nom de fichier
- Le fichier JSON est mis à jour automatiquement avec `watch-gallery.js`
