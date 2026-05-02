import { buildSections, buildStickers } from '../lib/catalog-gen'

export type { Sticker, Section, StickerType } from '../types'

export const sections = buildSections()
export const stickers = buildStickers()

export const stickerByCode = new Map(stickers.map((s) => [s.code, s]))
export const stickersBySection = new Map(
  sections.map((sec) => [sec.id, stickers.filter((s) => s.section === sec.id)])
)

if (import.meta.env.DEV) {
  const base = stickers.filter((s) => s.type !== 'coke')
  console.assert(base.length === 980, `Expected 980 base stickers, got ${base.length}`)
  const foils = stickers.filter((s) => s.isFoil && s.type !== 'coke')
  console.assert(foils.length === 68, `Expected 68 foil stickers, got ${foils.length}`)
}
