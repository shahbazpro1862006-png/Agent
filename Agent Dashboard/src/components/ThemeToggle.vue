<template>
  <q-btn
    flat
    round
    dense
    :icon="icon"
    @click="toggle"
    aria-label="Toggle theme"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'

const theme = useThemeStore()
theme.init()

const icon = computed(() => (theme.mode === 'dark' ? 'light_mode' : 'dark_mode'))
function toggle() {
  theme.toggle()
}
</script>
