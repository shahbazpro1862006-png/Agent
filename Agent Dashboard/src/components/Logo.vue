<template>
  <div class="row items-center no-wrap q-gutter-sm">
    <img :src="logoUrl" alt="Clazino" style="height: 28px; width: auto;" />
    <div v-if="showText" class="text-subtitle1 text-weight-semibold">Clazino</div>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '../assets/clazino-logo.png'
defineProps<{ showText?: boolean }>()
</script>
