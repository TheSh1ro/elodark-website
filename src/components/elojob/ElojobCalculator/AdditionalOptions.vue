<template>
  <transition name="slide-fade">
    <div v-if="show" class="grid-section">
      <h3 class="container-title compact-label">
        <span class="section-number">4</span>
        Opções Adicionais
      </h3>
      <div class="options-list">
        <label class="option-item">
          <input type="checkbox" :checked="modelValue.route" @change="toggleOption('route')" />
          <div class="option-content">
            <div class="option-header">
              <span class="option-icon">★</span>
              <span class="option-name">Escolher rota</span>
              <span class="option-badge">GRATUITO</span>
            </div>
            <p class="option-description">
              Selecione caso deseje escolher as rotas que o booster irá jogar durante o serviço
            </p>
          </div>
        </label>

        <label class="option-item">
          <input type="checkbox" :checked="modelValue.express" @change="toggleOption('express')" />
          <div class="option-content">
            <div class="option-header">
              <span class="option-icon">★</span>
              <span class="option-name">Prioridade Total</span>
              <span class="option-badge">+30%</span>
            </div>
            <p class="option-description">
              Iniciaremos o serviço com prioridade máxima e terminaremos na maior velocidade
              possível
            </p>
          </div>
        </label>

        <label class="option-item">
          <input type="checkbox" :checked="modelValue.badMMR" @change="toggleOption('badMMR')" />
          <div class="option-content">
            <div class="option-header">
              <span class="option-icon">★</span>
              <span class="option-name">MMR Baixo</span>
              <span class="option-badge">+25%</span>
            </div>
            <p class="option-description">
              Caso sua conta esteja ganhando menos pontos do que o normal selecione essa opção
            </p>
          </div>
        </label>

        <label class="option-item">
          <input
            type="checkbox"
            :checked="modelValue.specificChampions"
            @change="toggleOption('specificChampions')"
          />
          <div class="option-content">
            <div class="option-header">
              <span class="option-icon">★</span>
              <span class="option-name">Campeões Específicos</span>
              <span class="option-badge">+20%</span>
            </div>
            <p class="option-description">
              Escolha quais campeões serão utilizados no boost, útil se você for monochampion ou
              tiver uma pool específica
            </p>
          </div>
        </label>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
export interface AdditionalOptionsData {
  express: boolean
  badMMR: boolean
  specificChampions: boolean
  route: boolean
}

interface Props {
  modelValue: AdditionalOptionsData
  show: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AdditionalOptionsData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toggleOption = (key: keyof AdditionalOptionsData) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: !props.modelValue[key],
  })
}
</script>

<style scoped>
@import './EloSelector.css';

/* Opções Adicionais */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  cursor: pointer;
}

.option-item input[type='checkbox'] {
  display: none;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.2);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-item:hover .option-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.05);
}

.option-item input:checked + .option-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.2);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-icon {
  font-size: 1.3rem;
}

.option-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  flex: 1;
}

.option-badge {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--secondary);
  background: rgba(0, 255, 245, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--secondary);
}

.option-description {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  padding-left: 2rem;
  font-weight: 500;
  line-height: 1.4;
}
</style>
