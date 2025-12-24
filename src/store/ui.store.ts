import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  selectedBatimentId: string | null
  selectedNiveauId: string | null
  validationPanelOpen: boolean

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  selectBatiment: (id: string | null) => void
  selectNiveau: (id: string | null) => void
  toggleValidationPanel: () => void
  setValidationPanelOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  selectedBatimentId: null,
  selectedNiveauId: null,
  validationPanelOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  selectBatiment: (id) => set({ selectedBatimentId: id }),
  selectNiveau: (id) => set({ selectedNiveauId: id }),
  toggleValidationPanel: () =>
    set((state) => ({ validationPanelOpen: !state.validationPanelOpen })),
  setValidationPanelOpen: (open) => set({ validationPanelOpen: open }),
}))
