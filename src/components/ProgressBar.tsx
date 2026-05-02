type Props = {
  owned: number
  total: number
  className?: string
}

export function ProgressBar({ owned, total, className = '' }: Props) {
  const pct = total === 0 ? 0 : Math.round((owned / total) * 100)
  return (
    <div className={`w-full ${className}`}>
      <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
