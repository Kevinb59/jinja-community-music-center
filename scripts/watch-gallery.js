/**
 * ============================================
 * SCRIPT DE WATCH POUR LA GALERIE
 * ============================================
 *
 * Ce script surveille les dossiers d'images et régénère automatiquement
 * le fichier JSON de la galerie quand des fichiers sont ajoutés/modifiés.
 *
 * Usage: node scripts/watch-gallery.js
 *
 * Le script se lance et reste actif. Il régénère automatiquement
 * gallery-data.json à chaque modification dans les dossiers d'images.
 */

const fs = require('fs')
const path = require('path')
const { generateGalleryData } = require('./generate-gallery.js')

// Dossier source des images
const IMAGES_DIR = path.join(__dirname, '..', 'images')

// Configuration des albums à surveiller
const ALBUM_FOLDERS = [
  'concert',
  'instrument-parc',
  'vie-quotidienne',
  'repetition',
  'don'
]

console.log("👀 Surveillance des dossiers d'images activée...\n")
console.log('📁 Dossiers surveillés:')
ALBUM_FOLDERS.forEach((folder) => {
  console.log(`   - images/${folder}/`)
})
console.log(
  '\n✨ Ajoutez des images dans ces dossiers, elles seront automatiquement détectées!\n'
)
console.log('💡 Appuyez sur Ctrl+C pour arrêter la surveillance.\n')

// Générer une première fois
generateGalleryData()

// Fonction pour surveiller un dossier
function watchFolder(folderPath, folderName) {
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Dossier non trouvé: ${folderPath}`)
    return
  }

  fs.watch(folderPath, { recursive: false }, (eventType, filename) => {
    if (filename) {
      // Vérifier si c'est une image
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
      const ext = path.extname(filename).toLowerCase()

      if (imageExtensions.includes(ext)) {
        console.log(
          `\n🔄 Modification détectée dans ${folderName}: ${filename}`
        )
        console.log('📝 Régénération de la galerie...')
        generateGalleryData()
        console.log('✅ Galerie mise à jour!\n')
      }
    }
  })
}

// Surveiller tous les dossiers d'albums
ALBUM_FOLDERS.forEach((folderName) => {
  const folderPath = path.join(IMAGES_DIR, folderName)
  watchFolder(folderPath, folderName)
})

console.log(
  '✅ Surveillance active. Ajoutez des images pour voir la magie opérer! 🎉\n'
)
