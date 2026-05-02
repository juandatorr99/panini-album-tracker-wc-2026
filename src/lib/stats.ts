import type { Sticker, Section } from '../types'

export type SectionStats = {
  total: number
  owned: number
  missing: number
  duplicates: number
  foilOwned: number
  foilTotal: number
}

export function computeSection(sectionStickers: Sticker[], counts: Record<string, number>): SectionStats {
  let owned = 0
  let duplicates = 0
  let foilOwned = 0
  let foilTotal = 0

  for (const s of sectionStickers) {
    const count = counts[s.code] ?? 0
    if (count >= 1) owned++
    if (count > 1) duplicates += count - 1
    if (s.isFoil) {
      foilTotal++
      if (count >= 1) foilOwned++
    }
  }

  return {
    total: sectionStickers.length,
    owned,
    missing: sectionStickers.length - owned,
    duplicates,
    foilOwned,
    foilTotal,
  }
}

export function computeOverall(
  stickers: Sticker[],
  counts: Record<string, number>,
  showCoke: boolean
): SectionStats {
  const relevant = showCoke ? stickers : stickers.filter((s) => s.type !== 'coke')
  return computeSection(relevant, counts)
}

export type GroupedStickerList = { sectionId: string; sectionTitle: string; stickers: Sticker[] }[]

export function listDuplicates(
  stickers: Sticker[],
  counts: Record<string, number>,
  sectionTitles: Map<string, string>
): GroupedStickerList {
  const map = new Map<string, Sticker[]>()
  for (const s of stickers) {
    if (s.type === 'coke') continue
    if ((counts[s.code] ?? 0) > 1) {
      const list = map.get(s.section) ?? []
      list.push(s)
      map.set(s.section, list)
    }
  }
  return [...map.entries()].map(([id, items]) => ({
    sectionId: id,
    sectionTitle: sectionTitles.get(id) ?? id,
    stickers: items,
  }))
}

export function listMissing(
  stickers: Sticker[],
  counts: Record<string, number>,
  sectionTitles: Map<string, string>
): GroupedStickerList {
  const map = new Map<string, Sticker[]>()
  for (const s of stickers) {
    if (s.type === 'coke') continue
    if ((counts[s.code] ?? 0) === 0) {
      const list = map.get(s.section) ?? []
      list.push(s)
      map.set(s.section, list)
    }
  }
  return [...map.entries()].map(([id, items]) => ({
    sectionId: id,
    sectionTitle: sectionTitles.get(id) ?? id,
    stickers: items,
  }))
}

export function sectionTitleMap(sections: Section[]): Map<string, string> {
  return new Map(sections.map((s) => [s.id, s.title]))
}
