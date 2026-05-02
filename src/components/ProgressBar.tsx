type Props = {
  owned: number
  total: number
  className?: string
}

export function ProgressBar({ owned, total, className = '' }: Props) {
  const pct = total === 0 ? 0 : Math.round((owned / total) * 100)
  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
