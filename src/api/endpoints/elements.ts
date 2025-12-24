import { apiClient } from '../client'
import type { Batiment, Terrain, Fondations, Charpente, Toiture } from '../types/batiment.types'

export const elementsApi = {
  /**
   * Définir/Mettre à jour le terrain d'un bâtiment
   * PUT /api/batiments/{id}/terrain
   */
  setTerrain: async (batimentId: string, terrain: Partial<Terrain>): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/terrain`,
      terrain
    )
    return data
  },

  /**
   * Supprimer le terrain d'un bâtiment
   * DELETE /api/batiments/{id}/terrain
   */
  deleteTerrain: async (batimentId: string): Promise<Batiment> => {
    const { data } = await apiClient.delete<Batiment>(`/batiments/${batimentId}/terrain`)
    return data
  },

  /**
   * Définir/Mettre à jour les fondations d'un bâtiment
   * PUT /api/batiments/{id}/fondations
   */
  setFondations: async (
    batimentId: string,
    fondations: Partial<Fondations>
  ): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/fondations`,
      fondations
    )
    return data
  },

  /**
   * Supprimer les fondations d'un bâtiment
   * DELETE /api/batiments/{id}/fondations
   */
  deleteFondations: async (batimentId: string): Promise<Batiment> => {
    const { data } = await apiClient.delete<Batiment>(
      `/batiments/${batimentId}/fondations`
    )
    return data
  },

  /**
   * Définir/Mettre à jour la charpente d'un bâtiment
   * PUT /api/batiments/{id}/charpente
   */
  setCharpente: async (
    batimentId: string,
    charpente: Partial<Charpente>
  ): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/charpente`,
      charpente
    )
    return data
  },

  /**
   * Définir/Mettre à jour la toiture d'un bâtiment
   * PUT /api/batiments/{id}/toiture
   */
  setToiture: async (batimentId: string, toiture: Partial<Toiture>): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(
      `/batiments/${batimentId}/toiture`,
      toiture
    )
    return data
  },
}
