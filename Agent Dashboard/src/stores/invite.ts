import { defineStore } from 'pinia'
import { Notify } from 'quasar'

type InviteMeta = {
  code: string
  email?: string
  expiry?: string
  verifiedAt: string
}

const LS_KEY = 'clazino_invite'

export const useInviteStore = defineStore('invite', {
  state: () => ({
    verified: false,
    meta: null as InviteMeta | null
  }),
  getters: {
    isVerified: (s) => s.verified
  },
  actions: {
    load() {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        this.verified = !!parsed.verified
        this.meta = parsed.meta ?? null
      } catch { /* ignore */ }
    },
    async verify(code: string) {
      // Mock verification rules
      await new Promise((r) => setTimeout(r, 600))
      const trimmed = code.trim()
      if (!trimmed) throw new Error('Invite code is required.')
      if (trimmed.length < 6) throw new Error('Invite code looks incomplete.')
      if (trimmed.toLowerCase().startsWith('exp')) throw new Error('Invite expired. Request a new one from Admin.')
      if (trimmed.toLowerCase().startsWith('used')) throw new Error('Invite already used. Sign in instead.')
      this.verified = true
      this.meta = { code: trimmed, verifiedAt: new Date().toISOString() }
      localStorage.setItem(LS_KEY, JSON.stringify({ verified: this.verified, meta: this.meta }))
      Notify.create({ type: 'positive', message: 'Invite verified. Continue registration.' })
    },
    consume() {
      // mark used and clear gate
      this.verified = false
      this.meta = null
      localStorage.removeItem(LS_KEY)
    }
  }
})
