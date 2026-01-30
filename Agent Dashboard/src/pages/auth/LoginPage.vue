<template>
  <div>
    <div class="text-h6 text-weight-semibold">Sign in</div>
    <div class="text-body2 text-grey-6 q-mt-xs">Use your agent credentials to continue.</div>

    <q-form class="q-mt-md" @submit.prevent="onSubmit">
      <q-input v-model="email" label="Email" outlined type="email"
        :rules="[v=>!!v||'Required', v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))||'Enter a valid email']" />
      <q-input class="q-mt-md" v-model="password" label="Password" outlined :type="show ? 'text' : 'password'"
        :rules="[v=>!!v||'Required']">
        <template #append>
          <q-icon :name="show ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="show=!show" />
        </template>
      </q-input>

      <q-btn class="q-mt-md full-width" color="primary" label="Sign in" type="submit" :loading="loading" />

      <div class="text-caption q-mt-md">
        Need an invite? <router-link to="/invite">Enter invite code</router-link>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Notify } from 'quasar'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
auth.load()

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 400))
    // Mock credential check
    if (!email.value || !password.value) throw new Error('Email and password are required.')
    if (password.value.length < 4) throw new Error('Email or password is incorrect.')
    auth.login(email.value, password.value)
    const next = (route.query.next as string) || '/dashboard/home'
    router.push(next)
  } catch (e: any) {
    Notify.create({ type: 'negative', message: e?.message ?? 'Unable to sign in.' })
  } finally {
    loading.value = false
  }
}
</script>
