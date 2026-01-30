import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dark, Notify, Dialog } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './styles/app.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.use(Quasar, {
  plugins: { Notify, Dialog },
})

app.mount('#app')

// Initialize theme from localStorage (default: dark)
const saved = localStorage.getItem('clazino_theme')
const isDark = saved ? saved === 'dark' : true
Dark.set(isDark)
