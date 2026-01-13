<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="close">
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
          <h3 class="modal-title">Selecionar Campeões</h3>
        </div>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-icon">//</div>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar campeão..."
            autocomplete="off"
          />
          <div v-if="searchQuery" class="clear-search" @click="searchQuery = ''">×</div>
        </div>

        <!-- Selected Count -->
        <div class="selected-count">
          <span class="count-label">Selecionados:</span>
          <span class="count-value">{{ selectedIds.size }}</span>
        </div>

        <!-- Champions Grid -->
        <div class="champions-container">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Carregando campeões...</p>
          </div>

          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="loadChampions">Tentar Novamente</button>
          </div>

          <div v-else-if="filteredChampions.length === 0" class="empty-state">
            <p>Nenhum campeão encontrado</p>
          </div>

          <div v-else class="champions-grid">
            <div
              v-for="champion in filteredChampions"
              :key="champion.id"
              :class="['champion-card', { selected: selectedIds.has(champion.id) }]"
              :title="champion.name"
              @click="toggleChampion(champion)"
            >
              <div class="champion-image-container">
                <img
                  :src="getChampionImageUrl(champion.image.full)"
                  :alt="champion.name"
                  class="champion-image"
                  loading="lazy"
                />
              </div>
              <div class="champion-check">✓</div>
              <div class="champion-name">{{ champion.name }}</div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button class="action-btn secondary" @click="clearSelection">
            <span class="btn-text">Limpar</span>
          </button>
          <button class="action-btn primary" @click="confirm">
            <span class="btn-text">Confirmar</span>
            <span class="btn-corner"></span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import type { Champion } from '@/types/championTypes'

interface ChampionData {
  id: string
  name: string
  image: {
    full: string
  }
}

interface Props {
  modelValue: boolean
  selectedChampions: Champion[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', champions: Champion[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const champions = ref<ChampionData[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedIds = ref(new Set<string>())

const CDN_VERSION = '13.12.1'
const CHAMPIONS_URL = `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/data/pt_BR/champion.json`

const getChampionImageUrl = (imageName: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/img/champion/${imageName}`
}

const filteredChampions = computed(() => {
  if (!searchQuery.value) return champions.value

  const query = searchQuery.value.toLowerCase().trim()
  return champions.value.filter((champion) => champion.name.toLowerCase().includes(query))
})

const loadChampions = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(CHAMPIONS_URL)
    if (!response.ok) throw new Error('Falha ao carregar campeões')

    const data = await response.json()
    champions.value = Object.values(data.data) as ChampionData[]
  } catch (err) {
    error.value = 'Erro ao carregar campeões. Verifique sua conexão.'
    console.error('Error loading champions:', err)
  } finally {
    loading.value = false
  }
}

const toggleChampion = (champion: ChampionData) => {
  if (selectedIds.value.has(champion.id)) {
    selectedIds.value.delete(champion.id)
  } else {
    selectedIds.value.add(champion.id)
  }
}

const clearSelection = () => {
  selectedIds.value.clear()
}

const confirm = () => {
  const selected: Champion[] = champions.value
    .filter((c) => selectedIds.value.has(c.id))
    .map((c) => ({
      id: c.id,
      name: c.name,
      icon: getChampionImageUrl(c.image.full),
    }))

  emit('confirm', selected)
  emit('update:modelValue', false)
}

const close = () => {
  emit('update:modelValue', false)
}

// Initialize selected champions from props
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      selectedIds.value = new Set(props.selectedChampions.map((c) => c.id))
      searchQuery.value = ''
    }
  },
)

onMounted(() => {
  loadChampions()
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
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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
  z-index: 1;
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
  margin-bottom: 1.5rem;
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

/* Search Bar */
.search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  background: rgba(10, 14, 26, 0.6);
  border: 2px solid rgba(76, 186, 157, 0.3);
  padding: 0.75rem 1rem;
  clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
  transition: all 0.3s ease;
}

.search-container:focus-within {
  border-color: var(--secondary);
  box-shadow: 0 0 15px rgba(0, 255, 245, 0.2);
}

.search-icon {
  font-family: 'Orbitron', sans-serif;
  color: var(--primary);
  font-size: 1.2rem;
  font-weight: 700;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.clear-search {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  line-height: 1;
  transition: all 0.2s ease;
  padding: 0 0.25rem;
}

.clear-search:hover {
  color: var(--primary);
  transform: scale(1.2);
}

/* Selected Count */
.selected-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 245, 0.05);
  border-left: 3px solid var(--secondary);
}

.count-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.count-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  color: var(--secondary);
  font-weight: 700;
}

/* Champions Container */
.champions-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding-right: 0.5rem;
}

.champions-container::-webkit-scrollbar {
  width: 8px;
}

.champions-container::-webkit-scrollbar-track {
  background: rgba(10, 14, 26, 0.6);
  border-radius: 4px;
}

.champions-container::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
  box-shadow: 0 0 10px var(--primary);
}

.champions-container::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}

/* Grid States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(76, 186, 157, 0.2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
}

.retry-btn:hover {
  background: var(--primary);
  color: var(--dark);
  box-shadow: 0 0 20px var(--primary);
}

/* Champions Grid */
.champions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
  padding: 0.5rem;
}

.champion-card {
  position: relative;
  aspect-ratio: 1;
  cursor: pointer;
  background: rgba(10, 14, 26, 0.8);
  border: 2px solid rgba(76, 186, 157, 0.2);
  clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.champion-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(76, 186, 157, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.champion-card:hover::before {
  opacity: 1;
}

.champion-card:hover {
  border-color: var(--secondary);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 255, 245, 0.3);
  z-index: 10;
}

.champion-card.selected {
  border-color: var(--secondary);
  background: rgba(0, 255, 245, 0.15);
  box-shadow: 0 0 20px rgba(0, 255, 245, 0.4);
}

.champion-image-container {
  position: absolute;
  inset: 0;
}

.champion-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.champion-check {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: var(--secondary);
  color: var(--dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 900;
  border-radius: 2px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 0 10px var(--secondary);
}

.champion-card.selected .champion-check {
  opacity: 1;
  transform: scale(1);
}

.champion-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 0.25rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent);
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.champion-card:hover .champion-name {
  opacity: 1;
  transform: translateY(0);
}

/* Action Buttons */
.modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(76, 186, 157, 0.2);
}

.action-btn {
  position: relative;
  flex: 1;
  padding: 0.9rem 2rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: transparent;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  overflow: hidden;
}

.action-btn.secondary {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.action-btn.secondary:hover {
  border-color: rgba(255, 255, 255, 0.6);
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.action-btn.primary {
  border-color: var(--primary);
  color: var(--primary);
}

.action-btn.primary::before {
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

.action-btn.primary:hover::before {
  left: 0;
}

.action-btn.primary:hover {
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

.action-btn.primary:hover .btn-corner {
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
@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    max-width: 95%;
  }

  .modal-title {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }

  .champions-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 0.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .action-btn {
    padding: 0.85rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .champions-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }

  .search-input {
    font-size: 0.9rem;
  }
}
</style>
