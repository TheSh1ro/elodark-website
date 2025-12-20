<template>
  <div>
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div v-if="isOpen" class="login-backdrop" @click="closePanel"></div>
    </Transition>

    <!-- Slide-in Panel -->
    <Transition name="slide">
      <div v-if="isOpen" class="login-panel">
        <!-- Close Button -->
        <button class="close-btn" @click="closePanel" aria-label="Fechar">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <!-- Logo/Header -->
        <div class="panel-header">
          <h2 class="panel-title glitch" data-text="JOIN THE SHADOW">JOIN THE SHADOW</h2>
          <p class="panel-subtitle">Entre para continuar sua jornada rumo ao topo</p>
        </div>

        <!-- Login Form -->
        <div class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">E-MAIL</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              placeholder="seu@email.com"
              class="form-input"
              @keypress.enter="handleLogin"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">SENHA</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="formData.password"
                placeholder="••••••••"
                class="form-input"
                @keypress.enter="handleLogin"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                aria-label="Mostrar/Ocultar senha"
              >
                <svg
                  v-if="!showPassword"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.remember" />
              <span>Lembrar de mim</span>
            </label>
            <button class="forgot-link" @click="handleForgotPassword">Esqueceu a senha?</button>
          </div>

          <button class="btn-login" @click="handleLogin" :disabled="isLoading">
            <span v-if="!isLoading" class="btn-text">ENTRAR</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>

        <!-- Divider -->
        <div class="divider">
          <span>ou continue com</span>
        </div>

        <!-- Social Login -->
        <div class="social-login">
          <button class="btn-social btn-google" @click="handleSocialLogin('google')">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button class="btn-social btn-discord" @click="handleSocialLogin('discord')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
              />
            </svg>
            Discord
          </button>
        </div>

        <!-- Footer -->
        <div class="panel-footer">
          <p>
            Não tem uma conta?
            <button class="register-link" @click="handleRegister">Cadastre-se</button>
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'login', data: FormData): void
  (e: 'socialLogin', provider: string): void
  (e: 'register'): void
  (e: 'forgotPassword'): void
}

interface FormData {
  email: string
  password: string
  remember: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(props.modelValue)
const showPassword = ref(false)
const isLoading = ref(false)

const formData = ref<FormData>({
  email: '',
  password: '',
  remember: false,
})

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

const closePanel = () => {
  emit('update:modelValue', false)
}

const handleLogin = () => {
  isLoading.value = true
  emit('login', formData.value)

  // Simula requisição - remover em produção
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}

const handleSocialLogin = (provider: string) => {
  emit('socialLogin', provider)
}

const handleRegister = () => {
  emit('register')
  closePanel()
}

const handleForgotPassword = () => {
  emit('forgotPassword')
}

// Close on Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closePanel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Backdrop */
.login-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(10px);
  z-index: 9998;
}

/* Panel Container */
.login-panel {
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-width: 480px;
  background: linear-gradient(135deg, var(--dark) 0%, var(--darker) 100%);
  border-left: 2px solid rgba(76, 186, 157, 0.3);
  box-shadow:
    -20px 0 60px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(76, 186, 157, 0.1);
  z-index: 9999;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: absolute;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(76, 186, 157, 0.1);
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 4px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--primary);
  transition: all 0.3s ease;
  z-index: 1000;
}

.close-btn:hover {
  background: rgba(76, 186, 157, 0.2);
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.4);
  transform: rotate(90deg);
}

/* Header */
.panel-header {
  margin-bottom: 2.5rem;
  z-index: 2;
}

.panel-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 0.5rem 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(76, 186, 157, 0.5);
  max-width: 97%;
}

/* Glitch Effect */
.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch::before {
  animation: glitch-1 2.5s infinite;
  color: var(--secondary);
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 2.5s infinite;
  color: #ff00ff;
  z-index: -2;
}

@keyframes glitch-1 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

@keyframes glitch-2 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(2px, -2px);
  }
  40% {
    transform: translate(2px, 2px);
  }
  60% {
    transform: translate(-2px, -2px);
  }
  80% {
    transform: translate(-2px, 2px);
  }
}

.panel-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
  font-family: 'Rajdhani', sans-serif;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
}

.form-input {
  background: rgba(76, 186, 157, 0.05);
  border: 1px solid rgba(76, 186, 157, 0.2);
  border-radius: 4px;
  padding: 0.6rem 0.8rem;
  color: #fff;
  font-size: 0.95rem;
  font-family: 'Rajdhani', sans-serif;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.3);
}

.password-wrapper {
  display: flex;
  width: fit-content;
  position: relative;
}

.password-wrapper .form-input {
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(76, 186, 157, 0.5);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: var(--primary);
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
}

.checkbox-label input[type='checkbox'] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.forgot-link {
  color: var(--primary);
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Rajdhani', sans-serif;
}

.forgot-link:hover {
  color: var(--secondary);
  text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
}

/* Login Button */
.btn-login {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: var(--dark);
  border: none;
  border-radius: 4px;
  padding: 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.btn-login::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.btn-login:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 186, 157, 0.5);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(10, 14, 26, 0.3);
  border-top-color: var(--dark);
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0 1.5rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  font-family: 'Rajdhani', sans-serif;
  z-index: 2;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(76, 186, 157, 0.3), transparent);
}

.divider span {
  padding: 0 1rem;
}

/* Social Login */
.social-login {
  display: flex;
  gap: 1rem;
  z-index: 2;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(76, 186, 157, 0.05);
  border: 1px solid rgba(76, 186, 157, 0.2);
  border-radius: 4px;
  padding: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Rajdhani', sans-serif;
}

.btn-social:hover {
  background: rgba(76, 186, 157, 0.1);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 186, 157, 0.3);
}

/* Footer */
.panel-footer {
  margin-top: auto;
  padding-top: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  font-family: 'Rajdhani', sans-serif;
  z-index: 2;
}

.register-link {
  color: var(--primary);
  background: none;
  border: none;
  padding: 0;
  font-weight: 600;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-link:hover {
  color: var(--secondary);
  text-shadow: 0 0 10px rgba(0, 255, 245, 0.5);
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.7, 0, 0.84, 0);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 640px) {
  .login-panel {
    max-width: 100%;
    padding: 1.5rem;
  }

  .panel-header {
    margin-top: 2rem;
  }

  .panel-title {
    font-size: 1.5rem;
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
