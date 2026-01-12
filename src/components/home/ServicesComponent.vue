<template>
  <section class="services" id="services">
    <h2 class="section-title">CHOOSE YOUR DESTINY</h2>
    <p class="section-subtitle">Selecione o serviço que melhor se adequa ao seu objetivo</p>
    <div class="services-grid">
      <ServiceCard
        v-for="(service, index) in services"
        :key="index"
        :delay="index * 150"
        :badge="service.badge"
        :icon="service.icon"
        :name="service.name"
        :description="service.description"
        :features="service.features"
        :buttonText="service.buttonText"
        :route="service.route"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import ServiceCard from './ServiceCard.vue'

const services = [
  {
    badge: 'POPULAR',
    icon: '#1',
    name: 'EloJob',
    description: 'Boost completo sem sua participação',
    features: ['Menor preço', 'Entrega rápida', 'VPN + Proteção', 'Suporte 24/7'],
    buttonText: 'CONTRATAR ELOJOB',
    route: '/elojob',
  },
  {
    badge: null,
    icon: '/\\',
    name: 'DuoJob',
    description: 'Suba de elo enquanto recebe feedbacks',
    features: ['Absorva enquanto joga', 'Com ou sem Discord', 'Horário combinado', 'Suporte 24/7'],
    buttonText: 'COMEÇAR DUO',
    route: '/duojob',
  },
  {
    badge: null,
    icon: '///',
    name: 'VITÓRIAS',
    description: 'Compre vitórias e gerencie o seu decay',
    features: ['Agende as partidas', 'Com ou sem duo', 'VPN + Proteção', 'Suporte 24/7'],
    buttonText: 'Comprar vitórias',
    route: '/vitorias',
  },
]
</script>

<style scoped>
.services {
  padding-top: 8rem;
  padding-inline: 3rem;

  background: linear-gradient(
    180deg,
    var(--darker) 0%,
    rgba(76, 186, 157, 0.05) 50%,
    var(--darker) 100%
  );
  position: relative;
}

.services-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
</style>
