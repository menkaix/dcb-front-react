import { FormeBatiment } from '../types/wizard.types'

export const FORME_BATIMENT_LABELS: Record<FormeBatiment, string> = {
  I: 'Forme I (Simple rectangle)',
  L: 'Forme L (Équerre)',
  T: 'Forme T',
  U: 'Forme U (Fer à cheval)',
  O: 'Forme O (Carré/Rectangle fermé)',
  RECTANGULAIRE: 'Rectangulaire classique',
  CARRE: 'Carré',
  PERSONNALISE: 'Forme personnalisée',
}

export const FORME_BATIMENT_DESCRIPTIONS: Record<FormeBatiment, string> = {
  I: 'Un bâtiment simple de forme rectangulaire allongée',
  L: 'Deux ailes perpendiculaires formant un L',
  T: 'Une aile principale avec une aile perpendiculaire au centre',
  U: 'Trois ailes formant un U ouvert',
  O: 'Forme fermée avec cour intérieure',
  RECTANGULAIRE: 'Forme rectangulaire classique',
  CARRE: 'Forme carrée',
  PERSONNALISE: 'Définir une forme personnalisée',
}
