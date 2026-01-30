<template>
  <q-item clickable :to="to" active-class="clz-nav-active" class="clz-nav-item" exact>
    <q-item-section avatar>
      <q-icon :name="icon" class="clz-nav-icon" />
    </q-item-section>
    <q-item-section>{{ label }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{ to: string; icon: string; label: string }>()
</script>
