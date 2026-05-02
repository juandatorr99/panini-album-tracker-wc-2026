import type { Confederation } from '../types'

export type TeamEntry = {
  code: string
  name: string
  flag: string
  confederation: Confederation
  group: string
  isDebutant?: boolean
}

export const TEAMS: TeamEntry[] = [
  // CONCACAF
  { code: 'CAN', name: 'Canada',   flag: '🇨🇦', confederation: 'CONCACAF', group: 'B' },
  { code: 'MEX', name: 'Mexico',   flag: '🇲🇽', confederation: 'CONCACAF', group: 'A' },
  { code: 'USA', name: 'USA',      flag: '🇺🇸', confederation: 'CONCACAF', group: 'D' },
  { code: 'CUW', name: 'Curaçao', flag: '🇨🇼', confederation: 'CONCACAF', group: 'E', isDebutant: true },
  { code: 'HAI', name: 'Haiti',    flag: '🇭🇹', confederation: 'CONCACAF', group: 'C' },
  { code: 'PAN', name: 'Panama',   flag: '🇵🇦', confederation: 'CONCACAF', group: 'L' },
  // CONMEBOL
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL', group: 'J' },
  { code: 'BRA', name: 'Brazil',    flag: '🇧🇷', confederation: 'CONMEBOL', group: 'C' },
  { code: 'COL', name: 'Colombia',  flag: '🇨🇴', confederation: 'CONMEBOL', group: 'K' },
  { code: 'ECU', name: 'Ecuador',   flag: '🇪🇨', confederation: 'CONMEBOL', group: 'E' },
  { code: 'PAR', name: 'Paraguay',  flag: '🇵🇾', confederation: 'CONMEBOL', group: 'D' },
  { code: 'URU', name: 'Uruguay',   flag: '🇺🇾', confederation: 'CONMEBOL', group: 'H' },
  // UEFA
  { code: 'AUT', name: 'Austria',              flag: '🇦🇹', confederation: 'UEFA', group: 'J' },
  { code: 'BEL', name: 'Belgium',              flag: '🇧🇪', confederation: 'UEFA', group: 'G' },
  { code: 'BIH', name: 'Bosnia & Herzegovina', flag: '🇧🇦', confederation: 'UEFA', group: 'B' },
  { code: 'CRO', name: 'Croatia',              flag: '🇭🇷', confederation: 'UEFA', group: 'L' },
  { code: 'CZE', name: 'Czechia',              flag: '🇨🇿', confederation: 'UEFA', group: 'A' },
  { code: 'ENG', name: 'England',              flag: '🏴󠁧󠁢󠁥󠁮󠁧󁿢', confederation: 'UEFA', group: 'L' },
  { code: 'FRA', name: 'France',               flag: '🇫🇷', confederation: 'UEFA', group: 'I' },
  { code: 'GER', name: 'Germany',              flag: '🇩🇪', confederation: 'UEFA', group: 'E' },
  { code: 'NED', name: 'Netherlands',          flag: '🇳🇱', confederation: 'UEFA', group: 'F' },
  { code: 'NOR', name: 'Norway',               flag: '🇳🇴', confederation: 'UEFA', group: 'I' },
  { code: 'POR', name: 'Portugal',             flag: '🇵🇹', confederation: 'UEFA', group: 'K' },
  { code: 'SCO', name: 'Scotland',             flag: '🏴󠁧󠁢󠁳󠁣󠁴󁿢', confederation: 'UEFA', group: 'C' },
  { code: 'ESP', name: 'Spain',                flag: '🇪🇸', confederation: 'UEFA', group: 'H' },
  { code: 'SWE', name: 'Sweden',               flag: '🇸🇪', confederation: 'UEFA', group: 'F' },
  { code: 'SUI', name: 'Switzerland',          flag: '🇨🇭', confederation: 'UEFA', group: 'B' },
  { code: 'TUR', name: 'Türkiye',              flag: '🇹🇷', confederation: 'UEFA', group: 'D' },
  // CAF
  { code: 'ALG', name: 'Algeria',        flag: '🇩🇿', confederation: 'CAF', group: 'J' },
  { code: 'CPV', name: 'Cape Verde',     flag: '🇨🇻', confederation: 'CAF', group: 'H', isDebutant: true },
  { code: 'CIV', name: "Côte d'Ivoire", flag: '🇨🇮', confederation: 'CAF', group: 'E' },
  { code: 'COD', name: 'DR Congo',       flag: '🇨🇩', confederation: 'CAF', group: 'K' },
  { code: 'EGY', name: 'Egypt',          flag: '🇪🇬', confederation: 'CAF', group: 'G' },
  { code: 'GHA', name: 'Ghana',          flag: '🇬🇭', confederation: 'CAF', group: 'L' },
  { code: 'MAR', name: 'Morocco',        flag: '🇲🇦', confederation: 'CAF', group: 'C' },
  { code: 'SEN', name: 'Senegal',        flag: '🇸🇳', confederation: 'CAF', group: 'I' },
  { code: 'RSA', name: 'South Africa',   flag: '🇿🇦', confederation: 'CAF', group: 'A' },
  { code: 'TUN', name: 'Tunisia',        flag: '🇹🇳', confederation: 'CAF', group: 'F' },
  // AFC
  { code: 'AUS', name: 'Australia',    flag: '🇦🇺', confederation: 'AFC', group: 'D' },
  { code: 'IRN', name: 'Iran',         flag: '🇮🇷', confederation: 'AFC', group: 'G' },
  { code: 'IRQ', name: 'Iraq',         flag: '🇮🇶', confederation: 'AFC', group: 'I' },
  { code: 'JPN', name: 'Japan',        flag: '🇯🇵', confederation: 'AFC', group: 'F' },
  { code: 'JOR', name: 'Jordan',       flag: '🇯🇴', confederation: 'AFC', group: 'J', isDebutant: true },
  { code: 'QAT', name: 'Qatar',        flag: '🇶🇦', confederation: 'AFC', group: 'B' },
  { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC', group: 'H' },
  { code: 'KOR', name: 'South Korea',  flag: '🇰🇷', confederation: 'AFC', group: 'A' },
  { code: 'UZB', name: 'Uzbekistan',   flag: '🇺🇿', confederation: 'AFC', group: 'K', isDebutant: true },
  // OFC
  { code: 'NZL', name: 'New Zealand',  flag: '🇳🇿', confederation: 'OFC', group: 'G' },
]
