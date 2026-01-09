<template>
  <PageHeader @open-login="isLoginOpen = true" />
  <RouterView />
  <PageFooter />
  <!-- <AudioPlayer audio-src="../public/audio/Audio.mp3" :autoplay="false" /> -->
  <LoginPanel v-model="isLoginOpen" />
  <ModalNotification
    v-model="isOpen"
    :title="config.title"
    :message="config.message"
    :button-text="config.buttonText"
  />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import PageHeader from './components/PageHeader.vue'
import PageFooter from './components/PageFooter.vue'
// import AudioPlayer from './components/AudioPlayer.vue'
import LoginPanel from './components/home/LoginPanel.vue'

import ModalNotification from '@/components/ModalNotification.vue'
import { useModal } from '@/composables/useModal'

const { isOpen, config } = useModal()
const isLoginOpen = ref(false)

let lastParticleTime = 0
const PARTICLE_THROTTLE = 50
const particles = new Set<HTMLDivElement>()

const createParticle = (x: number, y: number) => {
  const particle = document.createElement('div')
  particle.className = 'particle'

  const rootStyles = getComputedStyle(document.documentElement)
  const primary = rootStyles.getPropertyValue('--primary').trim() || '#4cba9d'

  Object.assign(particle.style, {
    left: `${x}px`,
    top: `${y}px`,
    width: '3px',
    height: '3px',
    background: primary,
    borderRadius: '50%',
    boxShadow: `0 0 10px ${primary}`,
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9999',
    transition: 'all 0.5s ease-out',
  })

  document.body.appendChild(particle)
  particles.add(particle)

  requestAnimationFrame(() => {
    particle.style.opacity = '0'
    particle.style.transform = 'scale(0) translateY(-20px)'
  })

  setTimeout(() => {
    particle.remove()
    particles.delete(particle)
  }, 500)
}

const handleMouseMove = (e: MouseEvent) => {
  const now = Date.now()

  if (now - lastParticleTime < PARTICLE_THROTTLE) return
  if (Math.random() > 0.9) return

  lastParticleTime = now
  createParticle(e.clientX, e.clientY)
}

const cleanup = () => {
  document.removeEventListener('mousemove', handleMouseMove)
  particles.forEach((p) => p.remove())
  particles.clear()
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
})

onBeforeUnmount(cleanup)
</script>

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
