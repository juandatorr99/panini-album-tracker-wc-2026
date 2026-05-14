import { useRef, useState } from 'react'
import { stickerByCode } from '../data/catalog'
import { useCollection } from '../store/collection'
import { parseStickersFromImage } from '../lib/parseStickersFromImage'

type Props = {
  onClose: () => void
  onConfirm: (codes: string[]) => void
}

type Step = 'idle' | 'processing' | 'review' | 'error'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
const VALID_CODES = new Set(stickerByCode.keys())

export function PhotoImportOverlay({ onClose, onConfirm }: Props) {
  const counts = useCollection((s) => s.counts)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('idle')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [detectedCodes, setDetectedCodes] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const handleFiles = async (selected: FileList | null) => {
    if (!selected || selected.length === 0) return
    if (!API_KEY) {
      setErrorMsg('VITE_ANTHROPIC_API_KEY is not set. Add it to your .env.local file or Vercel environment variables.')
      setStep('error')
      return
    }

    const fileArr = Array.from(selected)
    setFiles(fileArr)
    setPreviews(fileArr.map((f) => URL.createObjectURL(f)))
    setStep('processing')

    try {
      const results = await Promise.all(
        fileArr.map((f) => parseStickersFromImage(f, API_KEY, VALID_CODES))
      )
      const merged = [...new Set(results.flatMap((r) => r.found))]
      setDetectedCodes(merged)
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

  const newCodes = detectedCodes.filter((c) => !counts[c] || counts[c] === 0)
  const ownedCodes = detectedCodes.filter((c) => counts[c] && counts[c] >= 1)
  const validCodes = [...newCodes, ...ownedCodes]

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
            {!API_KEY && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300">
                <strong>API key not configured.</strong> Add <code className="font-mono bg-white/10 px-1 rounded">VITE_ANTHROPIC_API_KEY</code> to your <code className="font-mono bg-white/10 px-1 rounded">.env.local</code> file or Vercel environment variables.
              </div>
            )}

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
                disabled={!API_KEY}
                className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
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
              Found <strong className="text-white">{detectedCodes.length}</strong> code{detectedCodes.length !== 1 ? 's' : ''} across{' '}
              <strong className="text-white">{files.length}</strong> image{files.length !== 1 ? 's' : ''}
            </p>

            {detectedCodes.length === 0 && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center text-white/40 text-sm">
                No sticker codes detected. Try a clearer photo.
              </div>
            )}

            {newCodes.length > 0 && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2.5">
                  New — {newCodes.length}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {newCodes.map((code) => (
                    <span key={code} className="bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-mono px-2 py-0.5 rounded-lg">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {ownedCodes.length > 0 && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
                  Already owned — {ownedCodes.length}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ownedCodes.map((code) => (
                    <span key={code} className="bg-white/[0.06] border border-white/[0.10] text-white/50 text-xs font-mono px-2 py-0.5 rounded-lg">
                      {code}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/25 mt-2">These will be incremented (+1 duplicate).</p>
              </div>
            )}
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
            onClick={() => onConfirm(validCodes)}
            disabled={validCodes.length === 0}
            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          >
            Import {validCodes.length} sticker{validCodes.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  )
}