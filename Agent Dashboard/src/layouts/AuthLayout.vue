<template>
  <q-layout view="lHh Lpr lFf" class="clz-layout">
    <q-page-container>
      <q-page class="clz-auth-bg flex flex-center q-pa-lg">
        <div class="absolute-top-right q-pa-md">
          <ThemeToggle />
        </div>

        <div style="width: 420px; max-width: 92vw;">
          <div class="text-center q-mb-lg">
            <Logo :showText="false" />
          </div>
          <q-card bordered class="clz-auth-card q-pa-lg">
            <router-view />
          </q-card>
          <div class="text-caption text-grey-6 text-center q-mt-md">
            Invite-only agent access • Money systems require strict controls
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ThemeToggle from '../components/ThemeToggle.vue'
import Logo from '../components/Logo.vue'
</script>
