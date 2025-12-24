// Enums
export enum TypeBatiment {
  MAISON_INDIVIDUELLE = 'MAISON_INDIVIDUELLE',
  IMMEUBLE = 'IMMEUBLE',
  BATIMENT_AGRICOLE = 'BATIMENT_AGRICOLE',
  BATIMENT_INDUSTRIEL = 'BATIMENT_INDUSTRIEL',
}

export enum StatutBatiment {
  BROUILLON = 'BROUILLON',
  EN_COURS = 'EN_COURS',
  VALIDE = 'VALIDE',
  ARCHIVE = 'ARCHIVE',
}

export enum TypeSol {
  ARGILE = 'ARGILE',
  SABLE = 'SABLE',
  ROCHE = 'ROCHE',
  LIMON = 'LIMON',
  GRAVIER = 'GRAVIER',
  TOURBE = 'TOURBE',
  REMBLAI = 'REMBLAI',
  MIXTE = 'MIXTE',
}

export enum TypeFondation {
  SEMELLES_FILANTES = 'SEMELLES_FILANTES',
  RADIER_GENERAL = 'RADIER_GENERAL',
  PIEUX_FORES = 'PIEUX_FORES',
  PIEUX_BATTUS = 'PIEUX_BATTUS',
  MICROPIEUX = 'MICROPIEUX',
}

export enum TypeMur {
  MUR_PORTEUR = 'MUR_PORTEUR',
  MUR_REFEND = 'MUR_REFEND',
  CLOISON = 'CLOISON',
}

export enum MateriauMur {
  PARPAINGS = 'PARPAINGS',
  BRIQUE_MONOMUR = 'BRIQUE_MONOMUR',
  BETON_BANCHE = 'BETON_BANCHE',
  OSSATURE_BOIS = 'OSSATURE_BOIS',
}

export enum OrientationMur {
  NORD = 'NORD',
  SUD = 'SUD',
  EST = 'EST',
  OUEST = 'OUEST',
}

export enum TypePiece {
  SALON = 'SALON',
  CUISINE = 'CUISINE',
  CHAMBRE = 'CHAMBRE',
  SALLE_DE_BAIN = 'SALLE_DE_BAIN',
  WC = 'WC',
  COULOIR = 'COULOIR',
  GRENIER = 'GRENIER',
}

export enum TypePlancher {
  HOURDIS_POUTRELLES = 'HOURDIS_POUTRELLES',
  DALLE_PLEINE_BETON = 'DALLE_PLEINE_BETON',
  PLANCHER_BOIS = 'PLANCHER_BOIS',
  CLT = 'CLT',
}

export enum TypeCharpente {
  TRADITIONNELLE = 'TRADITIONNELLE',
  FERMETTES_INDUSTRIELLES = 'FERMETTES_INDUSTRIELLES',
  METALLIQUE = 'METALLIQUE',
}

export enum FormeToit {
  MONO_PENTE = 'MONO_PENTE',
  DEUX_PENTES = 'DEUX_PENTES',
  QUATRE_PENTES = 'QUATRE_PENTES',
}

export enum TypeToiture {
  TUILES_TERRE_CUITE = 'TUILES_TERRE_CUITE',
  ARDOISES_NATURELLES = 'ARDOISES_NATURELLES',
  ZINC = 'ZINC',
  BAC_ACIER = 'BAC_ACIER',
  SHINGLE = 'SHINGLE',
  VEGETALISEE = 'VEGETALISEE',
  EPDM = 'EPDM',
}

export enum TypeSystemeElectrique {
  MONOPHASE = 'MONOPHASE',
  TRIPHASE = 'TRIPHASE',
}

export enum TypeProductionEauChaude {
  CHAUFFE_EAU_ELECTRIQUE = 'CHAUFFE_EAU_ELECTRIQUE',
  CHAUFFE_EAU_GAZ = 'CHAUFFE_EAU_GAZ',
  BALLON_THERMODYNAMIQUE = 'BALLON_THERMODYNAMIQUE',
}

export enum TypeGenerateurChauffage {
  CHAUDIERE_GAZ = 'CHAUDIERE_GAZ',
  CHAUDIERE_FIOUL = 'CHAUDIERE_FIOUL',
  POMPE_A_CHALEUR = 'POMPE_A_CHALEUR',
  POELE_BOIS = 'POELE_BOIS',
}

export enum TypeEnergie {
  GAZ = 'GAZ',
  FIOUL = 'FIOUL',
  ELECTRICITE = 'ELECTRICITE',
  BOIS = 'BOIS',
}

export enum TypeVentilation {
  VMC_SIMPLE_FLUX = 'VMC_SIMPLE_FLUX',
  VMC_DOUBLE_FLUX = 'VMC_DOUBLE_FLUX',
  VENTILATION_NATURELLE = 'VENTILATION_NATURELLE',
}

// Interfaces pour les structures de données

export interface Point3D {
  x: number
  y: number
  z?: number
}

export interface Terrain {
  surface: number
  numeroParcellesCadastrales?: string
  contour?: Point3D[]
  typeSol?: TypeSol
  portanceSol?: number
  profondeurNappePhréatique?: number
  presenceArgile?: boolean
  pente?: number
  altitude?: number
}

export interface Fondations {
  typeFondation: TypeFondation
  profondeur: number
  semelles?: any
  longrines?: any
  radier?: any
  pieux?: any
  drainage?: any
  beton?: any
  armatures?: any
}

export interface Mur {
  id: string
  nom?: string
  longueur: number
  hauteur: number
  epaisseur: number
  type: TypeMur
  materiau?: MateriauMur
  orientation?: OrientationMur
  surface?: number
  materiauxPrincipaux?: any
  chargesPermanentes?: any
  chargesExploitation?: any
  isolations?: any
  porteur?: boolean
  pointDebut?: any
  pointFin?: any
  finitionInterieure?: any
  finitionExterieure?: any
  structureParpaings?: any
  structureBrique?: any
  structureBeton?: any
  structureBois?: any
  chainages?: any
  linteaux?: any
  dimensions?: any
}

export interface Ouverture {
  id: string
  nom: string
  type: 'FENETRE' | 'PORTE' | 'PORTE_FENETRE'
  largeur: number
  hauteur: number
  idMur: string
}

export interface Piece {
  id: string
  nom: string
  type: TypePiece
  surface: number
  hauteurSousPlafond?: number
}

export interface Plancher {
  id?: string
  type: TypePlancher
  surface?: number
  epaisseur?: number
}

export interface Tremie {
  id: string
  nom: string
  type: 'ESCALIER' | 'TECHNIQUE'
  surface: number
}

export interface Niveau {
  id: string
  nom: string
  numero: number
  altitude: number
  altitudePlancher?: number
  hauteurSousPlafond: number
  surface?: number
  pieces?: Piece[]
  murs?: Mur[]
  plancher?: Plancher
  tremies?: Tremie[]
}

export interface Charpente {
  type: TypeCharpente
  materiau?: string
  structureTradition?: any
  structureFermettes?: any
  structureMetallique?: any
  isolation?: any
}

export interface Toiture {
  type: TypeToiture
  forme?: FormeToit
  pente: number
  surfaceTotale?: number
  couverture?: any
  zinguerie?: any
  ecranSousToiture?: any
  surfaceEcran?: number
  isolation?: any
  ouvertures?: any
  altitudeFaitage?: number
}

export interface TableauElectrique {
  puissance: number
  nombreCircuits: number
  type: TypeSystemeElectrique
}

export interface SystemeElectrique {
  puissanceAbonnement: number
  tableauElectrique?: TableauElectrique
}

export interface ProductionEauChaude {
  type: TypeProductionEauChaude
  capacite: number
  puissance?: number
}

export interface SystemePlomberie {
  reseauDistribution?: any
  reseauEvacuation?: any
  productionEauChaude?: ProductionEauChaude
}

export interface GenerateurChauffage {
  type: TypeGenerateurChauffage
  puissance: number
  energie: TypeEnergie
  rendement?: number
}

export interface SystemeChauffage {
  type?: string
  generateur?: GenerateurChauffage
}

export interface SystemeVentilation {
  type: TypeVentilation
}

// Interface principale Batiment
export interface Batiment {
  id: string
  nom: string
  type: TypeBatiment
  adresse?: string
  dateCreation?: string
  dateModification?: string
  statut: StatutBatiment
  terrain?: Terrain
  fondations?: Fondations
  niveaux?: Niveau[]
  charpente?: Charpente
  toiture?: Toiture
  systemeElectrique?: SystemeElectrique
  systemePlomberie?: SystemePlomberie
  systemeChauffage?: SystemeChauffage
  systemeVentilation?: SystemeVentilation
}

// Types pour les requêtes et réponses

export interface BatimentCreateRequest {
  nom: string
  type: TypeBatiment
}

export interface BatimentSummary {
  id: string
  nom: string
  type: TypeBatiment
  statut: StatutBatiment
  dateCreation: string
  dateModification: string
  surface?: number
  niveauCount?: number
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface ValidationError {
  ruleName: string
  field: string
  message: string
  severity: 'ERROR' | 'WARNING' | 'INFO'
}

export interface ValidationResponse {
  valid: boolean
  errorCount?: number
  warningCount?: number
  errors?: ValidationError[]
  warnings?: ValidationError[]
}

export interface ApiError {
  code: string
  message: string
  timestamp: string
  path: string
}

// Types pour les filtres et pagination
export interface BatimentFilters {
  nom?: string
  type?: TypeBatiment
  statut?: StatutBatiment
}

export interface Pagination {
  page?: number
  size?: number
  sort?: string
}
