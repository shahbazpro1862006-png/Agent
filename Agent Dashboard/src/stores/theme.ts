import { defineStore } from 'pinia'
import { Dark } from 'quasar'

const LS_KEY = 'clazino_theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: (localStorage.getItem(LS_KEY) as 'light' | 'dark' | null) ?? 'dark'
  }),
  actions: {
    init() {
      const isDark = this.mode === 'dark'
      Dark.set(isDark)
    },
    toggle() {
      this.mode = this.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem(LS_KEY, this.mode)
      Dark.set(this.mode === 'dark')
    }
  }
})
