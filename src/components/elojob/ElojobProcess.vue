<template>
  <section class="elojob-process">
    <h2 class="section-title">COMO FUNCIONA</h2>
    <p class="section-subtitle">5 passos simples para alcançar seu elo desejado</p>

    <div class="process-container">
      <div
        v-for="(step, index) in processSteps"
        :key="index"
        class="process-step"
        :style="{ animationDelay: `${index * 150}ms` }"
      >
        <div class="step-number">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="step-content">
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-description">{{ step.description }}</p>
        </div>
        <div v-if="index < processSteps.length - 1" class="step-connector"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const processSteps = [
  {
    title: 'Configure seu Boost',
    description: 'Use nossa calculadora para escolher elo inicial, final e extras desejados.',
  },
  {
    title: 'Realize o Pagamento',
    description: 'Pagamento seguro via PIX, cartão ou transferência. Confirmação instantânea.',
  },
  {
    title: 'Envie suas Credenciais',
    description: 'Compartilhe os dados de login de forma segura pelo nosso painel criptografado.',
  },
  {
    title: 'Acompanhe o Progresso',
    description: 'Monitore cada partida em tempo real. Receba notificações a cada vitória.',
  },
  {
    title: 'Receba sua Conta',
    description: 'Conta entregue no elo prometido. Comece a jogar no seu novo ranking!',
  },
]
</script>

<style scoped>
.elojob-process {
  padding: 4rem 3rem;
  background: var(--darker);
}

.process-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;
}

.process-step {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 2rem;
  position: relative;
  animation: fadeInLeft 0.6s ease-out backwards;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-number {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--dark);
  border: 3px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  color: var(--secondary);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.process-step:hover .step-number {
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.5);
  transform: scale(1.05);
}

.step-content {
  padding-top: 0.5rem;
}

.step-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.step-description {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.step-connector {
  position: absolute;
  left: 39px;
  top: 80px;
  width: 2px;
  height: calc(100% + 3rem);
  background: linear-gradient(180deg, var(--primary) 0%, rgba(76, 186, 157, 0.3) 100%);
}

@media (max-width: 768px) {
  .elojob-process {
    padding: 4rem 2rem;
  }

  .process-step {
    grid-template-columns: 60px 1fr;
    gap: 1.5rem;
  }

  .step-number {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .step-connector {
    left: 29px;
  }

  .step-title {
    font-size: 1.2rem;
  }

  .step-description {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .process-step {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .step-number {
    margin: 0 auto;
  }

  .step-connector {
    display: none;
  }
}
</style>
