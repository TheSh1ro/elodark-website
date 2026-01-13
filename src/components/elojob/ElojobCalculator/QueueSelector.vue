<template>
  <transition name="slide-fade">
    <div v-if="show" class="grid-section">
      <h3 class="container-title compact-label">
        <span class="section-number">3</span>
        Tipo de Fila
      </h3>
      <div class="queue-buttons">
        <label class="queue-item">
          <input type="radio" :checked="modelValue === 'solo'" @change="selectQueue('solo')" />
          <div class="queue-content">
            <div class="queue-header">
              <span class="queue-name">Ranqueada Solo/Duo</span>
            </div>
          </div>
        </label>

        <label class="queue-item">
          <input type="radio" :checked="modelValue === 'flex'" @change="selectQueue('flex')" />
          <div class="queue-content">
            <div class="queue-header">
              <span class="queue-name">Ranqueada Flex</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  show: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const selectQueue = (queue: string) => {
  emit('update:modelValue', queue)
}
</script>

<style scoped>
@import './EloSelector.css';

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
  color: whitesmoke;
}

@media (max-width: 768px) {
  .queue-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
