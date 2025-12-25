// Types pour l'assistant de configuration de bâtiment

export enum FormeBatiment {
  I = 'I',
  L = 'L',
  T = 'T',
  U = 'U',
  O = 'O',
  RECTANGULAIRE = 'RECTANGULAIRE',
  CARRE = 'CARRE',
  PERSONNALISE = 'PERSONNALISE',
}

export interface DimensionsBatiment {
  longueur?: number
  largeur?: number
  hauteur?: number
  nombreNiveaux?: number
  hauteurSousPlafond?: number
}

export interface ConfigurationToiture {
  forme?: string
  type?: string
  pente?: number
  surfaceTotale?: number
}

export interface ConfigurationFondations {
  type?: string
  profondeur?: number
}

export interface ConfigurationTerrain {
  surface?: number
  typeSol?: string
  altitude?: number
}

export interface ConfigurationSystemes {
  electrique?: {
    puissanceAbonnement?: number
    type?: string
  }
  chauffage?: {
    type?: string
    energie?: string
    puissance?: number
  }
  ventilation?: {
    type?: string
  }
  plomberie?: {
    typeProductionEauChaude?: string
    capacite?: number
  }
}

export interface WizardFormData {
  // Étape 1: Informations générales
  nom: string
  type: string
  adresse?: string
  forme: FormeBatiment

  // Étape 2: Dimensions
  dimensions: DimensionsBatiment

  // Étape 3: Terrain
  terrain: ConfigurationTerrain

  // Étape 4: Fondations
  fondations: ConfigurationFondations

  // Étape 5: Toiture
  toiture: ConfigurationToiture

  // Étape 6: Systèmes
  systemes: ConfigurationSystemes
}
