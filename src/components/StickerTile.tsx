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

  const bgClass = {
    missing: 'bg-gray-100 text-gray-500',
    owned: 'bg-green-100 text-gray-800',
    duplicate: 'bg-blue-100 text-gray-800',
  }[state]

  const borderClass = sticker.isFoil
    ? 'ring-2 ring-yellow-400 ring-offset-1'
    : 'border border-gray-200'

  return (
    <div className="relative">
      <button
        onClick={() => increment(sticker.code)}
        onContextMenu={(e) => {
          e.preventDefault()
          decrement(sticker.code)
        }}
        className={`w-full rounded-lg p-2 flex flex-col items-center select-none touch-manipulation transition-colors ${bgClass} ${borderClass}`}
        title={`${sticker.code} — ${sticker.name}`}
      >
        <span className="text-xs font-bold leading-none">{sticker.code}</span>
        <span className="text-[10px] leading-tight text-center mt-0.5 line-clamp-2 opacity-70">
          {sticker.name}
        </span>
        {count > 1 && (
          <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center pointer-events-none">
            {count}
          </span>
        )}
        {sticker.isDebutant && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[7px] rounded px-1 pointer-events-none whitespace-nowrap">
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
          className="absolute -top-1.5 -left-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center z-10 leading-none"
          aria-label="Remove one"
        >
          −
        </button>
      )}
    </div>
  )
}
