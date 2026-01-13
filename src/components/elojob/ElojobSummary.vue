<template>
  <div class="summary-card">
    <h3 class="summary-title">Resumo do Pedido</h3>

    <div class="summary-details">
      <div class="summary-divider"></div>

      <div class="summary-grid">
        <div class="summary-item">
          <span class="summary-label">Elo inicial</span>
          <span class="summary-value">{{ currentElo || '--' }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Elo final</span>
          <span class="summary-value">{{ targetElo || '--' }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Tempo Estimado</span>
          <span class="summary-value">{{ estimatedTime || '--' }}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">Divisões</span>
          <span class="summary-value">{{ divisions || '--' }}</span>
        </div>

        <!-- Mostra rotas  -->
        <div class="summary-item summary-item-full">
          <span class="summary-label">Lanes</span>
          <span class="summary-value">{{
            selectedRoles.length === 5 || !props.additionalOptions.role ? 'Todas' : formattedRoles
          }}</span>
        </div>

        <!-- Mostra campeões apenas se a opção estiver ativa E houver campeões selecionados -->
        <div v-if="showChampions" class="summary-item summary-item-full">
          <span class="summary-label">Campeões</span>
          <div class="champions-list">
            <span v-for="champion in selectedChampions" :key="champion.id" class="champion-tag">
              {{ champion.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="price-display">
      <div class="price-amount">
        <span class="currency">R$</span>
        <span class="price">{{ formattedPrice }}</span>
      </div>
    </div>

    <button class="btn-primary" :disabled="!isValid">
      <span>CONTRATAR AGORA</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RoleId } from '@/types/roleTypes'
import type { Champion } from '@/types/championTypes'
import type { AdditionalOptionsData } from '@/types/additionalOptionsTypes'

const props = defineProps<{
  currentElo: string
  targetElo: string
  divisions: number
  estimatedTime: string
  price: number
  selectedRoles: RoleId[]
  selectedChampions: Champion[]
  additionalOptions: AdditionalOptionsData
}>()

// Mapeamento de roles para nomes em português
const roleNames: Record<RoleId, string> = {
  top: 'Top',
  jungle: 'JG',
  mid: 'Mid',
  adc: 'ADC',
  support: 'Sup',
}

// Mostra roles apenas se a opção estiver ativa E houver menos de 5 roles selecionadas
// const showRoles = computed(() => {
//   return props.additionalOptions.role && props.selectedRoles.length < 5
// })

// Mostra campeões apenas se a opção estiver ativa e houver campeões selecionados
const showChampions = computed(() => {
  return props.additionalOptions.specificChampions && props.selectedChampions.length > 0
})

// Formata as roles para exibição
const formattedRoles = computed(() => {
  return props.selectedRoles.map((role) => roleNames[role]).join(' / ')
})

// Formata o preço
const formattedPrice = computed(() => {
  return props.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
})

// Verifica se os campos foram preenchidos
const isValid = computed(() => {
  return (
    props.currentElo !== '' &&
    props.currentElo !== '--' &&
    props.targetElo !== '' &&
    props.targetElo !== '--' &&
    props.divisions > 0 &&
    props.price > 0
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

.summary-item-full {
  grid-column: 1 / -1;
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

/* Estilos para lista de campeões */
.champions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.champion-tag {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background: rgba(76, 186, 157, 0.2);
  border: 1px solid rgba(76, 186, 157, 0.4);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.champion-tag:hover {
  background: rgba(76, 186, 157, 0.3);
  border-color: var(--primary);
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

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
