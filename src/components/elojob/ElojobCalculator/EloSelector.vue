<!-- src\components\elojob\ElojobCalculator\EloSelector.vue -->
<template>
  <div
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
        <span class="section-number">1</span>
        Qual seu elo atual?
      </h3>
      <div class="elo-grid">
        <div
          v-for="elo in availableElos"
          :key="`current-${elo.value}`"
          :class="['elo-item', { selected: modelValue === elo.value }]"
          @click="selectElo(elo.value)"
        >
          <img :src="elo.emblem" :alt="elo.label" class="elo-emblem" />
          <span class="elo-name">{{ elo.label }}</span>
        </div>
      </div>
    </div>

    <!-- Modo Compacto -->
    <div v-else class="compact-content" @click="edit">
      <div class="compact-label">
        <span class="section-number">1</span>
        Elo Atual
      </div>
      <div class="compact-display">
        <img :src="currentEmblem" :alt="label" class="compact-emblem" />
        <span class="compact-name">{{ label }}</span>
        <button class="compact-edit">Alterar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EloData } from '@/types/eloData'

interface Props {
  modelValue: number | null
  division: number | null
  availableElos: EloData[]
  allElos: EloData[]
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

const currentEmblem = computed(() => {
  if (props.modelValue === null) return ''
  return props.allElos[props.modelValue]?.emblem ?? ''
})

const selectElo = (index: number) => {
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
