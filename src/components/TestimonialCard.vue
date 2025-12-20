<template>
  <div
    ref="target"
    :class="{ 'is-visible': isVisible }"
    :style="{ transitionDelay: `${delay}ms` }"
    class="testimonial-card"
  >
    <div class="testimonial-header">
      <div class="testimonial-avatar">{{ avatar }}</div>
      <div class="testimonial-info">
        <h4>{{ name }}</h4>
        <div class="stars">{{ '★'.repeat(stars) }}</div>
      </div>
    </div>
    <p class="testimonial-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'

defineProps<{
  avatar: string
  name: string
  stars: number
  text: string
  delay?: number
}>()

const { target, isVisible } = useScrollAnimation({
  threshold: 0.2,
  once: true,
})
</script>

<style scoped>
.testimonial-card {
  background: rgba(10, 14, 26, 0.8);
  padding: 3rem;
  border-left: 5px solid var(--primary);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  position: relative;

  /* Estado inicial - invisível */
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease-out;
}

/* Estado visível */
.testimonial-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.testimonial-card::before {
  content: '"';
  position: absolute;
  top: -20px;
  left: 20px;
  font-size: 8rem;
  color: var(--primary);
  opacity: 0.2;
  font-family: 'Orbitron', sans-serif;
}

.testimonial-card:hover {
  transform: translateX(10px);
  box-shadow: 0 15px 60px rgba(76, 186, 157, 0.3);
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.testimonial-avatar {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  color: var(--dark);
  box-shadow: 0 0 30px var(--primary);
}

.testimonial-info h4 {
  font-family: 'Orbitron', sans-serif;
  color: var(--primary);
  font-size: 1.3rem;
}

.stars {
  color: var(--secondary);
  font-size: 1.2rem;
  text-shadow: 0 0 10px var(--secondary);
}

.testimonial-text {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  font-size: 1.1rem;
}
</style>
