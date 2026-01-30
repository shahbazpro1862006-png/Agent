import { defineStore } from 'pinia'
import { Notify } from 'quasar'

type AuthSession = {
  token: string
  email: string
  agentId: string
  name: string
}

const LS_KEY = 'clazino_auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null as AuthSession | null
  }),
  getters: {
    isAuthed: (s) => !!s.session
  },
  actions: {
    load() {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      try { this.session = JSON.parse(raw) } catch { /* ignore */ }
    },
    login(email: string, _password: string) {
      // Mock auth
      this.session = {
        token: 'mock-token-' + Math.random().toString(16).slice(2),
        email,
        agentId: 'AG-1024',
        name: 'Agent'
      }
      localStorage.setItem(LS_KEY, JSON.stringify(this.session))
      Notify.create({ type: 'positive', message: 'Signed in successfully.' })
    },
    logout() {
      this.session = null
      localStorage.removeItem(LS_KEY)
      Notify.create({ type: 'info', message: 'Signed out.' })
    }
  }
})
