/**
 * Page unique « Informations légales » : LCEN, SREN (2024), RGPD, cookies, CGU, dons.
 * Les champs inconnus sont marqués [A compléter] (surligné rouge).
 */
import { LEGAL_CONTACT_EMAIL } from './legal-constants.js'

/** Purpose: repère visuel pour les informations à compléter par l'association. */
const TODO = (label = '[A compléter]') =>
  `<span class="rounded bg-red-100 px-1.5 py-0.5 font-semibold text-red-700">${label}</span>`

export const legalModalBodyHtml = `
<div class="space-y-6 text-sm leading-7 text-slate-600">
  <p class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
    Ce document regroupe les <strong class="text-slate-900">mentions légales</strong>, la
    <strong class="text-slate-900">politique de confidentialité (RGPD)</strong>, les
    <strong class="text-slate-900">conditions d'utilisation</strong> du site et les informations
    relatives aux <strong class="text-slate-900">dons et paiements en ligne</strong>, conformément
    à la loi pour la confiance dans l'économie numérique (LCEN), au règlement général sur la
    protection des données (RGPD) et à la loi SREN du 21 mai 2024.
  </p>

  <nav class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4" aria-label="Sommaire">
    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">Sommaire</p>
    <ol class="list-decimal space-y-1 pl-5 text-emerald-900">
      <li><a class="underline hover:text-emerald-700" href="#legal-editeur">Éditeur du site</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-publication">Directeur de publication</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-hebergeur">Hébergement du site</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-donnees-hebergeur">Hébergement des données</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-cgu">Conditions générales d'utilisation</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-dons">Dons et paiements</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-rgpd">Données personnelles (RGPD)</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-cookies">Cookies et traceurs</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-pi">Propriété intellectuelle</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-responsabilite">Responsabilité</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-droit">Droit applicable</a></li>
      <li><a class="underline hover:text-emerald-700" href="#legal-contact">Contact et droits</a></li>
    </ol>
  </nav>

  <section id="legal-editeur" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-4 text-base font-semibold text-emerald-800">1. Éditeur du site</h3>
    <p class="mb-4">Le présent site est édité par :</p>
    <dl class="space-y-3">
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dénomination</dt>
        <dd class="mt-0.5 font-medium text-slate-900">Jinja Community Music Center – France</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Forme juridique</dt>
        <dd class="mt-0.5">Association déclarée loi du 1<sup>er</sup> juillet 1901</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Siège social</dt>
        <dd class="mt-0.5">176 rue Jean Jaurès, appartement 2<br />59500 Douai – France</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Numéro RNA (W…)</dt>
        <dd class="mt-0.5">W593009268</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Numéro SIREN</dt>
        <dd class="mt-0.5">103 953 741</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Numéro SIRET (siège)</dt>
        <dd class="mt-0.5">103 953 741 00016</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Code APE (INSEE)</dt>
        <dd class="mt-0.5">85.52Z — Enseignement culturel</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Préfecture ou sous-préfecture d'enregistrement</dt>
        <dd class="mt-0.5">Sous-préfecture de Douai — département du Nord (59)</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Objet social</dt>
        <dd class="mt-0.5">
          Promouvoir l'éducation, la protection et l'inclusion sociale par la musique, en France et à l'international.
          <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-600">
            <li>006030 — chant choral, musique</li>
            <li>009000 — action socio-culturelle</li>
          </ul>
        </dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Téléphone</dt>
        <dd class="mt-0.5">
          <a href="tel:+33659572712" class="font-medium text-emerald-600 underline decoration-emerald-400/40 hover:text-emerald-700">06 59 57 27 12</a>
        </dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Courriel</dt>
        <dd class="mt-0.5">
          <a href="mailto:${LEGAL_CONTACT_EMAIL}" class="font-medium text-emerald-600 underline decoration-emerald-400/40 hover:text-emerald-700">${LEGAL_CONTACT_EMAIL}</a>
        </dd>
      </div>
    </dl>
  </section>

  <section id="legal-publication" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">2. Directeur de la publication</h3>
    <p class="mb-2">Conformément à la loi du 29 juillet 1982 (art. 93-2) et à la LCEN, le directeur de la publication est :</p>
    <p class="m-0 font-medium text-slate-900">Emilie EMPIS, Présidente de l'association</p>
    <p class="mt-3 text-slate-600">En cas de litige relatif au contenu du site, elle est l'interlocutrice responsable au sens de la réglementation sur les services de communication au public en ligne.</p>
  </section>

  <section id="legal-hebergeur" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">3. Hébergement du site (pages web)</h3>
    <p class="mb-4">Le site est développé sous forme de dépôt de code source, puis déployé automatiquement sur l'hébergeur des pages. Conformément à la LCEN (art. 6-III-2°) :</p>

    <h4 class="mb-2 font-semibold text-slate-800">Hébergement des pages accessibles au public</h4>
    <dl class="mb-5 space-y-2">
      <div><dt class="inline font-semibold text-slate-800">Raison sociale :</dt> <dd class="inline">Vercel Inc.</dd></div>
      <div><dt class="inline font-semibold text-slate-800">Adresse :</dt> <dd class="inline">440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis</dd></div>
      <div><dt class="inline font-semibold text-slate-800">Site :</dt> <dd class="inline"><a href="https://vercel.com" class="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">vercel.com</a></dd></div>
      <div><dt class="inline font-semibold text-slate-800">Déploiement :</dt> <dd class="inline">import automatique depuis un dépôt GitHub vers Vercel</dd></div>
    </dl>

    <h4 class="mb-2 font-semibold text-slate-800">Dépôt de code source (hors pages publiques)</h4>
    <dl class="mb-5 space-y-2">
      <div><dt class="inline font-semibold text-slate-800">Raison sociale :</dt> <dd class="inline">GitHub, Inc. (Microsoft)</dd></div>
      <div><dt class="inline font-semibold text-slate-800">Adresse :</dt> <dd class="inline">88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis</dd></div>
      <div><dt class="inline font-semibold text-slate-800">Site :</dt> <dd class="inline"><a href="https://github.com" class="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">github.com</a></dd></div>
    </dl>

    <h4 class="mb-2 font-semibold text-slate-800">Nom de domaine (registrar / gestionnaire DNS)</h4>
    <dl class="space-y-2">
      <div><dt class="inline font-semibold text-slate-800">Raison sociale :</dt> <dd class="inline">IONOS SARL (1&amp;1 IONOS)</dd></div>
      <div><dt class="inline font-semibold text-slate-800">Adresse :</dt> <dd class="inline">7 place de la Gare, 57200 Sarreguemines – France</dd></div>
      <div><dt class="inline font-semibold text-slate-800">Site :</dt> <dd class="inline"><a href="https://www.ionos.fr" class="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">ionos.fr</a></dd></div>
    </dl>
  </section>

  <section id="legal-donnees-hebergeur" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">4. Hébergement des données (loi SREN, mai 2024)</h3>
    <p class="mb-4">Depuis la loi n° 2024-449 du 21 mai 2024, l'éditeur doit également identifier les prestataires qui stockent les données traitées via le site lorsqu'ils sont distincts de l'hébergeur des pages.</p>
    <ul class="list-disc space-y-3 pl-5">
      <li>
        <strong class="text-slate-800">Formulaires (contact, don matériel, notification de virement, confirmation de don) :</strong>
        Google LLC (Google Apps Script / Google Workspace) — 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis.
        Les messages sont transmis par e-mail à l'association via l'infrastructure Google.
      </li>
      <li>
        <strong class="text-slate-800">Paiements par carte (dons) :</strong>
        Stripe Payments Europe, Limited (Stripe) — 1 Grand Canal Street Lower, Dublin 2, Irlande.
        L'association ne stocke pas les coordonnées bancaires ; le paiement est traité par Stripe (certifié PCI-DSS).
      </li>
    </ul>
    <p class="mt-4">Les formulaires sont traités via Google Apps Script, exécuté depuis le compte de messagerie de l'association (<a href="mailto:${LEGAL_CONTACT_EMAIL}" class="text-emerald-600 underline">${LEGAL_CONTACT_EMAIL}</a>). Les contrats de sous-traitance (DPA) Google et Stripe sont acceptés conformément aux conditions des prestataires.</p>
  </section>

  <section id="legal-cgu" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">5. Conditions générales d'utilisation (CGU)</h3>
    <p class="mb-4">L'accès et l'utilisation du site impliquent l'acceptation sans réserve des présentes conditions.</p>
    <ul class="list-disc space-y-2 pl-5">
      <li>Le site a pour objet de présenter le projet Jinja Community Music Center – France, de permettre de contacter l'association et de faciliter les dons (financiers ou matériels) au profit du centre musical communautaire de Jinja (Ouganda).</li>
      <li>L'utilisateur s'engage à fournir des informations exactes dans les formulaires et à ne pas utiliser le site à des fins illicites, diffamatoires ou contraires à l'ordre public.</li>
      <li>L'association se réserve le droit de suspendre l'accès au site pour maintenance ou mise à jour, sans préavis ni indemnité.</li>
      <li>Les contenus sont fournis à titre informatif ; ils peuvent être modifiés à tout moment.</li>
    </ul>
  </section>

  <section id="legal-dons" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">6. Dons, virements et paiements en ligne</h3>
    <p class="mb-4">Le site permet de soutenir le projet par :</p>
    <ul class="list-disc space-y-2 pl-5 mb-4">
      <li><strong class="text-slate-800">Don financier par carte</strong> (Stripe) : montant libre ou suggéré ; confirmation par e-mail après paiement validé.</li>
      <li><strong class="text-slate-800">Virement bancaire</strong> sur le compte de l'association (coordonnées communiquées dans la modale de don ou sur demande).</li>
      <li><strong class="text-slate-800">Don matériel</strong> (instruments, partitions, etc.) via formulaire de proposition ; l'association recontacte le donateur pour organiser la suite.</li>
      <li>
        <strong class="text-slate-800">Boutique / créations artisanales :</strong>
        la boutique en ligne n'est pas ouverte à la vente pour le moment (section « Nos créations » du site).
        Les objets présentés sont fabriqués lors d'ateliers avec les enfants du centre ; aucune commande ni paiement à distance n'est possible actuellement.
        À l'ouverture, des conditions générales de vente seront publiées et préciseront notamment : les prix TTC, les modalités de commande et de paiement, les frais et délais de livraison, ainsi que le droit de rétractation de 14 jours prévu par le Code de la consommation pour toute vente à distance.
      </li>
    </ul>
    <p class="mb-2"><strong class="text-slate-800">Reçu fiscal / réduction d'impôt :</strong></p>
    <p class="mb-4">L'association n'est pas reconnue d'utilité publique et ne dispose pas à ce jour de l'agrément permettant d'émettre un reçu fiscal Cerfa n° 11580*05. Les dons n'ouvrent donc pas droit à une réduction d'impôt. Sur demande ou après un don en ligne, l'association peut néanmoins fournir un <strong class="text-slate-800">reçu attestant du versement</strong> (montant, date et identité du donateur).</p>
    <p class="mb-2"><strong class="text-slate-800">Remboursement :</strong></p>
    <p class="m-0">Les dons sont des libéralités ; en principe ils ne donnent pas lieu à remboursement. En cas d'erreur manifeste de paiement, contactez l'association à l'adresse indiquée ci-dessous.</p>
  </section>

  <section id="legal-rgpd" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">7. Données personnelles (RGPD &amp; loi Informatique et Libertés)</h3>
    <p class="mb-4"><strong class="text-slate-800">Responsable de traitement :</strong> Jinja Community Music Center – France (coordonnées section 1).</p>
    <p class="mb-4">Délégué à la protection des données (DPO) : <strong class="text-slate-800">non désigné</strong> (l'association n'étant pas tenue d'en nommer un au regard de la nature et du volume des traitements).</p>

    <h4 class="mb-2 font-semibold text-slate-800">Données collectées</h4>
    <ul class="list-disc space-y-2 pl-5 mb-4">
      <li>Formulaire de contact : nom, e-mail, objet, message.</li>
      <li>Don matériel : identité, coordonnées, description du matériel, message.</li>
      <li>Notification de virement : nom, e-mail, montant (facultatif), message (facultatif).</li>
      <li>Don par carte : nom (facultatif), e-mail, montant ; données de paiement traitées par Stripe (non conservées par l'association).</li>
      <li>Données techniques : logs du serveur / hébergeur (adresse IP, horodatage, navigateur) pour la sécurité et le fonctionnement du site.</li>
      <li>
        <strong class="text-slate-800">Photos et vidéos publiées sur le site</strong> (galerie, page d'accueil, illustrations) :
        images du centre musical de Jinja et de ses activités (concerts, vie du centre, instruments).
        <em class="text-slate-600">Finalité :</em> présenter le projet, sensibiliser et informer donateurs et partenaires.
        <em class="text-slate-600">Base légale :</em>
        <strong class="text-slate-800">consentement</strong> de la personne concernée, ou de son <strong class="text-slate-800">représentant légal</strong> pour les mineurs, avant toute publication d'une image où elle est identifiable ;
        <strong class="text-slate-800">intérêt légitime</strong> de l'association pour les vues de groupe ou les plans généraux sans identification directe, dans le respect de la dignité et de la vie privée.
        Avant diffusion en ligne, l'équipe sur place recueille une <strong class="text-slate-800">autorisation écrite</strong> (prise de vue et publication sur le site de l'association en France).
        Les noms de famille, coordonnées ou éléments sensibles ne sont pas publiés sans accord explicite.
        Pour demander le retrait d'une image vous concernant (ou celle d'un mineur dont vous êtes le responsable légal) :
        <a href="mailto:${LEGAL_CONTACT_EMAIL}" class="font-medium text-emerald-600 underline">${LEGAL_CONTACT_EMAIL}</a>.
      </li>
    </ul>

    <h4 class="mb-2 font-semibold text-slate-800">Finalités et bases légales</h4>
    <ul class="list-disc space-y-2 pl-5 mb-4">
      <li>Répondre aux demandes et gérer les relations avec les donateurs et partenaires (intérêt légitime / exécution de mesures précontractuelles).</li>
      <li>Traiter les dons et émettre les confirmations (exécution du don / obligation comptable).</li>
      <li>Respect des obligations légales et comptables de l'association.</li>
      <li>Communication sur le projet et publication d'images / vidéos (galerie) : intérêt légitime et, pour les personnes identifiables, <strong class="text-slate-800">consentement</strong> ou accord du représentant légal des mineurs (voir ci-dessus).</li>
    </ul>

    <h4 class="mb-2 font-semibold text-slate-800">Destinataires</h4>
    <p class="mb-4">Membres habilités du bureau de l'association ; prestataires techniques (Vercel, Google, Stripe) agissant en qualité de sous-traitants ou responsables conjoints selon le cas ; autorités compétentes sur réquisition légale.</p>

    <h4 class="mb-2 font-semibold text-slate-800">Durées de conservation</h4>
    <ul class="list-disc space-y-2 pl-5 mb-4">
      <li>Messages de contact : <strong class="text-slate-800">3 ans</strong> à compter du dernier échange, puis suppression ou anonymisation.</li>
      <li>Données relatives aux dons : <strong class="text-slate-800">10 ans</strong> à compter de la clôture de l'exercice comptable concerné (obligations comptables et trace des dons).</li>
      <li>Logs techniques : <strong class="text-slate-800">12 mois maximum</strong>, sauf obligation légale ou litige en cours.</li>
    </ul>

    <h4 class="mb-2 font-semibold text-slate-800">Transferts hors Union européenne</h4>
    <p class="mb-4">Certains prestataires (notamment Vercel et Google, États-Unis) peuvent traiter des données en dehors de l'UE. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne ou des garanties équivalentes prévues par les prestataires.</p>

    <h4 class="mb-2 font-semibold text-slate-800">Vos droits</h4>
    <p class="mb-2">Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité ( lorsque applicable ), ainsi que du droit de définir des directives relatives au sort de vos données après votre décès (France).</p>
    <p class="mb-4">Pour les exercer : <a href="mailto:${LEGAL_CONTACT_EMAIL}" class="font-medium text-emerald-600 underline">${LEGAL_CONTACT_EMAIL}</a>, en joignant une copie d'un titre d'identité si nécessaire. Réponse sous un mois.</p>
    <p class="m-0">Réclamation auprès de la CNIL : <a href="https://www.cnil.fr" class="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
  </section>

  <section id="legal-cookies" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">8. Cookies et traceurs</h3>
    <p class="mb-4">Un « cookie » est un petit fichier déposé sur votre terminal lors de la visite d'un site. La réglementation (recommandations CNIL, directive ePrivacy) impose d'informer l'utilisateur et, sauf exceptions, de recueillir son consentement avant le dépôt de traceurs non essentiels.</p>

    <p class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-slate-700">
      <strong class="text-slate-900">État du site (vérifié sur le code source) :</strong>
      l'association ne déploie <strong class="text-slate-900">aucun cookie de mesure d'audience, de publicité ou de réseau social</strong>.
      Le site n'utilise pas Google Analytics, Matomo, Plausible ni pixel publicitaire ; il ne stocke pas de données de suivi dans le navigateur (localStorage, etc.).
    </p>

    <h4 class="mb-2 font-semibold text-slate-800">Traceurs et services tiers</h4>
    <ul class="list-disc space-y-3 pl-5 mb-4">
      <li>
        <strong class="text-slate-800">Strictement nécessaires (paiement) :</strong>
        lorsque vous effectuez un <strong class="text-slate-800">don par carte</strong>, le module de paiement <strong class="text-slate-800">Stripe</strong> (<a href="https://stripe.com/fr/privacy" class="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">politique de confidentialité Stripe</a>) peut déposer des cookies ou traceurs techniques liés à la sécurisation de la transaction et à la prévention de la fraude. Ces traceurs ne sont activés que dans le cadre du paiement.
      </li>
      <li>
        <strong class="text-slate-800">Mesure d'audience :</strong>
        <strong class="text-slate-800">aucune</strong> — pas d'outil statistique installé sur le site.
      </li>
      <li>
        <strong class="text-slate-800">Réseaux sociaux :</strong>
        <strong class="text-slate-800">aucune intégration</strong> (pas de boutons, pixels ou fils YouTube, Facebook, Instagram, etc.).
      </li>
      <li>
        <strong class="text-slate-800">Carte OpenStreetMap :</strong>
        une carte du centre est affichée via une <strong class="text-slate-800">iframe</strong> hébergée par
        <a href="https://www.openstreetmap.org" class="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
        (section localisation). Le chargement de cette carte peut entraîner le dépôt de traceurs propres à ce service tiers ; consultez leur politique de confidentialité le cas échéant.
      </li>
      <li>
        <strong class="text-slate-800">Formulaires :</strong>
        les envois (contact, don matériel, notification de virement) passent par <strong class="text-slate-800">Google Apps Script</strong> sans afficher de page Google dans le navigateur ; l'association ne place pas de cookie propre à cet effet.
      </li>
    </ul>

    <h4 class="mb-2 font-semibold text-slate-800">Bandeau de consentement</h4>
    <p class="m-0">
      <strong class="text-slate-800">Aucun bandeau cookies</strong> n'est affiché à ce jour, l'association ne déployant pas de traceur non essentiel de statistiques ou de marketing.
      Un bandeau (Accepter / Refuser / Paramétrer) sera mis en place <strong class="text-slate-800">avant</strong> toute addition future de traceur soumis au consentement (mesure d'audience, widget social, etc.).
    </p>
  </section>

  <section id="legal-pi" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">9. Propriété intellectuelle</h3>
    <p class="mb-4">L'ensemble des contenus (textes, images, photographies, logos, vidéos, mise en page, code) est protégé par le droit d'auteur et le droit des marques, sauf mention contraire.</p>
    <p class="mb-4">Toute reproduction, représentation, modification ou exploitation non autorisée, totale ou partielle, est interdite sans accord écrit préalable de l'association ou des titulaires de droits.</p>
    <p class="m-0">Les autorisations de publication et, le cas échéant, les crédits des photographes sont conservés par l'association. Pour toute question ou demande de retrait : <a href="mailto:${LEGAL_CONTACT_EMAIL}" class="text-emerald-600 underline">${LEGAL_CONTACT_EMAIL}</a>.</p>
  </section>

  <section id="legal-responsabilite" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">10. Limitation de responsabilité</h3>
    <p class="mb-4">L'association s'efforce d'assurer l'exactitude des informations publiées. Toutefois, elle ne garantit pas l'absence d'erreurs, d'omissions ou d'indisponibilité du site.</p>
    <p class="mb-4">Les liens hypertextes vers des sites tiers n'engagent pas la responsabilité de l'association quant à leur contenu.</p>
    <p class="m-0">L'utilisateur est seul responsable de l'usage qu'il fait du site et des informations qu'il communique via les formulaires.</p>
  </section>

  <section id="legal-droit" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-emerald-800">11. Droit applicable et litiges</h3>
    <p class="mb-4">Les présentes informations sont régies par le droit français.</p>
    <p class="mb-4">En cas de litige, et à défaut de résolution amiable, compétence est attribuée aux tribunaux du ressort du siège social de l'association, sous réserve des règles impératives applicables aux consommateurs.</p>
    <p class="m-0">Médiation de la consommation (si vente en ligne à des consommateurs) : ${TODO('Coordonnées du médiateur de la consommation adhérent, obligatoire si vente à distance de biens ou services')}</p>
  </section>

  <section id="legal-contact" class="scroll-mt-24 rounded-2xl border border-violet-200 bg-violet-50 p-5">
    <h3 class="mb-3 text-base font-semibold text-violet-800">12. Contact et exercice de vos droits</h3>
    <p class="mb-4">Pour toute question relative au site, aux dons ou à vos données personnelles :</p>
    <p class="m-0">
      <a href="mailto:${LEGAL_CONTACT_EMAIL}" class="font-medium text-violet-700 underline decoration-violet-400/50 hover:text-violet-900">${LEGAL_CONTACT_EMAIL}</a><br />
      Jinja Community Music Center – France<br />
      176 rue Jean Jaurès, appartement 2 — 59500 Douai — France<br />
      <a href="tel:+33659572712" class="font-medium text-violet-700 underline decoration-violet-400/50 hover:text-violet-900">06 59 57 27 12</a>
    </p>
    <p class="mt-4 text-xs text-slate-500">Dernière mise à jour : 30 mai 2026</p>
  </section>
</div>
`.trim()
