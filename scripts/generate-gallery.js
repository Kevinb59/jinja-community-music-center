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

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configuration des albums
// Mapping entre les noms de dossiers et les IDs d'albums dans le HTML
const ALBUM_MAPPING = {
  concert: 'concert',
  'instrument-parc': 'centre',
  'vie-quotidienne': 'vie',
  repetition: 'repetition',
  // Dossier disque « dons » → onglet galerie « Don » (clé JSON / React : don)
  dons: 'don'
}

// Dossier source des images
const IMAGES_DIR = path.join(__dirname, '..', 'images')
// Fichier de sortie JSON (consommé par l’app React dans src/)
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'gallery-data.json')
// Copie pour les pages dans `public/` qui chargent encore `js/script.js` (fetch relatif `js/gallery-data.json`).
const PUBLIC_GALLERY_COPY = path.join(
  __dirname,
  '..',
  'public',
  'js',
  'gallery-data.json'
)

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

  // Écrire le fichier JSON (React + copie public pour le JS legacy des pages statiques)
  const payload = JSON.stringify(galleryData, null, 2)
  try {
    fs.writeFileSync(OUTPUT_FILE, payload, 'utf8')
    fs.mkdirSync(path.dirname(PUBLIC_GALLERY_COPY), { recursive: true })
    fs.writeFileSync(PUBLIC_GALLERY_COPY, payload, 'utf8')
    console.log(`\n✅ Fichier généré: ${OUTPUT_FILE}`)
    console.log(`✅ Copie public: ${PUBLIC_GALLERY_COPY}`)
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

// Exécuter le script uniquement en lancement direct (pas lors d’un import)
const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isMain) {
  generateGalleryData()
}

export { generateGalleryData }
