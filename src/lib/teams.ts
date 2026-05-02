import type { Confederation } from '../types'

export type TeamEntry = {
  code: string
  name: string
  flag: string
  confederation: Confederation
  isDebutant?: boolean
}

export const TEAMS: TeamEntry[] = [
  // CONCACAF
  { code: 'CAN', name: 'Canada',   flag: '🇨🇦', confederation: 'CONCACAF' },
  { code: 'MEX', name: 'Mexico',   flag: '🇲🇽', confederation: 'CONCACAF' },
  { code: 'USA', name: 'USA',      flag: '🇺🇸', confederation: 'CONCACAF' },
  { code: 'CUW', name: 'Curaçao', flag: '🇨🇼', confederation: 'CONCACAF', isDebutant: true },
  { code: 'HAI', name: 'Haiti',    flag: '🇭🇹', confederation: 'CONCACAF' },
  { code: 'PAN', name: 'Panama',   flag: '🇵🇦', confederation: 'CONCACAF' },
  // CONMEBOL
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL' },
  { code: 'BRA', name: 'Brazil',    flag: '🇧🇷', confederation: 'CONMEBOL' },
  { code: 'COL', name: 'Colombia',  flag: '🇨🇴', confederation: 'CONMEBOL' },
  { code: 'ECU', name: 'Ecuador',   flag: '🇪🇨', confederation: 'CONMEBOL' },
  { code: 'PAR', name: 'Paraguay',  flag: '🇵🇾', confederation: 'CONMEBOL' },
  { code: 'URU', name: 'Uruguay',   flag: '🇺🇾', confederation: 'CONMEBOL' },
  // UEFA
  { code: 'AUT', name: 'Austria',              flag: '🇦🇹', confederation: 'UEFA' },
  { code: 'BEL', name: 'Belgium',              flag: '🇧🇪', confederation: 'UEFA' },
  { code: 'BIH', name: 'Bosnia & Herzegovina', flag: '🇧🇦', confederation: 'UEFA' },
  { code: 'CRO', name: 'Croatia',              flag: '🇭🇷', confederation: 'UEFA' },
  { code: 'CZE', name: 'Czechia',              flag: '🇨🇿', confederation: 'UEFA' },
  { code: 'ENG', name: 'England',              flag: '🏴󠁧󠁢󠁥󠁮󠁧󁿢', confederation: 'UEFA' },
  { code: 'FRA', name: 'France',               flag: '🇫🇷', confederation: 'UEFA' },
  { code: 'GER', name: 'Germany',              flag: '🇩🇪', confederation: 'UEFA' },
  { code: 'NED', name: 'Netherlands',          flag: '🇳🇱', confederation: 'UEFA' },
  { code: 'NOR', name: 'Norway',               flag: '🇳🇴', confederation: 'UEFA' },
  { code: 'POR', name: 'Portugal',             flag: '🇵🇹', confederation: 'UEFA' },
  { code: 'SCO', name: 'Scotland',             flag: '🏴󠁧󠁢󠁳󠁣󠁴󁿢', confederation: 'UEFA' },
  { code: 'ESP', name: 'Spain',                flag: '🇪🇸', confederation: 'UEFA' },
  { code: 'SWE', name: 'Sweden',               flag: '🇸🇪', confederation: 'UEFA' },
  { code: 'SUI', name: 'Switzerland',          flag: '🇨🇭', confederation: 'UEFA' },
  { code: 'TUR', name: 'Türkiye',              flag: '🇹🇷', confederation: 'UEFA' },
  // CAF
  { code: 'ALG', name: 'Algeria',        flag: '🇩🇿', confederation: 'CAF' },
  { code: 'CPV', name: 'Cape Verde',     flag: '🇨🇻', confederation: 'CAF', isDebutant: true },
  { code: 'CIV', name: "Côte d'Ivoire", flag: '🇨🇮', confederation: 'CAF' },
  { code: 'COD', name: 'DR Congo',       flag: '🇨🇩', confederation: 'CAF' },
  { code: 'EGY', name: 'Egypt',          flag: '🇪🇬', confederation: 'CAF' },
  { code: 'GHA', name: 'Ghana',          flag: '🇬🇭', confederation: 'CAF' },
  { code: 'MAR', name: 'Morocco',        flag: '🇲🇦', confederation: 'CAF' },
  { code: 'SEN', name: 'Senegal',        flag: '🇸🇳', confederation: 'CAF' },
  { code: 'RSA', name: 'South Africa',   flag: '🇿🇦', confederation: 'CAF' },
  { code: 'TUN', name: 'Tunisia',        flag: '🇹🇳', confederation: 'CAF' },
  // AFC
  { code: 'AUS', name: 'Australia',   flag: '🇦🇺', confederation: 'AFC' },
  { code: 'IRN', name: 'Iran',        flag: '🇮🇷', confederation: 'AFC' },
  { code: 'IRQ', name: 'Iraq',        flag: '🇮🇶', confederation: 'AFC' },
  { code: 'JPN', name: 'Japan',       flag: '🇯🇵', confederation: 'AFC' },
  { code: 'JOR', name: 'Jordan',      flag: '🇯🇴', confederation: 'AFC', isDebutant: true },
  { code: 'QAT', name: 'Qatar',       flag: '🇶🇦', confederation: 'AFC' },
  { code: 'KSA', name: 'Saudi Arabia',flag: '🇸🇦', confederation: 'AFC' },
  { code: 'KOR', name: 'South Korea', flag: '🇰🇷', confederation: 'AFC' },
  { code: 'UZB', name: 'Uzbekistan',  flag: '🇺🇿', confederation: 'AFC', isDebutant: true },
  // OFC
  { code: 'NZL', name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC' },
]
