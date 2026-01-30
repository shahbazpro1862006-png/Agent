<template>
  <div>
    <div class="text-h6 text-weight-semibold">Enter Invitation Code</div>
    <div class="text-body2 text-grey-6 q-mt-xs">Use the invite code sent by Admin.</div>

    <q-form class="q-mt-md" @submit.prevent="onVerify">
      <q-input
        v-model="code"
        label="Invite code"
        outlined
        :error="!!error"
        :error-message="error"
        lazy-rules
        :rules="[v => !!v || 'Invite code is required', v => String(v).trim().length >= 6 || 'Invite code looks incomplete']"
      />
      <q-btn
        class="q-mt-md full-width"
        color="primary"
        label="Verify Code"
        type="submit"
        :loading="loading"
      />
    </q-form>

    <div class="text-caption q-mt-md">
      Already have an account?
      <router-link to="/login">Sign in</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useInviteStore } from '../../stores/invite'

const router = useRouter()
const invite = useInviteStore()
invite.load()

const code = ref(invite.meta?.code ?? '')
const loading = ref(false)
const error = ref('')

async function onVerify() {
  error.value = ''
  loading.value = true
  try {
    await invite.verify(code.value)
    router.push('/register')
  } catch (e: any) {
    error.value = e?.message ?? 'Unable to verify code.'
    Notify.create({ type: 'negative', message: error.value })
  } finally {
    loading.value = false
  }
}
</script>
