<template>
  <header>
    <nav>
      <div class="logo">ELODARK</div>
      <ul class="nav-menu">
        <li><a href="#home" @click.prevent="scrollToSection('#home')">Início</a></li>
        <li><a href="#boosters" @click.prevent="scrollToSection('#boosters')">Boosters</a></li>
        <li><a href="#services" @click.prevent="scrollToSection('#services')">Serviços</a></li>
        <li>
          <a href="#testimonials" @click.prevent="scrollToSection('#testimonials')">Reviews</a>
        </li>
      </ul>
      <button class="nav-cta" @click="$emit('open-login')">ENTRAR</button>
    </nav>
  </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    scrollToSection(selector: string) {
      const element = document.querySelector(selector)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
})
</script>
<style scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(5, 8, 16, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, transparent, var(--primary), transparent) 1;
}

nav {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 3px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px var(--primary));
  text-transform: uppercase;
  position: relative;
}

.logo::before {
  content: '>';
  position: absolute;
  left: -30px;
  color: var(--primary);
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.nav-menu {
  display: flex;
  gap: 3rem;
  list-style: none;
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

/* Responsive */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}
</style>
