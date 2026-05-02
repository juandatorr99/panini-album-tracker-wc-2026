import { useState, useMemo } from 'react'
import { sections, stickers, stickersBySection } from '../data/catalog'
import { useCollection } from '../store/collection'
import { computeSection, computeOverall } from '../lib/stats'
import { ProgressBar } from '../components/ProgressBar'
import { SectionCard } from '../components/SectionCard'

export function Home() {
  const counts = useCollection((s) => s.counts)
  const showCoke = useCollection((s) => s.showCokeInsert)
  const groupAssignments = useCollection((s) => s.groupAssignments)
  const increment = useCollection((s) => s.increment)
  const [quickCode, setQuickCode] = useState('')
  const [quickMsg, setQuickMsg] = useState('')

  const overall = useMemo(() => computeOverall(stickers, counts, showCoke), [counts, showCoke])

  const introSection = sections.find((s) => s.id === 'intro')!
  const museumSection = sections.find((s) => s.id === 'museum')!
  const cokeSection = sections.find((s) => s.id === 'coke')!
  const teamSections = useMemo(() => sections.filter((s) => s.confederation), [])

  const grouped = useMemo(() => {
    const groups: Record<string, typeof teamSections> = {}
    for (const team of teamSections) {
      const g = groupAssignments[team.id]
      const key = g ? `Group ${g}` : 'Ungrouped'
      groups[key] = groups[key] ?? []
      groups[key].push(team)
    }
    return groups
  }, [teamSections, groupAssignments])

  const sortedGroupKeys = useMemo(
    () =>
      Object.keys(grouped).sort((a, b) => {
        if (a === 'Ungrouped') return 1
        if (b === 'Ungrouped') return -1
        return a.localeCompare(b)
      }),
    [grouped]
  )

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const code = quickCode.trim().toUpperCase()
    if (!code) return
    const found = stickers.find((s) => s.code === code)
    if (found) {
      increment(code)
      setQuickMsg(`✓ ${code} added`)
      setQuickCode('')
    } else {
      setQuickMsg(`✗ "${code}" not found`)
    }
    setTimeout(() => setQuickMsg(''), 2500)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Overall stats */}
      <div className="bg-[#1a3c5e] text-white rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-2xl font-bold">{overall.owned} / 980</span>
          <span className="text-sm opacity-80">
            {Math.round((overall.owned / 980) * 100)}% complete
          </span>
        </div>
        <ProgressBar owned={overall.owned} total={980} className="mb-2" />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="text-red-300">{overall.missing} missing</span>
          <span className="text-blue-300">{overall.duplicates} duplicates</span>
          <span className="text-yellow-300">
            {overall.foilOwned}/{overall.foilTotal} foils ✨
          </span>
        </div>
      </div>

      {/* Quick add */}
      <form onSubmit={handleQuickAdd} className="flex gap-2 mb-1">
        <input
          value={quickCode}
          onChange={(e) => setQuickCode(e.target.value)}
          placeholder="Quick add: ARG7, FWC3, 00…"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
        />
        <button
          type="submit"
          className="bg-[#1a3c5e] text-white px-4 py-2 rounded-lg text-sm font-medium active:opacity-80"
        >
          Add
        </button>
      </form>
      {quickMsg && (
        <p className="text-sm text-center mb-3 text-gray-600">{quickMsg}</p>
      )}
      {!quickMsg && <div className="mb-3" />}

      {/* Intro & Museum */}
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        Tournament
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <SectionCard
          section={introSection}
          stats={computeSection(stickersBySection.get('intro') ?? [], counts)}
        />
        <SectionCard
          section={museumSection}
          stats={computeSection(stickersBySection.get('museum') ?? [], counts)}
        />
      </div>

      {/* Teams grouped by draw */}
      {sortedGroupKeys.map((groupLabel) => (
        <div key={groupLabel} className="mb-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            {groupLabel}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {grouped[groupLabel].map((sec) => (
              <SectionCard
                key={sec.id}
                section={sec}
                stats={computeSection(stickersBySection.get(sec.id) ?? [], counts)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Coca-Cola insert (optional) */}
      {showCoke && (
        <div className="mb-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Coca-Cola Insert
          </h2>
          <SectionCard
            section={cokeSection}
            stats={computeSection(stickersBySection.get('coke') ?? [], counts)}
          />
        </div>
      )}
    </div>
  )
}
