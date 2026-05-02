import { useNavigate } from 'react-router-dom'
import { ProgressBar } from './ProgressBar'
import type { Section } from '../types'
import type { SectionStats } from '../lib/stats'

type Props = {
  section: Section
  stats: SectionStats
  group?: string
}

const CONF_COLOR: Record<string, string> = {
  CONCACAF: '#f97316',
  CONMEBOL: '#3b82f6',
  UEFA:     '#6366f1',
  CAF:      '#22c55e',
  AFC:      '#ef4444',
  OFC:      '#14b8a6',
}

export function SectionCard({ section, stats, group }: Props) {
  const navigate = useNavigate()
  const pct = stats.total === 0 ? 0 : Math.round((stats.owned / stats.total) * 100)
  const accentColor = section.confederation ? CONF_COLOR[section.confederation] : '#6366f1'
  const isComplete = stats.missing === 0 && stats.total > 0

  return (
    <button
      onClick={() => navigate(`/section/${section.id}`)}
      className="relative w-full rounded-2xl p-3 text-left active:scale-[0.97] transition-all duration-150 overflow-hidden border border-white/[0.08]"
      style={{
        background: `linear-gradient(145deg, ${accentColor}18 0%, rgba(255,255,255,0.03) 100%)`,
      }}
    >
      {/* Subtle left accent line */}
      <span
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ backgroundColor: accentColor }}
      />

      {isComplete && (
        <span className="absolute top-1.5 right-1.5 text-xs">✅</span>
      )}

      <div className="flex items-start justify-between mb-1 pr-4 pl-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {section.flag && (
            <span className="text-base leading-none shrink-0">{section.flag}</span>
          )}
          <span className="font-bold text-sm text-white/90 truncate leading-tight">
            {section.title}
          </span>
        </div>
        <span className="text-xs font-semibold ml-1 shrink-0" style={{ color: accentColor }}>
          {pct}%
        </span>
      </div>

      {(section.confederation || group) && (
        <div className="flex items-center gap-1.5 mb-1.5 pl-2">
          {section.confederation && (
            <span className="text-[10px] text-white/30">{section.confederation}</span>
          )}
          {group && (
            <span
              className="text-[10px] font-bold px-1.5 rounded-md text-white leading-tight"
              style={{ backgroundColor: `${accentColor}40`, color: accentColor }}
            >
              {group}
            </span>
          )}
        </div>
      )}

      <div className="pl-2">
        <ProgressBar owned={stats.owned} total={stats.total} className="mb-1.5" />
      </div>

      <div className="flex gap-2 text-[11px] pl-2">
        <span className="text-emerald-400 font-medium">{stats.owned} ✓</span>
        <span className="text-red-400/80">{stats.missing} miss</span>
        {stats.duplicates > 0 && (
          <span className="text-indigo-400/80">{stats.duplicates} dupl</span>
        )}
      </div>
    </button>
  )
}
