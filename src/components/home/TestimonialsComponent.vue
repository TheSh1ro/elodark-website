<template>
  <section class="testimonials" id="testimonials">
    <h2 class="section-title">HALL OF FAME</h2>
    <p class="section-subtitle">O que nossos invocadores dizem</p>
    <div class="testimonials-container">
      <TestimonialCard
        v-for="(testimonial, index) in testimonials"
        :key="index"
        :delay="index * 150"
        :avatar="testimonial.avatar"
        :name="testimonial.name"
        :stars="testimonial.stars"
        :text="testimonial.text"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import TestimonialCard from './TestimonialCard.vue'

const testimonials = [
  {
    avatar: 'J',
    name: 'JadeRoc',
    stars: 5,
    text: 'Saí do Ouro para Diamante em 5 dias. Os caras são monstros, 100% de winrate nas minhas partidas. Valeu cada centavo!',
  },
  {
    avatar: 'O',
    name: 'Octodoggo',
    stars: 5,
    text: 'Melhor serviço de boost que já usei. A velocidade em que o booster subiu a conta foi demais, e deu pra assistir cada partida. Suporte nota 10!',
  },
  {
    avatar: 'O',
    name: 'PZZang',
    stars: 5,
    text: 'Excelente serviço, tinha esquecido como dava airblade e fiquei por muito tempo preso no gold..',
  },
]
</script>

<style scoped>
.testimonials {
  padding-block: 8rem;
  padding-inline: 3rem;

  position: relative;
}

.testimonials-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
}
</style>
