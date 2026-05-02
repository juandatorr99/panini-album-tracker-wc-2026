import { useCollection } from '../store/collection'
import type { Sticker } from '../types'

type Props = {
  sticker: Sticker
}

export function StickerTile({ sticker }: Props) {
  const count = useCollection((s) => s.counts[sticker.code] ?? 0)
  const increment = useCollection((s) => s.increment)
  const decrement = useCollection((s) => s.decrement)

  const state = count === 0 ? 'missing' : count === 1 ? 'owned' : 'duplicate'

  const bgClass =
    state === 'owned'
      ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/40'
      : state === 'duplicate'
      ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-900/40'
      : sticker.isFoil
      ? 'foil-dark'
      : 'bg-white/[0.04] border border-white/[0.08]'

  const ringClass = sticker.isFoil ? 'ring-1 ring-yellow-400/50 ring-offset-0' : ''

  const codeColor =
    state !== 'missing'
      ? 'text-white'
      : sticker.isFoil
      ? 'text-yellow-200/90'
      : 'text-white/30'

  const nameColor =
    state !== 'missing'
      ? 'text-white/70'
      : sticker.isFoil
      ? 'text-yellow-200/60'
      : 'text-white/20'

  return (
    <div className="relative">
      <button
        onClick={() => increment(sticker.code)}
        onContextMenu={(e) => {
          e.preventDefault()
          decrement(sticker.code)
        }}
        className={`w-full rounded-xl py-2.5 px-1.5 flex flex-col items-center gap-0.5 select-none touch-manipulation transition-all duration-150 active:scale-95 ${bgClass} ${ringClass}`}
        title={`${sticker.code} — ${sticker.name}`}
      >
        <span className={`text-[13px] font-black leading-none tracking-tight ${codeColor}`}>
          {sticker.code}
        </span>
        <span className={`text-[9px] leading-tight text-center line-clamp-2 ${nameColor}`}>
          {sticker.name}
        </span>

        {count > 1 && (
          <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center pointer-events-none leading-none shadow-sm">
            {count}
          </span>
        )}

        {sticker.isFoil && (
          <span className="absolute top-0.5 right-1 text-[8px] pointer-events-none opacity-80">✨</span>
        )}

        {sticker.isDebutant && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-violet-600/90 text-white text-[7px] font-bold rounded px-1 pointer-events-none whitespace-nowrap shadow">
            DEBUT
          </span>
        )}
      </button>

      {count > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            decrement(sticker.code)
          }}
          className="absolute -top-1.5 -left-1.5 bg-red-500/90 hover:bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center z-10 leading-none shadow"
          aria-label="Remove one"
        >
          −
        </button>
      )}
    </div>
  )
}
