import { usePWAInstall } from '../lib/usePWAInstall'

export function InstallBanner() {
  const { canInstall, isIOS, promptInstall, dismiss } = usePWAInstall()

  if (!canInstall) return null

  return (
    <div className="mx-4 mt-3 bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shrink-0 shadow-lg shadow-indigo-900/40">
        ⚽
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">Install App</p>
        {isIOS ? (
          <p className="text-white/40 text-xs mt-0.5">
            Tap{' '}
            <svg className="inline w-3.5 h-3.5 -mt-0.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {' '}then "Add to Home Screen"
          </p>
        ) : (
          <p className="text-white/40 text-xs mt-0.5">
            Add to your home screen for the best experience
          </p>
        )}
      </div>
      {!isIOS && (
        <button
          onClick={promptInstall}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shrink-0 active:scale-95 transition-all"
        >
          Install
        </button>
      )}
      <button
        onClick={dismiss}
        className="text-white/20 hover:text-white/50 text-lg leading-none shrink-0 -mt-0.5"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
