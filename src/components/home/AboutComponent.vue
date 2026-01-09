<template>
  <section class="about" id="about">
    <h2 class="section-title">HIGH CLASS</h2>
    <p class="section-subtitle">Ascenda ao elo que você deseja atingir</p>
    <div class="about-grid">
      <AboutCard
        :delay="0"
        title="Proteção Máxima"
        description="VPN e outros métodos para evitar qualquer detecção. Sua conta 100% segura."
      />
      <AboutCard
        :delay="150"
        title="Boost Turbo"
        description="Boosters jogando 24/7 com 90%+ winrate. Alcance seu elo em tempo recorde."
      />
      <AboutCard
        :delay="300"
        title="Jogadores 0.1%"
        description="Nossa equipe é composta por jogadores habilidosos que dominam a SoloQ brasileira."
      />
      <AboutCard
        :delay="450"
        title="Acompanhe"
        description="Assista cada partida em tempo real através do nosso servidor de Discord."
      />
      <AboutCard
        :delay="600"
        title="Garantia Premium"
        description="Se arrependeu? Reembolsamos o valor, basta entrar em contato."
      />
      <AboutCard
        :delay="750"
        title="Privacidade"
        description="Garantimos total sigilo sobre a compra do seu serviço e a realização do mesmo."
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import AboutCard from './AboutCard.vue'
</script>

<style scoped>
.about {
  padding-top: 8rem;
  padding-inline: 3rem;

  position: relative;
}

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

.about-grid {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
}
</style>
