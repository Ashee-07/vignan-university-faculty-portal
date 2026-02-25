
import { create } from 'zustand'

export const useAuth = create((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null })
}))
