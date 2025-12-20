<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import PageFooter from './components/PageFooter.vue'
import PageHeader from './components/PageHeader.vue'

const handleMouseMove = (e: MouseEvent) => {
  if (Math.random() > 0.5) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.left = e.clientX + 'px'
    particle.style.top = e.clientY + 'px'
    particle.style.width = '3px'
    particle.style.height = '3px'
    // Usando as cores do :root
    const rootStyles = getComputedStyle(document.documentElement)
    const primary = rootStyles.getPropertyValue('--primary') || '#4cba9d'
    particle.style.background = primary.trim()
    particle.style.borderRadius = '50%'
    particle.style.boxShadow = `0 0 10px ${primary.trim()}`
    particle.style.position = 'fixed'
    particle.style.pointerEvents = 'none'
    particle.style.zIndex = '9999'
    document.body.appendChild(particle)

    setTimeout(() => {
      particle.style.opacity = '0'
      particle.style.transform = 'scale(0)'
      particle.style.transition = 'all 0.5s'
    }, 100)

    setTimeout(() => {
      particle.remove()
    }, 600)
  }
}

const initParticles = () => {
  document.addEventListener('mousemove', handleMouseMove)
}

onMounted(() => {
  initParticles()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <PageHeader />
  <RouterView />
  <PageFooter />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #4cba9d;
  --secondary: #00fff5;
  --dark: #0a0e1a;
  --darker: #050810;
  --accent: #ff006e;
}

body {
  font-family: 'Rajdhani', sans-serif;
  background: var(--darker);
  color: #fff;
  overflow-x: hidden;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%234cba9d" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%2300fff5"/></svg>')
      12 12,
    auto;
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--secondary) var(--darker);
}

/* Remove as setas */
::-webkit-scrollbar-button {
  display: none;
}
</style>
