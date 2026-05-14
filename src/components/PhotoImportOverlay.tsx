import { useMemo, useRef, useState } from 'react'
import { stickerByCode } from '../data/catalog'
import { useCollection } from '../store/collection'
import { parseStickersFromImage } from '../lib/parseStickersFromImage'

type Props = {
  onClose: () => void
  onConfirm: (codes: string[]) => void
}

type Step = 'idle' | 'processing' | 'review' | 'error'

const VALID_CODES = new Set(stickerByCode.keys())

export function PhotoImportOverlay({ onClose, onConfirm }: Props) {
  const counts = useCollection((s) => s.counts)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('idle')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [entries, setEntries] = useState<Record<string, number>>({})
  const [crossedOutCodes, setCrossedOutCodes] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [addInput, setAddInput] = useState('')
  const [addError, setAddError] = useState('')

  const handleFiles = async (selected: FileList | null) => {
    if (!selected || selected.length === 0) return

    const fileArr = Array.from(selected)
    setFiles(fileArr)
    setPreviews(fileArr.map((f) => URL.createObjectURL(f)))
    setStep('processing')

    try {
      const results = await Promise.all(
        fileArr.map((f) => parseStickersFromImage(f, VALID_CODES))
      )
      const crossedUnion = [...new Set(results.flatMap((r) => r.crossedOut))]
      const crossedSet = new Set(crossedUnion)
      const counted: Record<string, number> = {}
      for (const r of results) {
        for (const code of r.found) {
          if (crossedSet.has(code)) continue
          counted[code] = (counted[code] ?? 0) + 1
        }
      }
      setEntries(counted)
      setCrossedOutCodes(crossedUnion)
      setStep('review')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setStep('error')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const adjust = (code: string, delta: number) => {
    setEntries((prev) => {
      const next = { ...prev }
      const q = (next[code] ?? 0) + delta
      if (q <= 0) delete next[code]
      else next[code] = q
      return next
    })
  }

  const removeEntry = (code: string) => {
    setEntries((prev) => {
      const next = { ...prev }
      delete next[code]
      return next
    })
  }

  const restoreCrossed = (code: string) => {
    setCrossedOutCodes((prev) => prev.filter((c) => c !== code))
    setEntries((prev) => ({ ...prev, [code]: (prev[code] ?? 0) + 1 }))
  }

  const handleAdd = () => {
    const code = addInput.trim().toUpperCase()
    if (!code) return
    if (!VALID_CODES.has(code)) {
      setAddError(`"${code}" is not a valid sticker code`)
      return
    }
    setEntries((prev) => ({ ...prev, [code]: (prev[code] ?? 0) + 1 }))
    setCrossedOutCodes((prev) => prev.filter((c) => c !== code))
    setAddInput('')
    setAddError('')
  }

  const { newEntries, ownedEntries, totalQty, duplicateCount } = useMemo(() => {
    const newE: Array<[string, number]> = []
    const ownedE: Array<[string, number]> = []
    let total = 0
    let dupes = 0
    for (const [code, qty] of Object.entries(entries)) {
      total += qty
      if (qty > 1) dupes += 1
      if (counts[code] && counts[code] >= 1) ownedE.push([code, qty])
      else newE.push([code, qty])
    }
    newE.sort(([a], [b]) => a.localeCompare(b))
    ownedE.sort(([a], [b]) => a.localeCompare(b))
    return { newEntries: newE, ownedEntries: ownedE, totalQty: total, duplicateCount: dupes }
  }, [entries, counts])

  const confirmPayload = useMemo(() => {
    const list: string[] = []
    for (const [code, qty] of Object.entries(entries)) {
      for (let i = 0; i < qty; i++) list.push(code)
    }
    return list
  }, [entries])

  const renderChip = (code: string, qty: number, owned: boolean) => {
    const isDuplicate = qty > 1
    const base = owned
      ? 'bg-white/[0.06] border-white/[0.10] text-white/70'
      : 'bg-indigo-600/30 border-indigo-500/40 text-indigo-200'
    const dupRing = isDuplicate ? 'ring-1 ring-amber-400/60' : ''
    return (
      <div key={code} className={`flex items-center gap-1 border ${base} ${dupRing} text-xs font-mono pl-2 pr-1 py-0.5 rounded-lg`}>
        <span>{code}</span>
        <span className={`px-1 rounded ${isDuplicate ? 'text-amber-300 font-semibold' : 'text-white/40'}`}>×{qty}</span>
        <button
          onClick={() => adjust(code, -1)}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-white/60"
          aria-label={`Decrease ${code}`}
        >
          −
        </button>
        <button
          onClick={() => adjust(code, 1)}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-white/60"
          aria-label={`Increase ${code}`}
        >
          +
        </button>
        <button
          onClick={() => removeEntry(code)}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/30 text-white/50 hover:text-red-200"
          aria-label={`Remove ${code}`}
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a14]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
        <p className="font-bold text-white text-sm">Import from Photo</p>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/70 transition-colors text-xl leading-none px-1"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* IDLE */}
        {step === 'idle' && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="text-4xl">📷</div>
              <p className="text-white/60 text-sm text-center">
                Tap to select photos, or drag & drop
              </p>
              <p className="text-white/30 text-xs text-center">
                Multiple images supported — each will be scanned separately
              </p>
              <button
                className="mt-1 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Select images
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        )}

        {/* PROCESSING */}
        {step === 'processing' && (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 text-sm">
              Analyzing {files.length} image{files.length !== 1 ? 's' : ''}…
            </p>
            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-20 h-20 object-cover rounded-xl opacity-50"
                    alt={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEW */}
        {step === 'review' && (
          <div className="space-y-4">
            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-16 h-16 object-cover rounded-xl border border-white/10"
                    alt={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <p className="text-white/50 text-xs">
              Found <strong className="text-white">{totalQty}</strong> sticker{totalQty !== 1 ? 's' : ''} across{' '}
              <strong className="text-white">{files.length}</strong> image{files.length !== 1 ? 's' : ''}
              {Object.keys(entries).length > 0 && ` (${Object.keys(entries).length} unique code${Object.keys(entries).length !== 1 ? 's' : ''})`}
            </p>

            {duplicateCount > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
                <strong>{duplicateCount}</strong> code{duplicateCount !== 1 ? 's' : ''} written more than once in the photo — adjust quantity below if that's wrong.
              </div>
            )}

            {totalQty === 0 && crossedOutCodes.length === 0 && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center text-white/40 text-sm">
                No sticker codes detected. Try a clearer photo or add codes manually below.
              </div>
            )}

            {newEntries.length > 0 && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2.5">
                  New — {newEntries.length}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {newEntries.map(([code, qty]) => renderChip(code, qty, false))}
                </div>
              </div>
            )}

            {ownedEntries.length > 0 && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
                  Already owned — {ownedEntries.length}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ownedEntries.map(([code, qty]) => renderChip(code, qty, true))}
                </div>
                <p className="text-xs text-white/25 mt-2">These will be incremented (+N duplicates).</p>
              </div>
            )}

            {crossedOutCodes.length > 0 && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
                  Marked as already had (crossed out) — {crossedOutCodes.length}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {crossedOutCodes.map((code) => (
                    <div
                      key={code}
                      className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] text-white/40 text-xs font-mono pl-2 pr-1 py-0.5 rounded-lg line-through"
                    >
                      <span>{code}</span>
                      <button
                        onClick={() => restoreCrossed(code)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-white/60 no-underline"
                        aria-label={`Add ${code} back to import`}
                        title="Add back to import"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/25 mt-2">Excluded from import — tap + to add one back.</p>
              </div>
            )}

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
                Add a code manually
              </p>
              <div className="flex gap-2">
                <input
                  value={addInput}
                  onChange={(e) => { setAddInput(e.target.value); setAddError('') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                  placeholder="e.g. ARG1"
                  className="flex-1 bg-white/[0.06] border border-white/[0.10] text-white text-sm font-mono px-3 py-2 rounded-xl placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={handleAdd}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  Add
                </button>
              </div>
              {addError && <p className="text-xs text-red-300 mt-2">{addError}</p>}
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === 'error' && (
          <div className="space-y-4 py-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
              {errorMsg}
            </div>
            <button
              onClick={() => { setStep('idle'); setFiles([]); setPreviews([]) }}
              className="w-full bg-white/[0.06] border border-white/[0.10] text-white/70 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {step === 'review' && (
        <div className="px-4 py-3 border-t border-white/[0.08] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-white/[0.06] border border-white/[0.10] text-white/70 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(confirmPayload)}
            disabled={confirmPayload.length === 0}
            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          >
            Import {confirmPayload.length} sticker{confirmPayload.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  )
}
