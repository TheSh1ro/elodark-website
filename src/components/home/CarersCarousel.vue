<template>
  <section class="boosters" id="boosters">
    <h2 class="section-title">NEWELO SQUAD</h2>
    <p class="section-subtitle">Elite dos melhores jogadores do servidor brasileiro</p>

    <div class="carousel-container">
      <button class="carousel-view-3d" id="view3dBtn" @click="showModal({ title: '3D View' })">
        <Box :size="24" color="#000" /> 3D View
      </button>

      <div class="carousel-wrapper" ref="carouselWrapper">
        <div class="carousel-track" ref="carouselTrack">
          <!-- Loop através dos boosters -->
          <div v-for="(booster, index) in boosters" :key="index" class="booster-card">
            <div class="booster-header">
              <div class="booster-avatar">{{ booster.avatar }}</div>
              <div class="booster-info">
                <h3 class="booster-name">{{ booster.name }}</h3>
                <span class="booster-rank">{{ booster.rank }}</span>
              </div>
            </div>
            <div class="booster-stats">
              <div class="stat-item">
                <span class="stat-label">Winrate</span>
                <span class="stat-value">{{ booster.winrate }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Jogos</span>
                <span class="stat-value">{{ booster.games }}</span>
              </div>
            </div>
            <div class="booster-specialty">
              <span
                v-for="(specialty, idx) in booster.specialties"
                :key="idx"
                class="specialty-tag"
              >
                {{ specialty }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <button class="carousel-nav prev" @click="prevSlide"></button>
      <button class="carousel-nav next" @click="nextSlide"></button>

      <!-- Indicators - AGORA USANDO VUE -->
      <div class="carousel-indicators">
        <div
          v-for="(page, index) in indicators"
          :key="index"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goToPage(index)"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Box } from 'lucide-vue-next'

import { useModal } from '@/composables/useModal'
const { showModal } = useModal()

// Refs para elementos do DOM
const carouselTrack = ref<HTMLElement | null>(null)
const carouselWrapper = ref<HTMLElement | null>(null)

// Estados reativos
const currentIndex = ref(0)
const isDragging = ref(false)
const startPos = ref(0)
const autoplayInterval = ref<number | null>(null)

// Constantes
const cardWidth = 280 + 24 // width + gap

// Dados dos boosters
const boosters = ref([
  {
    avatar: 'T',
    name: 'Titan',
    rank: 'Desafiante',
    winrate: '82.5%',
    games: '-',
    specialties: ['Adc', 'Trair'],
  },
  {
    avatar: 'S',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['MID', 'Top'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Support', 'Mid'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Jungle', 'Top'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Mid', 'ADC'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Top', 'Jungle'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Support', 'ADC'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Mid', 'Support'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Jungle', 'Top'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Top', 'Mid'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['ADC', 'Mid'],
  },
  {
    avatar: '+',
    name: 'Booster',
    rank: 'Aberto',
    winrate: '-',
    games: '-',
    specialties: ['Jungle', 'Mid'],
  },
])

// Computed properties
const visibleCards = computed(() => {
  if (!carouselWrapper.value) return 1
  const containerWidth = carouselWrapper.value.offsetWidth
  return Math.floor(containerWidth / cardWidth)
})

const totalPages = computed(() => {
  return Math.ceil(boosters.value.length / visibleCards.value)
})

const offset = computed(() => {
  return -currentIndex.value * cardWidth * visibleCards.value
})

// Computed para criar array de indicadores
const indicators = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i)
})

// Funções do carrossel
const updateCarousel = () => {
  if (!carouselTrack.value) return
  carouselTrack.value.style.transform = `translateX(${offset.value}px)`
}

const goToPage = (pageIndex: number) => {
  currentIndex.value = pageIndex
  updateCarousel()
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    updateCarousel()
  }
}

const nextSlide = () => {
  if (currentIndex.value < totalPages.value - 1) {
    currentIndex.value++
    updateCarousel()
  }
}

// Funções de arrastar
const dragStart = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  startPos.value = e.type.includes('mouse')
    ? (e as MouseEvent).pageX
    : ((e as TouchEvent).touches?.[0]?.clientX ?? 0)

  if (carouselTrack.value) {
    carouselTrack.value.style.cursor = 'grabbing'
  }
}

const drag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault()

  const currentPosition = e.type.includes('mouse')
    ? (e as MouseEvent).pageX
    : ((e as TouchEvent).touches?.[0]?.clientX ?? 0)

  const diff = currentPosition - startPos.value

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex.value > 0) {
      currentIndex.value--
      updateCarousel()
      isDragging.value = false
    } else if (diff < 0 && currentIndex.value < totalPages.value - 1) {
      currentIndex.value++
      updateCarousel()
      isDragging.value = false
    }
  }
}

const dragEnd = () => {
  isDragging.value = false
  if (carouselTrack.value) {
    carouselTrack.value.style.cursor = 'grab'
  }
}

// Autoplay
const startAutoplay = () => {
  autoplayInterval.value = window.setInterval(() => {
    if (currentIndex.value < totalPages.value - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
    updateCarousel()
  }, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

// Handler de redimensionamento
const handleResize = () => {
  currentIndex.value = 0
  updateCarousel()
}

// Lifecycle hooks
onMounted(() => {
  // Event listeners do track
  if (carouselTrack.value) {
    carouselTrack.value.addEventListener('mousedown', dragStart as EventListener)
    carouselTrack.value.addEventListener('touchstart', dragStart as EventListener)
    carouselTrack.value.addEventListener('mouseup', dragEnd)
    carouselTrack.value.addEventListener('touchend', dragEnd)
    carouselTrack.value.addEventListener('mousemove', drag as EventListener)
    carouselTrack.value.addEventListener('touchmove', drag as EventListener)
    carouselTrack.value.addEventListener('mouseleave', dragEnd)
    carouselTrack.value.addEventListener('mouseenter', stopAutoplay)
    carouselTrack.value.addEventListener('mouseleave', startAutoplay)
  }

  // Listener de redimensionamento
  window.addEventListener('resize', handleResize)

  // Inicializar
  startAutoplay()
})

onBeforeUnmount(() => {
  // Limpar todos os event listeners
  if (carouselTrack.value) {
    carouselTrack.value.removeEventListener('mousedown', dragStart as EventListener)
    carouselTrack.value.removeEventListener('touchstart', dragStart as EventListener)
    carouselTrack.value.removeEventListener('mouseup', dragEnd)
    carouselTrack.value.removeEventListener('touchend', dragEnd)
    carouselTrack.value.removeEventListener('mousemove', drag as EventListener)
    carouselTrack.value.removeEventListener('touchmove', drag as EventListener)
    carouselTrack.value.removeEventListener('mouseleave', dragEnd)
    carouselTrack.value.removeEventListener('mouseenter', stopAutoplay)
    carouselTrack.value.removeEventListener('mouseleave', startAutoplay)
  }

  window.removeEventListener('resize', handleResize)

  // Parar autoplay
  stopAutoplay()
})
</script>

<style scoped>
/* Boosters Section - Compact */
.boosters {
  padding-top: 8rem;
  padding-inline: 3rem;

  position: relative;
  overflow: hidden;
}

.carousel-container {
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
}

.carousel-wrapper {
  overflow: hidden;
  position: relative;
  padding: 1rem 0;
}

.carousel-track {
  display: flex;
  gap: 1.5rem;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0 1rem;
}

.booster-card {
  user-select: none;
  min-width: 280px;
  background: rgba(10, 14, 26, 0.9);
  border: 2px solid var(--primary);
  padding: 1.5rem;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  flex-shrink: 0;
}

.booster-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(76, 186, 157, 0.2), transparent);
  transition: left 0.6s;
}

.booster-card:hover::before {
  left: 100%;
}

.booster-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 40px rgba(76, 186, 157, 0.5);
  border-color: var(--secondary);
  z-index: 10;
}

.booster-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.booster-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--dark);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.6);
  flex-shrink: 0;
}

.booster-info {
  flex: 1;
  min-width: 0;
}

.booster-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.booster-rank {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: linear-gradient(135deg, rgba(76, 186, 157, 0.2), rgba(0, 255, 245, 0.2));
  border: 1px solid var(--primary);
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.booster-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  text-shadow: 0 0 8px var(--primary);
}

.booster-specialty {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.specialty-tag {
  padding: 0.3rem 0.6rem;
  background: rgba(76, 186, 157, 0.1);
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 15px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* View 3D Button */
.carousel-view-3d {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
  color: var(--dark);
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  transition: all 0.3s;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.5);
  z-index: 50;
}

.carousel-view-3d:hover {
  transform: scale(1.05) translateX(-50%);
  box-shadow:
    0 0 50px rgba(76, 186, 157, 0.8),
    0 10px 30px rgba(0, 255, 245, 0.3);
}

.carousel-view-3d i {
  margin-right: 0.5rem;
}

/* Navigation Buttons */
.carousel-nav {
  position: absolute;
  top: calc(50% - 1rem);
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(76, 186, 157, 0.2);
  border: 2px solid var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  transition: all 0.3s;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.carousel-nav:hover {
  background: var(--primary);
  box-shadow: 0 0 30px var(--primary);
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav:hover::before {
  border-color: var(--dark);
}

.carousel-nav.prev {
  left: 0;
}

.carousel-nav.next {
  right: 0;
}

.carousel-nav::before {
  content: '';
  width: 12px;
  height: 12px;
  border-top: 3px solid var(--primary);
  border-right: 3px solid var(--primary);
  transition: border-color 0.3s;
}

.carousel-nav.prev::before {
  transform: rotate(-135deg);
  margin-left: 4px;
}

.carousel-nav.next::before {
  transform: rotate(45deg);
  margin-right: 4px;
}

/* Carousel Indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  padding: 1rem;
}

.indicator {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background: rgba(76, 186, 157, 0.3);
  border: 2px solid var(--primary);
  cursor:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="%23ff8c00" opacity="0.3"/><circle cx="12" cy="12" r="3" fill="%23ffb347"/></svg>')
      12 12,
    auto;
  transition: all 0.3s;
}

.indicator.active {
  background: var(--primary);
  box-shadow: 0 0 15px var(--primary);
  transform: scale(1.3);
}

.indicator:hover {
  background: var(--secondary);
  box-shadow: 0 0 15px var(--secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .booster-card {
    min-width: 240px;
  }

  .carousel-nav {
    width: 40px;
    height: 40px;
  }

  .carousel-nav::before {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .boosters {
    padding: 3rem 1rem;
  }

  .booster-card {
    min-width: 260px;
  }
}
</style>
