/**
 * ============================================
 * SCRIPT DE GÉNÉRATION DE LA GALERIE
 * ============================================
 *
 * Ce script scanne les dossiers d'images et génère un fichier JSON
 * qui sera utilisé par le JavaScript pour construire la galerie dynamiquement.
 *
 * Usage: node scripts/generate-gallery.js
 */

const fs = require('fs')
const path = require('path')

// Configuration des albums
// Mapping entre les noms de dossiers et les IDs d'albums dans le HTML
const ALBUM_MAPPING = {
  concert: 'concert',
  'instrument-parc': 'centre',
  'vie-quotidienne': 'vie',
  repetition: 'repetition',
  don: 'don' // Si le dossier existe
}

// Dossier source des images
const IMAGES_DIR = path.join(__dirname, '..', 'images')
// Fichier de sortie JSON
const OUTPUT_FILE = path.join(__dirname, '..', 'js', 'gallery-data.json')

/**
 * Fonction pour scanner un dossier et récupérer tous les fichiers images
 * @param {string} dirPath - Chemin du dossier à scanner
 * @returns {Array<string>} - Liste des noms de fichiers images
 */
function getImageFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Dossier non trouvé: ${dirPath}`)
      return []
    }

    const files = fs.readdirSync(dirPath)
    // Filtrer uniquement les fichiers images
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return (
        imageExtensions.includes(ext) &&
        fs.statSync(path.join(dirPath, file)).isFile()
      )
    })

    // Trier les fichiers par nom
    return imageFiles.sort()
  } catch (error) {
    console.error(
      `❌ Erreur lors de la lecture du dossier ${dirPath}:`,
      error.message
    )
    return []
  }
}

/**
 * Fonction principale pour générer le fichier JSON de la galerie
 */
function generateGalleryData() {
  console.log('🖼️  Génération du fichier de données de la galerie...\n')

  const galleryData = {}

  // Scanner chaque dossier d'album
  for (const [folderName, albumId] of Object.entries(ALBUM_MAPPING)) {
    const folderPath = path.join(IMAGES_DIR, folderName)
    const images = getImageFiles(folderPath)

    if (images.length > 0) {
      // Construire les chemins relatifs depuis la racine du site
      galleryData[albumId] = images.map((image) => ({
        src: `images/${folderName}/${image}`,
        alt: getAltText(albumId, image)
      }))

      console.log(`✅ ${folderName} → ${albumId}: ${images.length} image(s)`)
    } else {
      console.log(`⚠️  ${folderName} → ${albumId}: Aucune image trouvée`)
      galleryData[albumId] = []
    }
  }

  // Écrire le fichier JSON
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(galleryData, null, 2), 'utf8')
    console.log(`\n✅ Fichier généré: ${OUTPUT_FILE}`)
    console.log(
      `📊 Total d'images: ${Object.values(galleryData).reduce(
        (sum, arr) => sum + arr.length,
        0
      )}`
    )
  } catch (error) {
    console.error(`❌ Erreur lors de l'écriture du fichier:`, error.message)
    process.exit(1)
  }
}

/**
 * Génère un texte alternatif basé sur l'album et le nom du fichier
 * @param {string} albumId - ID de l'album
 * @param {string} filename - Nom du fichier
 * @returns {string} - Texte alternatif
 */
function getAltText(albumId, filename) {
  const altTexts = {
    concert: 'Concert',
    centre: 'Parc instrumental',
    vie: 'Vie quotidienne',
    repetition: 'Répétition',
    don: 'Don'
  }
  return altTexts[albumId] || 'Photo'
}

// Exécuter le script
if (require.main === module) {
  generateGalleryData()
}

module.exports = { generateGalleryData }
