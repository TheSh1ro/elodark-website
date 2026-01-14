import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useConfigStore } from '@/stores/configStore'
import { useAuthStore } from '@/stores/authStore'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Cria Pinia com plugin de persistência
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')

// Inicializa stores
const configStore = useConfigStore()
configStore.initialize()

// Inicializa authStore (valida token se existir no localStorage)
const authStore = useAuthStore()
authStore.initialize()
