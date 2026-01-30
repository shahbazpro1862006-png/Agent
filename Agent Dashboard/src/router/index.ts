import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useInviteStore } from '../stores/invite'

import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

import InviteCodePage from '../pages/auth/InviteCodePage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import LoginPage from '../pages/auth/LoginPage.vue'

import HomePage from '../pages/dashboard/HomePage.vue'
import WalletPage from '../pages/dashboard/WalletPage.vue'
import PlayersPage from '../pages/dashboard/PlayersPage.vue'
import PlayerDetailPage from '../pages/dashboard/PlayerDetailPage.vue'
import InvitesPage from '../pages/dashboard/InvitesPage.vue'
import PayoutsPage from '../pages/dashboard/PayoutsPage.vue'
import CommissionsPage from '../pages/dashboard/CommissionsPage.vue'
import StatementDetailPage from '../pages/dashboard/StatementDetailPage.vue'
import ClanGoalsPage from '../pages/dashboard/ClanGoalsPage.vue'
import ClanWarsPage from '../pages/dashboard/ClanWarsPage.vue'
import WarDetailPage from '../pages/dashboard/WarDetailPage.vue'
import SettingsPage from '../pages/dashboard/SettingsPage.vue'

import NotFoundPage from '../pages/NotFoundPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/invite'
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'invite', name: 'invite', component: InviteCodePage },
      { path: 'register', name: 'register', component: RegisterPage, meta: { inviteRequired: true } },
      { path: 'login', name: 'login', component: LoginPage },
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { authRequired: true },
    children: [
      { path: '', redirect: '/dashboard/home' },
      { path: 'home', name: 'home', component: HomePage },
      { path: 'wallet', name: 'wallet', component: WalletPage },
      { path: 'players', name: 'players', component: PlayersPage },
      { path: 'players/:playerId', name: 'player-detail', component: PlayerDetailPage, props: true },
      { path: 'invites', name: 'invites', component: InvitesPage },
      { path: 'payouts', name: 'payouts', component: PayoutsPage },
      { path: 'commissions', name: 'commissions', component: CommissionsPage },
      { path: 'commissions/statements/:statementId', name: 'statement-detail', component: StatementDetailPage, props: true },
      { path: 'clan/goals', name: 'clan-goals', component: ClanGoalsPage },
      { path: 'clan/wars', name: 'clan-wars', component: ClanWarsPage },
      { path: 'clan/wars/:warId', name: 'war-detail', component: WarDetailPage, props: true },
      { path: 'settings', name: 'settings', component: SettingsPage },
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const invite = useInviteStore()
  auth.load()
  invite.load()

  if (to.meta.authRequired && !auth.isAuthed) {
    return { path: '/login', query: { next: to.fullPath } }
  }
  if (to.meta.inviteRequired && !invite.isVerified) {
    return { path: '/invite' }
  }
  return true
})

export default router
