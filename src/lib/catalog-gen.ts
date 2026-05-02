import type { Sticker, Section } from '../types'
import { TEAMS } from './teams'
import { MUSEUM_ENTRIES } from './museum'
import { COKE_PLAYERS } from './coke'

const INTRO_STICKERS: { code: string; name: string }[] = [
  { code: '00', name: 'Panini Logo' },
  { code: 'FWC1', name: 'Official Emblem' },
  { code: 'FWC2', name: 'Tournament Emblem' },
  { code: 'FWC3', name: 'Official Mascots' },
  { code: 'FWC4', name: 'Official Slogan' },
  { code: 'FWC5', name: 'Adidas Official Ball' },
  { code: 'FWC6', name: 'Canada — Host Country' },
  { code: 'FWC7', name: 'Mexico — Host Country' },
  { code: 'FWC8', name: 'USA — Host Country' },
]

export function buildSections(): Section[] {
  return [
    { id: 'intro', title: 'Intro & Tournament' },
    ...TEAMS.map((t) => ({
      id: t.code,
      title: t.name,
      flag: t.flag,
      confederation: t.confederation,
    })),
    { id: 'museum', title: 'FIFA Museum' },
    { id: 'coke', title: 'Coca-Cola Insert', optional: true },
  ]
}

export function buildStickers(): Sticker[] {
  const stickers: Sticker[] = []

  for (const s of INTRO_STICKERS) {
    stickers.push({ code: s.code, type: 'intro', section: 'intro', name: s.name, isFoil: true })
  }

  for (const team of TEAMS) {
    for (let slot = 1; slot <= 20; slot++) {
      let type: Sticker['type']
      let name: string
      let isFoil = false

      if (slot === 1) {
        type = 'team_crest'
        name = `${team.name} Crest`
        isFoil = true
      } else if (slot === 13) {
        type = 'team_photo'
        name = `${team.name} Squad`
      } else {
        type = 'player'
        const playerNum = slot < 13 ? slot - 1 : slot - 2
        name = `${team.name} Player ${playerNum}`
      }

      stickers.push({
        code: `${team.code}${slot}`,
        type,
        section: team.code,
        name,
        isFoil,
        team: team.code,
        ...(slot === 1 && team.isDebutant ? { isDebutant: true } : {}),
      })
    }
  }

  for (const m of MUSEUM_ENTRIES) {
    stickers.push({ code: m.code, type: 'museum', section: 'museum', name: m.name, isFoil: true })
  }

  COKE_PLAYERS.forEach((player, i) => {
    stickers.push({
      code: `COKE${i + 1}`,
      type: 'coke',
      section: 'coke',
      name: player,
      isFoil: false,
    })
  })

  return stickers
}
