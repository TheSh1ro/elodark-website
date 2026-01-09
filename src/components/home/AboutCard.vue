<template>
  <div
    ref="target"
    :class="{ 'is-visible': isVisible }"
    :style="{ transitionDelay: `${delay}ms` }"
    class="about-card"
  >
    <div class="about-icon"></div>
    <h3 class="about-title">{{ title }}</h3>
    <p class="about-desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'

defineProps<{
  title: string
  description: string
  delay?: number
}>()

const { target, isVisible } = useScrollAnimation({
  threshold: 0.2,
  once: true,
})
</script>

<style scoped>
.about-card {
  position: relative;
  background: rgba(10, 14, 26, 0.8);
  padding: 3rem;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
  border: 2px solid transparent;
  overflow: hidden;

  /* Estado inicial - invisível */
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease-out;
}

/* Estado visível */
.about-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.about-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  opacity: 0;
  transition: opacity 0.4s;
  z-index: -1;
}

.about-card:hover {
  border-color: var(--primary);
  box-shadow: 0 20px 60px rgba(76, 186, 157, 0.4);
}

.about-card:hover::before {
  opacity: 0.1;
}

.about-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.about-desc {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  font-size: 1.1rem;
}
</style>
