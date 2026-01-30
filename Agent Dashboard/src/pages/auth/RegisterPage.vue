<template>
  <div>
    <div class="text-h6 text-weight-semibold">Create your agent account</div>
    <div class="text-body2 text-grey-6 q-mt-xs">
      Registration is invite-only. Your invite code will be consumed after sign-up.
    </div>

    <q-form class="q-mt-md" @submit.prevent="onSubmit">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input v-model="form.firstName" label="First name" outlined :rules="[v=>!!v||'Required', v=>String(v).length>=2||'Min 2 characters']" />
        </div>
        <div class="col-12 col-sm-6">
          <q-input v-model="form.lastName" label="Last name" outlined :rules="[v=>!!v||'Required', v=>String(v).length>=2||'Min 2 characters']" />
        </div>
      </div>

      <q-input class="q-mt-md" v-model="form.email" label="Email" outlined type="email"
        :rules="[v=>!!v||'Required', v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))||'Enter a valid email']" />

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-sm-4">
          <q-select
            v-model="form.countryCode"
            label="Country code"
            outlined
            :options="countryOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            :rules="[v=>!!v||'Required']"
            @update:model-value="onCountryCode"
          />
        </div>
        <div class="col-12 col-sm-8">
          <q-input
            v-model="form.phone"
            label="Phone number"
            outlined
            inputmode="numeric"
            :rules="[v=>!!v||'Required', v=>/^\d+$/.test(String(v))||'Digits only', v=>String(v).length>=7||'Too short']"
          />
        </div>
      </div>

      <q-input class="q-mt-md" v-model="form.country" label="Country" outlined readonly />

      <q-input class="q-mt-md" v-model="dobLabel" label="Date of birth" outlined readonly @click="dobOpen=true">
        <template #append>
          <q-icon name="event" class="cursor-pointer" @click="dobOpen=true" />
        </template>
      </q-input>

      <q-dialog v-model="dobOpen">
        <q-card style="min-width: 340px">
          <q-card-section class="text-weight-semibold">Select date of birth</q-card-section>
          <q-separator />
          <q-card-section>
            <q-date v-model="form.dob" mask="YYYY-MM-DD" :options="dobOptions" />
            <div v-if="dobError" class="text-negative text-caption q-mt-sm">{{ dobError }}</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat label="Close" v-close-popup />
            <q-btn color="primary" label="Confirm" @click="confirmDob" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-sm-6">
          <q-input v-model="form.password" label="Password" outlined :type="showPass ? 'text' : 'password'"
            :rules="[passwordRule]" >
            <template #append>
              <q-icon :name="showPass ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPass=!showPass" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input v-model="form.confirmPassword" label="Confirm password" outlined :type="showPass2 ? 'text' : 'password'"
            :rules="[v=>!!v||'Required', v=>v===form.password||'Passwords do not match']">
            <template #append>
              <q-icon :name="showPass2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPass2=!showPass2" />
            </template>
          </q-input>
        </div>
      </div>

      <q-checkbox class="q-mt-md" v-model="form.terms" label="I agree to the Terms and Privacy Policy" />
      <div v-if="termsError" class="text-negative text-caption q-mt-xs">{{ termsError }}</div>

      <q-banner v-if="notice" class="q-mt-md" rounded dense inline-actions>
        {{ notice }}
      </q-banner>

      <q-btn class="q-mt-md full-width" color="primary" label="Create account" type="submit" :loading="loading" />
    </q-form>

    <div class="text-caption q-mt-md">
      Already have an account? <router-link to="/login">Sign in</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import dayjs from 'dayjs'
import { useInviteStore } from '../../stores/invite'

const router = useRouter()
const invite = useInviteStore()
invite.load()

const loading = ref(false)
const showPass = ref(false)
const showPass2 = ref(false)
const dobOpen = ref(false)
const dobError = ref('')
const termsError = ref('')
const notice = ref('')

const countryMap = [
  { value: '+92', country: 'Pakistan' },
  { value: '+971', country: 'United Arab Emirates' },
  { value: '+44', country: 'United Kingdom' },
  { value: '+1', country: 'United States' },
  { value: '+91', country: 'India' },
  { value: '+61', country: 'Australia' },
  { value: '+49', country: 'Germany' },
  { value: '+33', country: 'France' },
  { value: '+39', country: 'Italy' },
  { value: '+34', country: 'Spain' }
]
const countryOptions = countryMap.map(c => ({ label: `${c.value} — ${c.country}`, value: c.value }))

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '' as string,
  phone: '',
  country: '',
  dob: '' as string, // YYYY-MM-DD
  password: '',
  confirmPassword: '',
  terms: false
})

function onCountryCode(v: string) {
  const found = countryMap.find(c => c.value === v)
  form.country = found?.country ?? ''
}

const dobLabel = computed(() => form.dob ? dayjs(form.dob).format('DD MMM YYYY') : '')
function dobOptions(date: string) {
  // no future
  return date <= dayjs().format('YYYY/MM/DD')
}
function confirmDob() {
  dobError.value = ''
  if (!form.dob) {
    dobError.value = 'Date of birth is required.'
    return
  }
  const age = dayjs().diff(dayjs(form.dob), 'year')
  if (age < 18) {
    dobError.value = 'You must be 18+ to register.'
    return
  }
  dobOpen.value = false
}

function passwordRule(v: string) {
  if (!v) return 'Required'
  if (v.length < 8) return 'Minimum 8 characters'
  if (!/[A-Z]/.test(v)) return 'Must include 1 uppercase letter'
  if (!/[0-9]/.test(v)) return 'Must include 1 number'
  return true
}

async function onSubmit() {
  termsError.value = ''
  dobError.value = ''
  if (!invite.isVerified) {
    Notify.create({ type: 'negative', message: 'Invite not verified. Please enter invite code.' })
    router.push('/invite')
    return
  }
  if (!form.terms) {
    termsError.value = 'You must accept the terms to continue.'
    return
  }
  // ensure dob valid
  confirmDob()
  if (dobError.value) return

  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    invite.consume()
    Notify.create({ type: 'positive', message: 'Account created. Please sign in.' })
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>
