<template>
  <q-card bordered>
    <q-card-section class="row items-center justify-between">
      <div>
        <div class="text-subtitle1 text-weight-semibold">Players</div>
        <div class="text-caption text-grey-6">Manage only your clan players.</div>
      </div>
      <q-input dense outlined v-model="query" placeholder="Search players..." style="width: 260px;" />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-table
        flat
        :rows="filtered"
        :columns="cols"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        @row-click="(_, row) => go(row.id)"
      >
        <template #body-cell-risk="props">
          <q-td :props="props">
            <q-badge :color="props.row.risk === 'High' ? 'negative' : props.row.risk === 'Medium' ? 'warning' : 'positive'" :label="props.row.risk" />
          </q-td>
        </template>
      </q-table>
      <div v-if="filtered.length===0" class="text-caption text-grey-6">No players found.</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

const rows = ref([
  { id: 'PL-001', name: 'Ali Raza', kyc: 'Tier 1', balance: 120.5, risk: 'Low', lastActive: '2h ago' },
  { id: 'PL-002', name: 'Sara Khan', kyc: 'Tier 2', balance: 40.0, risk: 'Medium', lastActive: '1d ago' },
  { id: 'PL-003', name: 'John Doe', kyc: 'Tier 0', balance: 0.0, risk: 'High', lastActive: '7d ago' },
])

const cols = [
  { name: 'name', label: 'Player', field: 'name', align: 'left' },
  { name: 'kyc', label: 'KYC', field: 'kyc', align: 'left' },
  { name: 'balance', label: 'Balance', field: (r:any)=>`${r.balance.toFixed(2)} USDT`, align: 'left' },
  { name: 'risk', label: 'Risk', field: 'risk', align: 'left' },
  { name: 'lastActive', label: 'Last active', field: 'lastActive', align: 'left' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return rows.value
  return rows.value.filter(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
})

function go(id: string) {
  router.push(`/dashboard/players/${id}`)
}
</script>
