import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { nanoid } from 'nanoid'

export type DepositStatus = 'pending' | 'confirmed' | 'failed' | 'needs_review'

export type DepositAttempt = {
  id: string
  createdAt: string
  agentId: string
  sourceWallet: string
  sourceVerified: boolean
  casinoWallet: string
  amountUSDT: number
  status: DepositStatus
}

const LS_KEY = 'clazino_wallet_deposits'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    casinoWallet: 'TQmB3xW9nQmQm...............',
    attempts: [] as DepositAttempt[]
  }),
  actions: {
    load() {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      try { this.attempts = JSON.parse(raw) } catch { /* ignore */ }
    },
    createAttempt(payload: Omit<DepositAttempt, 'id' | 'createdAt' | 'status'>) {
      const attempt: DepositAttempt = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        status: 'pending',
        ...payload
      }
      this.attempts = [attempt, ...this.attempts]
      localStorage.setItem(LS_KEY, JSON.stringify(this.attempts))
      Notify.create({ type: 'positive', message: 'Deposit initiated. Waiting for confirmation.' })
      return attempt
    },
    // Mock: confirm with a simulated mismatch flag
    confirmAttempt(id: string, arrivingWallet: string) {
      const idx = this.attempts.findIndex(a => a.id === id)
      if (idx === -1) return
      const a = this.attempts[idx]
      this.attempts[idx] = {
        ...a,
        status: arrivingWallet !== a.sourceWallet ? 'needs_review' : 'confirmed'
      }
      localStorage.setItem(LS_KEY, JSON.stringify(this.attempts))
    }
  }
})
