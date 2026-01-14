// src/types/userTypes.ts

/**
 * Roles disponíveis no sistema
 */
export type UserRole = 'client' | 'booster' | 'admin'

/**
 * Provedores OAuth suportados
 */
export type OAuthProvider = 'google' | 'discord'

/**
 * Interface principal do usuário
 */
export interface User {
  id: string
  email: string
  name: string
  avatar: string
  role: UserRole
  createdAt: string
  updatedAt: string

  // Dados OAuth específicos (opcional)
  googleId?: string
  discordId?: string

  // Perfil adicional
  profile?: UserProfile
}

/**
 * Perfil adicional do usuário
 */
export interface UserProfile {
  bio?: string
  phone?: string

  // Específico para boosters
  boosterProfile?: BoosterProfile
}

/**
 * Perfil do booster (quando role === 'booster')
 */
export interface BoosterProfile {
  rating: number // Avaliação média (0-5)
  completedOrders: number // Pedidos concluídos
  successRate: number // Taxa de sucesso (0-100)
  wallet: {
    balance: number // Saldo disponível
    pending: number // Saldo pendente
  }
  verified: boolean // Se é booster verificado
  joinedAt: string // Data de entrada como booster
}

/**
 * Dados de autenticação armazenados
 */
export interface AuthData {
  user: User | null
  token: string | null
  refreshToken: string | null
  expiresAt: number | null // Timestamp de expiração
}

/**
 * Resposta do backend após login
 */
export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number // Segundos até expirar
}

/**
 * Dados para login OAuth
 */
export interface OAuthLoginData {
  provider: OAuthProvider
  code: string // Code retornado pelo OAuth
  redirectUri: string
}

/**
 * Erro de autenticação
 */
export interface AuthError {
  code: string
  message: string
  details?: Record<string, unknown>
}
