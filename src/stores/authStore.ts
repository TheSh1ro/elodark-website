// src/stores/authStore.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { User, AuthResponse, OAuthProvider, AuthError } from '@/types/userTypes'

// Configuração OAuth (vai vir do .env)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // ============================================
    // STATE
    // ============================================
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const expiresAt = ref<number | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ============================================
    // GETTERS
    // ============================================

    /**
     * Verifica se usuário está autenticado
     */
    const isAuthenticated = computed(() => {
      return !!user.value && !!token.value && !isTokenExpired.value
    })

    /**
     * Verifica se token está expirado
     */
    const isTokenExpired = computed(() => {
      if (!expiresAt.value) return true
      return Date.now() >= expiresAt.value
    })

    /**
     * Verifica se é booster
     */
    const isBooster = computed(() => {
      return user.value?.role === 'booster'
    })

    /**
     * Verifica se é admin
     */
    const isAdmin = computed(() => {
      return user.value?.role === 'admin'
    })

    /**
     * Verifica se é cliente
     */
    const isClient = computed(() => {
      return user.value?.role === 'client'
    })

    /**
     * Retorna iniciais do nome (para avatar fallback)
     */
    const userInitials = computed(() => {
      const name = user.value?.name?.trim()
      return name ? name[0]!.toUpperCase() : '?'
    })

    // ============================================
    // ACTIONS - OAUTH
    // ============================================

    /**
     * Inicia login OAuth com Google
     */
    function loginWithGoogle(): void {
      try {
        error.value = null

        // Parâmetros OAuth Google
        const params = new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          redirect_uri: GOOGLE_REDIRECT_URI,
          response_type: 'code',
          scope:
            'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          access_type: 'offline',
          prompt: 'select_account',
        })

        // Redireciona para Google OAuth
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
        window.location.href = authUrl
      } catch (err) {
        console.error('Error initiating Google login:', err)
        error.value = 'Erro ao iniciar login com Google'
      }
    }

    /**
     * Inicia login OAuth com Discord (futuro)
     */
    function loginWithDiscord(): void {
      error.value = 'Login com Discord será implementado em breve!'
      console.log('Discord OAuth coming soon...')

      // TODO: Implementar quando tiver Discord OAuth configurado
      // const params = new URLSearchParams({
      //   client_id: DISCORD_CLIENT_ID,
      //   redirect_uri: DISCORD_REDIRECT_URI,
      //   response_type: 'code',
      //   scope: 'identify email',
      // })
      // window.location.href = `https://discord.com/api/oauth2/authorize?${params}`
    }

    /**
     * Processa callback OAuth (quando retorna do Google/Discord)
     */
    async function handleOAuthCallback(provider: OAuthProvider, code: string): Promise<boolean> {
      loading.value = true
      error.value = null

      try {
        // Envia code para backend Django
        const response = await fetch(`${API_BASE_URL}/api/auth/${provider}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirect_uri: GOOGLE_REDIRECT_URI,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Erro ao autenticar')
        }

        const data: AuthResponse = await response.json()

        // Salva dados no store
        setAuthData(data)

        return true
      } catch (err) {
        console.error('OAuth callback error:', err)
        error.value = err instanceof Error ? err.message : 'Erro ao processar login'
        return false
      } finally {
        loading.value = false
      }
    }

    // ============================================
    // ACTIONS - TOKEN
    // ============================================

    /**
     * Salva dados de autenticação no store
     */
    function setAuthData(data: AuthResponse): void {
      user.value = data.user
      token.value = data.token
      refreshToken.value = data.refreshToken

      // Calcula timestamp de expiração (em ms)
      expiresAt.value = Date.now() + data.expiresIn * 1000
    }

    /**
     * Valida token atual e busca dados do usuário
     */
    async function checkAuth(): Promise<boolean> {
      // Se não tem token, não está autenticado
      if (!token.value) {
        return false
      }

      // Se token expirou, tenta renovar
      if (isTokenExpired.value) {
        return await tryRefreshToken()
      }

      // Token válido, busca dados atualizados do usuário
      loading.value = true
      error.value = null

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })

        if (!response.ok) {
          throw new Error('Token inválido')
        }

        const userData: User = await response.json()
        user.value = userData

        return true
      } catch (err) {
        console.error('Check auth error:', err)
        // Token inválido, limpa tudo
        clearAuth()
        return false
      } finally {
        loading.value = false
      }
    }

    /**
     * Renova token usando refreshToken
     */
    async function tryRefreshToken(): Promise<boolean> {
      if (!refreshToken.value) {
        clearAuth()
        return false
      }

      loading.value = true

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken.value,
          }),
        })

        if (!response.ok) {
          throw new Error('Não foi possível renovar token')
        }

        const data: AuthResponse = await response.json()
        setAuthData(data)

        return true
      } catch (err) {
        console.error('Refresh token error:', err)
        clearAuth()
        return false
      } finally {
        loading.value = false
      }
    }

    // ============================================
    // ACTIONS - LOGOUT
    // ============================================

    /**
     * Faz logout do usuário
     */
    async function logout(): Promise<void> {
      loading.value = true

      try {
        // Notifica backend (opcional, para invalidar token)
        if (token.value) {
          await fetch(`${API_BASE_URL}/api/auth/logout/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }).catch(() => {
            // Ignora erro de logout no backend
            console.warn('Could not notify backend about logout')
          })
        }
      } finally {
        clearAuth()
        loading.value = false
      }
    }

    /**
     * Limpa todos os dados de autenticação
     */
    function clearAuth(): void {
      user.value = null
      token.value = null
      refreshToken.value = null
      expiresAt.value = null
      error.value = null
    }

    // ============================================
    // ACTIONS - UTILS
    // ============================================

    /**
     * Limpa mensagem de erro
     */
    function clearError(): void {
      error.value = null
    }

    /**
     * Atualiza dados do usuário (sem refazer login)
     */
    function updateUser(updates: Partial<User>): void {
      if (user.value) {
        user.value = { ...user.value, ...updates }
      }
    }

    // ============================================
    // INICIALIZAÇÃO
    // ============================================

    /**
     * Inicializa o store (chamado no main.ts)
     */
    async function initialize(): Promise<void> {
      // Se tem token salvo, valida
      if (token.value) {
        await checkAuth()
      }
    }

    return {
      // State
      user,
      token,
      refreshToken,
      expiresAt,
      loading,
      error,

      // Getters
      isAuthenticated,
      isTokenExpired,
      isBooster,
      isAdmin,
      isClient,
      userInitials,

      // Actions - OAuth
      loginWithGoogle,
      loginWithDiscord,
      handleOAuthCallback,

      // Actions - Token
      checkAuth,
      tryRefreshToken,

      // Actions - Logout
      logout,
      clearAuth,

      // Actions - Utils
      clearError,
      updateUser,
      initialize,
    }
  },
  {
    // Persistência com pinia-plugin-persistedstate
    persist: {
      key: 'auth',
      storage: localStorage,
      pick: ['user', 'token', 'refreshToken', 'expiresAt'], // Só persiste esses
    },
  },
)
