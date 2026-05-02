import type { Confederation } from '../types'

export type TeamEntry = {
  code: string
  name: string
  confederation: Confederation
  isDebutant?: boolean
}

export const TEAMS: TeamEntry[] = [
  // CONCACAF
  { code: 'CAN', name: 'Canada', confederation: 'CONCACAF' },
  { code: 'MEX', name: 'Mexico', confederation: 'CONCACAF' },
  { code: 'USA', name: 'USA', confederation: 'CONCACAF' },
  { code: 'CUW', name: 'Curaçao', confederation: 'CONCACAF', isDebutant: true },
  { code: 'HAI', name: 'Haiti', confederation: 'CONCACAF' },
  { code: 'PAN', name: 'Panama', confederation: 'CONCACAF' },
  // CONMEBOL
  { code: 'ARG', name: 'Argentina', confederation: 'CONMEBOL' },
  { code: 'BRA', name: 'Brazil', confederation: 'CONMEBOL' },
  { code: 'COL', name: 'Colombia', confederation: 'CONMEBOL' },
  { code: 'ECU', name: 'Ecuador', confederation: 'CONMEBOL' },
  { code: 'PAR', name: 'Paraguay', confederation: 'CONMEBOL' },
  { code: 'URU', name: 'Uruguay', confederation: 'CONMEBOL' },
  // UEFA
  { code: 'AUT', name: 'Austria', confederation: 'UEFA' },
  { code: 'BEL', name: 'Belgium', confederation: 'UEFA' },
  { code: 'BIH', name: 'Bosnia & Herzegovina', confederation: 'UEFA' },
  { code: 'CRO', name: 'Croatia', confederation: 'UEFA' },
  { code: 'CZE', name: 'Czechia', confederation: 'UEFA' },
  { code: 'ENG', name: 'England', confederation: 'UEFA' },
  { code: 'FRA', name: 'France', confederation: 'UEFA' },
  { code: 'GER', name: 'Germany', confederation: 'UEFA' },
  { code: 'NED', name: 'Netherlands', confederation: 'UEFA' },
  { code: 'NOR', name: 'Norway', confederation: 'UEFA' },
  { code: 'POR', name: 'Portugal', confederation: 'UEFA' },
  { code: 'SCO', name: 'Scotland', confederation: 'UEFA' },
  { code: 'ESP', name: 'Spain', confederation: 'UEFA' },
  { code: 'SWE', name: 'Sweden', confederation: 'UEFA' },
  { code: 'SUI', name: 'Switzerland', confederation: 'UEFA' },
  { code: 'TUR', name: 'Türkiye', confederation: 'UEFA' },
  // CAF
  { code: 'ALG', name: 'Algeria', confederation: 'CAF' },
  { code: 'CPV', name: 'Cape Verde', confederation: 'CAF', isDebutant: true },
  { code: 'CIV', name: "Côte d'Ivoire", confederation: 'CAF' },
  { code: 'COD', name: 'DR Congo', confederation: 'CAF' },
  { code: 'EGY', name: 'Egypt', confederation: 'CAF' },
  { code: 'GHA', name: 'Ghana', confederation: 'CAF' },
  { code: 'MAR', name: 'Morocco', confederation: 'CAF' },
  { code: 'SEN', name: 'Senegal', confederation: 'CAF' },
  { code: 'RSA', name: 'South Africa', confederation: 'CAF' },
  { code: 'TUN', name: 'Tunisia', confederation: 'CAF' },
  // AFC
  { code: 'AUS', name: 'Australia', confederation: 'AFC' },
  { code: 'IRN', name: 'Iran', confederation: 'AFC' },
  { code: 'IRQ', name: 'Iraq', confederation: 'AFC' },
  { code: 'JPN', name: 'Japan', confederation: 'AFC' },
  { code: 'JOR', name: 'Jordan', confederation: 'AFC', isDebutant: true },
  { code: 'QAT', name: 'Qatar', confederation: 'AFC' },
  { code: 'KSA', name: 'Saudi Arabia', confederation: 'AFC' },
  { code: 'KOR', name: 'South Korea', confederation: 'AFC' },
  { code: 'UZB', name: 'Uzbekistan', confederation: 'AFC', isDebutant: true },
  // OFC
  { code: 'NZL', name: 'New Zealand', confederation: 'OFC' },
]
