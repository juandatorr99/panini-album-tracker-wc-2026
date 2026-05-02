import { useParams, useNavigate } from 'react-router-dom'
import { sections, stickersBySection } from '../data/catalog'
import { useCollection } from '../store/collection'
import { computeSection } from '../lib/stats'
import { StickerTile } from '../components/StickerTile'
import { ProgressBar } from '../components/ProgressBar'

export function Section() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const counts = useCollection((s) => s.counts)

  const section = sections.find((s) => s.id === id)
  const sectionStickers = stickersBySection.get(id ?? '') ?? []

  if (!section) {
    return (
      <div className="p-8 text-center text-white/40">
        <p className="mb-3">Section not found.</p>
        <button onClick={() => navigate('/')} className="text-indigo-400 text-sm">
          ← Back to album
        </button>
      </div>
    )
  }

  const stats = computeSection(sectionStickers, counts)
  const pct = stats.total === 0 ? 0 : Math.round((stats.owned / stats.total) * 100)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-indigo-400 text-sm mb-4 flex items-center gap-1 active:opacity-70"
      >
        ← Back
      </button>

      <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mb-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {section.flag && <span className="text-2xl leading-none">{section.flag}</span>}
            <h1 className="text-lg font-bold text-white">{section.title}</h1>
          </div>
          <span className="text-sm font-semibold text-white/40">{pct}%</span>
        </div>
        {section.confederation && (
          <p className="text-xs text-white/30 mb-2">{section.confederation}</p>
        )}
        <ProgressBar owned={stats.owned} total={stats.total} className="mb-3" />
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-emerald-400">{stats.owned} owned</span>
          <span className="text-red-400">{stats.missing} missing</span>
          {stats.duplicates > 0 && (
            <span className="text-indigo-400">{stats.duplicates} duplicates</span>
          )}
          {stats.foilTotal > 0 && (
            <span className="text-yellow-400">
              {stats.foilOwned}/{stats.foilTotal} foils ✨
            </span>
          )}
        </div>
      </div>

      <p className="text-[11px] text-white/20 text-center mb-3">
        Tap to add · Red − button or right-click to remove
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pb-4">
        {sectionStickers.map((sticker) => (
          <StickerTile key={sticker.code} sticker={sticker} />
        ))}
      </div>
    </div>
  )
}
