<template>
  <ThreeBackground />
  <div class="scanline"></div>

  <div class="elojob-page">
    <div class="elojob-container">
      <div class="elojob-left">
        <ElojobCalculator :max-elo="7" @update="updateData" />
        <ElojobProcess />
        <ElojobFAQ />
      </div>

      <div class="elojob-right">
        <ElojobSummary
          :current-elo="currentElo"
          :target-elo="targetElo"
          :divisions="divisions"
          :estimated-time="estimatedTime"
          :price="price"
          :selected-roles="selectedRoles"
          :selected-champions="selectedChampions"
          :additional-options="additionalOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThreeBackground from '@/components/ThreeBackground.vue'
import ElojobCalculator from '@/components/elojob/ElojobCalculator.vue'
import ElojobProcess from '@/components/elojob/ElojobProcess.vue'
import ElojobFAQ from '@/components/elojob/ElojobFaq.vue'
import ElojobSummary from '@/components/elojob/ElojobSummary.vue'

import type { ServiceData } from '@/types/serviceData'
import type { RoleId } from '@/types/roleTypes'
import type { Champion } from '@/types/championTypes'
import type { AdditionalOptionsData } from '@/types/additionalOptionsTypes'

const currentElo = ref('')
const targetElo = ref('')
const divisions = ref(0)
const estimatedTime = ref('')
const price = ref(0)
const selectedRoles = ref<RoleId[]>(['top', 'jungle', 'mid', 'adc', 'support'])
const selectedChampions = ref<Champion[]>([])
const additionalOptions = ref<AdditionalOptionsData>({
  express: false,
  badMMR: false,
  specificChampions: false,
  role: false,
})

const updateData = (data: ServiceData) => {
  currentElo.value = data.currentElo ?? currentElo.value
  targetElo.value = data.targetElo ?? targetElo.value
  divisions.value = data.divisions ?? divisions.value
  estimatedTime.value = data.estimatedTime ?? estimatedTime.value
  price.value = data.price ?? price.value
  selectedRoles.value = data.selectedRoles ?? selectedRoles.value
  selectedChampions.value = data.selectedChampions ?? selectedChampions.value
  additionalOptions.value = data.additionalOptions ?? additionalOptions.value
}
</script>

<style scoped>
@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
}

.elojob-page {
  min-height: 100vh;
  padding: calc(75px + 1rem) 3rem 8rem 3rem;
  /* padding: 8rem 3rem 3rem; */
}

.elojob-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 2.5rem;
  align-items: start;
}

.elojob-left {
  display: flex;
  flex-direction: column;
  gap: 9rem;
}

.elojob-right {
  position: sticky;
  top: 5rem;
}

/* Tablets e dispositivos menores */
@media (max-width: 1024px) {
  .elojob-container {
    grid-template-columns: 1fr;
  }

  .elojob-right {
    position: static;
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .elojob-page {
    padding: 6rem 2rem 2rem;
  }

  .elojob-container {
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .elojob-page {
    padding: 5rem 1rem 2rem;
  }
}
</style>
