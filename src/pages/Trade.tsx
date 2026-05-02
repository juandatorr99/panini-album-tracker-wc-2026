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
      <h1 className="text-lg font-bold text-gray-800 mb-4">Trade List</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Duplicates */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-blue-700">
              Duplicates ({totalDuplicates})
            </h2>
            <button
              onClick={() => handleCopy('dup')}
              disabled={totalDuplicates === 0}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg disabled:opacity-40"
            >
              {copied === 'dup' ? '✓ Copied!' : 'Copy list'}
            </button>
          </div>
          {duplicates.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No duplicates yet.</p>
          ) : (
            <div className="space-y-3">
              {duplicates.map((g) => (
                <div key={g.sectionId}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{g.sectionTitle}</p>
                  <div className="flex flex-wrap gap-1">
                    {g.stickers.map((s) => {
                      const excess = counts[s.code] - 1
                      return (
                        <span
                          key={s.code}
                          className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded px-1.5 py-0.5"
                        >
                          {s.code}
                          {excess > 1 && (
                            <span className="ml-0.5 text-blue-500 font-semibold">×{excess}</span>
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-red-600">
              Missing ({totalMissing})
            </h2>
            <button
              onClick={() => handleCopy('miss')}
              disabled={totalMissing === 0}
              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg disabled:opacity-40"
            >
              {copied === 'miss' ? '✓ Copied!' : 'Copy list'}
            </button>
          </div>
          {missing.length === 0 ? (
            <p className="text-sm text-green-600 font-semibold">Album complete! 🎉</p>
          ) : (
            <div className="space-y-3">
              {missing.map((g) => (
                <div key={g.sectionId}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{g.sectionTitle}</p>
                  <div className="flex flex-wrap gap-1">
                    {g.stickers.map((s) => (
                      <span
                        key={s.code}
                        className="bg-red-50 border border-red-200 text-red-800 text-xs rounded px-1.5 py-0.5"
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
