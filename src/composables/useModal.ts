import { ref } from 'vue'

interface ModalConfig {
  title?: string
  message?: string
  buttonText?: string
}

const defaultConfig: ModalConfig = {
  title: 'Em Construção',
  message: 'Esta funcionalidade está sendo desenvolvida e estará disponível em breve!',
  buttonText: 'Entendi',
}

const isOpen = ref(false)
const config = ref<ModalConfig>({ ...defaultConfig })

export function useModal() {
  const showModal = (customConfig?: ModalConfig) => {
    config.value = { ...defaultConfig, ...customConfig }
    isOpen.value = true
  }

  const hideModal = () => {
    isOpen.value = false
    config.value = { ...defaultConfig }
  }

  return {
    isOpen,
    config,
    showModal,
    hideModal,
  }
}
