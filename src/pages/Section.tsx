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
      <div className="p-8 text-center text-gray-500">
        <p className="mb-3">Section not found.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 text-sm">
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
        className="text-sm text-blue-600 mb-3 flex items-center gap-1 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="flex items-baseline justify-between mb-1">
          <h1 className="text-lg font-bold text-gray-800">{section.title}</h1>
          <span className="text-sm text-gray-500">{pct}%</span>
        </div>
        {section.confederation && (
          <p className="text-xs text-gray-400 mb-2">{section.confederation}</p>
        )}
        <ProgressBar owned={stats.owned} total={stats.total} className="mb-2" />
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-green-600">{stats.owned} owned</span>
          <span className="text-red-500">{stats.missing} missing</span>
          {stats.duplicates > 0 && (
            <span className="text-blue-500">{stats.duplicates} duplicates</span>
          )}
          {stats.foilTotal > 0 && (
            <span className="text-yellow-600">
              {stats.foilOwned}/{stats.foilTotal} foils ✨
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mb-3">
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
