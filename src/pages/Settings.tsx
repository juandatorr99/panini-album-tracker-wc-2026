import { useRef } from 'react'
import { useCollection } from '../store/collection'
import { TEAMS } from '../lib/teams'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

type ExportData = {
  counts: Record<string, number>
  groupAssignments: Record<string, string>
  showCokeInsert: boolean
}

export function Settings() {
  const showCokeInsert = useCollection((s) => s.showCokeInsert)
  const toggleCoke = useCollection((s) => s.toggleCoke)
  const groupAssignments = useCollection((s) => s.groupAssignments)
  const setGroup = useCollection((s) => s.setGroup)
  const removeGroup = useCollection((s) => s.removeGroup)
  const reset = useCollection((s) => s.reset)
  const counts = useCollection((s) => s.counts)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data: ExportData = { counts, groupAssignments, showCokeInsert }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'panini-wc2026-collection.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Partial<ExportData>
        if (data.counts) {
          useCollection.setState({
            counts: data.counts,
            groupAssignments: data.groupAssignments ?? {},
            showCokeInsert: data.showCokeInsert ?? false,
          })
        } else {
          alert('Invalid collection file.')
        }
      } catch {
        alert('Could not read the file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('Reset all sticker counts to zero? This cannot be undone.')) {
      reset()
    }
  }

  const ownedCount = Object.values(counts).filter((n) => n >= 1).length

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-lg font-bold text-gray-800">Settings</h1>

      {/* Collection summary */}
      <div className="bg-[#1a3c5e] text-white rounded-xl p-3 text-sm">
        <p className="opacity-80 text-xs mb-0.5">Collection summary</p>
        <p>
          <span className="font-bold">{ownedCount}</span> stickers owned ·{' '}
          <span className="font-bold">
            {Object.values(counts).reduce((sum, n) => sum + Math.max(0, n - 1), 0)}
          </span>{' '}
          duplicates
        </p>
      </div>

      {/* Coca-Cola toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 text-sm">Coca-Cola Insert</p>
            <p className="text-xs text-gray-500 mt-0.5">
              13 promo stickers — not part of the 980 base set
            </p>
          </div>
          <button
            onClick={toggleCoke}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              showCokeInsert ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={showCokeInsert}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                showCokeInsert ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Group draw assignments */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="font-medium text-gray-800 text-sm mb-1">Group Draw Assignments</h2>
        <p className="text-xs text-gray-500 mb-3">
          Set each team's group (A–L) to display them in group order on the album home screen.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-3 max-h-80 overflow-y-auto pr-1">
          {TEAMS.map((team) => (
            <div key={team.code} className="flex items-center gap-1.5">
              <span className="text-xs text-gray-700 w-20 truncate shrink-0">{team.name}</span>
              <select
                value={groupAssignments[team.code] ?? ''}
                onChange={(e) => {
                  if (e.target.value) setGroup(team.code, e.target.value)
                  else removeGroup(team.code)
                }}
                className="text-xs border border-gray-200 rounded px-1 py-0.5 flex-1 min-w-0"
              >
                <option value="">—</option>
                {GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Export / Import */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <h2 className="font-medium text-gray-800 text-sm">Backup & Restore</h2>
        <button
          onClick={handleExport}
          className="w-full bg-[#1a3c5e] text-white py-2 rounded-lg text-sm font-medium active:opacity-80"
        >
          Export collection (JSON)
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium active:bg-gray-50"
        >
          Import collection (JSON)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      {/* Reset */}
      <div className="bg-white rounded-xl border border-red-200 p-4">
        <h2 className="font-medium text-red-700 text-sm mb-1">Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-3">
          Resets all sticker counts to zero. Group assignments are kept.
        </p>
        <button
          onClick={handleReset}
          className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium active:opacity-80"
        >
          Reset all counts
        </button>
      </div>
    </div>
  )
}
