<!-- src\components\elojob\ElojobCalculator\TargetEloSelector.vue -->
<template>
  <transition name="slide-fade">
    <div
      v-if="show"
      :class="[
        'grid-section',
        {
          'active-section': isActive,
          'compact-section': !isActive,
        },
      ]"
    >
      <!-- Modo Seleção -->
      <div v-if="isActive" class="section-content">
        <h3 class="container-title">
          <span class="section-number">2</span>
          Onde você quer chegar?
        </h3>
        <div class="elo-grid">
          <template v-for="elo in availableElos" :key="`target-${elo.value}`">
            <div
              v-if="!isEloDisabled(elo.value)"
              :class="[
                'elo-item',
                { selected: modelValue === elo.value, disabled: isEloDisabled(elo.value) },
              ]"
              @click="selectElo(elo.value)"
            >
              <img :src="elo.emblem" :alt="elo.label" class="elo-emblem" />
              <span class="elo-name">{{ elo.label }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Modo Compacto -->
      <div v-else class="compact-content" @click="edit">
        <div class="compact-label">
          <span class="section-number">2</span>
          Elo Desejado
        </div>
        <div class="compact-display">
          <img :src="targetEmblem" :alt="label" class="compact-emblem" />
          <span class="compact-name">{{ label }}</span>
          <button class="compact-edit">Alterar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EloData } from '@/types/eloData'

interface Props {
  modelValue: number | null
  division: number | null
  availableElos: EloData[]
  allElos: EloData[]
  currentElo: number | null
  currentDivision: number | null
  show: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'selectElo', value: number): void
  (e: 'edit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isActive = computed(() => {
  return props.modelValue === null || props.division === null
})

const label = computed(() => {
  if (props.modelValue === null || props.division === null) return ''
  const elo = props.allElos[props.modelValue]
  if (!elo?.hasLeagues) return elo?.label
  const divisions = ['I', 'II', 'III', 'IV']
  return `${elo.label} ${divisions[props.division]}`
})

const targetEmblem = computed(() => {
  if (props.modelValue === null) return ''
  return props.allElos[props.modelValue]?.emblem ?? ''
})

const getEloValue = (elo: number, division: number) => {
  const eloData = props.allElos[elo]
  if (!eloData?.hasLeagues) return elo * 10
  return elo * 10 + (3 - division)
}

const isEloDisabled = (index: number) => {
  if (props.currentElo === null || props.currentDivision === null) return true
  const currentValue = getEloValue(props.currentElo, props.currentDivision)
  const targetValue = getEloValue(index, 0)
  return targetValue <= currentValue
}

const selectElo = (index: number) => {
  if (isEloDisabled(index)) return
  emit('update:modelValue', index)
  emit('selectElo', index)
}

const edit = () => {
  emit('edit')
}
</script>

<style scoped>
@import './EloSelector.css';
</style>
