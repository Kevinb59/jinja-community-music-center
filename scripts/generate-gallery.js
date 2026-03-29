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
  dons: 'don',
  // Dossier ASCII « creations » (sans accent) → onglet « Créations »
  creations: 'creations'
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

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg']

/**
 * Scan d’un dossier : images + vidéos (MP4/WebM/Ogg), tri par nom.
 * @param {string} dirPath - Chemin du dossier à scanner
 * @returns {Array<{ file: string, type: 'image' | 'video' }>}
 */
function getMediaFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Dossier non trouvé: ${dirPath}`)
      return []
    }

    const files = fs.readdirSync(dirPath)
    const media = []
    for (const file of files) {
      const full = path.join(dirPath, file)
      if (!fs.statSync(full).isFile()) continue
      const ext = path.extname(file).toLowerCase()
      if (IMAGE_EXTENSIONS.includes(ext)) {
        media.push({ file, type: 'image' })
      } else if (VIDEO_EXTENSIONS.includes(ext)) {
        media.push({ file, type: 'video' })
      }
    }
    return media.sort((a, b) =>
      a.file.localeCompare(b.file, undefined, { sensitivity: 'base' })
    )
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

  // Scanner chaque dossier d'album (images + vidéos)
  for (const [folderName, albumId] of Object.entries(ALBUM_MAPPING)) {
    const folderPath = path.join(IMAGES_DIR, folderName)
    const mediaList = getMediaFiles(folderPath)

    if (mediaList.length > 0) {
      // Construire les chemins relatifs depuis la racine du site
      galleryData[albumId] = mediaList.map(({ file, type }) => {
        const entry = {
          src: `images/${folderName}/${file}`,
          alt: getAltText(albumId, file, type)
        }
        if (type === 'video') entry.type = 'video'
        return entry
      })

      const imgCount = mediaList.filter((m) => m.type === 'image').length
      const vidCount = mediaList.filter((m) => m.type === 'video').length
      console.log(
        `✅ ${folderName} → ${albumId}: ${imgCount} image(s), ${vidCount} vidéo(s)`
      )
    } else {
      console.log(`⚠️  ${folderName} → ${albumId}: Aucun média trouvé`)
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
      `📊 Total de médias: ${Object.values(galleryData).reduce(
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
 * Texte alternatif selon l’album, le fichier et le type (image / vidéo).
 * @param {string} albumId - ID de l'album
 * @param {string} filename - Nom du fichier
 * @param {'image'|'video'} mediaType - Type de média
 */
function getAltText(albumId, filename, mediaType = 'image') {
  const altTexts = {
    concert: 'Concert',
    centre: 'Parc instrumental',
    vie: 'Vie quotidienne',
    repetition: 'Répétition',
    don: 'Don',
    creations: 'Créations'
  }
  const base = altTexts[albumId] || 'Photo'
  if (mediaType === 'video') return `${base} — vidéo`
  return base
}

// Exécuter le script uniquement en lancement direct (pas lors d’un import)
const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isMain) {
  generateGalleryData()
}

export { generateGalleryData }
