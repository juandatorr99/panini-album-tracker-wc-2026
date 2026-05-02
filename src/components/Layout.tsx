import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 text-[11px] font-semibold px-6 py-2 rounded-2xl transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-white/30 hover:text-white/60'
    }`

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col">
      {/* Minimal dark header */}
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

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Floating bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a14]/90 backdrop-blur-2xl border-t border-white/[0.06] flex justify-around items-center px-4 py-3">
        <NavLink to="/" end className={navClass}>
          <span className="text-xl leading-none">🏠</span>
          <span>Album</span>
        </NavLink>
        <NavLink to="/trade" className={navClass}>
          <span className="text-xl leading-none">🔄</span>
          <span>Trade</span>
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          <span className="text-xl leading-none">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  )
}
