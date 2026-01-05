/**
 * ============================================
 * GOOGLE APPS SCRIPT - Gestionnaire d'envoi de mails
 * ============================================
 *
 * Ce script gère l'envoi de mails depuis les formulaires
 * du site web (contact et don matériel).
 *
 * INSTRUCTIONS DE DÉPLOIEMENT :
 * 1. Ouvrez https://script.google.com
 * 2. Créez un nouveau projet
 * 3. Collez ce code
 * 4. Remplacez RECIPIENT_EMAIL par votre adresse email
 * 5. Sauvegardez le projet
 * 6. Cliquez sur "Déployer" > "Nouvelle version"
 * 7. Type d'exécution : "Moi"
 * 8. Qui a accès : "Tout le monde"
 * 9. Copiez l'URL de déploiement dans js/config.js
 */

// Configuration : Email de destination
const RECIPIENT_EMAIL = 'votre-email@example.com'

/**
 * Fonction principale appelée par les formulaires
 * Reçoit les paramètres en GET et envoie un email
 */
function doGet(e) {
  try {
    // Récupération des paramètres de la requête
    const params = e.parameter

    // Détermination du type de formulaire (contact ou matériel)
    const formType = params.item ? 'Don matériel' : 'Contact'

    // Construction du sujet de l'email
    const subject = params.subject || formType

    // Construction du corps de l'email
    let emailBody = `Nouveau message depuis le site Jinja Community Music Center - France\n\n`
    emailBody += `Type : ${formType}\n`
    emailBody += `Nom : ${params.name || 'Non renseigné'}\n`
    emailBody += `Email : ${params.email || 'Non renseigné'}\n`
    emailBody += `Sujet : ${subject}\n\n`

    // Ajout des champs spécifiques au don matériel
    if (params.item) {
      emailBody += `Objet du don : ${params.item}\n`
      if (params.instrument) {
        emailBody += `Instrument : ${params.instrument}\n`
      }
      if (params.qty) {
        emailBody += `Quantité : ${params.qty}\n`
      }
      if (params.location) {
        emailBody += `Ville/Pays : ${params.location}\n`
      }
      if (params.photo) {
        emailBody += `Photo : ${params.photo}\n`
      }
      emailBody += `\n`
    }

    // Message principal
    emailBody += `Message :\n${params.message || 'Aucun message'}\n`

    // Envoi de l'email
    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: `[Jinja Project] ${subject}`,
      body: emailBody
    })

    // Retour d'une réponse JSON pour le frontend
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Email envoyé avec succès' })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // Gestion des erreurs
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Fonction POST alternative (si vous préférez utiliser POST)
 * Décommentez cette fonction et modifiez le frontend pour utiliser POST
 */
/*
function doPost(e) {
  try {
    const params = e.parameter;
    const formType = params.item ? "Don matériel" : "Contact";
    const subject = params.subject || formType;

    let emailBody = `Nouveau message depuis le site Jinja Community Music Center - France\n\n`;
    emailBody += `Type : ${formType}\n`;
    emailBody += `Nom : ${params.name || "Non renseigné"}\n`;
    emailBody += `Email : ${params.email || "Non renseigné"}\n`;
    emailBody += `Sujet : ${subject}\n\n`;

    if (params.item) {
      emailBody += `Objet du don : ${params.item}\n`;
      if (params.instrument) emailBody += `Instrument : ${params.instrument}\n`;
      if (params.qty) emailBody += `Quantité : ${params.qty}\n`;
      if (params.location) emailBody += `Ville/Pays : ${params.location}\n`;
      if (params.photo) emailBody += `Photo : ${params.photo}\n`;
      emailBody += `\n`;
    }

    emailBody += `Message :\n${params.message || "Aucun message"}\n`;

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: `[Jinja Project] ${subject}`,
      body: emailBody
    });

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Email envoyé avec succès" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
*/
