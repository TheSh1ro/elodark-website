<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <div class="modal-corner top-left"></div>
        <div class="modal-corner top-right"></div>
        <div class="modal-corner bottom-left"></div>
        <div class="modal-corner bottom-right"></div>

        <div class="scanline"></div>

        <!-- Close Button -->
        <button class="modal-close" @click="close" aria-label="Fechar">×</button>

        <!-- Content -->
        <div class="modal-header">
          <span class="status-indicator"></span>
          <h2 class="modal-title">{{ title }}</h2>
        </div>

        <p class="modal-message">{{ message }}</p>

        <!-- Button -->
        <button class="modal-button" @click="close">
          <span class="btn-text">{{ buttonText }}</span>
          <span class="btn-corner"></span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  buttonText?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Em Construção 🚧',
  message: 'Esta funcionalidade está sendo desenvolvida e estará disponível em breve!',
  buttonText: 'Entendi',
})

const emit = defineEmits<Emits>()

const close = () => {
  emit('update:modelValue', false)
}

// Bloquear scroll quando modal abrir
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

// Fechar com ESC
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscape)
}

// Cleanup
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleEscape)
  }
  document.body.style.overflow = ''
})
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
  padding: 2rem 2.5rem;
  max-width: 420px;
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

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(76, 186, 157, 0.03) 2px,
    rgba(76, 186, 157, 0.03) 4px
  );
  pointer-events: none;
  animation: scan 8s linear infinite;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50px);
  }
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
  margin-bottom: 1rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #ffc107;
  box-shadow: 0 0 10px #ffc107;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
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

.modal-message {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.75rem 0;
  letter-spacing: 0.5px;
  border-left: 2px solid rgba(76, 186, 157, 0.3);
  padding-left: 1rem;
}

.modal-button {
  position: relative;
  width: 100%;
  padding: 0.9rem 2rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  overflow: hidden;
}

.modal-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--primary);
  transition: left 0.3s ease;
  z-index: 0;
}

.modal-button:hover::before {
  left: 0;
}

.modal-button:hover {
  color: var(--dark);
  box-shadow:
    0 0 20px var(--primary),
    inset 0 0 20px rgba(76, 186, 157, 0.2);
  transform: translateY(-2px);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-corner {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  background: var(--primary);
  z-index: 1;
  transition: all 0.3s ease;
}

.modal-button:hover .btn-corner {
  background: var(--dark);
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
@media (max-width: 640px) {
  .modal-content {
    padding: 1.75rem 1.75rem;
    max-width: 360px;
  }

  .modal-close {
    width: 26px;
    height: 26px;
    font-size: 1.3rem;
  }

  .modal-title {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }

  .modal-message {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .modal-button {
    padding: 0.85rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 380px) {
  .modal-content {
    padding: 1.5rem 1.5rem;
    max-width: 320px;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-message {
    font-size: 0.85rem;
  }
}
</style>
