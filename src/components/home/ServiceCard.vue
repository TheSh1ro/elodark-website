<template>
  <RouterLink :to="route">
    <div
      ref="target"
      :class="{ 'is-visible': isVisible }"
      :style="{ transitionDelay: `${delay}ms` }"
      class="service-card"
    >
      <div v-if="badge" class="service-badge">{{ badge }}</div>
      <div class="service-icon">{{ icon }}</div>
      <h3 class="service-name">{{ name }}</h3>
      <p class="service-desc">{{ description }}</p>
      <div class="service-features">
        <div v-for="(feature, index) in features" :key="index" class="service-feature">
          {{ feature }}
        </div>
      </div>
      <button class="service-button">{{ buttonText }}</button>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'

defineProps<{
  badge?: string | null
  icon: string
  name: string
  description: string
  features: string[]
  buttonText: string
  delay?: number
  route: string
}>()

const { target, isVisible } = useScrollAnimation({
  threshold: 0.2,
  once: true,
})
</script>

<style scoped>
.service-card {
  position: relative;
  background: rgba(10, 14, 26, 0.95);
  padding: 2rem 1.8rem;
  text-align: center;
  border: 2px solid var(--primary);
  border-radius: 8px;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Estado inicial - invisível */
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease-out;
}

/* Estado visível */
.service-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  opacity: 0;
  transition: opacity 0.4s;
  z-index: 0;
}

.service-card::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 245, 0.3));
  transition: top 0.6s;
  z-index: 1;
}

.service-card:hover::after {
  top: 0;
}

.service-card:hover {
  border-color: var(--secondary);
  transform: translateY(-10px);
  box-shadow:
    0 15px 60px rgba(76, 186, 157, 0.4),
    0 0 30px rgba(0, 255, 245, 0.2);
}

.service-card:hover::before {
  opacity: 0.1;
}

.service-icon {
  font-size: 3rem;
  position: relative;
  z-index: 2;
  font-weight: 900;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.service-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  z-index: 2;
}

.service-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  position: relative;
  z-index: 2;
}

.service-features {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0.5rem 0;
  position: relative;
  z-index: 2;
}

.service-feature {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.service-feature::before {
  content: '✓';
  color: var(--primary);
  font-weight: bold;
  font-size: 1rem;
}

.service-button {
  margin-top: auto;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  color: var(--dark);
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  transition: all 0.3s;
  position: relative;
  z-index: 2;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.service-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(76, 186, 157, 0.5);
}

.service-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, var(--secondary), pink);
  color: var(--dark);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  z-index: 3;
}
</style>
