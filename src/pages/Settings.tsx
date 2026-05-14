import { useRef, useState } from 'react'
import { useCollection } from '../store/collection'
import { PhotoImportOverlay } from '../components/PhotoImportOverlay'

type ExportData = {
  counts: Record<string, number>
  groupAssignments: Record<string, string>
  showCokeInsert: boolean
}

export function Settings() {
  const showCokeInsert = useCollection((s) => s.showCokeInsert)
  const toggleCoke = useCollection((s) => s.toggleCoke)
  const groupAssignments = useCollection((s) => s.groupAssignments)
  const reset = useCollection((s) => s.reset)
  const counts = useCollection((s) => s.counts)
  const increment = useCollection((s) => s.increment)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPhotoImport, setShowPhotoImport] = useState(false)

  const handlePhotoImportConfirm = (codes: string[]) => {
    codes.forEach((code) => increment(code))
    setShowPhotoImport(false)
  }

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
  const duplicateCount = Object.values(counts).reduce((sum, n) => sum + Math.max(0, n - 1), 0)

  return (
    <>
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest">Settings</p>

      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #3730a3 0%, #1e40af 100%)' }}>
        <p className="text-white/50 text-xs mb-2">Collection summary</p>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-black text-white leading-none">{ownedCount}</p>
            <p className="text-white/40 text-xs mt-0.5">owned</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white leading-none">{duplicateCount}</p>
            <p className="text-white/40 text-xs mt-0.5">duplicates</p>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white text-sm">Coca-Cola Insert</p>
            <p className="text-xs text-white/30 mt-0.5">14 promo stickers — not part of the 980 base set</p>
          </div>
          <button
            onClick={toggleCoke}
            className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${showCokeInsert ? 'bg-indigo-500' : 'bg-white/10'}`}
            role="switch"
            aria-checked={showCokeInsert}
          >
            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${showCokeInsert ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-2.5">
        <p className="font-semibold text-white text-sm">Backup & Restore</p>
        <button onClick={handleExport} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all">
          Export collection (JSON)
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white/[0.06] border border-white/[0.10] text-white/70 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all">
          Import collection (JSON)
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-2.5">
        <p className="font-semibold text-white text-sm">Import from Photo</p>
        <p className="text-xs text-white/30">Take a picture of your handwritten sticker list and the app will detect the codes automatically.</p>
        <button onClick={() => setShowPhotoImport(true)} className="w-full bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all">
          Scan photos…
        </button>
      </div>

      <div className="bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-4">
        <p className="font-semibold text-red-400 text-sm mb-1">Danger Zone</p>
        <p className="text-xs text-white/30 mb-3">Resets all sticker counts to zero. Group assignments are kept.</p>
        <button onClick={handleReset} className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all">
          Reset all counts
        </button>
      </div>
    </div>

    {showPhotoImport && (
      <PhotoImportOverlay
        onClose={() => setShowPhotoImport(false)}
        onConfirm={handlePhotoImportConfirm}
      />
    )}
    </>
  )
}