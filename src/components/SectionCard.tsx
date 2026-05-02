import { useNavigate } from 'react-router-dom'
import { ProgressBar } from './ProgressBar'
import type { Section } from '../types'
import type { SectionStats } from '../lib/stats'

type Props = {
  section: Section
  stats: SectionStats
}

export function SectionCard({ section, stats }: Props) {
  const navigate = useNavigate()
  const pct = stats.total === 0 ? 0 : Math.round((stats.owned / stats.total) * 100)

  return (
    <button
      onClick={() => navigate(`/section/${section.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-blue-400 active:bg-gray-50 transition-colors w-full"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm text-gray-800 truncate">{section.title}</span>
        <span className="text-xs text-gray-500 ml-2 shrink-0">{pct}%</span>
      </div>
      {section.confederation && (
        <span className="text-xs text-gray-400 block mb-1">{section.confederation}</span>
      )}
      <ProgressBar owned={stats.owned} total={stats.total} className="mb-1" />
      <div className="flex gap-3 text-xs">
        <span className="text-green-600">{stats.owned} have</span>
        <span className="text-red-500">{stats.missing} miss</span>
        {stats.duplicates > 0 && (
          <span className="text-blue-500">{stats.duplicates} dupl</span>
        )}
      </div>
    </button>
  )
}
