<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <div class="modal-corner top-left"></div>
        <div class="modal-corner top-right"></div>
        <div class="modal-corner bottom-left"></div>
        <div class="modal-corner bottom-right"></div>

        <!-- Close Button -->
        <button class="modal-close" @click="close" aria-label="Fechar">×</button>

        <!-- Header -->
        <div class="modal-header">
          <span class="status-indicator"></span>
          <h3 class="modal-title">Selecione a Divisão</h3>
        </div>

        <!-- Division Grid -->
        <div class="modal-divisions">
          <div
            v-for="(division, idx) in ['I', 'II', 'III', 'IV']"
            :key="`modal-div-${idx}`"
            :class="['modal-division-item', { disabled: isDivisionDisabled(idx) }]"
            @click="selectDivision(idx)"
          >
            <span class="division-corner tl"></span>
            <span class="division-corner tr"></span>
            <span class="division-corner bl"></span>
            <span class="division-corner br"></span>

            <span class="division-roman">{{ division }}</span>
            <span class="division-label">Divisão {{ division }}</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal-content {
  position: relative;
  background: linear-gradient(145deg, rgba(10, 14, 26, 0.98), rgba(15, 20, 35, 0.98));
  border: 2px solid var(--primary);
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  clip-path: polygon(
    0 12px,
    12px 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% calc(100% - 12px),
    calc(100% - 12px) 100%,
    12px 100%,
    0 calc(100% - 12px)
  );
  box-shadow:
    0 0 40px rgba(76, 186, 157, 0.4),
    inset 0 0 40px rgba(76, 186, 157, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary) 20%,
    var(--primary) 80%,
    transparent
  );
  animation: borderScan 3s linear infinite;
}

.modal-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--secondary) 20%,
    var(--secondary) 80%,
    transparent
  );
  animation: borderScan 3s linear infinite reverse;
}

@keyframes borderScan {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.modal-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid var(--primary);
  box-shadow: 0 0 10px var(--primary);
}

.modal-corner.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.modal-corner.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.modal-corner.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.modal-corner.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: 1px solid var(--primary);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--primary);
  font-size: 1.5rem;
  line-height: 1;
  transition: all 0.2s ease;
  clip-path: polygon(20% 0, 100% 0, 80% 100%, 0 100%);
  font-weight: 300;
  z-index: 10;
}

.modal-close:hover {
  background: var(--primary);
  color: var(--dark);
  box-shadow: 0 0 15px var(--primary);
  transform: rotate(5deg);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.modal-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 15px var(--primary);
  line-height: 1;
}

.modal-divisions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.modal-division-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba(10, 14, 26, 0.8), rgba(15, 20, 35, 0.6));
  border: 2px solid rgba(76, 186, 157, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 1/1;
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  overflow: hidden;
}

.modal-division-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 245, 0.1), transparent);
  transition: left 0.4s ease;
}

.modal-division-item:hover:not(.disabled)::before {
  left: 100%;
}

.modal-division-item:hover:not(.disabled) {
  border-color: var(--secondary);
  background: linear-gradient(135deg, rgba(0, 255, 245, 0.15), rgba(15, 20, 35, 0.8));
  box-shadow:
    0 0 25px rgba(0, 255, 245, 0.4),
    inset 0 0 20px rgba(0, 255, 245, 0.1);
  transform: translateY(-4px) scale(1.02);
}

.modal-division-item.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(0.8);
}

.modal-division-item.disabled::before {
  display: none;
}

.division-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid var(--secondary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-division-item:hover:not(.disabled) .division-corner {
  opacity: 1;
}

.division-corner.tl {
  top: 2px;
  left: 2px;
  border-right: none;
  border-bottom: none;
}

.division-corner.tr {
  top: 2px;
  right: 2px;
  border-left: none;
  border-bottom: none;
}

.division-corner.bl {
  bottom: 2px;
  left: 2px;
  border-right: none;
  border-top: none;
}

.division-corner.br {
  bottom: 2px;
  right: 2px;
  border-left: none;
  border-top: none;
}

.division-roman {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--secondary);
  text-shadow: 0 0 20px var(--secondary);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.modal-division-item:hover:not(.disabled) .division-roman {
  transform: scale(1.1);
  text-shadow:
    0 0 30px var(--secondary),
    0 0 40px var(--secondary);
}

.division-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
  position: relative;
  z-index: 1;
}

.modal-division-item:hover:not(.disabled) .division-label {
  color: rgba(255, 255, 255, 0.95);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.9) translateY(30px);
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-30px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    padding: 2rem 1.5rem;
  }

  .modal-divisions {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }

  .modal-division-item {
    padding: 1.5rem 0.75rem;
  }

  .division-roman {
    font-size: 2rem;
  }

  .division-label {
    font-size: 0.85rem;
  }

  .modal-title {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1.75rem 1.25rem;
    max-width: 380px;
  }

  .modal-header {
    margin-bottom: 1.5rem;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-divisions {
    gap: 0.75rem;
  }

  .division-roman {
    font-size: 1.75rem;
  }

  .division-label {
    font-size: 0.8rem;
  }
}
</style>
