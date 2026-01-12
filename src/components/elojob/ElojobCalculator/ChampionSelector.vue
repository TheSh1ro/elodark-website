<template>
  <transition name="slide-fade">
    <div v-if="show" class="grid-section">
      <h3 class="container-title compact-label">
        <span class="section-number">6</span>
        Campeões Específicos
      </h3>

      <div class="champion-selector-content">
        <button class="select-champions-btn" @click="openModal">
          <span class="btn-icon">🎯</span>
          <span class="btn-text">{{
            selectedChampions.length === 0
              ? 'Escolher Campeões'
              : `${selectedChampions.length} Campeão${selectedChampions.length > 1 ? 'es' : ''} Selecionado${selectedChampions.length > 1 ? 's' : ''}`
          }}</span>
        </button>

        <transition name="champions-fade">
          <div v-if="selectedChampions.length > 0" class="selected-champions">
            <div
              v-for="champion in selectedChampions"
              :key="champion.id"
              class="champion-badge"
              :title="champion.name"
            >
              <img :src="champion.icon" :alt="champion.name" class="champion-icon" />
              <button class="remove-champion" @click="removeChampion(champion.id)">×</button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Modal placeholder - será implementado depois -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h3 class="modal-title">Selecionar Campeões</h3>
          <p class="modal-placeholder">
            🚧 Modal de seleção de campeões será implementado em breve
          </p>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface Champion {
  id: string
  name: string
  icon: string
}

interface Props {
  selectedChampions: Champion[]
  show: boolean
}

interface Emits {
  (e: 'update:selectedChampions', value: Champion[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showModal = ref(false)

// TEMPORÁRIO: Dados de exemplo para visualização
// Remover quando o modal estiver implementado
const exampleChampions: Champion[] = [
  {
    id: '1',
    name: 'Yasuo',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yasuo.png',
  },
  {
    id: '2',
    name: 'Zed',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png',
  },
  {
    id: '3',
    name: 'Lee Sin',
    icon: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/LeeSin.png',
  },
]

const openModal = () => {
  // TEMPORÁRIO: Adicionar campeões de exemplo ao abrir modal
  // Remover quando o modal real estiver implementado
  if (props.selectedChampions.length === 0) {
    emit('update:selectedChampions', exampleChampions)
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const removeChampion = (championId: string) => {
  const newChampions = props.selectedChampions.filter((c) => c.id !== championId)
  emit('update:selectedChampions', newChampions)
}
</script>

<style scoped>
@import './EloSelector.css';

.champion-selector-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.select-champions-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: var(--darker);
  border: 2px solid var(--primary);
  border-radius: 10px;
  color: white;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-champions-btn:hover {
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 25px rgba(76, 186, 157, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.5rem;
}

.btn-text {
  flex: 1;
}

.selected-champions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: var(--darker);
  border: 1px solid rgba(76, 186, 157, 0.2);
  border-radius: 10px;
}

.champion-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid var(--primary);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.champion-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.4);
}

.champion-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-champion {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff4444;
  border: 2px solid var(--darker);
  border-radius: 50%;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
  padding: 0;
}

.champion-badge:hover .remove-champion {
  opacity: 1;
}

.remove-champion:hover {
  background: #ff0000;
  transform: scale(1.1);
}

/* Modal Placeholder */
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
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 0 60px rgba(76, 186, 157, 0.4);
  text-align: center;
}

.modal-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-placeholder {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.6;
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
.champions-fade-enter-active,
.champions-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.champions-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.champions-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .select-champions-btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .selected-champions {
    gap: 0.75rem;
  }

  .champion-badge {
    width: 50px;
    height: 50px;
  }
}
</style>
