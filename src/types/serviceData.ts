import type { RoleId } from '@/types/roleTypes'
import type { Champion } from '@/types/championTypes'
import type { AdditionalOptionsData } from '@/types/additionalOptionsTypes'
import type { QueueType } from '@/types/queueTypes'

export interface ServiceData {
  currentElo?: string
  targetElo?: string
  divisions?: number
  estimatedTime?: string
  price?: number
  selectedRoles?: RoleId[]
  selectedChampions?: Champion[]
  additionalOptions?: AdditionalOptionsData
  queueType?: QueueType
}
