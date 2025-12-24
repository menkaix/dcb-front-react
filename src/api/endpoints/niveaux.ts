import { apiClient } from '../client'
import type { Batiment, Niveau, Piece, Mur, Ouverture } from '../types/batiment.types'

export const niveauxApi = {
  /**
   * Ajouter un niveau à un bâtiment
   * POST /api/batiments/{id}/niveaux
   */
  add: async (batimentId: string, niveau: Partial<Niveau>): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>(
      `/batiments/${batimentId}/niveaux`,
      niveau
    )
    return data
  },

  /**
   * Mettre à jour un niveau
   * PUT /api/batiments/{id}/niveaux/{niveauId}
   */
  update: async (
    batimentId: string,
    niveauId: string,
    niveau: Partial<Niveau>
  ): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}`,
      niveau
    )
    return data
  },

  /**
   * Supprimer un niveau
   * DELETE /api/batiments/{id}/niveaux/{niveauId}
   */
  delete: async (batimentId: string, niveauId: string): Promise<Batiment> => {
    const { data } = await apiClient.delete<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}`
    )
    return data
  },

  /**
   * Dupliquer un niveau avec toutes ses pièces
   * POST /api/batiments/{id}/niveaux/{niveauId}/duplicate
   */
  duplicate: async (batimentId: string, niveauId: string): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/duplicate`
    )
    return data
  },

  /**
   * Ajouter une pièce à un niveau
   * POST /api/batiments/{id}/niveaux/{niveauId}/pieces
   */
  addPiece: async (
    batimentId: string,
    niveauId: string,
    piece: Partial<Piece>
  ): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/pieces`,
      piece
    )
    return data
  },

  /**
   * Mettre à jour une pièce
   * PUT /api/batiments/{id}/niveaux/{niveauId}/pieces/{pieceId}
   */
  updatePiece: async (
    batimentId: string,
    niveauId: string,
    pieceId: string,
    piece: Partial<Piece>
  ): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/pieces/${pieceId}`,
      piece
    )
    return data
  },

  /**
   * Supprimer une pièce
   * DELETE /api/batiments/{id}/niveaux/{niveauId}/pieces/{pieceId}
   */
  deletePiece: async (
    batimentId: string,
    niveauId: string,
    pieceId: string
  ): Promise<Batiment> => {
    const { data } = await apiClient.delete<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/pieces/${pieceId}`
    )
    return data
  },

  /**
   * Ajouter un mur à un niveau
   * POST /api/batiments/{id}/niveaux/{niveauId}/murs
   */
  addMur: async (
    batimentId: string,
    niveauId: string,
    mur: Partial<Mur>
  ): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/murs`,
      mur
    )
    return data
  },

  /**
   * Mettre à jour un mur
   * PUT /api/batiments/{id}/niveaux/{niveauId}/murs/{murId}
   */
  updateMur: async (
    batimentId: string,
    niveauId: string,
    murId: string,
    mur: Partial<Mur>
  ): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/murs/${murId}`,
      mur
    )
    return data
  },

  /**
   * Supprimer un mur
   * DELETE /api/batiments/{id}/niveaux/{niveauId}/murs/{murId}
   */
  deleteMur: async (
    batimentId: string,
    niveauId: string,
    murId: string
  ): Promise<Batiment> => {
    const { data } = await apiClient.delete<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/murs/${murId}`
    )
    return data
  },

  /**
   * Ajouter une ouverture à un mur
   * POST /api/batiments/{id}/niveaux/{niveauId}/murs/{murId}/ouvertures
   */
  addOuverture: async (
    batimentId: string,
    niveauId: string,
    murId: string,
    ouverture: Partial<Ouverture>
  ): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/murs/${murId}/ouvertures`,
      ouverture
    )
    return data
  },

  /**
   * Mettre à jour une ouverture
   * PUT /api/batiments/{id}/niveaux/{niveauId}/murs/{murId}/ouvertures/{ouvertureId}
   */
  updateOuverture: async (
    batimentId: string,
    niveauId: string,
    murId: string,
    ouvertureId: string,
    ouverture: Partial<Ouverture>
  ): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/murs/${murId}/ouvertures/${ouvertureId}`,
      ouverture
    )
    return data
  },

  /**
   * Supprimer une ouverture
   * DELETE /api/batiments/{id}/niveaux/{niveauId}/murs/{murId}/ouvertures/{ouvertureId}
   */
  deleteOuverture: async (
    batimentId: string,
    niveauId: string,
    murId: string,
    ouvertureId: string
  ): Promise<Batiment> => {
    const { data } = await apiClient.delete<Batiment>(
      `/batiments/${batimentId}/niveaux/${niveauId}/murs/${murId}/ouvertures/${ouvertureId}`
    )
    return data
  },
}
