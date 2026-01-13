<!-- src\components\elojob\ElojobFaq.vue -->
<template>
  <section class="elojob-faq">
    <h2 class="section-title">DÚVIDAS FREQUENTES</h2>
    <p class="section-subtitle">Tudo que você precisa saber sobre nosso serviço</p>

    <div class="faq-container">
      <div
        v-for="faq in faqs"
        :key="faq.id"
        class="faq-item"
        :class="{ active: openFaq === faq.id }"
        @click="toggleFaq(faq.id)"
      >
        <div class="faq-question">
          <h3>{{ faq.question }}</h3>
          <span class="faq-icon">{{ openFaq === faq.id ? '−' : '+' }}</span>
        </div>
        <transition name="fade">
          <div v-show="openFaq === faq.id" class="faq-answer">
            <p>{{ faq.answer }}</p>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openFaq = ref<number | null>(null)

const faqs = [
  {
    id: 1,
    question: 'É seguro contratar um serviço de elojob?',
    answer:
      'Sim! Utilizamos meios seguros, não alteramos configurações da sua conta e garantimos total sigilo. Trabalhamos há anos no mercado de elojob com zero casos de banimento.',
  },
  {
    id: 2,
    question: 'Quanto tempo leva para completar o boost?',
    answer:
      'O tempo varia conforme o elo inicial e final. Em média, cada divisão leva de 1 a 2 dias. Você acompanha o progresso em tempo real através dos nossos boosters.',
  },
  {
    id: 3,
    question: 'Posso escolher o horário das partidas?',
    answer:
      'Sim! Você pode definir janelas de horário específicas para que o booster jogue apenas nos períodos que você determinar, evitando conflitos com sua rotina.',
  },
  {
    id: 4,
    question: 'Quem são os boosters?',
    answer:
      'Todos nossos boosters são jogadores Mestre+ com histórico verificado e alta taxa de vitória. Cada profissional passa por um processo de seleção, garantindo que sejam bons e confiáveis.',
  },
  {
    id: 5,
    question: 'O que acontece se eu não ficar satisfeito?',
    answer:
      'Oferecemos garantia total de satisfação. Se não entregarmos o serviço conforme prometido, você recebe 100% do seu dinheiro de volta, sem burocracia.',
  },
  {
    id: 6,
    question: 'Quais formas de pagamento vocês aceitam?',
    answer:
      'Aceitamos PIX (confirmação instantânea) e cartão de crédito/débito. Todas as transações são protegidas e você pode entrar em contato com a nossa equipe caso surja alguma dúvida.',
  },
]

const toggleFaq = (id: number) => {
  openFaq.value = openFaq.value === id ? null : id
}
</script>

<style scoped>
.elojob-faq {
  padding-inline: 3rem;
}

.faq-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: var(--dark);
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item:hover {
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.2);
}

.faq-item.active {
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.3);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  gap: 1rem;
}

.faq-question h3 {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.faq-icon {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  width: 30px;
  text-align: center;
}

.faq-item.active .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 2rem 1.5rem 2rem;
}

.faq-answer p {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .elojob-faq {
    padding: 4rem 2rem;
  }

  .faq-question {
    padding: 1.25rem 1.5rem;
  }

  .faq-question h3 {
    font-size: 1.1rem;
  }

  .faq-answer {
    padding: 0 1.5rem 1.25rem 1.5rem;
  }

  .faq-answer p {
    font-size: 1rem;
  }
}
</style>
