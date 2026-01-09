<template>
  <ThreeBackground />
  <div class="scanline"></div>

  <HeroSection />
  <CarersCarousel />
  <AboutComponent />
  <ServicesComponent />
  <TestimonialsComponent />
</template>
<script lang="ts">
import ThreeBackground from '@/components/ThreeBackground.vue'
import AboutComponent from '@/components/home/AboutComponent.vue'
import CarersCarousel from '@/components/home/CarersCarousel.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ServicesComponent from '@/components/home/ServicesComponent.vue'
import TestimonialsComponent from '@/components/home/TestimonialsComponent.vue'
export default {
  components: {
    AboutComponent,
    CarersCarousel,
    HeroSection,
    ThreeBackground,
    ServicesComponent,
    TestimonialsComponent,
  },
}
</script>
<style>
/* Scanline Effect */
.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent 50%, rgba(76, 186, 157, 0.025) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 9999;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
}

/* Padronizando as sections  */
.section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  text-align: center;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 5rem;
  letter-spacing: 1px;
}
</style>
