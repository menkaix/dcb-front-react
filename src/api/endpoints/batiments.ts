import { apiClient } from '../client'
import type {
  Batiment,
  BatimentCreateRequest,
  BatimentFilters,
  Page,
  Pagination,
  ValidationResponse,
} from '../types/batiment.types'

export const batimentsApi = {
  /**
   * Initialiser un nouveau bâtiment vide
   * POST /api/batiments/init
   */
  init: async (request: BatimentCreateRequest): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>('/batiments/init', request)
    return data
  },

  /**
   * Récupérer la liste des bâtiments avec pagination
   * GET /api/batiments
   */
  getAll: async (
    filters: BatimentFilters = {},
    pagination: Pagination = {}
  ): Promise<Page<Batiment>> => {
    const { data } = await apiClient.get<Page<Batiment>>('/batiments', {
      params: {
        ...filters,
        page: pagination.page ?? 0,
        size: pagination.size ?? 20,
        sort: pagination.sort,
      },
    })
    return data
  },

  /**
   * Récupérer tous les bâtiments sans pagination
   * GET /api/batiments/all
   */
  getAllNoPagination: async (): Promise<Batiment[]> => {
    const { data } = await apiClient.get<Batiment[]>('/batiments/all')
    return data
  },

  /**
   * Récupérer un bâtiment par son ID
   * GET /api/batiments/{id}
   */
  getById: async (id: string): Promise<Batiment> => {
    const { data } = await apiClient.get<Batiment>(`/batiments/${id}`)
    return data
  },

  /**
   * Créer un nouveau bâtiment complet
   * POST /api/batiments
   */
  create: async (batiment: Partial<Batiment>, validate = false): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>('/batiments', batiment, {
      params: { validate },
    })
    return data
  },

  /**
   * Mettre à jour un bâtiment
   * PUT /api/batiments/{id}
   */
  update: async (
    id: string,
    batiment: Partial<Batiment>,
    validate = false
  ): Promise<Batiment> => {
    const { data } = await apiClient.put<Batiment>(`/batiments/${id}`, batiment, {
      params: { validate },
    })
    return data
  },

  /**
   * Supprimer un bâtiment
   * DELETE /api/batiments/{id}
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/batiments/${id}`)
  },

  /**
   * Dupliquer un bâtiment
   * POST /api/batiments/{id}/duplicate
   */
  duplicate: async (id: string, nouveauNom?: string): Promise<Batiment> => {
    const { data } = await apiClient.post<Batiment>(`/batiments/${id}/duplicate`, {
      nouveauNom,
    })
    return data
  },

  /**
   * Valider un bâtiment existant
   * GET /api/batiments/{id}/validate
   */
  validate: async (id: string): Promise<ValidationResponse> => {
    const { data } = await apiClient.get<ValidationResponse>(`/batiments/${id}/validate`)
    return data
  },
}
