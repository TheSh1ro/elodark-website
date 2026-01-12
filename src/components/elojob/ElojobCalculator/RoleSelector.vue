<template>
  <transition name="slide-fade">
    <div v-if="show" class="grid-section">
      <h3 class="container-title compact-label">
        <span class="section-number">5</span>
        Selecionar Rotas
        <span class="role-requirement">(Mínimo 2 rotas)</span>
      </h3>
      <div class="roles-grid">
        <label
          v-for="role in roles"
          :key="role.id"
          :class="['role-item', { disabled: isRoleDisabled(role.id) }]"
        >
          <input
            type="checkbox"
            :checked="modelValue.includes(role.id)"
            :disabled="isRoleDisabled(role.id)"
            @change="toggleRole(role.id)"
          />
          <div class="role-content">
            <img class="role-icon" :src="role.icon" />
            <span class="role-name">{{ role.name }}</span>
          </div>
        </label>
      </div>
      <p v-if="modelValue.length < 2" class="role-warning">
        ⚠️ Selecione pelo menos 2 rotas para continuar
      </p>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import iconAdcarry from '@/assets/icons-role/adc.png'
import iconSupport from '@/assets/icons-role/support.png'
import iconMidlaner from '@/assets/icons-role/mid.png'
import iconJungler from '@/assets/icons-role/jungle.png'
import iconToplaner from '@/assets/icons-role/top.png'

export type RoleId = 'top' | 'jungle' | 'mid' | 'adc' | 'support'

interface Role {
  id: RoleId
  name: string
  icon: string
}

interface Props {
  modelValue: RoleId[]
  show: boolean
}

interface Emits {
  (e: 'update:modelValue', value: RoleId[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const roles: Role[] = [
  { id: 'top', name: 'Top', icon: iconToplaner },
  { id: 'jungle', name: 'Jungle', icon: iconJungler },
  { id: 'mid', name: 'Mid', icon: iconMidlaner },
  { id: 'adc', name: 'ADC', icon: iconAdcarry },
  { id: 'support', name: 'Suporte', icon: iconSupport },
]

const isRoleDisabled = computed(() => (roleId: RoleId) => {
  // Se só tem 2 rotas selecionadas e essa rota está selecionada, não pode desmarcar
  return props.modelValue.length === 2 && props.modelValue.includes(roleId)
})

const toggleRole = (roleId: RoleId) => {
  if (isRoleDisabled.value(roleId)) return

  const newValue = props.modelValue.includes(roleId)
    ? props.modelValue.filter((r) => r !== roleId)
    : [...props.modelValue, roleId]

  emit('update:modelValue', newValue)
}
</script>

<style scoped>
@import './EloSelector.css';

.role-requirement {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-left: auto;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.role-item {
  cursor: pointer;
}

.role-item input[type='checkbox'] {
  display: none;
}

.role-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: var(--darker);
  border: 2px solid rgba(76, 186, 157, 0.2);
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.role-item:hover:not(.disabled) .role-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.05);
  transform: translateY(-2px);
}

.role-item input:checked + .role-content {
  border-color: var(--primary);
  background: rgba(76, 186, 157, 0.1);
  box-shadow: 0 0 15px rgba(76, 186, 157, 0.2);
}

.role-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.role-item.disabled .role-content {
  cursor: not-allowed;
}

.role-icon {
  font-size: 2.5rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.role-item:hover:not(.disabled) .role-icon {
  transform: scale(1.1);
}

.role-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  text-align: center;
}

.role-warning {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  color: #ff6b6b;
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .roles-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .role-content {
    padding: 1.25rem 0.75rem;
  }

  .role-icon {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .roles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
