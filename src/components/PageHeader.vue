<template>
  <header :class="headerClasses">
    <nav>
      <!-- Logo -->
      <div class="nav-left">
        <img class="logo" @click="navigateToHome" :src="logo" alt="Logo" />

        <!-- Dropdown serviços (apenas em páginas internas) -->
        <div
          v-if="!isHome"
          class="dropdown"
          @mouseenter="showServicesDropdown = true"
          @mouseleave="showServicesDropdown = false"
        >
          <span class="dropdown-trigger">Serviços</span>
          <ul v-show="showServicesDropdown" class="dropdown-menu">
            <li><RouterLink to="/services/elojob">Elojob</RouterLink></li>
            <li>
              <a
                @click="
                  showModal({ title: 'DuoJob', message: 'Este serviço ainda não está disponível' })
                "
              >
                DuoJob
              </a>
            </li>
            <li>
              <a
                @click="
                  showModal({
                    title: 'Vitórias',
                    message: 'Este serviço ainda não está disponível',
                  })
                "
              >
                Vitórias
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Menu completo (apenas na home) -->
      <ul v-if="isHome" class="nav-menu">
        <li><a href="#home" @click.prevent="scrollToSection('#home')">Início</a></li>
        <li><a href="#boosters" @click.prevent="scrollToSection('#boosters')">Boosters</a></li>
        <li><a href="#services" @click.prevent="scrollToSection('#services')">Serviços</a></li>
        <li>
          <a href="#testimonials" @click.prevent="scrollToSection('#testimonials')">Reviews</a>
        </li>
      </ul>

      <!-- Usuário -->
      <div class="nav-right">
        <!-- Login button -->
        <button v-if="!authStore.isAuthenticated" class="btn-primary" @click="emit('open-login')">
          ENTRAR
        </button>

        <!-- User dropdown -->
        <div v-else class="user-dropdown" @click="showUserDropdown = !showUserDropdown">
          <div class="user-trigger" :class="{ active: showUserDropdown }">
            <div v-if="authStore.user?.avatar" class="user-avatar">
              <img :src="authStore.user.avatar" alt="" />
            </div>
            <div v-else class="user-initials">{{ authStore.userInitials }}</div>
            <span class="user-name">{{ authStore.user?.name.split(' ')[0] }}</span>
            <svg class="dropdown-icon" :class="{ rotated: showUserDropdown }" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="3" fill="none" />
            </svg>
          </div>

          <!-- Dropdown menu -->
          <ul v-show="showUserDropdown" class="user-dropdown-menu">
            <!-- User info -->
            <li class="user-info">
              <div class="info-avatar">
                <div v-if="authStore.user?.avatar" class="avatar-img">
                  <img :src="authStore.user.avatar" :alt="authStore.user.name" />
                </div>
                <div v-else class="avatar-initials">{{ authStore.userInitials }}</div>
              </div>
              <div class="info-text">
                <p class="info-name">{{ authStore.user?.name }}</p>
                <p class="info-email">{{ authStore.user?.email }}</p>
                <span class="badge">{{ roleText }}</span>
              </div>
            </li>

            <li class="divider"></li>

            <!-- Actions -->
            <li>
              <a @click="handleOrders" class="menu-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    stroke-width="2"
                  />
                </svg>
                <span>Meus Pedidos</span>
              </a>
            </li>

            <li v-if="authStore.isBooster">
              <a @click="handleBoosterDashboard" class="menu-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    stroke-width="2"
                  />
                </svg>
                <span>Painel Booster</span>
              </a>
            </li>

            <li class="divider"></li>

            <li>
              <a @click="handleLogout" class="menu-item logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    stroke-width="2"
                  />
                </svg>
                <span>Sair</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'
import { useAuthStore } from '@/stores/authStore'
import logo from '@/assets/logo.png'

const { showModal } = useModal()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const emit = defineEmits<{ 'open-login': [] }>()

// State
const isVisible = ref(true)
const showServicesDropdown = ref(false)
const showUserDropdown = ref(false)

// Computed
const isHome = computed(() => route.path === '/')
const headerClasses = computed(() => ({
  'header-hidden': !isVisible.value,
  'is-home': isHome.value,
}))
const roleText = computed(() => {
  const roles = { client: 'Cliente', booster: 'Booster', admin: 'Administrador' }
  return roles[authStore.user?.role || 'client']
})

// Scroll handling
let lastScrollY = 0
const SCROLL_THRESHOLD = 10

const handleScroll = () => {
  const currentScrollY = window.scrollY

  if (currentScrollY < SCROLL_THRESHOLD) {
    isVisible.value = true
    lastScrollY = currentScrollY
    return
  }

  isVisible.value = currentScrollY < lastScrollY
  lastScrollY = currentScrollY
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// Methods
const scrollToSection = (selector: string) => {
  const element = document.querySelector(selector)
  if (!element) return

  const offset = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4
  const elementPosition = element.getBoundingClientRect().top + window.scrollY

  window.scrollTo({
    top: elementPosition > window.scrollY ? elementPosition + offset : elementPosition,
    behavior: 'smooth',
  })
}

const navigateToHome = () => {
  if (!isHome.value) router.push('/')
}

const handleOrders = () => {
  showUserDropdown.value = false
  showModal({ title: 'Meus Pedidos', message: 'A página de pedidos será implementada em breve!' })
}

const handleBoosterDashboard = () => {
  showUserDropdown.value = false
  showModal({ title: 'Painel Booster', message: 'O painel do booster será implementado em breve!' })
}

const handleLogout = async () => {
  showUserDropdown.value = false
  try {
    await authStore.logout()
    if (route.meta.requiresAuth) router.push('/')
    showModal({ title: 'Logout realizado', message: 'Você saiu da sua conta com sucesso!' })
  } catch (err) {
    console.error('Logout error:', err)
    showModal({ title: 'Erro', message: 'Não foi possível fazer logout. Tente novamente.' })
  }
}
</script>

<style scoped>
/* ============================================
   HEADER
   ============================================ */
header {
  position: fixed;
  top: 0;
  width: 100%;
  max-height: 75px;
  z-index: 1000;
  background: rgba(5, 8, 16, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, transparent, var(--primary), transparent) 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

header.is-home {
  background: rgba(5, 8, 16, 0.4);
}

header:not(.is-home) {
  background-color: transparent;
  backdrop-filter: none;
  border: none;
}

header.header-hidden {
  transform: translateY(-100%);
}

/* ============================================
   NAVIGATION
   ============================================ */
nav {
  max-width: 1600px;
  max-height: 75px;
  margin: 0 auto;
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Logo */
.logo {
  height: 35px;
  width: auto;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 15px rgba(76, 186, 157, 0.5));
}

.logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 25px rgba(76, 186, 157, 0.8));
}

/* Menu principal */
.nav-menu {
  display: flex;
  gap: 3rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-menu a::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-menu a:hover {
  color: var(--primary);
  text-shadow: 0 0 20px var(--primary);
}

.nav-menu a:hover::before {
  width: 100%;
}

/* ============================================
   DROPDOWNS
   ============================================ */
.dropdown {
  position: relative;
}

.dropdown-trigger {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-trigger:hover {
  color: var(--primary);
  text-shadow: 0 0 20px var(--primary);
}

.dropdown-menu {
  position: absolute;
  top: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(5, 8, 16, 0.98);
  backdrop-filter: blur(20px);
  border: 2px solid var(--primary);
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 180px;
  list-style: none;
  margin: 0;
  box-shadow: 0 8px 32px rgba(76, 186, 157, 0.3);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.dropdown-menu a {
  display: block;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-menu a:hover {
  background: rgba(76, 186, 157, 0.1);
  padding-left: 2rem;
  color: var(--primary);
}

/* ============================================
   USER DROPDOWN
   ============================================ */
.user-dropdown {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(76, 186, 157, 0.05);
  border: 1px solid rgba(76, 186, 157, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-trigger:hover,
.user-trigger.active {
  background: rgba(76, 186, 157, 0.1);
  border-color: var(--primary);
}

.user-avatar,
.user-initials {
  width: 32px;
  height: 32px;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-initials {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--dark);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
}

.user-name {
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  width: 12px;
  height: 12px;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

/* User menu */
.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  background: rgba(5, 8, 16, 0.98);
  backdrop-filter: blur(20px);
  border: 2px solid var(--primary);
  border-radius: 8px;
  min-width: 280px;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 8px 32px rgba(76, 186, 157, 0.3);
  animation: fadeInDown 0.2s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info {
  padding: 1.25rem 1rem;
  background: rgba(76, 186, 157, 0.05);
  display: flex;
  gap: 1rem;
  align-items: center;
}

.info-avatar {
  flex-shrink: 0;
}

.avatar-img,
.avatar-initials {
  width: 48px;
  height: 48px;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid var(--primary);
}

.avatar-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--dark);
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
}

.info-text {
  flex: 1;
  min-width: 0;
}

.info-name {
  margin: 0 0 0.25rem 0;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-email {
  margin: 0 0 0.5rem 0;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(76, 186, 157, 0.2);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(76, 186, 157, 0.3), transparent);
  margin: 0.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(76, 186, 157, 0.1);
  color: var(--primary);
  padding-left: 1.5rem;
}

.menu-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  stroke-width: 2;
}

.menu-item.logout {
  color: #ff6b6b;
}

.menu-item.logout:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

/* ============================================
   BUTTON
   ============================================ */
.btn-primary {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  color: var(--dark);
  text-transform: uppercase;
  cursor: pointer;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.5);
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 50px rgba(76, 186, 157, 0.8);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  nav {
    padding: 1rem 1.5rem;
  }

  .logo {
    height: 25px;
  }

  .nav-menu {
    display: none;
  }

  .nav-left {
    gap: 1rem;
  }

  .dropdown-trigger {
    font-size: 0.9rem;
  }

  .btn-primary {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }

  .user-name {
    display: none;
  }

  .user-dropdown-menu {
    min-width: 260px;
  }
}
</style>
