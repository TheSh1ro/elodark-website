<!-- src\components\elojob\ElojobCalculator.vue -->
<template>
  <section class="calculator-section">
    <div class="calculator-grid">
      <!-- 1. Seleção de Elo Atual -->
      <EloSelector
        v-model="currentElo"
        :division="currentDivision"
        :available-elos="currentElos"
        :all-elos="configStore.elosPricing"
        @select-elo="handleCurrentEloSelect"
        @edit="editCurrentElo"
      />

      <!-- 2. Seleção de Elo Desejado -->
      <TargetEloSelector
        v-model="targetElo"
        :division="targetDivision"
        :available-elos="targetElos"
        :all-elos="configStore.elosPricing"
        :current-elo="currentElo"
        :current-division="currentDivision"
        :show="showTargetEloSelection"
        @select-elo="handleTargetEloSelect"
        @edit="editTargetElo"
      />

      <!-- 3. Tipo de Fila -->
      <QueueSelector v-model="queue" :show="showQueueSelector" @update:model-value="emitUpdate" />

      <!-- 4. Opções Adicionais -->
      <AdditionalOptions
        v-model="options"
        :show="showAdditionalOptions"
        @update:model-value="emitUpdate"
      />

      <!-- 5. Seleção de Roles -->
      <RoleSelector
        v-model="selectedRoles"
        :show="showRoleSelector"
        @update:model-value="emitUpdate"
      />

      <!-- 6. Seleção de Campeões -->
      <ChampionSelector
        :selected-champions="selectedChampions"
        :show="showChampionSelector"
        @update:selected-champions="updateSelectedChampions"
      />
    </div>

    <!-- Modal de Divisões -->
    <DivisionModal
      :show="showDivisionModal"
      :mode="modalMode"
      :current-elo="currentElo"
      :current-division="currentDivision"
      :target-elo="targetElo"
      @select-division="handleDivisionSelect"
      @close="closeDivisionModal"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'

// Componentes
import EloSelector from './ElojobCalculator/EloSelector.vue'
import TargetEloSelector from './ElojobCalculator/TargetEloSelector.vue'
import QueueSelector from './ElojobCalculator/QueueSelector.vue'
import AdditionalOptions from './ElojobCalculator/AdditionalOptions.vue'
import DivisionModal from './ElojobCalculator/DivisionModal.vue'
import RoleSelector from './ElojobCalculator/RoleSelector.vue'
import ChampionSelector from './ElojobCalculator/ChampionSelector.vue'

// Types
import type { ServiceData } from '@/types/serviceData'
import type { AdditionalOptionsData } from '@/types/additionalOptionsTypes'
import type { RoleId } from '@/types/roleTypes'
import type { Champion } from '@/types/championTypes'
import type { QueueType } from '@/types/queueTypes'

const emit = defineEmits<{
  update: [data: ServiceData]
}>()

const props = withDefaults(
  defineProps<{
    maxElo?: number
  }>(),
  {
    maxElo: 8,
  },
)

// ============================================
// STORES
// ============================================
const configStore = useConfigStore()

// ============================================
// ESTADO
// ============================================
const currentElo = ref<number | null>(2)
const currentDivision = ref<number | null>(1)
const targetElo = ref<number | null>(5)
const targetDivision = ref<number | null>(3)
const queue = ref<QueueType>('solo')
const options = ref<AdditionalOptionsData>({
  express: false,
  badMMR: false,
  specificChampions: false,
  role: false,
})

const selectedRoles = ref<RoleId[]>(['top', 'jungle', 'mid', 'adc', 'support'])
const selectedChampions = ref<Champion[]>([])

// Inicializar valores
onMounted(() => {
  emitUpdate()
})

// Modal
const showDivisionModal = ref(false)
const modalMode = ref<'current' | 'target'>('current')

// ============================================
// COMPUTED - ELOS DISPONÍVEIS
// ============================================
const currentElos = computed(() => configStore.getCurrentElos(props.maxElo))
const targetElos = computed(() => configStore.getAvailableElos(props.maxElo))

// ============================================
// VISIBILIDADE DE SEÇÕES
// ============================================
const showTargetEloSelection = computed(() => {
  return (
    (currentElo.value !== null && currentDivision.value !== null) ||
    (targetElo.value !== null && targetDivision.value !== null)
  )
})

const showQueueSelector = computed(() => {
  return targetElo.value !== null && targetDivision.value !== null
})

const showAdditionalOptions = computed(() => {
  return targetElo.value !== null && targetDivision.value !== null
})

const showRoleSelector = computed(() => {
  return options.value.role && targetElo.value !== null && targetDivision.value !== null
})

const showChampionSelector = computed(() => {
  return (
    options.value.specificChampions && targetElo.value !== null && targetDivision.value !== null
  )
})

// ============================================
// HANDLERS - ELO ATUAL
// ============================================
const handleCurrentEloSelect = (index: number) => {
  const elo = configStore.elosPricing[index]

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

// ============================================
// HANDLERS - ELO ALVO
// ============================================
const handleTargetEloSelect = (index: number) => {
  const elo = configStore.elosPricing[index]

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

// ============================================
// HANDLERS - MODAL
// ============================================
const handleDivisionSelect = (divIndex: number) => {
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

// ============================================
// HANDLERS - ROLES E CAMPEÕES
// ============================================
const updateSelectedChampions = (champions: Champion[]) => {
  selectedChampions.value = champions
  emitUpdate()
}

// ============================================
// LÓGICA DE AJUSTE
// ============================================
const getEloValue = (elo: number, division: number) => {
  const eloData = configStore.elosPricing[elo]
  if (!eloData?.hasLeagues) return elo * 10
  return elo * 10 + (3 - division)
}

const adjustTargetAfterCurrentChange = () => {
  if (targetElo.value === null || targetDivision.value === null) return

  const currentValue = getEloValue(currentElo.value!, currentDivision.value!)
  const targetValue = getEloValue(targetElo.value, targetDivision.value)

  // Só reseta o target se o novo current for >= target
  if (targetValue <= currentValue) {
    targetElo.value = null
    targetDivision.value = null
  } else {
    emitUpdate()
  }
}

// ============================================
// CÁLCULOS
// ============================================
const divisions = computed(() => {
  if (currentElo.value === null || targetElo.value === null) return 0

  let count = 0

  if (currentElo.value === targetElo.value) {
    return currentDivision.value! - targetDivision.value!
  }

  for (let i = currentElo.value; i <= targetElo.value; i++) {
    const eloData = configStore.elosPricing[i]

    if (i === currentElo.value) {
      if (eloData?.hasLeagues) {
        count += currentDivision.value! + 1
      } else {
        count += 1
      }
    } else if (i === targetElo.value) {
      if (eloData?.hasLeagues) {
        count += 3 - targetDivision.value!
      }
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
    const divCount = currentDivision.value! - targetDivision.value!
    const elo = configStore.elosPricing[currentElo.value]
    const price = elo?.basePrice ? elo.basePrice * divCount : 0
    return price
  }

  for (let i = currentElo.value; i <= targetElo.value; i++) {
    const eloData = configStore.elosPricing[i]

    if (!eloData) continue

    if (i === currentElo.value) {
      if (eloData.hasLeagues) {
        const divisionsToCount = currentDivision.value! + 1
        const divisionPrice = eloData.basePrice * divisionsToCount
        total += divisionPrice
      } else {
        total += eloData.basePrice
      }
    } else if (i === targetElo.value) {
      if (eloData.hasLeagues) {
        const divisionsToCount = 3 - targetDivision.value!
        if (divisionsToCount > 0) {
          const divisionPrice = eloData.basePrice * divisionsToCount
          total += divisionPrice
        }
      }
    } else {
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
  if (options.value.express) price *= configStore.multipliers.express
  if (options.value.badMMR) price *= configStore.multipliers.badMMR
  if (options.value.specificChampions) price *= configStore.multipliers.specificChampions
  if (options.value.role) price *= configStore.multipliers.role
  return parseFloat(price.toFixed(2))
})

const estimatedTime = computed(() => {
  let days = divisions.value * configStore.settings.baseDaysPerDivision
  if (options.value.express) days = Math.ceil(days * configStore.settings.expressTimeMultiplier)

  const minDays = Math.max(1, Math.floor(days))
  const maxDays = Math.max(minDays + 1, Math.ceil(days * 1.5))

  return `${minDays}-${maxDays} dias`
})

// Labels para exibição
const currentEloLabel = computed(() => {
  if (currentElo.value === null || currentDivision.value === null) return ''
  const elo = configStore.elosPricing[currentElo.value]
  if (!elo?.hasLeagues) return elo?.label
  const divisionLabels = ['I', 'II', 'III', 'IV']
  return `${elo.label} ${divisionLabels[currentDivision.value]}`
})

const targetEloLabel = computed(() => {
  if (targetElo.value === null || targetDivision.value === null) return ''
  const elo = configStore.elosPricing[targetElo.value]
  if (!elo?.hasLeagues) return elo?.label
  const divisionLabels = ['I', 'II', 'III', 'IV']
  return `${elo.label} ${divisionLabels[targetDivision.value]}`
})

// ============================================
// EMIT UPDATE
// ============================================
const emitUpdate = () => {
  if (currentElo.value === null || targetElo.value === null) return

  emit('update', {
    currentElo: currentEloLabel.value,
    targetElo: targetEloLabel.value,
    divisions: divisions.value,
    estimatedTime: estimatedTime.value,
    price: finalPrice.value,
    selectedRoles: selectedRoles.value,
    selectedChampions: selectedChampions.value,
    additionalOptions: options.value,
    queueType: queue.value,
  })
}

watch([options], emitUpdate, { deep: true })
</script>

<style scoped>
@import './ElojobCalculator/EloSelector.css';

.calculator-section {
  display: grid;
  align-content: start;
  gap: 3rem;
  width: 100%;
  min-height: calc(100vh - 75px);
}

.calculator-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 480px) {
  .calculator-grid {
    gap: 1.25rem;
  }
}
</style>
