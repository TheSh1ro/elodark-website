<template>
  <div class="summary-card">
    <h3 class="summary-title">Resumo do Pedido</h3>

    <div class="summary-details">
      <div class="summary-divider"></div>

      <div class="summary-grid">
        <div class="summary-item">
          <span class="summary-label">Elo inicial</span>
          <span class="summary-value">Prata II</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Elo final</span>
          <span class="summary-value">Esmeralda II</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Tempo Estimado</span>
          <span class="summary-value">{{ estimatedTime }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Estimativa de início</span>
          <span class="summary-value">24h</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Rotas</span>
          <span class="summary-value">NEED TO CODE</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Extras</span>
          <span class="summary-value">NEED TO CODE</span>
        </div>
      </div>
    </div>

    <div class="price-display">
      <div class="price-amount">
        <span class="currency">R$</span>
        <span class="price">{{ price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
      </div>
    </div>

    <button class="btn-primary" :disabled="!isValid">
      <span>CONTRATAR AGORA</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentElo: string
  targetElo: string
  divisions: number
  estimatedTime: string
  price: number
}>()

// Verifica se os campos foram preenchidos
const isValid = computed(() => {
  return (
    props.currentElo !== '--' && props.targetElo !== '--' && props.divisions > 0 && props.price > 0
  )
})
</script>

<style scoped>
.summary-card {
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.summary-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 1.8rem;
  text-align: center;
  letter-spacing: 2px;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.8rem;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.summary-row.highlight {
  background: rgba(76, 186, 157, 0.05);
  border: 1px solid rgba(76, 186, 157, 0.2);
  border-radius: 8px;
  padding: 1rem;
}

.arrow {
  font-size: 1.5rem;
  color: var(--secondary);
  font-weight: 700;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.summary-row .summary-item {
  align-items: center;
}

.summary-row:not(.highlight) .summary-item {
  flex-direction: row;
  justify-content: space-between;
}

.summary-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--secondary);
}

.summary-row.highlight .summary-value {
  font-size: 1.2rem;
}

.elo-from {
  color: rgba(255, 255, 255, 0.8);
}

.elo-to {
  color: var(--primary);
  text-shadow: 0 0 10px var(--primary);
}

.summary-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(76, 186, 157, 0.3), transparent);
  margin: 0.3rem 0;
}

.price-display {
  background: rgba(76, 186, 157, 0.08);
  border: 2px solid var(--primary);
  border-radius: 8px;
  padding: 0.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.price-display::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(76, 186, 157, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.price-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.currency {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.4rem;
  color: var(--secondary);
  font-weight: 700;
}

.price {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 6px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:not(:disabled):hover::before {
  left: 100%;
}

.btn-primary:not(:disabled):hover {
  box-shadow: 0 0 30px var(--primary);
  transform: translateY(-2px);
}

.btn-primary:not(:disabled):active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: rgba(76, 186, 157, 0.3);
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.btn-primary:not(:disabled):hover .btn-icon {
  transform: translateX(5px);
}

/* Responsividade */
@media (max-width: 480px) {
  .summary-card {
    padding: 1.5rem;
  }

  .summary-title {
    font-size: 1.2rem;
  }

  .price {
    font-size: 2.3rem;
  }

  .summary-row.highlight {
    flex-direction: column;
    text-align: center;
  }

  .arrow {
    transform: rotate(90deg);
  }
}
</style>
