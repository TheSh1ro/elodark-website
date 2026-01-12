<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Selecione a divisão</h3>
        <div class="modal-divisions">
          <div
            v-for="(division, idx) in ['I', 'II', 'III', 'IV']"
            :key="`modal-div-${idx}`"
            :class="['modal-division-item', { disabled: isDivisionDisabled(idx) }]"
            @click="selectDivision(idx)"
          >
            <span class="division-roman">{{ division }}</span>
            <span class="division-label">Divisão {{ division }}</span>
          </div>
        </div>
        <button class="modal-close" @click="close">✕</button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  mode: 'current' | 'target'
  currentElo: number | null
  currentDivision: number | null
  targetElo: number | null
}

interface Emits {
  (e: 'selectDivision', division: number): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDivisionDisabled = (divIndex: number) => {
  if (props.mode === 'current') return false
  if (props.targetElo !== props.currentElo) return false
  if (props.currentDivision === null) return false
  return divIndex >= props.currentDivision
}

const selectDivision = (divIndex: number) => {
  if (isDivisionDisabled(divIndex)) return
  emit('selectDivision', divIndex)
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
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

@media (max-width: 768px) {
  .modal-divisions {
    grid-template-columns: 1fr;
  }

  .division-roman {
    font-size: 2rem;
  }
}
</style>
