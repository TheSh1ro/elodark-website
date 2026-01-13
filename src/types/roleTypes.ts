export type RoleId = 'top' | 'jungle' | 'mid' | 'adc' | 'support'

export interface Role {
  id: RoleId
  name: string
  icon: string
}
