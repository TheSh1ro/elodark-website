<template>
  <section class="calculator-section">
    <div class="calculator-wrapper">
      <!-- Seletores de Elo -->
      <div class="elo-selectors">
        <!-- Elo Atual -->
        <div class="elo-selector-box">
          <h3 class="selector-label">Elo Atual</h3>
          <div class="elo-grid">
            <div
              v-for="(elo, index) in currentElos"
              :key="`current-${elo.value}`"
              :class="[
                'elo-item',
                {
                  selected: currentElo === elo.value && !showCurrentDivisions,
                  'show-divisions': currentElo === elo.value && showCurrentDivisions,
                },
              ]"
              @click="selectCurrentElo(elo.value)"
            >
              <span class="elo-symbol">{{ elo.symbol }}</span>
              <span class="elo-name">{{ getCurrentEloLabel(elo, elo.value) }}</span>
            </div>
          </div>

          <!-- Divisões do Elo Atual -->
          <transition name="fade">
            <div v-if="showCurrentDivisions" class="divisions-selector">
              <div
                v-for="(division, idx) in ['I', 'II', 'III', 'IV']"
                :key="`current-div-${idx}`"
                :class="['division-item', { selected: currentDivision === idx }]"
                @click="selectCurrentDivision(idx)"
              >
                {{ division }}
              </div>
            </div>
          </transition>
        </div>

        <!-- Elo Desejado -->
        <div class="elo-selector-box">
          <h3 class="selector-label">Elo Desejado</h3>
          <div class="elo-grid">
            <div
              v-for="(elo, index) in targetElos"
              :key="`target-${elo.value}`"
              :class="[
                'elo-item',
                {
                  selected: targetElo === elo.value && !showTargetDivisions,
                  'show-divisions': targetElo === elo.value && showTargetDivisions,
                  disabled: isEloDisabled(elo.value),
                },
              ]"
              @click="selectTargetElo(elo.value)"
            >
              <span class="elo-symbol">{{ elo.symbol }}</span>
              <span class="elo-name">{{ getTargetEloLabel(elo, elo.value) }}</span>
            </div>
          </div>

          <!-- Divisões do Elo Desejado -->
          <transition name="fade">
            <div v-if="showTargetDivisions" class="divisions-selector">
              <div
                v-for="(division, idx) in ['I', 'II', 'III', 'IV']"
                :key="`target-div-${idx}`"
                :class="[
                  'division-item',
                  {
                    selected: targetDivision === idx,
                    disabled: isDivisionDisabled(idx),
                  },
                ]"
                @click="selectTargetDivision(idx)"
              >
                {{ division }}
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Configurações -->
      <div class="config-section">
        <div class="config-grid">
          <div class="config-item">
            <label class="config-label">Servidor</label>
            <select v-model="server" class="select-input">
              <option value="br">Brasil</option>
            </select>
          </div>

          <div class="config-item">
            <label class="config-label">Fila</label>
            <select v-model="queue" class="select-input">
              <option value="solo">Solo/Duo</option>
              <option value="flex">Flex</option>
            </select>
          </div>
        </div>

        <div class="extras-grid">
          <label class="extra-checkbox">
            <input type="checkbox" v-model="options.express" @change="emitUpdate" />
            <span class="extra-label">
              <span class="extra-icon">⚡</span>
              <span class="extra-text">Prioridade total <strong>+30%</strong></span>
            </span>
          </label>

          <label class="extra-checkbox">
            <input type="checkbox" v-model="options.badMMR" @change="emitUpdate" />
            <span class="extra-label">
              <span class="extra-icon">👤</span>
              <span class="extra-text">MMR ruim <strong>+15%</strong></span>
            </span>
          </label>

          <label class="extra-checkbox">
            <input type="checkbox" v-model="options.specificChampions" @change="emitUpdate" />
            <span class="extra-label">
              <span class="extra-icon">🎯</span>
              <span class="extra-text">Especificar campeões <strong>+20%</strong></span>
            </span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['update'])

const props = withDefaults(
  defineProps<{
    maxElo?: number // 0-8, default 8 (Grão-Mestre)
  }>(),
  {
    maxElo: 8,
  },
)

// Estado
const currentElo = ref(2)
const currentDivision = ref(2) // 0=I, 1=II, 2=III, 3=IV
const showCurrentDivisions = ref(false)

const targetElo = ref(6)
const targetDivision = ref(0)
const showTargetDivisions = ref(false)

const server = ref('br')
const queue = ref('solo')

const options = ref({
  express: false,
  badMMR: false,
  specificChampions: false,
})

// Configuração dos Elos
const allElos = [
  { value: 0, label: 'Ferro', symbol: '🛡️', basePrice: 50, hasLeagues: true },
  { value: 1, label: 'Bronze', symbol: '🥉', basePrice: 60, hasLeagues: true },
  { value: 2, label: 'Prata', symbol: '🥈', basePrice: 80, hasLeagues: true },
  { value: 3, label: 'Ouro', symbol: '🥇', basePrice: 120, hasLeagues: true },
  { value: 4, label: 'Platina', symbol: '💎', basePrice: 180, hasLeagues: true },
  { value: 5, label: 'Esmeralda', symbol: '💚', basePrice: 230, hasLeagues: true },
  { value: 6, label: 'Diamante', symbol: '💠', basePrice: 280, hasLeagues: true },
  { value: 7, label: 'Mestre', symbol: '👑', basePrice: 450, hasLeagues: false },
  { value: 8, label: 'Grão-Mestre', symbol: '⭐', basePrice: 700, hasLeagues: false },
]

// Elos disponíveis
const currentElos = computed(() => allElos.filter((elo) => elo.value < props.maxElo))
const targetElos = computed(() => allElos.filter((elo) => elo.value <= props.maxElo))

// Labels dos elos com divisão
const getCurrentEloLabel = (elo: any, index: number) => {
  if (currentElo.value === index && !showCurrentDivisions.value && elo.hasLeagues) {
    const divisions = ['I', 'II', 'III', 'IV']
    return `${elo.label} ${divisions[currentDivision.value]}`
  }
  return elo.label
}

const getTargetEloLabel = (elo: any, index: number) => {
  if (targetElo.value === index && !showTargetDivisions.value && elo.hasLeagues) {
    const divisions = ['I', 'II', 'III', 'IV']
    return `${elo.label} ${divisions[targetDivision.value]}`
  }
  return elo.label
}

// Função auxiliar: calcula o "valor numérico" de um elo+divisão para comparação
// Quanto menor o número, mais alto o elo (I=0 é mais alto que IV=3)
const getEloValue = (elo: number, division: number) => {
  const eloData = allElos[elo]
  if (!eloData.hasLeagues) {
    return elo * 10 // Sem divisões, apenas multiplica
  }
  return elo * 10 + (3 - division) // I=3, II=2, III=1, IV=0 (invertido para ordem crescente)
}

// Validações
const isEloDisabled = (index: number) => {
  if (index > props.maxElo) return true

  const currentValue = getEloValue(currentElo.value, currentDivision.value)
  const targetValue = getEloValue(index, 0) // Assume a melhor divisão possível (I)

  // Desabilita se o elo alvo for menor ou igual ao atual
  return targetValue <= currentValue
}

const isDivisionDisabled = (divIndex: number) => {
  if (targetElo.value !== currentElo.value) return false

  // Se está no mesmo elo, só permite divisões menores (numericamente maiores)
  return divIndex >= currentDivision.value
}

// Seleção de Elo Atual
const selectCurrentElo = (index: number) => {
  if (allElos[index].hasLeagues) {
    // Toggle divisões
    if (currentElo.value === index && showCurrentDivisions.value) {
      showCurrentDivisions.value = false
    } else {
      currentElo.value = index
      showCurrentDivisions.value = true
      showTargetDivisions.value = false
    }
  } else {
    // Elo sem divisões
    currentElo.value = index
    showCurrentDivisions.value = false
    showTargetDivisions.value = false

    // Ajusta o target se necessário
    adjustTargetAfterCurrentChange()
    emitUpdate()
  }
}

const selectCurrentDivision = (divIndex: number) => {
  currentDivision.value = divIndex
  showCurrentDivisions.value = false

  // Ajusta o target se necessário
  adjustTargetAfterCurrentChange()
  emitUpdate()
}

// Ajusta o target quando o current muda
const adjustTargetAfterCurrentChange = () => {
  const currentValue = getEloValue(currentElo.value, currentDivision.value)
  const targetValue = getEloValue(targetElo.value, targetDivision.value)

  if (targetValue <= currentValue) {
    // Target inválido, precisa ajustar
    if (currentDivision.value > 0) {
      // Pode ir para a próxima divisão do mesmo elo
      targetElo.value = currentElo.value
      targetDivision.value = currentDivision.value - 1
    } else if (currentElo.value + 1 <= props.maxElo) {
      // Vai para o próximo elo
      targetElo.value = currentElo.value + 1
      targetDivision.value = allElos[currentElo.value + 1].hasLeagues ? 3 : 0
    }
  }
}

// Seleção de Elo Alvo
const selectTargetElo = (index: number) => {
  if (isEloDisabled(index)) return

  if (allElos[index].hasLeagues) {
    // Toggle divisões
    if (targetElo.value === index && showTargetDivisions.value) {
      showTargetDivisions.value = false
    } else {
      targetElo.value = index
      showTargetDivisions.value = true
      showCurrentDivisions.value = false

      // Se é o mesmo elo, ajusta a divisão se necessário
      if (index === currentElo.value) {
        if (targetDivision.value >= currentDivision.value) {
          targetDivision.value = Math.max(0, currentDivision.value - 1)
        }
      }
    }
  } else {
    // Elo sem divisões
    targetElo.value = index
    showTargetDivisions.value = false
    showCurrentDivisions.value = false
    emitUpdate()
  }
}

const selectTargetDivision = (divIndex: number) => {
  if (isDivisionDisabled(divIndex)) return

  targetDivision.value = divIndex
  showTargetDivisions.value = false
  emitUpdate()
}

// Cálculo de divisões
const divisions = computed(() => {
  let count = 0

  // Mesmo elo
  if (currentElo.value === targetElo.value) {
    return currentDivision.value - targetDivision.value
  }

  // Elos diferentes
  for (let i = currentElo.value; i <= targetElo.value; i++) {
    const eloData = allElos[i]

    if (i === currentElo.value) {
      // Primeiro elo: conta da divisão atual até o topo
      if (eloData.hasLeagues) {
        count += currentDivision.value + 1 // +1 porque inclui a divisão atual
      } else {
        count += 1
      }
    } else if (i === targetElo.value) {
      // Último elo: conta do fundo até a divisão alvo
      if (eloData.hasLeagues) {
        count += 4 - targetDivision.value
      }
      // Se não tem leagues, já foi contado no elo anterior
    } else {
      // Elos intermediários: conta todas as 4 divisões
      if (eloData.hasLeagues) {
        count += 4
      } else {
        count += 1
      }
    }
  }

  return count
})

// Cálculo de preço base
const basePrice = computed(() => {
  let total = 0

  if (currentElo.value === targetElo.value) {
    // Mesmo elo: preço * número de divisões
    const divCount = currentDivision.value - targetDivision.value
    return allElos[currentElo.value].basePrice * divCount
  }

  // Elos diferentes
  for (let i = currentElo.value; i <= targetElo.value; i++) {
    const eloData = allElos[i]

    if (i === currentElo.value) {
      // Primeiro elo: conta da divisão atual até o topo
      if (eloData.hasLeagues) {
        total += eloData.basePrice * (currentDivision.value + 1)
      } else {
        total += eloData.basePrice
      }
    } else if (i === targetElo.value) {
      // Último elo: conta do fundo até a divisão alvo
      if (eloData.hasLeagues) {
        total += eloData.basePrice * (4 - targetDivision.value)
      } else {
        // Elo sem divisões (Mestre, Grão-Mestre) - AGORA CONTA!
        total += eloData.basePrice
      }
    } else {
      // Elos intermediários: conta tudo
      if (eloData.hasLeagues) {
        total += eloData.basePrice * 4
      } else {
        total += eloData.basePrice
      }
    }
  }

  return total
})

// Preço final com modificadores
const finalPrice = computed(() => {
  let price = basePrice.value
  if (options.value.express) price *= 1.3
  if (options.value.badMMR) price *= 1.15
  if (options.value.specificChampions) price *= 1.2
  return Math.round(price)
})

// Tempo estimado
const estimatedTime = computed(() => {
  let days = divisions.value * 2
  if (options.value.express) days = Math.ceil(days * 0.6)
  return `${days}-${days + 3} dias`
})

// Emite atualização
const emitUpdate = () => {
  const divisionLabels = ['I', 'II', 'III', 'IV']

  const currentLabel = allElos[currentElo.value].hasLeagues
    ? `${allElos[currentElo.value].label} ${divisionLabels[currentDivision.value]}`
    : allElos[currentElo.value].label

  const targetLabel = allElos[targetElo.value].hasLeagues
    ? `${allElos[targetElo.value].label} ${divisionLabels[targetDivision.value]}`
    : allElos[targetElo.value].label

  emit('update', {
    currentElo: currentLabel,
    targetElo: targetLabel,
    divisions: divisions.value,
    estimatedTime: estimatedTime.value,
    price: finalPrice.value,
  })
}

// Watch para mudanças
watch([currentElo, targetElo, currentDivision, targetDivision, options], emitUpdate, {
  immediate: true,
  deep: true,
})
</script>

<style scoped>
.calculator-section {
  margin-bottom: 2.5rem;
}

.calculator-wrapper {
  background: var(--dark);
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Seletores lado a lado */
.elo-selectors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.elo-selector-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.selector-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  text-align: center;
  margin: 0;
  letter-spacing: 1px;
}

.elo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.elo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.elo-item:hover:not(.disabled) {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.05);
  transform: translateY(-2px);
}

.elo-item.selected,
.elo-item.show-divisions {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.3);
}

.elo-item.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.elo-symbol {
  font-size: 1.8rem;
}

.elo-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.2;
}

/* Seletor de Divisões */
.divisions-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.division-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--darker);
  border: 2px solid rgba(0, 255, 245, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--secondary);
}

.division-item:hover:not(.disabled) {
  border-color: var(--secondary);
  background: rgba(0, 255, 245, 0.1);
  box-shadow: 0 0 15px rgba(0, 255, 245, 0.3);
  transform: scale(1.05);
}

.division-item.selected {
  border-color: var(--secondary);
  background: rgba(0, 255, 245, 0.15);
  box-shadow: 0 0 20px rgba(0, 255, 245, 0.5);
}

.division-item.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Fade transition */
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

/* Configurações */
.config-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(76, 186, 157, 0.2);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-input {
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.3);
  border-radius: 8px;
  padding: 0.875rem;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.select-input:hover,
.select-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 10px rgba(76, 186, 157, 0.2);
  outline: none;
}

/* Extras */
.extras-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.extra-checkbox {
  cursor: pointer;
}

.extra-checkbox input[type='checkbox'] {
  display: none;
}

.extra-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.2);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.extra-checkbox:hover .extra-label {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.05);
}

.extra-checkbox input:checked + .extra-label {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 10px rgba(76, 186, 157, 0.2);
}

.extra-icon {
  font-size: 1.3rem;
}

.extra-text {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.extra-text strong {
  color: var(--secondary);
  font-weight: 700;
}

@media (max-width: 1024px) {
  .elo-selectors {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .calculator-wrapper {
    padding: 1.5rem;
  }

  .config-grid,
  .extras-grid {
    grid-template-columns: 1fr;
  }

  .elo-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
