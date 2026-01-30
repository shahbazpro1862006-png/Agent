<template>
  <div class="column q-gutter-md">
    <q-card bordered>
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-semibold">Player {{ playerId }}</div>
          <div class="text-caption text-grey-6">Read-only financial operations • Automated credit only</div>
        </div>
        <q-btn flat icon="arrow_back" label="Back" @click="$router.back()" />
      </q-card-section>
    </q-card>

    <q-card bordered>
      <q-tabs v-model="tab" dense align="left">
        <q-tab name="overview" label="Overview" />
        <q-tab name="transactions" label="Transactions" />
        <q-tab name="activity" label="Activity" />
        <q-tab name="payouts" label="Payouts" />
        <q-tab name="limits" label="Limits" />
        <q-tab name="notes" label="Notes" />
        <q-tab name="audit" label="Audit Log" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="overview">
          <div class="text-body2">Player overview content (mock).</div>
        </q-tab-panel>
        <q-tab-panel name="transactions">
          <div class="text-body2">Transactions list (mock).</div>
        </q-tab-panel>
        <q-tab-panel name="activity">
          <div class="text-body2">Activity feed (mock).</div>
        </q-tab-panel>
        <q-tab-panel name="payouts">
          <div class="text-body2">Payouts (read-only) (mock).</div>
        </q-tab-panel>
        <q-tab-panel name="limits">
          <div class="text-body2">Limits (mock).</div>
        </q-tab-panel>
        <q-tab-panel name="notes">
          <q-input v-model="notes" type="textarea" outlined label="Internal notes (agent-only)" />
          <q-btn class="q-mt-md" color="primary" label="Save note" @click="saveNote" />
        </q-tab-panel>
        <q-tab-panel name="audit">
          <q-list dense>
            <q-item v-for="a in audit" :key="a.id">
              <q-item-section>
                <q-item-label>{{ a.title }}</q-item-label>
                <q-item-label caption>{{ a.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Notify } from 'quasar'

defineProps<{ playerId: string }>()
const tab = ref('overview')
const notes = ref('')
const audit = ref([
  { id: 1, title: 'Viewed player profile', time: 'Just now' }
])

function saveNote() {
  audit.value.unshift({ id: Date.now(), title: 'Updated player notes', time: new Date().toLocaleString() })
  Notify.create({ type: 'positive', message: 'Note saved.' })
}
</script>
