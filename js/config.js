/**
 * ============================================
 * CONFIGURATION GOOGLE APPS SCRIPT (GAS)
 * ============================================
 *
 * Ce fichier contient la configuration pour l'intégration
 * avec Google Apps Script pour l'envoi de mails.
 *
 * INSTRUCTIONS :
 * 1. Créez un nouveau projet Google Apps Script
 * 2. Collez le code du fichier gas/mail-handler.gs
 * 3. Déployez-le en tant que "Web app"
 * 4. Copiez l'URL de déploiement ici
 * 5. Remplacez "XXXXX" par votre URL complète
 */

// URL du script Google Apps Script déployé en Web app
// Format attendu : https://script.google.com/macros/s/VOTRE_ID/exec
const GAS_CONFIG = {
  // URL pour le formulaire de contact
  contactUrl: 'https://script.google.com/macros/s/XXXXX/exec',

  // URL pour le formulaire de don matériel
  materialUrl: 'https://script.google.com/macros/s/XXXXX/exec',

  // Email de destination pour les notifications
  recipientEmail: 'votre-email@example.com'
}

// Configuration Cloudinary pour l'upload d'images
// INSTRUCTIONS :
// 1. Créez un compte sur cloudinary.com
// 2. Récupérez votre Cloud Name depuis le dashboard
// 3. Créez un Upload Preset (Settings > Upload > Upload presets)
// 4. Remplacez les valeurs ci-dessous
const CLOUDINARY_CONFIG = {
  cloudName: 'your_cloud_name', // À remplacer par votre Cloud Name
  uploadPreset: 'your_upload_preset' // À remplacer par votre Upload Preset
}

// Export de la configuration pour utilisation dans script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAS_CONFIG, CLOUDINARY_CONFIG }
}
