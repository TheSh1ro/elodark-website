<template>
  <section class="calculator-section">
    <h2 class="section-title">ELOJOB</h2>
    <p class="section-subtitle" style="margin-bottom: 1.5rem">
      Prencha as informações do seu boost
    </p>

    <div class="calculator-form">
      <!-- Elo Atual -->
      <div class="form-group">
        <label class="form-label">Elo Atual</label>
        <select v-model="currentElo" class="form-select" @change="emitUpdate">
          <option v-for="elo in elos" :key="elo.value" :value="elo.value">
            {{ elo.label }}
          </option>
        </select>
      </div>

      <!-- Elo Desejado -->
      <div class="form-group">
        <label class="form-label">Elo Desejado</label>
        <select v-model="targetElo" class="form-select" @change="emitUpdate">
          <option v-for="elo in availableTargetElos" :key="elo.value" :value="elo.value">
            {{ elo.label }}
          </option>
        </select>
      </div>

      <!-- Servidor -->
      <div class="form-group">
        <label class="form-label">Servidor</label>
        <select v-model="server" class="form-select">
          <option value="br">Brasil (BR)</option>
          <option value="lan">América Latina Norte (LAN)</option>
          <option value="las">América Latina Sul (LAS)</option>
        </select>
      </div>

      <!-- Fila -->
      <div class="form-group">
        <label class="form-label">Fila</label>
        <select v-model="queue" class="form-select">
          <option value="solo">Solo/Duo</option>
          <option value="flex">Flex</option>
        </select>
      </div>

      <!-- Extras -->
      <div class="form-group full-width">
        <label class="form-label">Extras</label>
        <div class="checkbox-group">
          <label class="checkbox-item">
            <input type="checkbox" v-model="options.express" @change="emitUpdate" />
            <span>Express (+30%)</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="options.offline" @change="emitUpdate" />
            <span>Modo Offline (+15%)</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="options.specificChampions" @change="emitUpdate" />
            <span>Campeões Específicos (+20%)</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['update'])

const currentElo = ref(2)
const targetElo = ref(5)
const server = ref('br')
const queue = ref('solo')

const options = ref({
  express: false,
  offline: false,
  specificChampions: false,
})

const elos = [
  { value: 0, label: 'Ferro', basePrice: 50 },
  { value: 1, label: 'Bronze', basePrice: 60 },
  { value: 2, label: 'Prata', basePrice: 80 },
  { value: 3, label: 'Ouro', basePrice: 120 },
  { value: 4, label: 'Platina', basePrice: 180 },
  { value: 5, label: 'Diamante', basePrice: 280 },
  { value: 6, label: 'Mestre', basePrice: 450 },
  { value: 7, label: 'Grão-Mestre', basePrice: 700 },
]

const availableTargetElos = computed(() => {
  return elos.filter((elo) => elo.value > currentElo.value)
})

const divisions = computed(() => {
  return targetElo.value - currentElo.value
})

const basePrice = computed(() => {
  let total = 0
  for (let i = currentElo.value; i < targetElo.value; i++) {
    total += elos[i].basePrice
  }
  return total
})

const finalPrice = computed(() => {
  let price = basePrice.value
  if (options.value.express) price *= 1.3
  if (options.value.offline) price *= 1.15
  if (options.value.specificChampions) price *= 1.2
  return Math.round(price)
})

const estimatedTime = computed(() => {
  let days = divisions.value * 2
  if (options.value.express) days = Math.ceil(days * 0.6)
  return `${days}-${days + 3} dias`
})

const emitUpdate = () => {
  if (targetElo.value <= currentElo.value) {
    targetElo.value = currentElo.value + 1
  }

  emit('update', {
    currentElo: elos[currentElo.value].label,
    targetElo: elos[targetElo.value].label,
    divisions: divisions.value,
    estimatedTime: estimatedTime.value,
    price: finalPrice.value,
  })
}

// Emitir dados iniciais
watch(() => [currentElo.value, targetElo.value], emitUpdate, { immediate: true })
</script>

<style scoped>
.calculator-section {
  margin-bottom: 3rem;
}

.calculator-form {
  background: var(--dark);
  border: 1px solid rgba(76, 186, 157, 0.3);
  border-radius: 12px;
  padding: 3rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-select {
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.3);
  border-radius: 6px;
  padding: 1rem;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-select:hover,
.form-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.2);
  outline: none;
}

.checkbox-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s;
}

.checkbox-item:hover {
  color: var(--primary);
}

.checkbox-item input[type='checkbox'] {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
  cursor: pointer;
}

@media (max-width: 768px) {
  .calculator-form {
    padding: 2rem;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .checkbox-group {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
