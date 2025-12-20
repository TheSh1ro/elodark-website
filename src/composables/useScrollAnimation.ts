import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollAnimation(options = {}) {
  const target: Ref<HTMLElement | null> = ref(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  const defaultOptions = {
    threshold: 0.2, // 10% do elemento precisa estar visível
    rootMargin: '0px',
    once: true, // Anima apenas uma vez
    ...options,
  }

  onMounted(() => {
    if (!target.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true

            // Se once = true, para de observar
            if (defaultOptions.once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!defaultOptions.once) {
            isVisible.value = false
          }
        })
      },
      {
        threshold: defaultOptions.threshold,
        rootMargin: defaultOptions.rootMargin,
      },
    )

    observer.observe(target.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    target,
    isVisible,
  }
}
