<template>
  <header :class="headerClasses">
    <nav>
      <!-- Logo -->
      <div class="nav-left">
        <img class="logo" @click="navigateToHome" :src="logo" alt="Logo" />

        <!-- Dropdown only visible on non-home pages -->
        <div
          v-if="!isHome"
          class="dropdown"
          @mouseenter="showDropdown = true"
          @mouseleave="showDropdown = false"
        >
          <span class="dropdown-trigger">Serviços</span>
          <ul v-show="showDropdown" class="dropdown-menu">
            <li><RouterLink to="/services/elojob">Elojob</RouterLink></li>
            <li><RouterLink to="/services/duojob">Duojob</RouterLink></li>
            <li><RouterLink to="/services/wins">Vitórias</RouterLink></li>
          </ul>
        </div>
      </div>

      <!-- Full menu only on home page -->
      <ul v-if="isHome" class="nav-menu">
        <li>
          <a href="#home" @click.prevent="scrollToSection('#home')">Início</a>
        </li>
        <li>
          <a href="#boosters" @click.prevent="scrollToSection('#boosters')">Boosters</a>
        </li>
        <li class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <a href="#services" @click.prevent="scrollToSection('#services')">Serviços</a>
        </li>
        <li>
          <a href="#testimonials" @click.prevent="scrollToSection('#testimonials')">Reviews</a>
        </li>
      </ul>

      <!-- Login button -->
      <button class="nav-cta" @click="emit('open-login')">ENTRAR</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import logo from '@/assets/logo.png'

// Router
const route = useRoute()
const router = useRouter()

// Emits
const emit = defineEmits<{
  'open-login': []
}>()

// Computed
const isHome = computed(() => route.path === '/')

const headerClasses = computed(() => ({
  'header-hidden': !isVisible.value,
  'is-home': isHome.value,
}))

// Refs
const isVisible = ref(true)
const showDropdown = ref(false)

// Scroll handling
let lastScrollY = 0
const SCROLL_THRESHOLD = 10

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // Always show header at top of page
  if (currentScrollY < SCROLL_THRESHOLD) {
    isVisible.value = true
    lastScrollY = currentScrollY
    return
  }

  // Hide on scroll down, show on scroll up
  if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
    isVisible.value = false
  } else if (currentScrollY < lastScrollY) {
    isVisible.value = true
  }

  lastScrollY = currentScrollY
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Methods
const scrollToSection = (selector: string) => {
  const element = document.querySelector(selector)
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top + window.scrollY
  const currentPosition = window.scrollY

  if (elementPosition > currentPosition) {
    const offset = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4
    window.scrollTo({
      top: elementPosition + offset,
      behavior: 'smooth',
    })
  } else {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const navigateToHome = () => {
  if (!isHome.value) {
    router.push('/')
  }
}
</script>

<style scoped>
/* ============================================
   HEADER BASE STYLES
   ============================================ */
header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(5, 8, 16, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, transparent, var(--primary), transparent) 1;
  transition:
    transform 0.3s ease-in-out,
    background 0.3s ease;
  transform: translateY(0);
}

/* Home page specific styling */
header.is-home {
  background: rgba(5, 8, 16, 0.4);
}

/* Non-home page styling */
header:not(.is-home) {
  background-color: transparent;
  backdrop-filter: none;
  border: none;
}

/* Hidden state */
header.header-hidden {
  transform: translateY(-100%);
}

/* ============================================
   NAVIGATION LAYOUT
   ============================================ */
nav {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.2rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* ============================================
   LOGO
   ============================================ */
.logo {
  height: 35px;
  width: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 15px rgba(76, 186, 157, 0.5));
}

.logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 25px rgba(76, 186, 157, 0.8));
}

/* ============================================
   NAVIGATION MENU (HOME PAGE)
   ============================================ */
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
  transition: all 0.3s;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
}

.nav-menu a::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s;
}

.nav-menu a:hover {
  color: var(--primary);
  text-shadow: 0 0 20px var(--primary);
}

.nav-menu a:hover::before {
  width: 100%;
}

/* ============================================
   DROPDOWN
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
  position: relative;
  transition: all 0.3s;
  cursor: pointer;
}

.dropdown-trigger::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s;
}

.dropdown-trigger:hover {
  color: var(--primary);
  text-shadow: 0 0 20px var(--primary);
}

.dropdown-trigger:hover::before {
  width: 100%;
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
  box-shadow: 0 8px 32px rgba(76, 186, 157, 0.3);
  animation: fadeIn 0.2s ease;
  margin: 0;
}

/* Invisible bridge between trigger and menu */
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -1.5rem;
  left: 0;
  right: 0;
  height: 1.5rem;
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

.dropdown-menu li {
  padding: 0;
}

.dropdown-menu a {
  display: block;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  transition: all 0.3s;
  color: #fff;
  text-decoration: none;
}

.dropdown-menu a::before {
  display: none;
}

.dropdown-menu a:hover {
  background: rgba(76, 186, 157, 0.1);
  padding-left: 2rem;
  color: var(--primary);
}

/* ============================================
   CTA BUTTON
   ============================================ */
.nav-cta {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  color: var(--dark);
  text-transform: uppercase;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  transition: all 0.3s;
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.5);
}

.nav-cta:hover {
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

  .nav-cta {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
