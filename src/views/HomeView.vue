<!-- src\views\HomeView.vue -->
<template>
  <ThreeBackground />
  <div class="scanline"></div>

  <HeroSection />
  <ServicesComponent />
  <CarersCarousel />
  <AboutComponent />
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
<style scoped></style>
