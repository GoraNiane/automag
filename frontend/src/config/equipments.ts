export interface EquipmentCategory {
  id: string;
  name: string;
  icon: string;
  items: string[];
}

export const EQUIPMENTS_BY_CATEGORY: EquipmentCategory[] = [
  {
    id: 'security',
    name: 'Sécurité',
    icon: '🛡️',
    items: [
      'ABS',
      'ESP / contrôle électronique de stabilité',
      'Airbags frontaux',
      'Airbags latéraux',
      'Airbags rideaux',
      'Airbag genoux',
      'Aide au freinage d\'urgence',
      'Freinage automatique d\'urgence',
      'Détection des angles morts',
      'Alerte de franchissement de ligne',
      'Maintien dans la voie',
      'Régulateur de vitesse adaptatif',
      'Détection des panneaux de signalisation',
      'Caméra 360°',
      'Caméra de recul',
      'Radars de stationnement avant',
      'Radars de stationnement arrière',
      'Système de surveillance de la pression des pneus',
      'Aide au stationnement automatique'
    ]
  },
  {
    id: 'comfort',
    name: 'Confort',
    icon: '❄️',
    items: [
      'Climatisation manuelle',
      'Climatisation automatique',
      'Climatisation bi-zone',
      'Climatisation tri-zone',
      'Chauffage des sièges',
      'Ventilation des sièges',
      'Sièges électriques',
      'Siège conducteur à mémoire',
      'Volant chauffant',
      'Volant multifonction',
      'Démarrage sans clé',
      'Accès sans clé',
      'Ouverture électrique du coffre',
      'Hayon électrique',
      'Toit ouvrant',
      'Toit panoramique',
      'Vitres électriques',
      'Rétroviseurs électriques',
      'Rétroviseurs chauffants',
      'Rétroviseurs rabattables électriquement',
      'Sièges en cuir',
      'Sièges en similicuir',
      'Sièges avant réglables',
      'Accoudoir central'
    ]
  },
  {
    id: 'multimedia',
    name: 'Multimédia et Connectivité',
    icon: '📱',
    items: [
      'Écran tactile',
      'Apple CarPlay',
      'Android Auto',
      'Bluetooth',
      'USB',
      'USB-C',
      'Chargeur sans fil',
      'Navigation GPS',
      'Système audio premium',
      'Radio numérique DAB',
      'Commandes vocales',
      'Écran conducteur numérique',
      'Écran tête haute (HUD)',
      'Wi-Fi embarqué'
    ]
  },
  {
    id: 'lighting',
    name: 'Éclairage',
    icon: '💡',
    items: [
      'Phares LED',
      'Phares Matrix LED',
      'Phares automatiques',
      'Feux de route automatiques',
      'Feux de jour LED',
      'Feux arrière LED',
      'Antibrouillards',
      'Éclairage intérieur LED',
      'Éclairage d\'ambiance'
    ]
  },
  {
    id: 'driving',
    name: 'Conduite',
    icon: '⚙️',
    items: [
      'Régulateur de vitesse',
      'Mode Sport',
      'Mode Eco',
      'Mode Confort',
      'Sélecteur de modes de conduite',
      'Palettes au volant',
      'Boîte automatique',
      'Boîte manuelle',
      'Transmission intégrale (4x4 / AWD)',
      'Suspension pilotée'
    ]
  },
  {
    id: 'exterior',
    name: 'Extérieur',
    icon: '🚗',
    items: [
      'Jantes alliage',
      'Jantes sport',
      'Barres de toit',
      'Vitres teintées',
      'Peinture métallisée',
      'Peinture nacrée',
      'Attelage',
      'Becquet arrière',
      'Pack sport'
    ]
  },
  {
    id: 'interior',
    name: 'Intérieur',
    icon: '✨',
    items: [
      'Sellerie cuir',
      'Sellerie tissu',
      'Sellerie alcantara',
      'Volant cuir',
      'Volant sport',
      'Inserts décoratifs',
      'Banquette arrière rabattable',
      'Accoudoir arrière',
      'Porte-gobelets'
    ]
  }
];
