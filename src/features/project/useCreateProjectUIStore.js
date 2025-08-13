import { create } from 'zustand'

export const useCreateProjectUIStore = create((set) => ({
  isCreatingNew: false,
  setIsCreatingNew: (val) => set({ isCreatingNew: val }),
}))
