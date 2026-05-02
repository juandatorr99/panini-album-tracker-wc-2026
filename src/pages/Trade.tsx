import { useMemo, useState } from 'react'
import { stickers, sections } from '../data/catalog'
import { useCollection } from '../store/collection'
import { listDuplicates, listMissing, sectionTitleMap } from '../lib/stats'

export function Trade() {
  const counts = useCollection((s) => s.counts)
  const [copied, setCopied] = useState<'dup' | 'miss' | null>(null)

  const titles = useMemo(() => sectionTitleMap(sections), [])

  const duplicates = useMemo(() => listDuplicates(stickers, counts, titles), [counts, titles])
  const missing = useMemo(() => listMissing(stickers, counts, titles), [counts, titles])

  const totalDuplicates = duplicates.reduce((sum, g) => sum + g.stickers.length, 0)
  const totalMissing = missing.reduce((sum, g) => sum + g.stickers.length, 0)

  const formatList = (groups: typeof duplicates, isDup: boolean) =>
    groups
      .map((g) =>
        g.stickers
          .map((s) => {
            const excess = counts[s.code] - 1
            return isDup && excess > 1 ? `${s.code}(×${excess})` : s.code
          })
          .join(', ')
      )
      .filter(Boolean)
      .join(', ')

  const handleCopy = async (type: 'dup' | 'miss') => {
    const text = type === 'dup' ? formatList(duplicates, true) : formatList(missing, false)
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-4">Trade List</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Duplicates */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-white">Duplicates</p>
              <p className="text-xs text-indigo-400">{totalDuplicates} stickers</p>
            </div>
            <button
              onClick={() => handleCopy('dup')}
              disabled={totalDuplicates === 0}
              className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg disabled:opacity-30 active:scale-95 transition-all"
            >
              {copied === 'dup' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          {duplicates.length === 0 ? (
            <p className="text-xs text-white/25 italic">No duplicates yet.</p>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {duplicates.map((g) => (
                <div key={g.sectionId}>
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5">
                    {g.sectionTitle}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {g.stickers.map((s) => {
                      const excess = counts[s.code] - 1
                      return (
                        <span
                          key={s.code}
                          className="bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs rounded-lg px-2 py-1 font-medium"
                        >
                          {s.code}
                          {excess > 1 && (
                            <span className="ml-0.5 text-indigo-400/70">×{excess}</span>
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-white">Missing</p>
              <p className="text-xs text-red-400">{totalMissing} stickers</p>
            </div>
            <button
              onClick={() => handleCopy('miss')}
              disabled={totalMissing === 0}
              className="text-xs bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg disabled:opacity-30 active:scale-95 transition-all"
            >
              {copied === 'miss' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          {missing.length === 0 ? (
            <p className="text-xs text-emerald-400 font-semibold">Album complete! 🎉</p>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {missing.map((g) => (
                <div key={g.sectionId}>
                  <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5">
                    {g.sectionTitle}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {g.stickers.map((s) => (
                      <span
                        key={s.code}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg px-2 py-1 font-medium"
                      >
                        {s.code}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
