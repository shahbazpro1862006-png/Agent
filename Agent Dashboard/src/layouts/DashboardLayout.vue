<template>
  <q-layout view="hHh LpR lFf" class="clz-layout">
    <q-header bordered class="clz-header">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title class="text-weight-semibold">{{ pageTitle }}</q-toolbar-title>

        <q-space />
        <ThemeToggle />
        <q-btn flat round dense icon="account_circle">
          <q-menu>
            <q-list style="min-width: 180px">
              <q-item clickable v-close-popup>
                <q-item-section>
                  <div class="text-weight-medium">{{ auth.session?.email }}</div>
                  <div class="text-caption text-grey-6">Agent</div>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar><q-icon name="logout" /></q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered :width="280" class="clz-drawer">
      <div class="q-pa-md">
        <router-link to="/dashboard/home" class="text-decoration-none">
          <Logo :showText="true" />
        </router-link>
      </div>

      <q-list padding>
        <NavItem to="/dashboard/home" icon="dashboard" label="Home" />
        <NavItem to="/dashboard/wallet" icon="account_balance_wallet" label="Wallet" />
        <NavItem to="/dashboard/players" icon="groups" label="Players" />
        <NavItem to="/dashboard/invites" icon="mail" label="Invites" />
        <NavItem to="/dashboard/payouts" icon="payments" label="Payouts" />
        <NavItem to="/dashboard/commissions" icon="receipt_long" label="Commissions" />
        <q-separator class="q-my-sm" />
        <NavItem to="/dashboard/clan/goals" icon="emoji_events" label="Clan Goals" />
        <NavItem to="/dashboard/clan/wars" icon="sports_esports" label="Clan Wars" />
        <q-separator class="q-my-sm" />
        <NavItem to="/dashboard/settings" icon="settings" label="Settings" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="clz-page q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ThemeToggle from '../components/ThemeToggle.vue'
import Logo from '../components/Logo.vue'
import NavItem from '../components/NavItem.vue'

const auth = useAuthStore()
auth.load()
const router = useRouter()
const route = useRoute()

const drawer = ref(true)

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    home: 'Home',
    wallet: 'Wallet & Prefunding',
    players: 'Players',
    'player-detail': 'Player Details',
    invites: 'Invite Management',
    payouts: 'Payouts (Read-only)',
    commissions: 'Commissions & Statements',
    'statement-detail': 'Statement Detail',
    'clan-goals': 'Clan Goals & Rewards',
    'clan-wars': 'Clan Wars',
    'war-detail': 'War Detail',
    settings: 'Settings'
  }
  return map[String(route.name || '')] ?? 'Dashboard'
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
