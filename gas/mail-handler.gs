/**
 * ============================================
 * GOOGLE APPS SCRIPT — Envoi des formulaires du site
 * ============================================
 *
 * Le site (React, gasSubmit.js) appelle cette URL en GET avec des paramètres
 * de requête (mode no-cors). Cette fonction construit le mail et l’envoie.
 *
 * Adresse de réception : alignée sur les mentions légales du site.
 *
 * DÉPLOIEMENT :
 * 1. https://script.google.com — nouveau projet — coller ce code
 * 2. Enregistrer ; Déployer > Nouveau déploiement > Type : Application Web
 * 3. Exécuter en tant que : Moi ; Accès : Tout le monde
 * 4. Copier l’URL /exec dans Vercel : GAS_URL_CONTACT (et GAS_URL_MATERIAL si même script)
 * 5. public/js/config.js : même URL pour les pages HTML legacy (boutique, etc.)
 */

// ---------------------------------------------------------------------------
// Destinataire : adresse indiquée dans les mentions légales (contact association)
// ---------------------------------------------------------------------------
const RECIPIENT_EMAIL = 'jinja.community.music.center@gmail.com'

/**
 * Point d’entrée : requêtes GET depuis le navigateur (fetch + URLSearchParams).
 * e.parameter : objet nom → valeur des query string (contact + don matériel).
 */
function doGet(e) {
  try {
    const params = e.parameter || {}

    // Type de formulaire : présence de "item" = don matériel (voir App.jsx)
    const isMaterial = !!params.item
    const formType = isMaterial ? 'Don matériel' : 'Contact'

    const subject = params.subject || formType

    // Corps du message : lignes fixes puis champs optionnels selon le type
    let emailBody = ''
    emailBody += 'Nouveau message depuis le site Jinja Community Music Center — France\n\n'
    emailBody += `Type : ${formType}\n`
    emailBody += `Nom : ${params.name || 'Non renseigné'}\n`
    emailBody += `Email expéditeur : ${params.email || 'Non renseigné'}\n`
    emailBody += `Sujet : ${subject}\n\n`

    if (isMaterial) {
      emailBody += '--- Don matériel ---\n'
      emailBody += `Objet / description : ${params.item || '—'}\n`
      if (params.instrument) {
        emailBody += `Instrument : ${params.instrument}\n`
      }
      if (params.brand) {
        emailBody += `Marque : ${params.brand}\n`
      }
      if (params.serial) {
        emailBody += `N° de série : ${params.serial}\n`
      }
      if (params.qty) {
        emailBody += `Quantité : ${params.qty}\n`
      }
      if (params.condition) {
        emailBody += `État : ${params.condition}\n`
      }
      if (params.location) {
        emailBody += `Ville / pays : ${params.location}\n`
      }
      if (params.photo) {
        emailBody += `Photo (lien ou note) : ${params.photo}\n`
      }
      emailBody += '\n'
    }

    emailBody += 'Message :\n'
    emailBody += params.message || 'Aucun message'

    // replyTo : permet de répondre directement à l’internaute depuis la boîte mail
    const senderMail = (params.email || '').trim()
    const mailOptions = {
      to: RECIPIENT_EMAIL,
      subject: `[Jinja CMF — Site] ${subject}`,
      body: emailBody
    }
    if (senderMail.indexOf('@') !== -1) {
      mailOptions.replyTo = senderMail
    }

    MailApp.sendEmail(mailOptions)

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Email envoyé' })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: String(error) })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Optionnel : même logique en POST si un jour le front envoie un formulaire classique.
 * Les paramètres formulaire arrivent dans e.parameter comme pour GET.
 */
function doPost(e) {
  return doGet(e)
}
