<template>
  <section class="calculator-section">
    <section class="section-title">DEFINIÇÕES DO SERVIÇO</section>
    <div class="calculator-grid">
      <!-- 1. Seleção de Elo Atual -->
      <div
        :class="[
          'grid-section',
          {
            'active-section': showCurrentEloSelection,
            'compact-section': !showCurrentEloSelection,
          },
        ]"
      >
        <!-- Modo Seleção -->
        <div v-if="showCurrentEloSelection" class="section-content">
          <h3 class="container-title">
            <span class="section-number">1</span>
            Qual seu elo atual?
          </h3>
          <div class="elo-grid">
            <div
              v-for="elo in currentElos"
              :key="`current-${elo.value}`"
              :class="['elo-item', { selected: currentElo === elo.value }]"
              @click="selectCurrentElo(elo.value)"
            >
              <img :src="elo.emblem" :alt="elo.label" class="elo-emblem" />
              <span class="elo-name">{{ elo.label }}</span>
            </div>
          </div>
        </div>

        <!-- Modo Compacto -->
        <div v-else class="compact-content" @click="editCurrentElo">
          <div class="compact-label">
            <span class="section-number">1</span>
            Elo Atual
          </div>
          <div class="compact-display">
            <img :src="getCurrentEmblem()" :alt="currentEloLabel" class="compact-emblem" />
            <span class="compact-name">{{ currentEloLabel }}</span>
            <button class="compact-edit">Alterar</button>
          </div>
        </div>
      </div>

      <!-- 2. Seleção de Elo Desejado -->
      <transition name="slide-fade">
        <div
          v-if="showTargetEloSelection"
          :class="[
            'grid-section',
            {
              'active-section': targetElo === null || targetDivision === null,
              'compact-section': targetElo !== null && targetDivision !== null,
            },
          ]"
        >
          <!-- Modo Seleção -->
          <div v-if="targetElo === null || targetDivision === null" class="section-content">
            <h3 class="container-title">
              <span class="section-number">2</span>
              Onde você quer chegar?
            </h3>
            <div class="elo-grid">
              <template v-for="elo in targetElos" :key="`target-${elo.value}`">
                <div
                  v-if="!isEloDisabled(elo.value)"
                  :class="[
                    'elo-item',
                    { selected: targetElo === elo.value, disabled: isEloDisabled(elo.value) },
                  ]"
                  @click="selectTargetElo(elo.value)"
                >
                  <img :src="elo.emblem" :alt="elo.label" class="elo-emblem" />
                  <span class="elo-name">{{ elo.label }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Modo Compacto -->
          <div v-else class="compact-content" @click="editTargetElo">
            <div class="compact-label">
              <span class="section-number">2</span>
              Elo Desejado
            </div>
            <div class="compact-display">
              <img :src="getTargetEmblem()" :alt="targetEloLabel" class="compact-emblem" />
              <span class="compact-name">{{ targetEloLabel }}</span>
              <button class="compact-edit">Alterar</button>
            </div>
          </div>
        </div>
      </transition>

      <!-- 3. Tipo de Fila -->
      <transition name="slide-fade">
        <div v-if="targetElo !== null && targetDivision !== null" class="grid-section">
          <h3 class="container-title">
            <span class="section-number">3</span>
            Tipo de Fila
          </h3>
          <div class="queue-buttons">
            <label class="queue-item">
              <input type="radio" v-model="queue" value="solo" @change="emitUpdate" />
              <div class="queue-content">
                <div class="queue-header">
                  <span class="queue-name">Ranqueada Solo/Duo</span>
                </div>
              </div>
            </label>

            <label class="queue-item">
              <input type="radio" v-model="queue" value="flex" @change="emitUpdate" />
              <div class="queue-content">
                <div class="queue-header">
                  <span class="queue-name">Ranqueada Flex</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </transition>

      <!-- 4. Opções Adicionais -->
      <transition name="slide-fade">
        <div v-if="targetElo !== null && targetDivision !== null" class="grid-section">
          <h3 class="container-title">
            <span class="section-number">4</span>
            Opções Adicionais
          </h3>
          <div class="options-list">
            <label class="option-item">
              <input type="checkbox" v-model="options.route" @change="emitUpdate" />
              <div class="option-content">
                <div class="option-header">
                  <span class="option-icon">★</span>
                  <span class="option-name">Escolher rota</span>
                  <span class="option-badge">GRATUITO</span>
                </div>
                <p class="option-description">
                  Selecione caso deseje escolher as rotas que o booster irá jogar durante o serviço
                </p>
              </div>
            </label>

            <label class="option-item">
              <input type="checkbox" v-model="options.express" @change="emitUpdate" />
              <div class="option-content">
                <div class="option-header">
                  <span class="option-icon">★</span>
                  <span class="option-name">Prioridade Total</span>
                  <span class="option-badge">+30%</span>
                </div>
                <p class="option-description">
                  Iniciaremos o serviço com prioridade máxima e terminaremos na maior velocidade
                  possível
                </p>
              </div>
            </label>

            <label class="option-item">
              <input type="checkbox" v-model="options.badMMR" @change="emitUpdate" />
              <div class="option-content">
                <div class="option-header">
                  <span class="option-icon">★</span>
                  <span class="option-name">MMR Baixo</span>
                  <span class="option-badge">+25%</span>
                </div>
                <p class="option-description">
                  Caso sua conta esteja ganhando menos pontos do que o normal selecione essa opção
                </p>
              </div>
            </label>

            <label class="option-item">
              <input type="checkbox" v-model="options.specificChampions" @change="emitUpdate" />
              <div class="option-content">
                <div class="option-header">
                  <span class="option-icon">★</span>
                  <span class="option-name">Campeões Específicos</span>
                  <span class="option-badge">+20%</span>
                </div>
                <p class="option-description">
                  Escolha quais campeões serão utilizados no boost, útil se você for monochampion ou
                  tiver uma pool específica
                </p>
              </div>
            </label>
          </div>
        </div>
      </transition>
    </div>

    <!-- Modal de Divisões -->
    <transition name="modal-fade">
      <div v-if="showDivisionModal" class="modal-overlay" @click="closeDivisionModal">
        <div class="modal-content" @click.stop>
          <h3 class="modal-title">Selecione a divisão</h3>
          <div class="modal-divisions">
            <div
              v-for="(division, idx) in ['I', 'II', 'III', 'IV']"
              :key="`modal-div-${idx}`"
              :class="['modal-division-item', { disabled: isDivisionDisabledInModal(idx) }]"
              @click="selectDivisionFromModal(idx)"
            >
              <span class="division-roman">{{ division }}</span>
              <span class="division-label">Divisão {{ division }}</span>
            </div>
          </div>
          <button class="modal-close" @click="closeDivisionModal">✕</button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Importar imagens dos ranks
import emblemIron from '@/assets/emblems-rank/emblem-iron.png'
import emblemBronze from '@/assets/emblems-rank/emblem-bronze.png'
import emblemSilver from '@/assets/emblems-rank/emblem-silver.png'
import emblemGold from '@/assets/emblems-rank/emblem-gold.png'
import emblemPlatinum from '@/assets/emblems-rank/emblem-platinum.png'
import emblemEmerald from '@/assets/emblems-rank/emblem-emerald.png'
import emblemDiamond from '@/assets/emblems-rank/emblem-diamond.png'
import emblemMaster from '@/assets/emblems-rank/emblem-master.png'
import emblemGrandmaster from '@/assets/emblems-rank/emblem-grandmaster.png'

const emit = defineEmits(['update'])

const props = withDefaults(
  defineProps<{
    maxElo?: number
  }>(),
  {
    maxElo: 8,
  },
)

// Estado dos elos
const currentElo = ref<number | null>(null)
const currentDivision = ref<number | null>(null)

const targetElo = ref<number | null>(null)
const targetDivision = ref<number | null>(null)

const queue = ref('solo')

const options = ref({
  express: false,
  badMMR: false,
  specificChampions: false,
  route: true,
})

// Modal
const showDivisionModal = ref(false)
const modalMode = ref<'current' | 'target'>('current')

// Controle de visibilidade baseado em estado
const showCurrentEloSelection = computed(() => {
  return currentElo.value === null || currentDivision.value === null
})
const showTargetEloSelection = computed(() => {
  return (
    (currentElo.value !== null && currentDivision.value !== null) ||
    (targetElo.value !== null && targetDivision.value !== null)
  )
})

// Configuração dos Elos
const allElos = [
  { value: 0, label: 'Ferro', emblem: emblemIron, basePrice: 9.9, hasLeagues: true },
  { value: 1, label: 'Bronze', emblem: emblemBronze, basePrice: 11.9, hasLeagues: true },
  { value: 2, label: 'Prata', emblem: emblemSilver, basePrice: 14.9, hasLeagues: true },
  { value: 3, label: 'Ouro', emblem: emblemGold, basePrice: 14.9, hasLeagues: true },
  { value: 4, label: 'Platina', emblem: emblemPlatinum, basePrice: 22.9, hasLeagues: true },
  { value: 5, label: 'Esmeralda', emblem: emblemEmerald, basePrice: 29.9, hasLeagues: true },
  { value: 6, label: 'Diamante', emblem: emblemDiamond, basePrice: 50, hasLeagues: true },
  { value: 7, label: 'Mestre', emblem: emblemMaster, basePrice: 500, hasLeagues: false },
  { value: 8, label: 'Grão-Mestre', emblem: emblemGrandmaster, basePrice: 800, hasLeagues: false },
]

const currentElos = computed(() => allElos.filter((elo) => elo.value < props.maxElo))
const targetElos = computed(() => allElos.filter((elo) => elo.value <= props.maxElo))

// Labels computados
const currentEloLabel = computed(() => {
  if (currentElo.value === null) return ''
  const elo = allElos[currentElo.value]
  if (!elo?.hasLeagues) return elo?.label
  const divisions = ['I', 'II', 'III', 'IV']
  return `${elo.label} ${divisions[currentDivision.value!]}`
})

const targetEloLabel = computed(() => {
  if (targetElo.value === null) return ''
  const elo = allElos[targetElo.value]
  if (!elo?.hasLeagues) return elo?.label
  const divisions = ['I', 'II', 'III', 'IV']
  return `${elo.label} ${divisions[targetDivision.value!]}`
})

const getCurrentEmblem = () => {
  if (currentElo.value === null || currentDivision.value === null) return ''
  const elo = allElos[currentElo.value]
  return elo?.emblem ?? ''
}

const getTargetEmblem = () => {
  if (targetElo.value === null || targetDivision.value === null) return ''
  const elo = allElos[targetElo.value]
  return elo?.emblem ?? ''
}

// Validações
const getEloValue = (elo: number, division: number) => {
  const eloData = allElos[elo]
  if (!eloData?.hasLeagues) return elo * 10
  return elo * 10 + (3 - division)
}

const isEloDisabled = (index: number) => {
  if (index > props.maxElo || currentElo.value === null || currentDivision.value === null)
    return true
  const currentValue = getEloValue(currentElo.value, currentDivision.value)
  const targetValue = getEloValue(index, 0)
  return targetValue <= currentValue
}

const isDivisionDisabledInModal = (divIndex: number) => {
  if (modalMode.value === 'current') return false
  if (targetElo.value !== currentElo.value) return false
  return divIndex >= currentDivision.value!
}

// Seleção de Elo Atual
const selectCurrentElo = (index: number) => {
  currentElo.value = index
  const elo = allElos[index]

  if (elo?.hasLeagues) {
    modalMode.value = 'current'
    showDivisionModal.value = true
  } else {
    currentDivision.value = 0
    adjustTargetAfterCurrentChange()
  }
}

const editCurrentElo = () => {
  currentElo.value = null
  currentDivision.value = null
}

// Seleção de Elo Desejado
const selectTargetElo = (index: number) => {
  if (isEloDisabled(index)) return

  targetElo.value = index
  const elo = allElos[index]

  if (elo?.hasLeagues) {
    modalMode.value = 'target'
    showDivisionModal.value = true
  } else {
    targetDivision.value = 0
    emitUpdate()
  }
}

const editTargetElo = () => {
  targetElo.value = null
  targetDivision.value = null
}

// Modal de Divisões
const selectDivisionFromModal = (divIndex: number) => {
  if (isDivisionDisabledInModal(divIndex)) return

  if (modalMode.value === 'current') {
    currentDivision.value = divIndex
    adjustTargetAfterCurrentChange()
  } else {
    targetDivision.value = divIndex
    emitUpdate()
  }

  closeDivisionModal()
}

const closeDivisionModal = () => {
  showDivisionModal.value = false
}

const adjustTargetAfterCurrentChange = () => {
  if (targetElo.value === null || targetDivision.value === null) return

  const currentValue = getEloValue(currentElo.value!, currentDivision.value!)
  const targetValue = getEloValue(targetElo.value, targetDivision.value)

  // Só reseta o target se o novo current for >= target
  if (targetValue <= currentValue) {
    targetElo.value = null
    targetDivision.value = null
  }
}

// Cálculos
const divisions = computed(() => {
  if (currentElo.value === null || targetElo.value === null) return 0

  let count = 0

  if (currentElo.value === targetElo.value) {
    return currentDivision.value! - targetDivision.value!
  }

  for (let i = currentElo.value; i <= targetElo.value; i++) {
    const eloData = allElos[i]

    if (i === currentElo.value) {
      if (eloData?.hasLeagues) {
        count += currentDivision.value! + 1 // Adicionar +1
      } else {
        count += 1
      }
    } else if (i === targetElo.value) {
      if (eloData?.hasLeagues) {
        count += 3 - targetDivision.value! // Pode ser 0
      }
      // Elos sem ligas no final: não adiciona nada
    } else {
      if (eloData?.hasLeagues) {
        count += 4
      } else {
        count += 1
      }
    }
  }

  return count
})

const basePrice = computed(() => {
  if (currentElo.value === null || targetElo.value === null) return 0

  let total = 0

  if (currentElo.value === targetElo.value) {
    // Mesmo elo: apenas a diferença
    const divCount = currentDivision.value! - targetDivision.value!
    const elo = allElos[currentElo.value]
    const price = elo?.basePrice ? elo.basePrice * divCount : 0

    return price
  }

  for (let i = currentElo.value; i <= targetElo.value; i++) {
    const eloData = allElos[i]

    if (!eloData) {
      continue
    }

    if (i === currentElo.value) {
      // Elo inicial: contar divisões da atual até sair do elo
      if (eloData.hasLeagues) {
        // Se está em Ferro IV (div 3): precisa subir IV→III→II→I = 4 divisões (3+1)
        const divisionsToCount = currentDivision.value! + 1
        const divisionPrice = eloData.basePrice * divisionsToCount
        total += divisionPrice
      } else {
        total += eloData.basePrice
      }
    } else if (i === targetElo.value) {
      // Elo final: contar divisões DENTRO do elo de destino
      if (eloData.hasLeagues) {
        const divisionsToCount = 3 - targetDivision.value!
        if (divisionsToCount > 0) {
          const divisionPrice = eloData.basePrice * divisionsToCount
          total += divisionPrice
        }
      } else {
        // Elos sem ligas como destino: não cobra nada (já chegou)
      }
    } else {
      // Elos intermediários: todas as 4 divisões
      if (eloData.hasLeagues) {
        const divisionPrice = eloData.basePrice * 4
        total += divisionPrice
      } else {
        total += eloData.basePrice
      }
    }
  }

  return total
})

const finalPrice = computed(() => {
  let price = basePrice.value
  if (options.value.express) price *= 1.3
  if (options.value.badMMR) price *= 1.25
  if (options.value.specificChampions) price *= 1.2
  if (options.value.route) price *= 1.0
  return parseFloat(price.toFixed(2))
})

const estimatedTime = computed(() => {
  let days = divisions.value * 2
  if (options.value.express) days = Math.ceil(days * 0.6)
  return `${days}-${days + 3} dias`
})

const emitUpdate = () => {
  if (currentElo.value === null || targetElo.value === null) return

  emit('update', {
    currentElo: currentEloLabel.value,
    targetElo: targetEloLabel.value,
    divisions: divisions.value,
    estimatedTime: estimatedTime.value,
    price: finalPrice.value,
  })
}

watch([options], emitUpdate, { deep: true })
</script>

<style scoped>
.calculator-section {
  display: grid;
  align-content: start;
  gap: 3rem;
  width: 100%;
  min-height: calc(100vh - 80px);
}

/* Grid Principal */
.calculator-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Seção Individual */
.grid-section {
  background: var(--dark);
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-section.active-section {
  border-color: var(--primary);
  box-shadow: 0 0 30px rgba(76, 186, 157, 0.2);
}

.grid-section:hover {
  border-color: rgba(76, 186, 157, 0.5);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.container-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--primary);
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 900;
  flex-shrink: 0;
}

/* Grid de Elos */
.elo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-template-rows: 1fr;
  gap: 1rem;
}

.elo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0.75rem;
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.elo-item:hover:not(.disabled) {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.05);
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(76, 186, 157, 0.2);
}

.elo-item.selected {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.3);
}

.elo-item.disabled {
  opacity: 0.25;
  cursor: not-allowed;
  filter: grayscale(1);
}

.elo-emblem {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(76, 186, 157, 0.3));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.elo-item:hover:not(.disabled) .elo-emblem {
  filter: drop-shadow(0 4px 12px rgba(76, 186, 157, 0.6));
  transform: scale(1.1);
}

.elo-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.2;
}

/* Seção Compacta */
.compact-section {
  cursor: pointer;
  padding: 1rem 1.5rem;
}

.compact-section:hover {
  background: rgba(76, 186, 157, 0.05);
  box-shadow: 0 0 20px rgba(76, 186, 157, 0.2);

  & .compact-edit {
    color: var(--secondary);
    transform: scale(1.05);
  }
}

.compact-content:hover {
  opacity: 0.9;
}

.compact-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.compact-label {
  font-family: 'Rajdhani', sans-serif;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.compact-label .section-number {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
}

.compact-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.compact-emblem {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(76, 186, 157, 0.5));
}

.compact-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--secondary);
  flex: 1;
}

.compact-edit {
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Tipo de Fila */
.queue-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.queue-item {
  cursor: pointer;
}

.queue-item input[type='radio'] {
  display: none;
}

.queue-content {
  padding: 1rem;
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.2);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.queue-item:hover .queue-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.05);
}

.queue-item input:checked + .queue-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.2);
}

.queue-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.queue-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

/* Opções Adicionais */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  cursor: pointer;
}

.option-item input[type='checkbox'] {
  display: none;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.2);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-item:hover .option-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.05);
}

.option-item input:checked + .option-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.2);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-icon {
  font-size: 1.3rem;
}

.option-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  flex: 1;
}

.option-badge {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--secondary);
  background: rgba(0, 255, 245, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--secondary);
}

.option-description {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  padding-left: 2rem;
  font-weight: 500;
  line-height: 1.4;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: var(--dark);
  border: 2px solid var(--primary);
  border-radius: 16px;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  position: relative;
  box-shadow: 0 0 60px rgba(76, 186, 157, 0.4);
}

.modal-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-align: center;
  margin: 0 0 2rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-divisions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.modal-division-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  background: var(--darker);
  border: 2px solid rgba(0, 255, 245, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 1/1;
}

.modal-division-item:hover:not(.disabled) {
  border-color: var(--secondary);
  background: rgba(0, 255, 245, 0.1);
  box-shadow: 0 0 25px rgba(0, 255, 245, 0.3);
  transform: scale(1.05);
}

.modal-division-item.disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.division-roman {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--secondary);
  text-shadow: 0 0 20px var(--secondary);
}

.division-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: uppercase;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-close:hover {
  color: var(--primary);
  transform: scale(1.2);
}

/* Animações */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsividade */
@media (max-width: 768px) {
  .grid-section {
    padding: 1.25rem;
  }

  .elo-grid {
    grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
    gap: 0.75rem;
  }

  .elo-emblem {
    width: 2.5rem;
    height: 2.5rem;
  }

  .queue-buttons {
    grid-template-columns: 1fr;
  }

  .modal-divisions {
    grid-template-columns: 1fr;
  }

  .division-roman {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .calculator-grid {
    gap: 1.25rem;
  }

  .grid-section {
    padding: 1rem;
  }

  .container-title {
    font-size: 1rem;
  }

  .elo-grid {
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 0.5rem;
  }

  .elo-item {
    padding: 0.75rem 0.5rem;
  }
}
</style>
