<template>
  <div class="column q-gutter-md">
    <q-card bordered>
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-semibold">Wallet & Prefunding</div>
          <div class="text-caption text-grey-6">USDT (TRC-20) only • No manual balance edits</div>
        </div>
        <q-btn color="primary" label="Deposit USDT" @click="openDeposit" />
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <div class="text-caption text-grey-6">Available</div>
          <div class="text-h6">{{ money(available) }}</div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-caption text-grey-6">Locked</div>
          <div class="text-h6">{{ money(locked) }}</div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-caption text-grey-6">Total</div>
          <div class="text-h6">{{ money(available + locked) }}</div>
        </div>
      </q-card-section>
    </q-card>

    <q-card bordered>
      <q-card-section>
        <div class="text-subtitle1 text-weight-semibold">Deposit Attempts</div>
        <div class="text-caption text-grey-6">Each attempt records your source wallet for dispute resolution.</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          flat
          :rows="rows"
          :columns="cols"
          row-key="id"
          :pagination="{ rowsPerPage: 8 }"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="statusColor(props.row.status)" :label="statusLabel(props.row.status)" />
            </q-td>
          </template>
          <template #body-cell-sourceVerified="props">
            <q-td :props="props">
              <q-badge :color="props.row.sourceVerified ? 'positive' : 'grey-6'" :label="props.row.sourceVerified ? 'Verified' : 'Manual'" />
            </q-td>
          </template>
        </q-table>
        <div v-if="rows.length===0" class="text-caption text-grey-6">No deposit attempts yet.</div>
      </q-card-section>
    </q-card>

    <!-- Deposit Dialog (keep existing layout; add source wallet identification at top) -->
    <q-dialog v-model="depositOpen">
      <q-card bordered style="width: 760px; max-width: 96vw;">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-weight-semibold">Deposit USDT (TRC-20)</div>
            <div class="text-caption text-grey-6">Identify your sending wallet before proceeding.</div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />

        <!-- Source wallet identification (NEW) -->
        <q-card-section>
          <div class="text-caption text-grey-6 q-mb-sm">Source wallet (required)</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-7">
              <q-input
                v-model="sourceWallet"
                outlined
                label="Your sending wallet address"
                :disable="sourceVerified"
                :rules="[v => !!v || 'Sending wallet address is required']"
              />
              <q-banner class="q-mt-sm" dense rounded>
                Send USDT only from this wallet. Deposits from other wallets may be delayed or rejected.
              </q-banner>
            </div>

            <div class="col-12 col-md-5">
              <q-btn
                outline
                color="primary"
                class="full-width"
                icon="link"
                label="Connect Coinductor Wallet"
                @click="connectWallet"
              />
              <div class="text-caption text-grey-6 q-mt-sm">
                Connect will auto-fill your address and mark it as verified.
              </div>
              <q-badge v-if="sourceWallet" class="q-mt-sm" :color="sourceVerified ? 'positive' : 'grey-6'">
                {{ sourceVerified ? 'Verified source wallet' : 'Manual source wallet' }}
              </q-badge>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Existing deposit instructions -->
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
              <div class="text-caption text-grey-6">Casino deposit address</div>
              <q-input v-model="casinoWallet" outlined readonly>
                <template #append>
                  <q-btn flat round dense icon="content_copy" @click="copy(casinoWallet)" />
                </template>
              </q-input>

              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-12 col-md-6">
                  <q-card bordered>
                    <q-card-section>
                      <div class="text-weight-medium">Pending deposits</div>
                      <div class="text-h6 q-mt-sm">{{ pendingCount }}</div>
                      <div class="text-caption text-grey-6">Waiting confirmations</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-6">
                  <q-card bordered>
                    <q-card-section>
                      <div class="text-weight-medium">Confirmed deposits</div>
                      <div class="text-h6 q-mt-sm">{{ confirmedCount }}</div>
                      <div class="text-caption text-grey-6">Completed</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <q-card bordered class="fit">
                <q-card-section>
                  <div class="text-weight-medium">QR</div>
                  <div class="text-caption text-grey-6">Mock QR placeholder</div>
                  <div class="q-mt-md flex flex-center" style="height: 160px;">
                    <div class="text-caption text-grey-6">[ QR ]</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="I have sent USDT"
            :disable="!canProceed"
            :loading="creating"
            @click="createDepositAttempt"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Notify, copyToClipboard } from 'quasar'
import { useAuthStore } from '../../stores/auth'
import { useWalletStore } from '../../stores/wallet'

const auth = useAuthStore()
auth.load()

const wallet = useWalletStore()
wallet.load()

const available = 180
const locked = 40

const depositOpen = ref(false)
const sourceWallet = ref('')
const sourceVerified = ref(false)
const creating = ref(false)

const casinoWallet = computed(() => wallet.casinoWallet)

const rows = computed(() => wallet.attempts)
const pendingCount = computed(() => wallet.attempts.filter(a => a.status === 'pending').length)
const confirmedCount = computed(() => wallet.attempts.filter(a => a.status === 'confirmed').length)

const cols = [
  { name: 'createdAt', label: 'Date', field: 'createdAt', align: 'left' },
  { name: 'amountUSDT', label: 'Amount', field: 'amountUSDT', align: 'left' },
  { name: 'sourceWallet', label: 'Source Wallet', field: 'sourceWallet', align: 'left' },
  { name: 'sourceVerified', label: 'Verification', field: 'sourceVerified', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
]

function money(v: number) {
  return `${v.toFixed(2)} USDT`
}

function statusLabel(s: string) {
  if (s === 'needs_review') return 'Needs manual review'
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function statusColor(s: string) {
  if (s === 'confirmed') return 'positive'
  if (s === 'pending') return 'warning'
  if (s === 'failed') return 'negative'
  return 'negative'
}

function openDeposit() {
  depositOpen.value = true
  sourceWallet.value = ''
  sourceVerified.value = false
}

async function copy(text: string) {
  await copyToClipboard(text)
  Notify.create({ type: 'positive', message: 'Copied to clipboard.' })
}

// Option 2: connect wallet (mock)
function connectWallet() {
  sourceWallet.value = 'TXk9...coinductor...wallet'
  sourceVerified.value = true
  Notify.create({ type: 'positive', message: 'Coinductor wallet connected.' })
}

const canProceed = computed(() => !!sourceWallet.value.trim())

async function createDepositAttempt() {
  if (!canProceed.value) {
    Notify.create({ type: 'negative', message: 'Please provide a sending wallet address.' })
    return
  }
  creating.value = true
  try {
    wallet.createAttempt({
      agentId: auth.session?.agentId ?? 'AG-UNKNOWN',
      sourceWallet: sourceWallet.value.trim(),
      sourceVerified: sourceVerified.value,
      casinoWallet: casinoWallet.value,
      amountUSDT: 50
    })
    depositOpen.value = false
  } finally {
    creating.value = false
  }
}
</script>
