<!-- src/views/AuthCallbackView.vue -->
<template>
  <div class="callback-container">
    <div class="callback-card">
      <!-- Loading -->
      <div v-if="loading" class="callback-content">
        <div class="spinner"></div>
        <h2>Processando login...</h2>
        <p>Aguarde enquanto finalizamos sua autenticação</p>
      </div>

      <!-- Success -->
      <div v-else-if="success" class="callback-content success">
        <div class="success-icon">✓</div>
        <h2>Login realizado!</h2>
        <p>Redirecionando...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="callback-content error">
        <div class="error-icon">✕</div>
        <h2>Erro no login</h2>
        <p>{{ error }}</p>
        <button class="btn-retry" @click="goHome">Voltar para Home</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { OAuthProvider } from '@/types/userTypes'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const success = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // Pega código OAuth da URL (?code=...)
    const code = route.query.code as string
    const state = route.query.state as string
    const errorParam = route.query.error as string

    // Se veio erro do OAuth provider
    if (errorParam) {
      throw new Error('Login cancelado ou erro no provedor')
    }

    // Se não tem code, algo deu errado
    if (!code) {
      throw new Error('Código de autenticação não encontrado')
    }

    // Detecta provider (pode vir no state ou path)
    const provider: OAuthProvider = 'google' // TODO: Detectar dinamicamente

    // Processa callback
    const result = await authStore.handleOAuthCallback(provider, code)

    if (!result) {
      throw new Error(authStore.error || 'Erro ao processar login')
    }

    // ✅ Sucesso!
    success.value = true
    loading.value = false

    // Redireciona após 1.5s
    setTimeout(() => {
      // Verifica se tinha rota salva antes do login
      const redirectTo = localStorage.getItem('redirectAfterLogin')
      localStorage.removeItem('redirectAfterLogin')

      router.push(redirectTo || '/')
    }, 1500)
  } catch (err) {
    console.error('OAuth callback error:', err)
    error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    loading.value = false
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.callback-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #0f1423 100%);
  padding: 2rem;
}

.callback-card {
  background: rgba(15, 20, 35, 0.95);
  border: 2px solid rgba(76, 186, 157, 0.3);
  border-radius: 8px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 0 40px rgba(76, 186, 157, 0.2);
}

.callback-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(76, 186, 157, 0.2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-icon,
.error-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  border-radius: 50%;
}

.success-icon {
  background: rgba(76, 186, 157, 0.2);
  color: var(--primary);
  border: 3px solid var(--primary);
  animation: scaleIn 0.5s ease-out;
}

.error-icon {
  background: rgba(255, 77, 77, 0.2);
  color: #ff4d4d;
  border: 3px solid #ff4d4d;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

h2 {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  color: var(--primary);
  margin: 0;
  letter-spacing: 1px;
}

p {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: var(--dark);
  border: none;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(76, 186, 157, 0.5);
}
</style>
