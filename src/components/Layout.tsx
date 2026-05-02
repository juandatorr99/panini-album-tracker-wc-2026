import { NavLink, Outlet } from 'react-router-dom'
import { InstallBanner } from './InstallBanner'

function IconAlbum({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}

function IconTrade({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16V4m0 0L3 8m4-4 4 4" />
      <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
    </svg>
  )
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1.5 text-[11px] font-semibold px-6 py-2 rounded-2xl transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-white/30 hover:text-white/60'
    }`

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#0a0a14]/80 backdrop-blur-xl border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base shadow-lg shadow-indigo-900/40">
            ⚽
          </div>
          <div>
            <p className="text-white font-bold text-[13px] leading-none tracking-tight">Panini WC 2026</p>
            <p className="text-white/30 text-[10px] leading-none mt-0.5">FIFA World Cup™</p>
          </div>
        </div>
      </header>

      <InstallBanner />

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a14]/90 backdrop-blur-2xl border-t border-white/[0.06] flex justify-around items-center px-4 py-3">
        <NavLink to="/" end className={navClass}>
          <IconAlbum className="w-6 h-6" />
          <span>Album</span>
        </NavLink>
        <NavLink to="/trade" className={navClass}>
          <IconTrade className="w-6 h-6" />
          <span>Trade</span>
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          <IconSettings className="w-6 h-6" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  )
}
