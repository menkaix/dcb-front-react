import {
  TypeBatiment,
  StatutBatiment,
  TypeSol,
  TypeFondation,
  TypeMur,
  MateriauMur,
  OrientationMur,
  TypePiece,
  TypePlancher,
  TypeCharpente,
  FormeToit,
  TypeToiture,
  TypeSystemeElectrique,
  TypeProductionEauChaude,
  TypeGenerateurChauffage,
  TypeEnergie,
  TypeVentilation,
} from '@/api/types/batiment.types'

// Types de bâtiments
export const TYPE_BATIMENT_LABELS: Record<TypeBatiment, string> = {
  MAISON_INDIVIDUELLE: 'Maison Individuelle',
  IMMEUBLE: 'Immeuble',
  BATIMENT_AGRICOLE: 'Bâtiment Agricole',
  BATIMENT_INDUSTRIEL: 'Bâtiment Industriel',
}

// Statuts
export const STATUT_LABELS: Record<StatutBatiment, string> = {
  BROUILLON: 'Brouillon',
  EN_COURS: 'En cours',
  VALIDE: 'Validé',
  ARCHIVE: 'Archivé',
}

export const STATUT_COLORS: Record<StatutBatiment, string> = {
  BROUILLON: 'default',
  EN_COURS: 'processing',
  VALIDE: 'success',
  ARCHIVE: 'warning',
}

// Types de sol
export const TYPE_SOL_LABELS: Record<TypeSol, string> = {
  ARGILE: 'Argile',
  SABLE: 'Sable',
  ROCHE: 'Roche',
  LIMON: 'Limon',
  GRAVIER: 'Gravier',
  TOURBE: 'Tourbe',
  REMBLAI: 'Remblai',
  MIXTE: 'Mixte',
}

// Types de fondations
export const TYPE_FONDATION_LABELS: Record<TypeFondation, string> = {
  SEMELLES_FILANTES: 'Semelles filantes',
  RADIER_GENERAL: 'Radier général',
  PIEUX_FORES: 'Pieux forés',
  PIEUX_BATTUS: 'Pieux battus',
  MICROPIEUX: 'Micropieux',
}

// Types de murs
export const TYPE_MUR_LABELS: Record<TypeMur, string> = {
  MUR_PORTEUR: 'Mur porteur',
  MUR_REFEND: 'Mur refend',
  CLOISON: 'Cloison',
}

// Matériaux de murs
export const MATERIAU_MUR_LABELS: Record<MateriauMur, string> = {
  PARPAINGS: 'Parpaings',
  BRIQUE_MONOMUR: 'Brique monomur',
  BETON_BANCHE: 'Béton banché',
  OSSATURE_BOIS: 'Ossature bois',
}

// Orientations
export const ORIENTATION_MUR_LABELS: Record<OrientationMur, string> = {
  NORD: 'Nord',
  SUD: 'Sud',
  EST: 'Est',
  OUEST: 'Ouest',
}

// Types de pièces
export const TYPE_PIECE_LABELS: Record<TypePiece, string> = {
  SALON: 'Salon',
  CUISINE: 'Cuisine',
  CHAMBRE: 'Chambre',
  SALLE_DE_BAIN: 'Salle de bain',
  WC: 'WC',
  COULOIR: 'Couloir',
  GRENIER: 'Grenier',
}

// Types de planchers
export const TYPE_PLANCHER_LABELS: Record<TypePlancher, string> = {
  HOURDIS_POUTRELLES: 'Hourdis poutrelles',
  DALLE_PLEINE_BETON: 'Dalle pleine béton',
  PLANCHER_BOIS: 'Plancher bois',
  CLT: 'CLT',
}

// Types de charpente
export const TYPE_CHARPENTE_LABELS: Record<TypeCharpente, string> = {
  TRADITIONNELLE: 'Traditionnelle',
  FERMETTES_INDUSTRIELLES: 'Fermettes industrielles',
  METALLIQUE: 'Métallique',
}

// Formes de toit
export const FORME_TOIT_LABELS: Record<FormeToit, string> = {
  MONO_PENTE: 'Mono-pente',
  DEUX_PENTES: 'Deux pentes',
  QUATRE_PENTES: 'Quatre pentes',
}

// Types de toiture
export const TYPE_TOITURE_LABELS: Record<TypeToiture, string> = {
  TUILES_TERRE_CUITE: 'Tuiles terre cuite',
  ARDOISES_NATURELLES: 'Ardoises naturelles',
  ZINC: 'Zinc',
  BAC_ACIER: 'Bac acier',
  SHINGLE: 'Shingle',
  VEGETALISEE: 'Végétalisée',
  EPDM: 'EPDM',
}

// Types de systèmes électriques
export const TYPE_SYSTEME_ELECTRIQUE_LABELS: Record<TypeSystemeElectrique, string> = {
  MONOPHASE: 'Monophasé',
  TRIPHASE: 'Triphasé',
}

// Types de production d'eau chaude
export const TYPE_PRODUCTION_EAU_CHAUDE_LABELS: Record<TypeProductionEauChaude, string> = {
  CHAUFFE_EAU_ELECTRIQUE: 'Chauffe-eau électrique',
  CHAUFFE_EAU_GAZ: 'Chauffe-eau gaz',
  BALLON_THERMODYNAMIQUE: 'Ballon thermodynamique',
}

// Types de générateurs de chauffage
export const TYPE_GENERATEUR_CHAUFFAGE_LABELS: Record<TypeGenerateurChauffage, string> = {
  CHAUDIERE_GAZ: 'Chaudière gaz',
  CHAUDIERE_FIOUL: 'Chaudière fioul',
  POMPE_A_CHALEUR: 'Pompe à chaleur',
  POELE_BOIS: 'Poêle bois',
}

// Types d'énergie
export const TYPE_ENERGIE_LABELS: Record<TypeEnergie, string> = {
  GAZ: 'Gaz',
  FIOUL: 'Fioul',
  ELECTRICITE: 'Électricité',
  BOIS: 'Bois',
}

// Types de ventilation
export const TYPE_VENTILATION_LABELS: Record<TypeVentilation, string> = {
  VMC_SIMPLE_FLUX: 'VMC simple flux',
  VMC_DOUBLE_FLUX: 'VMC double flux',
  VENTILATION_NATURELLE: 'Ventilation naturelle',
}
