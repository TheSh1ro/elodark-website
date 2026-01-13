<template>
  <section class="calculator-section">
    <div class="calculator-grid">
      <!-- 1. Seleção de Elo Atual -->
      <EloSelector
        v-model="currentElo"
        :division="currentDivision"
        :available-elos="currentElos"
        :all-elos="allElos"
        @select-elo="handleCurrentEloSelect"
        @edit="editCurrentElo"
      />

      <!-- 2. Seleção de Elo Desejado -->
      <TargetEloSelector
        v-model="targetElo"
        :division="targetDivision"
        :available-elos="targetElos"
        :all-elos="allElos"
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

      <!-- 5. Seleção de Rotas -->
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
import type { EloData } from '@/types/eloData'
import type { AdditionalOptionsData } from './ElojobCalculator/AdditionalOptions.vue'
import type { RoleId } from './ElojobCalculator/RoleSelector.vue'
import type { Champion } from './ElojobCalculator/ChampionSelector.vue'

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
// ESTADO
// ============================================
const currentElo = ref<number | null>(2)
const currentDivision = ref<number | null>(1)

const targetElo = ref<number | null>(5)
const targetDivision = ref<number | null>(3)

const queue = ref('solo')

const options = ref<AdditionalOptionsData>({
  express: false,
  badMMR: false,
  specificChampions: false,
  route: false,
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
// CONFIGURAÇÃO DE ELOS
// ============================================
const allElos: EloData[] = [
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
  return options.value.route && targetElo.value !== null && targetDivision.value !== null
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

// ============================================
// HANDLERS - ELO ALVO
// ============================================
const handleTargetEloSelect = (index: number) => {
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
  const eloData = allElos[elo]
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
    const eloData = allElos[i]

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
    const elo = allElos[currentElo.value]
    const price = elo?.basePrice ? elo.basePrice * divCount : 0
    return price
  }

  for (let i = currentElo.value; i <= targetElo.value; i++) {
    const eloData = allElos[i]

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
  if (options.value.express) price *= 1.3
  if (options.value.badMMR) price *= 1.25
  if (options.value.specificChampions) price *= 1.3
  if (options.value.route) price *= 1.0
  return parseFloat(price.toFixed(2))
})

const estimatedTime = computed(() => {
  let days = divisions.value * 0.5
  if (options.value.express) days = Math.ceil(days * 0.6)
  return `${Math.floor(days)}-${Math.ceil(days * 1.5)} dias`
})

// Labels para exibição
const currentEloLabel = computed(() => {
  if (currentElo.value === null || currentDivision.value === null) return ''
  const elo = allElos[currentElo.value]
  if (!elo?.hasLeagues) return elo?.label
  const divisionLabels = ['I', 'II', 'III', 'IV']
  return `${elo.label} ${divisionLabels[currentDivision.value]}`
})

const targetEloLabel = computed(() => {
  if (targetElo.value === null || targetDivision.value === null) return ''
  const elo = allElos[targetElo.value]
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
  })
}

watch([options], emitUpdate, { deep: true })

// Resetar rotas quando a opção for desmarcada
watch(
  () => options.value.route,
  (newValue) => {
    if (!newValue) {
      selectedRoles.value = ['top', 'jungle', 'mid', 'adc', 'support']
    }
  },
)

// Resetar campeões quando a opção for desmarcada
watch(
  () => options.value.specificChampions,
  (newValue) => {
    if (!newValue) {
      selectedChampions.value = []
    }
  },
)
</script>

<style scoped>
@import './ElojobCalculator/EloSelector.css';

.calculator-section {
  display: grid;
  align-content: start;
  gap: 3rem;
  width: 100%;
  min-height: calc(100vh - 80px);
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
