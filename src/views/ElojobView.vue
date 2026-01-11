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

const currentElo = ref('Prata')
const targetElo = ref('Diamante')
const divisions = ref(3)
const estimatedTime = ref('6-9 dias')
const price = ref(480)

const updateData = (data: any) => {
  currentElo.value = data.currentElo
  targetElo.value = data.targetElo
  divisions.value = data.divisions
  estimatedTime.value = data.estimatedTime
  price.value = data.price
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
  padding: 8rem 3rem 3rem;
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
  gap: 3rem;
}

.elojob-right {
  position: sticky;
  top: 100px;
  align-self: start;
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
