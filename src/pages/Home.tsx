import { useState, useMemo } from 'react'
import { sections, stickers, stickersBySection } from '../data/catalog'
import { useCollection } from '../store/collection'
import { computeSection, computeOverall } from '../lib/stats'
import { ProgressBar } from '../components/ProgressBar'
import { SectionCard } from '../components/SectionCard'

const CONF_ORDER = ['CONCACAF', 'CONMEBOL', 'UEFA', 'CAF', 'AFC', 'OFC']

export function Home() {
  const counts = useCollection((s) => s.counts)
  const showCoke = useCollection((s) => s.showCokeInsert)
  const groupAssignments = useCollection((s) => s.groupAssignments)
  const increment = useCollection((s) => s.increment)
  const [quickCode, setQuickCode] = useState('')
  const [quickMsg, setQuickMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const overall = useMemo(() => computeOverall(stickers, counts, false), [counts])
  const pct = Math.round((overall.owned / 980) * 100)

  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - overall.owned / 980)

  const introSection = sections.find((s) => s.id === 'intro')!
  const museumSection = sections.find((s) => s.id === 'museum')!
  const cokeSection = sections.find((s) => s.id === 'coke')!
  const teamSections = useMemo(() => sections.filter((s) => s.confederation), [])

  const anyGrouped = Object.keys(groupAssignments).length > 0

  const grouped = useMemo(() => {
    const groups: Record<string, typeof teamSections> = {}
    if (anyGrouped) {
      for (const team of teamSections) {
        const g = groupAssignments[team.id]
        const key = g ? `Group ${g}` : 'Ungrouped'
        groups[key] = groups[key] ?? []
        groups[key].push(team)
      }
    } else {
      for (const team of teamSections) {
        const key = team.confederation ?? 'Other'
        groups[key] = groups[key] ?? []
        groups[key].push(team)
      }
    }
    return groups
  }, [teamSections, groupAssignments, anyGrouped])

  const sortedGroupKeys = useMemo(
    () =>
      Object.keys(grouped).sort((a, b) => {
        if (!anyGrouped) {
          const ia = CONF_ORDER.indexOf(a)
          const ib = CONF_ORDER.indexOf(b)
          if (ia !== -1 && ib !== -1) return ia - ib
          if (ia !== -1) return -1
          if (ib !== -1) return 1
          return a.localeCompare(b)
        }
        if (a === 'Ungrouped') return 1
        if (b === 'Ungrouped') return -1
        return a.localeCompare(b)
      }),
    [grouped, anyGrouped]
  )

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const code = quickCode.trim().toUpperCase()
    if (!code) return
    const found = stickers.find((s) => s.code === code)
    if (found) {
      increment(code)
      setQuickMsg({ text: `✓ ${code} added`, ok: true })
      setQuickCode('')
    } else {
      setQuickMsg({ text: `"${code}" not found`, ok: false })
    }
    setTimeout(() => setQuickMsg(null), 2500)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Hero card */}
      <div className="relative rounded-3xl overflow-hidden mb-5"
        style={{ background: 'linear-gradient(135deg, #3730a3 0%, #5b21b6 45%, #1e40af 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-black/20" />
        <div className="relative p-5 flex items-center gap-4">
          {/* Circular progress ring */}
          <div className="w-28 h-28 shrink-0 relative">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle
                cx="60" cy="60" r={r}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="60" cy="60" r={r}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform="rotate(-90 60 60)"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white leading-none">{pct}%</span>
              <span className="text-[10px] text-white/40 mt-0.5">done</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-4xl leading-none">{overall.owned}</p>
            <p className="text-white/40 text-xs mb-3 mt-0.5">of 980 stickers</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-white/50">{overall.missing} missing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-white/50">{overall.duplicates} duplicates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                <span className="text-white/50">{overall.foilOwned}/{overall.foilTotal} foils</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom progress strip */}
        <div className="relative px-5 pb-4">
          <ProgressBar owned={overall.owned} total={980} />
        </div>
      </div>

      {/* Quick add */}
      <form onSubmit={handleQuickAdd} className="flex gap-2 mb-1">
        <input
          value={quickCode}
          onChange={(e) => setQuickCode(e.target.value)}
          placeholder="Quick add: ARG7, FWC3, 00…"
          className="flex-1 bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
        >
          Add
        </button>
      </form>
      <div className="h-6 flex items-center justify-center mb-3">
        {quickMsg && (
          <p className={`text-xs font-medium ${quickMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
            {quickMsg.text}
          </p>
        )}
      </div>

      {/* Intro & Museum */}
      <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-2">Tournament</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <SectionCard
          section={introSection}
          stats={computeSection(stickersBySection.get('intro') ?? [], counts)}
        />
        <SectionCard
          section={museumSection}
          stats={computeSection(stickersBySection.get('museum') ?? [], counts)}
        />
      </div>

      {/* Teams */}
      {sortedGroupKeys.map((groupLabel) => (
        <div key={groupLabel} className="mb-5">
          <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-2">
            {groupLabel}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {grouped[groupLabel].map((sec) => (
              <SectionCard
                key={sec.id}
                section={sec}
                stats={computeSection(stickersBySection.get(sec.id) ?? [], counts)}
                group={groupAssignments[sec.id]}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Coca-Cola insert */}
      {showCoke && (
        <div className="mb-5">
          <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-2">
            Coca-Cola Insert
          </p>
          <SectionCard
            section={cokeSection}
            stats={computeSection(stickersBySection.get('coke') ?? [], counts)}
          />
        </div>
      )}
    </div>
  )
}
