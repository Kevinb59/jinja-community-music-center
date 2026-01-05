/**
 * ============================================
 * SCRIPT PRINCIPAL - Jinja Community Music Center - France
 * ============================================
 *
 * Ce fichier contient toute la logique JavaScript du site :
 * - Internationalisation (i18n FR/EN)
 * - Gestion des formulaires
 * - Navigation de la galerie
 * - Intégration Google Apps Script
 */

// ============================================
// CONFIGURATION - Import de la config GAS
// ============================================
// La configuration GAS est chargée depuis config.js
// Si config.js n'est pas disponible, on utilise une URL par défaut
let GAS_URL = 'https://script.google.com/macros/s/XXXXX/exec'

// Vérification de la disponibilité de la configuration GAS
if (typeof GAS_CONFIG !== 'undefined') {
  // Utilisation de l'URL de contact par défaut, ou materialUrl si spécifié
  GAS_URL = GAS_CONFIG.contactUrl || GAS_CONFIG.materialUrl || GAS_URL
}

// ============================================
// INTERNATIONALISATION (i18n)
// ============================================
// Dictionnaire de traduction FR/EN pour tous les textes du site
const i18n = {
  fr: {
    brand: 'PROJET JINJA COMMUNITY MUSIC CENTER - FRANCE',
    nav_project: 'Le projet',
    nav_needs: 'Nos besoins',
    nav_help: 'Aider',
    nav_donate: 'Donner',
    nav_creations: 'Nos créations',
    nav_gallery: 'Galerie',
    nav_contact: 'Contact',
    nav_donors: 'Nos donateurs',
    cta_donate: 'Faire un don',
    pill: 'Musique • Enfance • Jinja',
    hero_title: 'Un lieu culturel qui forme des musiciens.',
    hero_subtitle:
      "Jinja Community Music Center est un espace gratuit et sécurisé où les enfants peuvent apprendre, s'exprimer et grandir grâce à la musique.",
    hero_note:
      "Aujourd'hui, ils sont <strong>27 musiciens</strong> mais il manque des instruments : c'est la raison de notre appel aux dons.",
    hero_cta_donate: 'Faire un don',
    hero_cta_needs: 'Voir les besoins',
    countline_text: 'musiciens à ce jour',
    countline_tag: "Chaque don d'instrument compte",
    visual_title: 'Priorité',
    visual_text:
      "Obtenir des instruments pour accueillir plus d'enfants et renforcer l'orchestre.",
    project_title: 'Le projet',
    project_intro_title: 'Présentation',
    project_intro_text:
      "<strong>JINJA COMMUNITY MUSIC CENTER - FRANCE</strong> est une initiative humanitaire et culturelle créée pour soutenir l'action de <strong>Bwiire JohnBosco</strong>, musicien et éducateur originaire de Jinja, en Ouganda. Depuis plusieurs années, Bwiire consacre son énergie à offrir aux enfants et adolescents de son village un espace <strong>sécurisé, ouvert et gratuit</strong>, où ils peuvent découvrir la musique, développer leurs talents et trouver un repère bienveillant.",
    project_who_title: 'Le fondateur du centre musical de Jinja',
    project_who_text:
      "<strong>Bwiire JohnBosco</strong> est le fondateur du centre. Il enseigne patiemment, organise les répétitions et accompagne les enfants au quotidien. Il a transformé la maison qu'il loue en <strong>centre communautaire</strong>, et offre un hébergement permanent à certains enfants en situation de grande précarité.",
    project_team_title: "La fondatrice de l'association",
    project_team_text:
      "Professeure de tuba dans plusieurs écoles de musique et conservatoires de la région lilloise, la musique occupe une place centrale dans ma vie, tant sur le plan professionnel que personnel.<br>Ma rencontre avec BWIIRE JohnBosco, a été une évidence. Depuis de nombreuses années, je nourrissais le désir profond de pouvoir aider des enfants grâce à la musique. Découvrir son engagement, son humanité et le travail qu'il mène chaque jour auprès des enfants de Jinja a donné un sens concret à ce rêve.<br>Je suis convaincue que chaque enfant mérite de recevoir une éducation et un cadre bienveillant pour grandir. La musique transmet des valeurs essentielles : la discipline, la rigueur, la concentration, l'écoute, mais aussi le respect et l'esprit d'équipe.<br>En tant qu'euphonium solo au sein d'un brass band, je mesure chaque jour la richesse de cette pratique collective, capable de rassembler, de structurer et de révéler les potentiels. C'est cette richesse que je souhaite aujourd'hui partager et rendre accessible à des enfants qui en ont profondément besoin.<br>Soutenir ce projet, c'est pour moi une manière naturelle de mettre la musique au service de l'humain, et de contribuer, à mon échelle, à offrir un avenir plus lumineux à ces enfants.",
    project_team_creator_name: 'EMILIE EMPIS',
    project_team_creator_role: "Présidente de l'association",
    project_team_creator_desc: '',
    project_team_other_title: "L'équipe",
    project_team_other_text:
      "<strong>Autres membres de l'association :</strong><br><br><strong>Trésorier :</strong> [Nom du trésorier]<br><strong>Secrétaire :</strong> [Nom du secrétaire]",
    project_team_members:
      "<strong>Membres de l'association :</strong><br><span></span>",
    project_team_members_title: "Membres de l'association :",
    project_team_members_list: '',
    project_context_title: 'Contexte',
    project_context_text:
      "À Jinja, beaucoup d'enfants grandissent avec des opportunités limitées : pauvreté, manque de soutien et absence d'espaces positifs. Le centre est une alternative concrète : un lieu simple, mais stable, où l'on apprend, où l'on se sent reconnu, et où l'on construit de la confiance.",
    project_house_title: 'Une maison devenue refuge',
    project_house_text:
      "Ce lieu est à la fois un foyer, une école informelle, un espace d'expression et une bulle de protection. Chaque jour, les enfants s'y retrouvent pour apprendre, pratiquer et se soutenir.",
    project_music_title: "La musique comme outil d'avenir",
    project_music_text:
      "L'objectif est simple : offrir une voie d'épanouissement, de discipline, de joie, et parfois une perspective professionnelle.",
    project_music_list:
      '<li>Percussions</li><li>Cuivres (trompette, tuba, trombone, ténor horn…)</li><li>Bases de théorie musicale</li>',
    project_day_title: 'Vie quotidienne au centre',
    project_day_text:
      'Une journée est simple, mais remplie d\'apprentissage et de joie : accueil des enfants, pratique (rythme, bases, instruments), petites leçons de discipline et de travail d\'équipe. Les enfants apprennent également à entretenir et prendre soin des instruments, une compétence essentielle qui leur enseigne la responsabilité et le respect du matériel. Ils participent aussi à des ateliers de création handmade où ils fabriquent des objets en bois, comme des dessous de verres et des dessous de table. Ces créations sont ensuite disponibles dans notre <a href="#creations" style="color: var(--accent); text-decoration: underline;">boutique</a> pour soutenir le centre. Il y a aussi des pauses, des jeux simples, parfois un encas quand c\'est possible, puis un moment d\'encouragement pour terminer.',
    project_need_title: 'Ce dont nous avons besoin',
    project_need_text:
      "Aujourd'hui, <strong>27 enfants/adolescents</strong> participent régulièrement. Beaucoup d'autres aimeraient rejoindre… mais les moyens manquent : <strong>pas assez d'instruments</strong> et <strong>pas assez de matériel pédagogique</strong>.",
    project_location_title: 'Localisation',
    project_location_text:
      'Le centre se trouve à <strong>Jinja, en Ouganda</strong>, une ville située à la source du Nil.',
    project_map_link: 'Voir la carte en grand',
    needs_title: 'Nos besoins',
    needs_1_title: 'Instruments',
    needs_1_text: "Nous cherchons ces instruments pour compléter l'orchestre.",
    inst_1: 'Trombone',
    inst_2: 'Tuba',
    inst_3: 'Euphonium',
    inst_4: 'Baryton',
    inst_5: 'Ténor horn',
    inst_6: 'Trompette',
    inst_7: 'Cornet',
    needs_2_title: 'Partitions',
    needs_2_text:
      "Méthodes d'apprentissage, partitions de brass band, niveaux débutant → intermédiaire.",
    needs_2_digital:
      'Les dons de méthodes ou de partitions peuvent être dématérialisés (fichiers PDF, liens de téléchargement légaux).',
    needs_3_title: 'Soutien financier',
    needs_3_text:
      'Pour faire vivre le lieu : fonctionnement, loyer, charges, nourriture pour les enfants, matériel pédagogique, organisation des activités.',
    help_title: 'Aider',
    help_1_title: 'Choisis ton type de don',
    help_1_text:
      "Financier ou matériel (instruments, partitions, accessoires, matériel d'entretien, pupitres).",
    help_2_title: 'Remplis le formulaire',
    help_2_text: 'Nous te recontactons rapidement avec les étapes suivantes.',
    help_3_title: 'On te tient au courant',
    help_3_text: 'Photos, nouvelles, avancées : transparence et suivi.',
    donate_title: 'Donner',
    donate_text:
      "Deux façons d'aider : un don financier (le plus rapide) ou un don matériel (instruments, partitions, accessoires, matériel d'entretien, pupitres).",
    transparency_btn: 'Transparence & utilisation des dons',
    transparency_title: 'Transparence & utilisation des dons',
    transparency_content:
      '<p style="margin-top: 0;">Texte à insérer sur la transparence et l\'utilisation des dons.</p>',
    donate_fin_title: 'Don financier',
    donate_fin_text:
      "Pour soutenir immédiatement le fonctionnement du lieu et l'achat d'instruments.",
    donate_fin_btn: 'Accéder à la page de don',
    donate_mat_title: 'Don matériel',
    donate_mat_text:
      "Propose un instrument, des partitions, des accessoires, du matériel d'entretien ou des pupitres : remplis le formulaire ci-dessous.",
    donate_mat_btn: 'Remplir le formulaire don matériel',
    donate_mat_list: "Voir la liste d'instruments",
    donate_info_title: 'Comment ça fonctionne ?',
    donate_info_fin_title: 'Dons financiers',
    donate_info_fin_text:
      "Les dons financiers sont transférés directement vers le compte de l'association. Nous utilisons des plateformes sécurisées pour les transferts internationaux vers l'Ouganda. Les fonds servent immédiatement au fonctionnement du centre, à l'achat d'instruments sur place, au loyer, aux charges et à la nourriture pour les enfants.",
    donate_info_mat_title: 'Dons matériels',
    donate_info_mat_text:
      "Après réception de ton formulaire, nous te recontactons pour organiser l'envoi. Pour les instruments, accessoires, matériel d'entretien et pupitres, nous coordonnons l'expédition vers l'Ouganda (frais de transport à discuter selon le cas). Les dons matériels peuvent être regroupés pour optimiser les coûts d'expédition : nous attendons parfois plusieurs dons avant d'organiser un envoi groupé. Vous serez informé du planning d'expédition. Pour les partitions dématérialisées, nous t'enverrons un email avec les instructions pour le transfert des fichiers.",
    instruments_modal_title: 'Liste des instruments',
    instruments_modal_text:
      "Voici la liste des instruments recherchés pour compléter l'orchestre :",
    mat_title: 'Formulaire — Don matériel',
    mat_text:
      'Remplis ce formulaire pour proposer un instrument ou des partitions. Nous te recontactons via le site.',
    mat_item: 'Objet du don',
    mat_item_ph: 'Choisir…',
    mat_item_maintenance: "Matériel d'entretien",
    mat_item_stands: 'Pupitres',
    mat_item_accessories: 'Accessoires',
    mat_item_sheet_music: 'Partitions',
    mat_item_instruments: 'Instruments',
    mat_text_digital:
      "<strong>Note :</strong> Pour les dons de partitions dématérialisées (fichiers PDF, liens légaux), nous t'enverrons un email après réception de ton formulaire pour organiser l'envoi.",
    mat_instrument: 'Instrument (si concerné)',
    mat_instrument_ph: 'Choisir…',
    mat_brand: 'Marque',
    mat_serial: 'Numéro de série',
    mat_qty: 'Quantité',
    mat_condition: 'État du matériel',
    mat_condition_ph: 'Choisir…',
    mat_condition_excellent: 'Excellent',
    mat_condition_very_good: 'Très bon',
    mat_condition_good: 'Bon',
    mat_condition_fair: 'Correct',
    mat_condition_repair: 'À réparer',
    mat_city: 'Ville / Pays',
    mat_photo: 'Photo (optionnel)',
    mat_photo_placeholder: 'Choisir un fichier',
    mat_photo_hint: 'Formats acceptés : JPG, PNG, GIF (max 10 Mo)',
    mat_photo_remove: 'Supprimer la photo',
    mat_send: 'Envoyer la proposition',
    mat_note:
      '⚠️ Pour le moment, ce formulaire envoie vers une URL Google Apps Script (à remplacer dans le code).',
    donors_title: 'Nos donateurs',
    donors_text:
      'Nous remercions les donateurs. Si vous préférez, votre don peut apparaître comme « Anonyme ».',
    donors_th_name: 'Nom',
    donors_th_gift: 'Don',
    donors_th_type: 'Type',
    donors_th_date: 'Date',
    donors_type_fin: 'Financier',
    donors_type_mat: 'Matériel',
    donors_admin_title: '(Option) Ajouter un donateur',
    donors_admin_text:
      'Cette partie sert de démo. Plus tard, on pourra la connecter à une base de données (ou la gérer manuellement).',
    donors_f_name: 'Nom',
    donors_f_gift: 'Don',
    donors_f_type: 'Type',
    donors_f_visibility: 'Affichage',
    donors_vis_named: 'Afficher mon nom',
    donors_vis_anon: 'Anonyme',
    donors_f_add: 'Ajouter à la liste (démo)',
    creations_title: 'Nos créations',
    creations_text:
      "Les enfants du centre participent à des ateliers créatifs où ils fabriquent des objets faits main. Ces créations artisanales utilisent exclusivement des matières premières locales et naturelles : fibre de bananiers, feuilles de bananier, et cordes fabriquées à partir du sisal, une plante locale aux fibres résistantes. Les ventes de ces créations soutiennent directement le projet associatif et permettent de financer le fonctionnement du centre. En achetant ces objets, vous encouragez les enfants dans leur apprentissage tout en valorisant un savoir-faire artisanal respectueux de l'environnement.",
    creations_photo_alt: 'Nos créations',
    creations_photo_placeholder: 'Photo des créations à ajouter',
    creations_info:
      '<strong>Comment commander ?</strong> Rendez-vous sur notre <a href="boutique.html" style="color: var(--accent); text-decoration: underline;">boutique</a> où vous pourrez voir les prix et sélectionner la quantité souhaitée. Le paiement se fait par virement bancaire directement sur le compte de l\'association.',
    creations_btn_shop: 'Voir la boutique',
    shop_title: 'Boutique',
    shop_intro:
      'Découvrez les créations uniques fabriquées par les enfants du centre lors de nos ateliers créatifs. Chaque achat soutient directement le centre et encourage les enfants dans leur apprentissage.',
    shop_item_1_name: 'Dessous de verres',
    shop_item_1_desc:
      'Dessous de verres en bois fabriqués lors de nos ateliers créatifs avec les enfants.',
    shop_item_1_price: 'Prix sur demande',
    shop_item_2_name: 'Dessous de table',
    shop_item_2_desc:
      'Dessous de table en bois réalisés par les enfants lors des ateliers.',
    shop_item_2_price: 'Prix sur demande',
    shop_price_unit: 'Prix unitaire :',
    shop_quantity: 'Quantité :',
    shop_total: 'Total :',
    shop_item_btn: 'Commander',
    shop_info_title: 'Comment commander ?',
    shop_info_text:
      'Pour commander un article, cliquez sur le bouton "Commander" correspondant. Vous serez redirigé vers le formulaire de contact où vous pourrez préciser votre commande. Nous vous enverrons ensuite les photos disponibles, les prix détaillés et les modalités de paiement et d\'expédition.',
    shop_contact_btn: 'Accéder au formulaire de contact',
    gallery_title: 'Galerie',
    gallery_text:
      "Plusieurs albums (placeholders pour l'instant). On branchera ensuite Cloudinary.",
    alb_1: 'Parc instrumental',
    alb_1_description:
      'Liste des instruments présents au centre :<br>7 trombones / 4 trompettes / 5 cornets / 4 baritons / 1 euphonium / 2 tubas / 3 tenor horns / 3 snare drums / 1 bass drums',
    alb_2: 'Concert',
    alb_2_description:
      "L'orchestre est souvent sollicité par des particuliers ou d'autres organisations pour animer des événements dans le village ou les villages environnants et promouvoir la musique. Certaines prestations génèrent des revenus qui servent à payer le loyer, à acheter de la nourriture pour les enfants se rendant au centre, ou encore à aider au paiement des frais de scolarité.",
    alb_3: 'Vie',
    alb_5: 'Répétition',
    alb_4: 'Don',
    contact_title: 'Contact',
    contact_text:
      'Les contacts se font uniquement via le site internet. Nous nous engageons à répondre sous une semaine maximum.',
    contact_team: '',
    contact_team_title: 'Notre équipe',
    contact_team_contact_name: '<strong>EMILIE EMPIS</strong>',
    contact_team_contact_role:
      "Présidente de l'association — Personne contact principale",
    contact_team_contact_desc:
      "C'est cette personne qui répond à vos messages et questions via le formulaire de contact.",
    contact_note:
      "⚠️ Dans ce prototype, le formulaire essaie d'appeler une URL Google Apps Script (à remplacer dans le code).",
    form_name: 'Nom',
    form_subject: 'Sujet',
    form_message: 'Message',
    form_send: 'Envoyer',
    footer_top: 'Haut de page',
    footer_legal: 'Mentions légales'
  },
  en: {
    brand: 'JINJA COMMUNITY MUSIC CENTER - FRANCE PROJECT',
    nav_project: 'Project',
    nav_needs: 'Needs',
    nav_help: 'Help',
    nav_donate: 'Donate',
    nav_creations: 'Our creations',
    nav_donors: 'Donors',
    nav_gallery: 'Gallery',
    nav_contact: 'Contact',
    cta_donate: 'Donate',
    pill: 'Music • Children • Jinja',
    hero_title: 'A cultural place that trains musicians.',
    hero_subtitle:
      'Jinja Community Music Center is a free, safe space where children can learn, express themselves, and grow through music.',
    hero_note:
      "Right now there are <strong>27</strong> musicians — but instruments are missing. That's why we're asking for donations.",
    hero_cta_donate: 'Donate',
    hero_cta_needs: 'See needs',
    countline_text: 'musicians so far',
    countline_tag: 'Every instrument donation matters',
    visual_title: 'Priority',
    visual_text:
      'Get instruments to welcome more children and strengthen the ensemble.',
    project_title: 'The project',
    project_intro_title: 'Overview',
    project_intro_text:
      '<strong>JINJA COMMUNITY MUSIC CENTER - FRANCE</strong> is a humanitarian and cultural initiative supporting <strong>Bwiire JohnBosco</strong>, a musician and educator from Jinja, Uganda. For several years, Bwiire has been offering children and teenagers a <strong>safe, open and free</strong> place to discover music, develop their talent, and find a caring reference point.',
    project_who_title: 'The founder of the Jinja music center',
    project_who_text:
      '<strong>Bwiire JohnBosco</strong> founded the center. He teaches patiently, organizes rehearsals, and supports children day-to-day. He turned the house he rents into a <strong>community center</strong>, and provides permanent accommodation to some children in very vulnerable situations.',
    project_team_title: 'The association founder',
    project_team_text:
      'Tuba teacher in several music schools and conservatories in the Lille region, music occupies a central place in my life, both professionally and personally.<br>My meeting with BWIIRE JohnBosco was obvious. For many years, I had nurtured a deep desire to be able to help children through music. Discovering his commitment, his humanity and the work he does every day with the children of Jinja gave concrete meaning to this dream.<br>I am convinced that every child deserves to receive an education and a caring environment to grow. Music transmits essential values: discipline, rigor, concentration, listening, but also respect and team spirit.<br>As a solo euphonium in a brass band, I experience every day the richness of this collective practice, capable of bringing together, structuring and revealing potential. This is the richness I want to share today and make accessible to children who deeply need it.<br>Supporting this project is, for me, a natural way to put music at the service of humanity, and to contribute, on my scale, to offering a brighter future to these children.',
    project_team_creator_name: 'EMILIE EMPIS',
    project_team_creator_role: 'Association President',
    project_team_creator_desc: '',
    project_team_members:
      '<strong>Association members:</strong><br><span></span>',
    project_team_members_title: 'Association members:',
    project_team_members_list: '',
    project_context_title: 'Context',
    project_context_text:
      'In Jinja, many children grow up with limited opportunities: poverty, lack of support, and few positive spaces. The center is a practical alternative: simple but stable — a place to learn, to feel valued, and to build confidence.',
    project_house_title: 'A home turned into a refuge',
    project_house_text:
      'This place is a home, an informal school, a space of expression, and a protective bubble. Every day, children come to learn, practice and support each other.',
    project_music_title: 'Music as a tool for the future',
    project_music_text:
      'The goal is simple: offer growth, discipline, joy, and sometimes a professional perspective.',
    project_music_list:
      '<li>Percussion</li><li>Brass instruments (trumpet, tuba, trombone, tenor horn…)</li><li>Basic music theory</li>',
    project_day_title: 'Daily life at the center',
    project_day_text:
      'A typical day is simple but full of learning and joy: welcoming children, practice (rhythm, basics, instruments), short lessons about discipline and teamwork. Children also learn to maintain and care for the instruments, an essential skill that teaches them responsibility and respect for equipment. They also participate in handmade creation workshops where they make wooden objects, such as coasters and placemats. These creations are then available in our <a href="#creations" style="color: var(--accent); text-decoration: underline;">shop</a> to support the center. There are breaks, simple games, sometimes a snack when possible, and words of encouragement to end the day.',
    project_need_title: 'What we need',
    project_need_text:
      'Today, <strong>27 children/teens</strong> participate regularly. Many more would like to join… but resources are limited: <strong>not enough instruments</strong> and <strong>not enough learning materials</strong>.',
    project_location_title: 'Location',
    project_location_text:
      'The center is located in <strong>Jinja, Uganda</strong>, a city at the source of the Nile.',
    project_map_link: 'View larger map',
    needs_title: 'The needs',
    needs_1_title: 'Instruments',
    needs_1_text:
      'We are looking for these instruments to complete the ensemble.',
    inst_1: 'Trombone',
    inst_2: 'Tuba',
    inst_3: 'Euphonium',
    inst_4: 'Baritone',
    inst_5: 'Tenor horn',
    inst_6: 'Trumpet',
    inst_7: 'Cornet',
    needs_2_title: 'Sheet music',
    needs_2_text:
      'Learning books, brass band charts, beginner → intermediate levels.',
    needs_2_digital:
      'Donations of methods or sheet music can be digital (PDF files, legal download links).',
    needs_3_title: 'Financial support',
    needs_3_text:
      'To keep the place running: operations, rent, utilities, food for children, teaching materials, activities.',
    help_title: 'help',
    help_1_title: 'Choose a donation type',
    help_1_text:
      'Financial or material (instruments, sheet music, accessories, maintenance equipment, music stands).',
    help_2_title: 'Fill the form',
    help_2_text: "We'll contact you quickly with the next steps.",
    help_3_title: 'We keep you updated',
    help_3_text: 'Photos, news, progress: transparency and follow-up.',
    donate_title: 'Donate',
    donate_text:
      'Two ways to help: a financial donation (fastest) or a material donation (instruments, sheet music, accessories, maintenance equipment, music stands).',
    transparency_btn: 'Transparency & use of donations',
    transparency_title: 'Transparency & use of donations',
    transparency_content:
      '<p style="margin-top: 0;">Text to be inserted about transparency and use of donations.</p>',
    donate_fin_title: 'Financial donation',
    donate_fin_text:
      'Support immediate running costs and instrument purchases.',
    donate_fin_btn: 'Go to donation page',
    donate_mat_title: 'Material donation',
    donate_mat_text:
      'Offer an instrument, sheet music, accessories, maintenance equipment, or music stands: fill the form below.',
    donate_mat_btn: 'Open the material form',
    donate_mat_list: 'See instrument list',
    donate_info_title: 'How does it work?',
    donate_info_fin_title: 'Financial donations',
    donate_info_fin_text:
      "Financial donations are transferred directly to the association's account. We use secure platforms for international transfers to Uganda. Funds are immediately used for the center's operations, purchasing instruments locally, rent, utilities, and food for children.",
    donate_info_mat_title: 'Material donations',
    donate_info_mat_text:
      'After receiving your form, we will contact you to organize the shipment. For instruments, accessories, maintenance equipment, and music stands, we coordinate shipping to Uganda (shipping costs to be discussed case by case). Material donations may be grouped to optimize shipping costs: we sometimes wait for several donations before organizing a group shipment. You will be informed of the shipping schedule. For digital sheet music, we will send you an email with instructions for file transfer.',
    instruments_modal_title: 'Instrument list',
    instruments_modal_text:
      'Here is the list of instruments we are looking for to complete the orchestra:',
    mat_title: 'Form — Material donation',
    mat_text:
      'Fill this form to offer an instrument or sheet music. We will contact you through the website.',
    mat_item: 'Donation type',
    mat_item_ph: 'Choose…',
    mat_item_maintenance: 'Maintenance equipment',
    mat_item_stands: 'Music stands',
    mat_item_accessories: 'Accessories',
    mat_item_sheet_music: 'Sheet music',
    mat_item_instruments: 'Instruments',
    mat_text_digital:
      '<strong>Note:</strong> For digital sheet music donations (PDF files, legal links), we will send you an email after receiving your form to organize the transfer.',
    mat_instrument: 'Instrument (if applicable)',
    mat_instrument_ph: 'Choose…',
    mat_brand: 'Brand',
    mat_serial: 'Serial number',
    mat_qty: 'Quantity',
    mat_condition: 'Condition',
    mat_condition_ph: 'Choose…',
    mat_condition_excellent: 'Excellent',
    mat_condition_very_good: 'Very good',
    mat_condition_good: 'Good',
    mat_condition_fair: 'Fair',
    mat_condition_repair: 'Needs repair',
    mat_city: 'City / Country',
    mat_photo: 'Photo (optional)',
    mat_photo_placeholder: 'Choose a file',
    mat_photo_hint: 'Accepted formats: JPG, PNG, GIF (max 10 MB)',
    mat_photo_remove: 'Remove photo',
    mat_send: 'Send offer',
    mat_note:
      '⚠️ For now, this form sends to a Google Apps Script URL (replace it in the code).',
    donors_title: 'Our donors',
    donors_text:
      'We thank our donors. If you prefer, your gift can appear as "Anonymous".',
    donors_th_name: 'Name',
    donors_th_gift: 'Gift',
    donors_th_type: 'Type',
    donors_th_date: 'Date',
    donors_type_fin: 'Financial',
    donors_type_mat: 'Material',
    donors_admin_title: '(Optional) Add a donor',
    donors_admin_text:
      'This is a demo. Later we can connect it to a database (or manage it manually).',
    donors_f_name: 'Name',
    donors_f_gift: 'Gift',
    donors_f_type: 'Type',
    donors_f_visibility: 'Display',
    donors_vis_named: 'Show my name',
    donors_vis_anon: 'Anonymous',
    donors_f_add: 'Add to the list (demo)',
    creations_title: 'Our creations',
    creations_text:
      "The center's children participate in creative workshops where they make handmade objects. These artisanal creations use exclusively local and natural raw materials: banana tree fiber, banana leaves, and ropes made from sisal, a local plant with strong fibers. The sales of these creations directly support the association project and help finance the center's operations. By purchasing these objects, you encourage the children in their learning while valuing an environmentally respectful artisanal know-how.",
    creations_photo_alt: 'Our creations',
    creations_photo_placeholder: 'Photo of creations to be added',
    creations_info:
      '<strong>How to order?</strong> Visit our <a href="boutique.html" style="color: var(--accent); text-decoration: underline;">shop</a> where you can see the prices and select the desired quantity. Payment is made by bank transfer directly to the association\'s account.',
    creations_btn_shop: 'Visit the shop',
    shop_title: 'Shop',
    shop_intro:
      "Discover unique creations made by the center's children during our creative workshops. Each purchase directly supports the center and encourages the children in their learning.",
    shop_item_1_name: 'Coasters',
    shop_item_1_desc:
      'Wooden coasters made during our creative workshops with the children.',
    shop_item_1_price: 'Price on request',
    shop_item_2_name: 'Placemats',
    shop_item_2_desc: 'Wooden placemats made by the children during workshops.',
    shop_item_2_price: 'Price on request',
    shop_price_unit: 'Unit price:',
    shop_quantity: 'Quantity:',
    shop_total: 'Total:',
    shop_item_btn: 'Order',
    shop_info_title: 'How to order?',
    shop_info_text:
      'To order an item, click on the corresponding "Order" button. You will be redirected to the contact form where you can specify your order. We will then send you available photos, detailed prices, and payment and shipping details.',
    shop_contact_btn: 'Go to contact form',
    gallery_title: 'Gallery',
    gallery_text:
      "Multiple albums (placeholders for now). We'll connect Cloudinary later.",
    alb_1: 'Instrument park',
    alb_1_description:
      'List of instruments present at the center:<br>7 trombones / 4 trumpets / 5 cornets / 4 baritones / 1 euphonium / 2 tubas / 3 tenor horns / 3 snare drums / 1 bass drums',
    alb_2: 'Concert',
    alb_2_description:
      'The orchestra is often requested by individuals or other organizations to enliven events in the village or surrounding villages and promote music. Some performances generate revenue that helps pay the rent, buy food for children attending the center, or help pay school fees.',
    alb_3: 'Daily life',
    alb_5: 'Rehearsal',
    alb_4: 'Donations',
    contact_title: 'contact',
    contact_text:
      'Contact is only through the website. We commit to responding within a maximum of one week.',
    contact_team: '',
    contact_team_title: 'Our team',
    contact_team_contact_name: '<strong>EMILIE EMPIS</strong>',
    contact_team_contact_role: 'Association President — Main contact person',
    contact_team_contact_desc:
      'This person responds to your messages and questions via the contact form.',
    contact_note:
      '⚠️ In this prototype, the form calls a Google Apps Script URL (replace it in the code).',
    form_name: 'Name',
    form_subject: 'Subject',
    form_message: 'Message',
    form_send: 'Send',
    footer_top: 'Back to top',
    footer_legal: 'Legal notice'
  }
}

// Variable globale pour la langue courante
let currentLang = 'fr'

/**
 * Fonction d'application de l'internationalisation
 * Parcourt tous les éléments avec data-i18n et remplace leur contenu
 *
 * @param {string} lang - Code de langue ('fr' ou 'en')
 */
function applyI18n(lang) {
  currentLang = lang
  const dict = i18n[lang]

  // Parcours de tous les éléments avec l'attribut data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (!dict[key]) return
    el.innerHTML = dict[key]
  })

  // Mise à jour du bouton de langue et de l'attribut lang du document
  const langBtn = document.getElementById('langBtn')
  if (langBtn) {
    langBtn.textContent = lang.toUpperCase()
  }
  document.documentElement.lang = lang
}

// ============================================
// GESTION DES FORMULAIRES - Envoi vers GAS
// ============================================

/**
 * Fonction pour uploader une image vers Cloudinary
 *
 * @param {File} file - Fichier image à uploader
 * @returns {Promise<string>} URL de l'image uploadée
 */
async function uploadToCloudinary(file) {
  // Vérifier si la configuration Cloudinary est disponible
  if (
    typeof CLOUDINARY_CONFIG === 'undefined' ||
    !CLOUDINARY_CONFIG.cloudName ||
    !CLOUDINARY_CONFIG.uploadPreset
  ) {
    console.warn('Configuration Cloudinary non trouvée. Vérifiez config.js')
    throw new Error('Configuration Cloudinary manquante')
  }

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`

  // Créer un FormData pour l'upload
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.secure_url // Retourner l'URL de l'image uploadée
  } catch (error) {
    console.error('Erreur Cloudinary:', error)
    throw error
  }
}

/**
 * Fonction générique pour envoyer un formulaire vers Google Apps Script
 *
 * @param {HTMLElement} formEl - Élément formulaire
 * @param {HTMLElement} statusEl - Élément pour afficher le statut
 * @param {HTMLElement} btnEl - Bouton de soumission
 * @param {Object} extra - Paramètres supplémentaires à envoyer
 */
async function sendToGAS(formEl, statusEl, btnEl, extra = {}) {
  // Affichage du message d'envoi
  statusEl.textContent = currentLang === 'fr' ? 'Envoi...' : 'Sending...'
  btnEl.disabled = true

  // Récupération des données du formulaire
  // Si extra.formData existe, l'utiliser (pour le formulaire matériel avec photo)
  const fd = extra.formData || new FormData(formEl)
  const params = new URLSearchParams()

  // Ajout des champs communs
  params.append('name', fd.get('name') || '')
  params.append('email', fd.get('email') || '')
  params.append('subject', fd.get('subject') || extra.subject || '')
  params.append('message', fd.get('message') || '')

  // Ajout des paramètres supplémentaires
  Object.entries(extra).forEach(([k, v]) => {
    if (k !== 'formData' && k !== 'photoUrl') {
      params.append(k, String(v ?? ''))
    }
  })

  // Ajout des champs spécifiques au formulaire matériel (si présents)
  if (fd.get('item') !== null) params.append('item', fd.get('item') || '')
  if (fd.get('instrument') !== null)
    params.append('instrument', fd.get('instrument') || '')
  if (fd.get('brand') !== null) params.append('brand', fd.get('brand') || '')
  if (fd.get('serial') !== null) params.append('serial', fd.get('serial') || '')
  if (fd.get('qty') !== null) params.append('qty', fd.get('qty') || '')
  if (fd.get('condition') !== null)
    params.append('condition', fd.get('condition') || '')
  if (fd.get('location') !== null)
    params.append('location', fd.get('location') || '')
  // Utiliser photoUrl de extra si disponible (URL Cloudinary), sinon utiliser la valeur du formulaire
  if (extra.photoUrl) {
    params.append('photo', extra.photoUrl)
  } else if (fd.get('photo') !== null) {
    params.append('photo', fd.get('photo') || '')
  }

  try {
    // Envoi de la requête vers Google Apps Script
    const url = `${GAS_URL}?${params.toString()}`
    await fetch(url, { method: 'GET', mode: 'no-cors' })

    // Réinitialisation du formulaire et affichage du succès
    formEl.reset()

    // Réinitialiser l'aperçu photo si présent
    const photoPreview = document.getElementById('photoPreview')
    const photoPreviewImg = document.getElementById('photoPreviewImg')
    const materialPhotoInput = document.getElementById('materialPhotoInput')
    if (photoPreview && photoPreviewImg) {
      photoPreview.style.display = 'none'
      photoPreviewImg.src = ''
    }
    if (materialPhotoInput) {
      materialPhotoInput.value = ''
    }

    statusEl.textContent =
      currentLang === 'fr' ? 'Message envoyé ✅' : 'Sent ✅'
    statusEl.style.color = 'var(--accent2, #25d366)'
  } catch (err) {
    // Gestion des erreurs
    statusEl.textContent =
      currentLang === 'fr'
        ? "Erreur d'envoi. Réessaie plus tard."
        : 'Send failed. Try again later.'
    statusEl.style.color = 'var(--error, #dc2626)'
  } finally {
    // Réactivation du bouton et nettoyage du message après 6 secondes
    btnEl.disabled = false
    setTimeout(() => (statusEl.textContent = ''), 6000)
  }
}

// ============================================
// GESTION DE LA GALERIE - Changement d'albums
// ============================================

/**
 * Fonction pour afficher un album spécifique dans la galerie
 *
 * @param {string} name - Nom de l'album à afficher
 */
// ============================================
// GESTION DE LA GALERIE DYNAMIQUE
// ============================================

// Variable globale pour stocker les données de la galerie
let galleryData = {}
// Variable pour suivre si la galerie a déjà été initialisée
let galleryInitialized = false

/**
 * Fonction pour charger les données de la galerie depuis le fichier JSON
 * Le fichier JSON est généré automatiquement par le script generate-gallery.js
 * qui scanne les dossiers d'images
 */
async function loadGalleryData() {
  // Éviter de charger plusieurs fois la galerie
  if (galleryInitialized) {
    return Promise.resolve()
  }

  try {
    // Charger le fichier JSON généré par le script
    // Ce fichier est automatiquement mis à jour quand on exécute le script
    const response = await fetch('js/gallery-data.json')
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    galleryData = await response.json()

    // Générer la galerie dynamiquement
    generateGallery()
    galleryInitialized = true
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la galerie:', error)
    // Afficher un message d'erreur dans la galerie
    const galleryContainer = document.getElementById('galleryContainer')
    if (galleryContainer) {
      galleryContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--muted);">
          <p>⚠️ Impossible de charger la galerie.</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">
            Exécutez: <code>node scripts/generate-gallery.js</code>
          </p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--muted);">
            Ce script scanne automatiquement les dossiers d'images et génère la liste.
          </p>
        </div>
      `
    }
  }
}

/**
 * Fonction pour générer tous les albums de la galerie
 */
function generateGallery() {
  const galleryContainer = document.getElementById('galleryContainer')
  if (!galleryContainer) return

  // Vider le conteneur avant de générer pour éviter les doublons
  galleryContainer.innerHTML = ''

  // Ordre des albums (correspond aux onglets)
  const albumOrder = ['concert', 'centre', 'vie', 'repetition', 'don']

  // Générer chaque album
  albumOrder.forEach((albumId, index) => {
    const images = galleryData[albumId] || []

    // Créer le conteneur de l'album
    const albumPanel = document.createElement('div')
    albumPanel.className = 'gridGallery'
    albumPanel.setAttribute('data-album-panel', albumId)

    // Masquer tous les albums sauf le premier (concert)
    if (index !== 0) {
      albumPanel.classList.add('hidden')
    }

    // Si l'album a des images, les générer
    if (images.length > 0) {
      images.forEach((image) => {
        const galleryItem = document.createElement('div')
        galleryItem.className = 'gallery-item'

        const img = document.createElement('img')
        img.src = image.src
        img.alt = image.alt || 'Photo'
        img.loading = 'lazy'

        galleryItem.appendChild(img)
        albumPanel.appendChild(galleryItem)
      })
    } else {
      // Afficher un placeholder si l'album est vide
      const placeholder = document.createElement('div')
      placeholder.className = 'ph'
      placeholder.textContent = `${albumId} — Aucune image`
      albumPanel.appendChild(placeholder)
    }

    galleryContainer.appendChild(albumPanel)
  })
}

/**
 * Fonction pour afficher un album spécifique
 * @param {string} name - ID de l'album à afficher
 */
function showAlbum(name) {
  const tabs = Array.from(document.querySelectorAll('.tab[data-album]'))
  const panels = Array.from(document.querySelectorAll('[data-album-panel]'))
  const descriptions = Array.from(
    document.querySelectorAll('[data-album-text]')
  )

  // Mise à jour de l'état des onglets (aria-selected)
  tabs.forEach((t) =>
    t.setAttribute('aria-selected', String(t.dataset.album === name))
  )

  // Affichage/masquage des panneaux d'albums
  panels.forEach((p) =>
    p.classList.toggle('hidden', p.dataset.albumPanel !== name)
  )

  // Affichage/masquage des descriptions d'albums
  descriptions.forEach((d) =>
    d.classList.toggle('hidden', d.dataset.albumText !== name)
  )
}

// ============================================
// GESTION DES DONATEURS - Liste locale (démo)
// ============================================

/**
 * Fonction pour ajouter un donateur à la liste (démo locale)
 * Note : Cette fonction est uniquement pour la démonstration.
 * En production, cela devrait être géré par un backend.
 */
// ============================================
// INITIALISATION - Au chargement de la page
// ============================================

// Attente du chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialisation de l'internationalisation en français
  applyI18n('fr')

  // Gestion du pré-remplissage du formulaire de contact depuis la boutique
  if (window.location.hash.includes('contact')) {
    const hashParts = window.location.hash.split('?')
    if (hashParts.length > 1) {
      const urlParams = new URLSearchParams(hashParts[1])
      const product = urlParams.get('product')
      const productName = urlParams.get('name')
      const quantity = urlParams.get('quantity') || '1'
      const price = urlParams.get('price') || ''

      if (product && productName) {
        // Attendre que le formulaire soit chargé
        setTimeout(() => {
          const contactForm = document.getElementById('contactForm')
          const subjectInput = contactForm?.querySelector(
            'input[name="subject"]'
          )
          const messageTextarea = contactForm?.querySelector(
            'textarea[name="message"]'
          )

          if (subjectInput) {
            subjectInput.value = `Commande : ${productName}`
          }

          if (messageTextarea) {
            let message = `Bonjour,\n\nJe souhaite commander : ${productName}`
            if (quantity && quantity !== '1') {
              message += `\nQuantité : ${quantity}`
            }
            if (
              price &&
              price !== 'Prix sur demande' &&
              price !== 'Price on request'
            ) {
              message += `\nPrix total : ${price}`
            }
            message += `\n\nMerci de me faire parvenir les photos disponibles, les prix et les modalités de commande.\n\nCordialement`
            messageTextarea.value = message
          }

          // Scroll vers le formulaire
          const contactSection = document.getElementById('contact')
          if (contactSection) {
            contactSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }
        }, 500)
      }
    }
  }

  // Gestion du bouton de changement de langue
  const langBtn = document.getElementById('langBtn')
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyI18n(currentLang === 'fr' ? 'en' : 'fr')
      // Réattacher les event listeners après changement de langue
      attachEventListeners()
    })
  }

  // Attacher tous les event listeners
  attachEventListeners()
})

// ============================================
// FONCTION POUR ATTACHER LES EVENT LISTENERS
// ============================================
function attachEventListeners() {
  // ============================================
  // GESTION DU MENU HAMBURGER MOBILE
  // ============================================
  const menuToggle = document.getElementById('menuToggle')
  const mainNav = document.getElementById('mainNav')

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true'
      menuToggle.setAttribute('aria-expanded', !isOpen)
      mainNav.classList.toggle('nav--open')
    })

    // Fermer le menu quand on clique sur un lien
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false')
        mainNav.classList.remove('nav--open')
      })
    })

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false')
        mainNav.classList.remove('nav--open')
      }
    })
  }

  // ============================================
  // GESTION DU SCROLL FLUIDE POUR LES LIENS DU MENU
  // ============================================
  // Ajouter un scroll fluide pour tous les liens d'ancrage
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      // Ignorer les liens vides ou vers #top
      if (href === '#' || href === '#top') {
        // Retirer l'état actif de tous les liens si on clique sur #top
        document.querySelectorAll('.nav a').forEach((link) => {
          link.classList.remove('active')
        })
        return
      }

      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        // Calculer la position avec un offset pour le header fixe
        const headerOffset = 80
        const elementPosition = target.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset

        // Mettre à jour immédiatement le lien actif dans le menu
        const navLinks = document.querySelectorAll('.nav a[href^="#"]')
        navLinks.forEach((link) => {
          link.classList.remove('active')
        })
        this.classList.add('active')

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    })
  })

  // ============================================
  // DÉTECTION DE LA SECTION ACTIVE AU SCROLL
  // ============================================
  /**
   * Fonction pour mettre à jour le lien actif dans le menu
   * selon la section visible à l'écran
   */
  function updateActiveNavLink() {
    // Récupérer toutes les sections avec un ID
    const sections = document.querySelectorAll('section[id], main[id]')
    const navLinks = document.querySelectorAll('.nav a[href^="#"]')

    // Offset pour tenir compte du header fixe
    const headerOffset = 100

    // Trouver la section actuellement visible
    let currentSection = ''
    const scrollPosition = window.scrollY + headerOffset

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute('id')

      // Vérifier si la section est dans la zone visible
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = sectionId
      }
    })

    // Si on est tout en haut de la page, ne pas activer de lien
    if (window.scrollY < 50) {
      currentSection = ''
    }

    // Mettre à jour les classes actives des liens de navigation
    navLinks.forEach((link) => {
      const href = link.getAttribute('href')
      const targetId = href.replace('#', '')

      if (targetId === currentSection && currentSection !== '') {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }

  // Utiliser Intersection Observer pour une détection plus précise
  function initActiveNavObserver() {
    const sections = document.querySelectorAll('section[id], main[id]')
    const navLinks = document.querySelectorAll('.nav a[href^="#"]')

    // Options pour l'Intersection Observer
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-20% 0px -60% 0px', // Déclencher quand la section est dans le tiers supérieur
      threshold: 0.1 // Déclencher dès que 10% de la section est visible
    }

    // Callback de l'observer
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id')

          // Mettre à jour les liens de navigation
          navLinks.forEach((link) => {
            const href = link.getAttribute('href')
            const targetId = href.replace('#', '')

            if (targetId === sectionId) {
              link.classList.add('active')
            } else {
              link.classList.remove('active')
            }
          })
        }
      })
    }

    // Créer l'observer
    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observer toutes les sections
    sections.forEach((section) => {
      observer.observe(section)
    })

    // Gérer le cas où on est tout en haut de la page
    window.addEventListener('scroll', () => {
      if (window.scrollY < 50) {
        navLinks.forEach((link) => {
          link.classList.remove('active')
        })
      }
    })
  }

  // Initialiser la détection de section active
  initActiveNavObserver()

  // Fallback : mettre à jour aussi au scroll pour plus de réactivité
  let scrollTimeout
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      updateActiveNavLink()
    }, 100)
  })

  // Mettre à jour au chargement initial
  updateActiveNavLink()

  // Mise à jour de l'année dans le footer
  const yearEl = document.getElementById('year')
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear()
  }

  // Initialisation de la galerie dynamique
  // Charger les données et générer la galerie
  // Vérifier si la galerie a déjà été initialisée pour éviter les doublons
  if (!window.galleryTabsInitialized) {
    loadGalleryData().then(() => {
      // Une fois la galerie chargée, initialiser les onglets
      const tabs = Array.from(document.querySelectorAll('.tab[data-album]'))
      tabs.forEach((t) => {
        t.addEventListener('click', () => showAlbum(t.dataset.album))
      })
      // Afficher l'album "concert" par défaut
      showAlbum('concert')
      window.galleryTabsInitialized = true
    })
  }

  // ============================================
  // GESTION DU LIGHTBOX GALERIE
  // ============================================
  const galleryLightbox = document.getElementById('galleryLightbox')
  const lightboxImage = document.getElementById('lightboxImage')
  const lightboxClose = document.getElementById('lightboxClose')
  const lightboxOverlay = document.getElementById('lightboxOverlay')
  const lightboxPrev = document.getElementById('lightboxPrev')
  const lightboxNext = document.getElementById('lightboxNext')
  const lightboxCounter = document.getElementById('lightboxCounter')

  let currentImages = []
  let currentImageIndex = 0

  // Fonction pour ouvrir le lightbox
  function openLightbox(images, index) {
    if (!galleryLightbox || !lightboxImage) return

    currentImages = images
    currentImageIndex = index

    updateLightboxImage()
    galleryLightbox.setAttribute('aria-hidden', 'false')
    galleryLightbox.classList.add('lightbox--active')
    document.body.style.overflow = 'hidden'
  }

  // Fonction pour fermer le lightbox
  function closeLightbox() {
    if (!galleryLightbox) return

    galleryLightbox.setAttribute('aria-hidden', 'true')
    galleryLightbox.classList.remove('lightbox--active')
    document.body.style.overflow = ''
  }

  // Fonction pour mettre à jour l'image du lightbox
  function updateLightboxImage() {
    if (!lightboxImage || currentImages.length === 0) return

    const currentImage = currentImages[currentImageIndex]
    lightboxImage.src = currentImage.src
    lightboxImage.alt = currentImage.alt || 'Photo de la galerie'

    // Mettre à jour le compteur
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${
        currentImages.length
      }`
    }
  }

  // Fonction pour aller à l'image précédente
  function prevImage() {
    if (currentImages.length === 0) return
    currentImageIndex =
      (currentImageIndex - 1 + currentImages.length) % currentImages.length
    updateLightboxImage()
  }

  // Fonction pour aller à l'image suivante
  function nextImage() {
    if (currentImages.length === 0) return
    currentImageIndex = (currentImageIndex + 1) % currentImages.length
    updateLightboxImage()
  }

  // Ajouter les event listeners pour les images de la galerie (délégation d'événements)
  document.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item')
    if (galleryItem) {
      e.preventDefault()

      // Récupérer toutes les images de l'album actif
      const activePanel = document.querySelector(
        '[data-album-panel]:not(.hidden)'
      )
      if (activePanel) {
        const allImages = Array.from(
          activePanel.querySelectorAll('.gallery-item img')
        )
        const clickedImage = galleryItem.querySelector('img')
        const index = allImages.findIndex((img) => img === clickedImage)

        if (index !== -1) {
          // Convertir les éléments img en objets avec src et alt pour le lightbox
          const imageData = allImages.map((img) => ({
            src: img.src,
            alt: img.alt
          }))
          openLightbox(imageData, index)
        }
      }
    }
  })

  // Event listeners pour le lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox)
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox)
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation()
      prevImage()
    })
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation()
      nextImage()
    })
  }

  // Navigation au clavier
  document.addEventListener('keydown', (e) => {
    if (
      galleryLightbox &&
      galleryLightbox.classList.contains('lightbox--active')
    ) {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevImage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextImage()
      }
    }
  })

  // Navigation tactile (swipe) pour mobile
  let touchStartX = 0
  let touchEndX = 0

  if (galleryLightbox) {
    galleryLightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX
    })

    galleryLightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleLightboxSwipe()
    })
  }

  function handleLightboxSwipe() {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe gauche - image suivante
        nextImage()
      } else {
        // Swipe droite - image précédente
        prevImage()
      }
    }
  }

  // Gestion du formulaire de contact
  const contactForm = document.getElementById('contactForm')
  const formStatus = document.getElementById('formStatus')
  const sendBtn = document.getElementById('sendBtn')

  if (contactForm && formStatus && sendBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault()
      sendToGAS(contactForm, formStatus, sendBtn)
    })
  }

  // Gestion du formulaire de don matériel
  const materialForm = document.getElementById('materialForm')
  const matStatus = document.getElementById('matStatus')
  const matSendBtn = document.getElementById('matSendBtn')
  const materialPhotoInput = document.getElementById('materialPhotoInput')
  const photoPreview = document.getElementById('photoPreview')
  const photoPreviewImg = document.getElementById('photoPreviewImg')
  const removePhotoBtn = document.getElementById('removePhotoBtn')

  // Gestion de l'aperçu de la photo
  if (materialPhotoInput && photoPreview && photoPreviewImg) {
    materialPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (file) {
        // Vérifier la taille du fichier (10 Mo max)
        if (file.size > 10 * 1024 * 1024) {
          alert(
            currentLang === 'fr'
              ? 'Le fichier est trop volumineux. Taille maximale : 10 Mo.'
              : 'File is too large. Maximum size: 10 MB.'
          )
          e.target.value = ''
          return
        }

        // Vérifier le type de fichier
        if (!file.type.match('image.*')) {
          alert(
            currentLang === 'fr'
              ? 'Veuillez sélectionner une image (JPG, PNG, GIF).'
              : 'Please select an image file (JPG, PNG, GIF).'
          )
          e.target.value = ''
          return
        }

        // Afficher l'aperçu
        const reader = new FileReader()
        reader.onload = (event) => {
          photoPreviewImg.src = event.target.result
          photoPreview.style.display = 'block'
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // Supprimer la photo
  if (removePhotoBtn && materialPhotoInput) {
    removePhotoBtn.addEventListener('click', () => {
      materialPhotoInput.value = ''
      photoPreview.style.display = 'none'
      photoPreviewImg.src = ''
    })
  }

  if (materialForm && matStatus && matSendBtn) {
    materialForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      // Gestion de l'upload de la photo vers Cloudinary si un fichier est sélectionné
      let photoUrl = ''
      if (materialPhotoInput && materialPhotoInput.files[0]) {
        try {
          photoUrl = await uploadToCloudinary(materialPhotoInput.files[0])
        } catch (error) {
          console.error("Erreur lors de l'upload vers Cloudinary:", error)
          matStatus.textContent =
            currentLang === 'fr'
              ? "Erreur lors de l'upload de la photo. Veuillez réessayer."
              : 'Error uploading photo. Please try again.'
          matStatus.style.color = 'var(--error, #dc2626)'
          return
        }
      }

      // Créer un FormData avec toutes les données
      const formData = new FormData(materialForm)
      if (photoUrl) {
        formData.set('photo', photoUrl) // Remplacer le fichier par l'URL Cloudinary
      }

      // Envoyer vers GAS
      sendToGAS(materialForm, matStatus, matSendBtn, {
        subject: currentLang === 'fr' ? 'Don matériel' : 'Material donation',
        formData: formData,
        photoUrl: photoUrl
      })
    })
  }

  // La gestion des donateurs se fera via une base de données ou manuellement
  // Le code d'ajout de donateur a été retiré car le formulaire de test a été supprimé

  // ============================================
  // GESTION DU FORMULAIRE DE DON MATÉRIEL
  // ============================================
  // Afficher/masquer le formulaire de don matériel
  // Utilisation de la délégation d'événements pour éviter les problèmes avec i18n
  const materialFormSection = document.getElementById('materiel')
  if (!materialFormSection) {
    console.error('Section formulaire matériel non trouvée')
  }

  // Event listener unique avec délégation
  if (!window.materialFormListenerAttached) {
    document.addEventListener('click', (e) => {
      // Vérifier si le clic est sur le bouton ou un de ses enfants
      const btn = e.target.closest('#showMaterialFormBtn')
      if (btn) {
        e.preventDefault()
        e.stopPropagation()
        const section = document.getElementById('materiel')
        if (section) {
          console.log('Affichage du formulaire matériel')
          // Afficher la section du formulaire
          section.style.display = 'block'
          // Scroll fluide vers le formulaire
          setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        } else {
          console.error('Section formulaire non trouvée au clic')
        }
      }
    })
    window.materialFormListenerAttached = true
  }

  // ============================================
  // GESTION DU MODAL LISTE D'INSTRUMENTS
  // ============================================
  // Liste des instruments avec leurs icônes emoji
  // Note : Les icônes sont choisies pour représenter visuellement chaque type d'instrument
  const instrumentsList = [
    { key: 'inst_1', emoji: '🎺', name: 'Trombone' }, // Trombone (cuivre)
    { key: 'inst_2', emoji: '🎷', name: 'Tuba' }, // Tuba (cuivre grave)
    { key: 'inst_3', emoji: '🎹', name: 'Euphonium' }, // Euphonium (cuivre)
    { key: 'inst_4', emoji: '🎸', name: 'Baryton' }, // Baryton (cuivre)
    { key: 'inst_5', emoji: '🎵', name: 'Ténor horn' }, // Ténor horn (cuivre)
    { key: 'inst_6', emoji: '🎺', name: 'Trompette' }, // Trompette (cuivre aigu)
    { key: 'inst_7', emoji: '🎺', name: 'Cornet' } // Cornet (cuivre)
  ]

  // Éléments du modal
  const instrumentsModal = document.getElementById('instrumentsModal')
  const showInstrumentsListBtn = document.getElementById(
    'showInstrumentsListBtn'
  )
  const closeInstrumentsModal = document.getElementById('closeInstrumentsModal')
  const instrumentsModalOverlay = document.getElementById(
    'instrumentsModalOverlay'
  )
  const instrumentsGrid = document.getElementById('instrumentsGrid')

  // Fonction pour générer la grille d'instruments
  function generateInstrumentsGrid() {
    if (!instrumentsGrid) return

    instrumentsGrid.innerHTML = ''
    const currentLang = document.documentElement.lang || 'fr'
    const translations = i18n[currentLang] || i18n.fr

    instrumentsList.forEach((instrument) => {
      const instrumentCard = document.createElement('div')
      instrumentCard.className = 'instrument-card'
      instrumentCard.innerHTML = `
        <div class="instrument-card__icon">${instrument.emoji}</div>
        <div class="instrument-card__name">${
          translations[instrument.key] || instrument.name
        }</div>
      `
      instrumentsGrid.appendChild(instrumentCard)
    })
  }

  // Fonction pour ouvrir le modal
  function openInstrumentsModal() {
    if (!instrumentsModal) {
      console.error('Modal instruments non trouvé')
      return
    }
    generateInstrumentsGrid()
    instrumentsModal.setAttribute('aria-hidden', 'false')
    instrumentsModal.classList.add('modal--active')
    document.body.style.overflow = 'hidden' // Empêcher le scroll du body
  }

  // Fonction pour fermer le modal
  function closeInstrumentsModalFunc() {
    if (!instrumentsModal) return
    instrumentsModal.setAttribute('aria-hidden', 'true')
    instrumentsModal.classList.remove('modal--active')
    document.body.style.overflow = '' // Réactiver le scroll du body
  }

  // Événements pour ouvrir/fermer le modal
  // Utilisation de la délégation d'événements pour éviter les problèmes avec i18n
  if (!window.instrumentsModalListenerAttached) {
    document.addEventListener('click', (e) => {
      // Vérifier si le clic est sur le bouton ou un de ses enfants
      const btn = e.target.closest('#showInstrumentsListBtn')
      if (btn) {
        e.preventDefault()
        e.stopPropagation()
        console.log('Ouverture du modal instruments')
        openInstrumentsModal()
      }
    })
    window.instrumentsModalListenerAttached = true
  }

  if (closeInstrumentsModal) {
    closeInstrumentsModal.addEventListener('click', closeInstrumentsModalFunc)
  }

  if (instrumentsModalOverlay) {
    instrumentsModalOverlay.addEventListener('click', closeInstrumentsModalFunc)
  }

  // Fermer avec la touche Escape (une seule fois)
  document.removeEventListener('keydown', handleEscapeKey)
  document.addEventListener('keydown', handleEscapeKey)

  function handleEscapeKey(e) {
    if (
      e.key === 'Escape' &&
      instrumentsModal &&
      instrumentsModal.classList.contains('modal--active')
    ) {
      closeInstrumentsModalFunc()
    }
  }

  // ============================================
  // GESTION DU CARROUSEL "LE PROJET"
  // ============================================
  const projectCarouselTrack = document.getElementById('projectCarouselTrack')
  const projectCarouselPrev = document.getElementById('projectCarouselPrev')
  const projectCarouselNext = document.getElementById('projectCarouselNext')
  const projectCarouselIndicators = document.getElementById(
    'projectCarouselIndicators'
  )

  if (projectCarouselTrack && projectCarouselPrev && projectCarouselNext) {
    let currentSlide = 0
    const slides = projectCarouselTrack.querySelectorAll(
      '.project-carousel__slide'
    )
    const totalSlides = slides.length
    const carouselWrapper = projectCarouselTrack.closest(
      '.project-carousel__wrapper'
    )

    // Fonction pour créer les indicateurs
    function createIndicators() {
      if (!projectCarouselIndicators) return

      projectCarouselIndicators.innerHTML = ''
      for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button')
        indicator.className = 'project-carousel__indicator'
        indicator.setAttribute('aria-label', `Aller au slide ${i + 1}`)
        indicator.addEventListener('click', () => goToSlide(i))
        projectCarouselIndicators.appendChild(indicator)
      }
      updateIndicators()
    }

    // Fonction pour mettre à jour les indicateurs
    function updateIndicators() {
      if (!projectCarouselIndicators) return
      const indicators = projectCarouselIndicators.querySelectorAll(
        '.project-carousel__indicator'
      )
      indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
          indicator.classList.add('project-carousel__indicator--active')
        } else {
          indicator.classList.remove('project-carousel__indicator--active')
        }
      })
    }

    // Fonction pour ajuster la hauteur du wrapper selon le slide actif
    function adjustWrapperHeight() {
      if (!carouselWrapper) return

      const activeSlide = slides[currentSlide]
      if (activeSlide) {
        // Obtenir la hauteur réelle du slide actif
        const slideHeight = activeSlide.offsetHeight
        // Ajuster la hauteur du wrapper avec transition
        carouselWrapper.style.height = `${slideHeight}px`
      }
    }

    // Fonction pour aller à un slide spécifique
    function goToSlide(index) {
      if (index < 0) {
        currentSlide = totalSlides - 1
      } else if (index >= totalSlides) {
        currentSlide = 0
      } else {
        currentSlide = index
      }

      const translateX = -currentSlide * 100
      projectCarouselTrack.style.transform = `translateX(${translateX}%)`
      updateIndicators()

      // Ajuster la hauteur après le changement de slide
      // Utiliser setTimeout pour laisser le temps à la transition de se faire
      setTimeout(() => {
        adjustWrapperHeight()
      }, 50)
    }

    // Navigation précédent
    projectCarouselPrev.addEventListener('click', () => {
      goToSlide(currentSlide - 1)
    })

    // Navigation suivant
    projectCarouselNext.addEventListener('click', () => {
      goToSlide(currentSlide + 1)
    })

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
      // Vérifier si on est dans la section projet
      const projectSection = document.getElementById('projet')
      if (!projectSection) return

      const rect = projectSection.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0

      if (isInView) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goToSlide(currentSlide - 1)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goToSlide(currentSlide + 1)
        }
      }
    })

    // Initialisation
    createIndicators()

    // Ajuster la hauteur au chargement initial
    window.addEventListener('load', () => {
      adjustWrapperHeight()
    })

    // Ajuster la hauteur au redimensionnement de la fenêtre
    let resizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        adjustWrapperHeight()
      }, 150)
    })

    goToSlide(0)

    // Navigation tactile (swipe) pour mobile
    let touchStartX = 0
    let touchEndX = 0

    projectCarouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX
    })

    projectCarouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    })

    function handleSwipe() {
      const swipeThreshold = 50
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe gauche - slide suivant
          goToSlide(currentSlide + 1)
        } else {
          // Swipe droite - slide précédent
          goToSlide(currentSlide - 1)
        }
      }
    }
  }
}
