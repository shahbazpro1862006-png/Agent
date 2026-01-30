<template>
  <div class="column q-gutter-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-semibold">Wallet Health</div>
            <div class="text-caption text-grey-6">Available / Locked / Total</div>
            <div class="row q-mt-md q-col-gutter-sm">
              <div class="col">
                <div class="text-caption text-grey-6">Available</div>
                <div class="text-h6">{{ money(available) }}</div>
              </div>
              <div class="col">
                <div class="text-caption text-grey-6">Locked</div>
                <div class="text-h6">{{ money(locked) }}</div>
              </div>
              <div class="col">
                <div class="text-caption text-grey-6">Total</div>
                <div class="text-h6">{{ money(total) }}</div>
              </div>
            </div>
            <q-banner v-if="available < 200" class="q-mt-md" dense rounded>
              Low balance warning. Add funds to avoid prefunding delays.
            </q-banner>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="Add Funds" to="/dashboard/wallet" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-semibold">Commission Snapshot</div>
            <div class="text-caption text-grey-6">Current cycle</div>
            <div class="q-mt-md">
              <div class="row items-center justify-between">
                <div class="text-caption text-grey-6">Earned</div>
                <div class="text-weight-medium">{{ money(earned) }}</div>
              </div>
              <div class="row items-center justify-between q-mt-xs">
                <div class="text-caption text-grey-6">Projected</div>
                <div class="text-weight-medium">{{ money(projected) }}</div>
              </div>
              <div class="row items-center justify-between q-mt-xs">
                <div class="text-caption text-grey-6">Tier</div>
                <div class="text-weight-medium">{{ tier }}</div>
              </div>
              <q-linear-progress class="q-mt-md" :value="tierProgress" rounded />
              <div class="text-caption text-grey-6 q-mt-xs">Next tier in {{ Math.round((1-tierProgress)*100) }}%</div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="View commissions" to="/dashboard/commissions" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-semibold">Alerts</div>
            <div class="text-caption text-grey-6">Actionable items</div>
            <q-list dense class="q-mt-sm">
              <q-item v-for="a in alerts" :key="a.id" clickable :to="a.to">
                <q-item-section avatar>
                  <q-icon :name="a.icon" :color="a.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ a.title }}</q-item-label>
                  <q-item-label caption>{{ a.desc }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-if="alerts.length===0" class="text-caption text-grey-6 q-mt-sm">No alerts.</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card bordered>
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-semibold">Quick Actions</div>
          <div class="text-caption text-grey-6">Fast navigation</div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn color="primary" label="Invite Player" to="/dashboard/invites" />
          <q-btn outline color="primary" label="View Players" to="/dashboard/players" />
          <q-btn outline color="primary" label="Clan Goals" to="/dashboard/clan/goals" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
const available = 180
const locked = 40
const total = available + locked

const earned = 320
const projected = 520
const tier = 'Silver'
const tierProgress = 0.64

const alerts = [
  { id: 1, icon: 'warning', color: 'warning', title: 'Low balance', desc: 'Top up to avoid delays', to: '/dashboard/wallet' },
  { id: 2, icon: 'hourglass_bottom', color: 'warning', title: 'Pending deposits', desc: '2 deposits pending', to: '/dashboard/wallet' }
]

function money(v: number) {
  return `${v.toFixed(2)} USDT`
}
</script>
