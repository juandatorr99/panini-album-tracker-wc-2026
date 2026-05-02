export type StickerType =
  | 'intro'
  | 'museum'
  | 'team_crest'
  | 'team_photo'
  | 'player'
  | 'coke'

export type Confederation = 'CONCACAF' | 'CONMEBOL' | 'UEFA' | 'CAF' | 'AFC' | 'OFC'

export type Sticker = {
  code: string
  type: StickerType
  section: string
  name: string
  isFoil: boolean
  team?: string
  isDebutant?: boolean
}

export type Section = {
  id: string
  title: string
  flag?: string
  group?: string
  confederation?: Confederation
  optional?: boolean
}
