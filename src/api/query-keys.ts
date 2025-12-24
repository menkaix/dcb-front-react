import type { BatimentFilters, Pagination } from './types/batiment.types'

export const queryKeys = {
  batiments: {
    all: ['batiments'] as const,
    lists: () => [...queryKeys.batiments.all, 'list'] as const,
    list: (filters: BatimentFilters, pagination: Pagination) =>
      [...queryKeys.batiments.lists(), { filters, pagination }] as const,
    allNoPagination: () => [...queryKeys.batiments.all, 'no-pagination'] as const,
    details: () => [...queryKeys.batiments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.batiments.details(), id] as const,
    validation: (id: string) => [...queryKeys.batiments.detail(id), 'validation'] as const,
  },
  niveaux: {
    all: (batimentId: string) => ['batiments', batimentId, 'niveaux'] as const,
    detail: (batimentId: string, niveauId: string) =>
      [...queryKeys.niveaux.all(batimentId), niveauId] as const,
  },
  pieces: {
    all: (batimentId: string, niveauId: string) =>
      ['batiments', batimentId, 'niveaux', niveauId, 'pieces'] as const,
    detail: (batimentId: string, niveauId: string, pieceId: string) =>
      [...queryKeys.pieces.all(batimentId, niveauId), pieceId] as const,
  },
}
