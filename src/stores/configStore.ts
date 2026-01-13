// src/stores/configStore.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { EloData } from '@/types/eloData'

import emblemIron from '@/assets/emblems-rank/emblem-iron.png'
import emblemBronze from '@/assets/emblems-rank/emblem-bronze.png'
import emblemSilver from '@/assets/emblems-rank/emblem-silver.png'
import emblemGold from '@/assets/emblems-rank/emblem-gold.png'
import emblemPlatinum from '@/assets/emblems-rank/emblem-platinum.png'
import emblemEmerald from '@/assets/emblems-rank/emblem-emerald.png'
import emblemDiamond from '@/assets/emblems-rank/emblem-diamond.png'
import emblemMaster from '@/assets/emblems-rank/emblem-master.png'
import emblemGrandmaster from '@/assets/emblems-rank/emblem-grandmaster.png'

interface Champion {
  id: string
  name: string
  image: {
    full: string
  }
}

interface Multipliers {
  express: number
  badMMR: number
  specificChampions: number
  role: number
}

interface Settings {
  maxElo: number
  baseDaysPerDivision: number
  expressTimeMultiplier: number
  cdnVersion: string
}

export const useConfigStore = defineStore('config', () => {
  // ============================================
  // STATE
  // ============================================

  // Tabela de preços base por elo
  const elosPricing = ref<EloData[]>([
    { value: 0, label: 'Ferro', emblem: emblemIron, basePrice: 9.9, hasLeagues: true },
    { value: 1, label: 'Bronze', emblem: emblemBronze, basePrice: 11.9, hasLeagues: true },
    { value: 2, label: 'Prata', emblem: emblemSilver, basePrice: 14.9, hasLeagues: true },
    { value: 3, label: 'Ouro', emblem: emblemGold, basePrice: 14.9, hasLeagues: true },
    { value: 4, label: 'Platina', emblem: emblemPlatinum, basePrice: 22.9, hasLeagues: true },
    { value: 5, label: 'Esmeralda', emblem: emblemEmerald, basePrice: 29.9, hasLeagues: true },
    { value: 6, label: 'Diamante', emblem: emblemDiamond, basePrice: 50, hasLeagues: true },
    { value: 7, label: 'Mestre', emblem: emblemMaster, basePrice: 500, hasLeagues: false },
    {
      value: 8,
      label: 'Grão-Mestre',
      emblem: emblemGrandmaster,
      basePrice: 800,
      hasLeagues: false,
    },
  ])

  // Multiplicadores de opções extras
  const multipliers = ref<Multipliers>({
    express: 1.3, // +30%
    badMMR: 1.25, // +25%
    specificChampions: 1.3, // +30%
    role: 1.0, // Gratuito
  })

  // Configurações gerais
  const settings = ref<Settings>({
    maxElo: 7, // Limite padrão (Mestre)
    baseDaysPerDivision: 0.5, // Dias base por divisão
    expressTimeMultiplier: 0.6, // Multiplicador de tempo express
    cdnVersion: '13.12.1', // Versão do CDN da Riot
  })

  // Cache de campeões da API Riot
  const champions = ref<Champion[]>([])

  // Estados de loading e erro
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<number | null>(null)

  // ============================================
  // GETTERS
  // ============================================

  /**
   * Busca um elo específico pelo valor
   */
  const getEloByValue = computed(() => {
    return (value: number): EloData | undefined => {
      return elosPricing.value.find((elo) => elo.value === value)
    }
  })

  /**
   * Retorna elos disponíveis até um limite máximo
   */
  const getAvailableElos = computed(() => {
    return (maxElo: number = settings.value.maxElo): EloData[] => {
      return elosPricing.value.filter((elo) => elo.value <= maxElo)
    }
  })

  /**
   * Retorna elos disponíveis para seleção inicial (excluindo o limite)
   */
  const getCurrentElos = computed(() => {
    return (maxElo: number = settings.value.maxElo): EloData[] => {
      return elosPricing.value.filter((elo) => elo.value < maxElo)
    }
  })

  /**
   * Verifica se precisa recarregar campeões (cache de 24 horas)
   */
  const shouldRefetchChampions = computed(() => {
    if (!lastFetched.value) return true
    const oneDay = 24 * 60 * 60 * 1000
    return Date.now() - lastFetched.value > oneDay
  })

  /**
   * Verifica se as configurações já foram carregadas
   */
  const isLoaded = computed(() => {
    return elosPricing.value.length > 0
  })

  /**
   * URL base do CDN da Riot
   */
  const championsCdnUrl = computed(() => {
    return `https://ddragon.leagueoflegends.com/cdn/${settings.value.cdnVersion}`
  })

  /**
   * Gera URL da imagem de um campeão
   */
  const getChampionImageUrl = (imageName: string): string => {
    return `${championsCdnUrl.value}/img/champion/${imageName}`
  }

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Busca lista de campeões da API Riot (com cache)
   */
  async function fetchChampions(): Promise<void> {
    // Se já tem cache válido, não busca novamente
    if (champions.value.length > 0 && !shouldRefetchChampions.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const url = `${championsCdnUrl.value}/data/pt_BR/champion.json`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Falha ao carregar campeões da API Riot')
      }

      const data = await response.json()
      champions.value = Object.values(data.data) as Champion[]
      lastFetched.value = Date.now()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido ao carregar campeões'
      console.error('Error fetching champions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca configurações do backend (futuro)
   * Por enquanto usa valores hardcoded
   */
  async function fetchConfig(): Promise<void> {
    // TODO: Implementar quando tiver backend
    // const response = await fetch('/api/config')
    // const data = await response.json()
    // settings.value = data.settings
    // multipliers.value = data.multipliers

    // Por enquanto, apenas simula delay
    return Promise.resolve()
  }

  /**
   * Busca tabela de preços do backend (futuro)
   * Por enquanto usa valores hardcoded
   */
  async function fetchPricing(): Promise<void> {
    // TODO: Implementar quando tiver backend
    // const response = await fetch('/api/pricing')
    // const data = await response.json()
    // elosPricing.value = data.pricing

    // Por enquanto, apenas simula delay
    return Promise.resolve()
  }

  /**
   * Atualiza um multiplicador específico
   */
  function updateMultiplier(key: keyof Multipliers, value: number): void {
    multipliers.value[key] = value
  }

  /**
   * Atualiza uma configuração específica
   */
  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
    settings.value[key] = value
  }

  /**
   * Reseta todas as configurações para os valores padrão
   */
  function reset(): void {
    multipliers.value = {
      express: 1.3,
      badMMR: 1.25,
      specificChampions: 1.3,
      role: 1.0,
    }

    settings.value = {
      maxElo: 7,
      baseDaysPerDivision: 0.5,
      expressTimeMultiplier: 0.6,
      cdnVersion: '13.12.1',
    }

    champions.value = []
    lastFetched.value = null
    error.value = null
  }

  /**
   * Inicializa o store (carrega configurações iniciais)
   */
  async function initialize(): Promise<void> {
    try {
      await Promise.all([
        fetchConfig(),
        fetchPricing(),
        fetchChampions(), // é chamado sob demanda, não na inicialização
      ])
    } catch (err) {
      console.error('Error initializing config store:', err)
    }
  }

  return {
    // State
    elosPricing,
    multipliers,
    settings,
    champions,
    loading,
    error,
    lastFetched,

    // Getters
    getEloByValue,
    getAvailableElos,
    getCurrentElos,
    shouldRefetchChampions,
    isLoaded,
    championsCdnUrl,
    getChampionImageUrl,

    // Actions
    fetchChampions,
    fetchConfig,
    fetchPricing,
    updateMultiplier,
    updateSetting,
    reset,
    initialize,
  }
})
