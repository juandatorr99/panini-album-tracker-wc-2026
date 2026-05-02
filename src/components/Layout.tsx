import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs px-4 py-2 rounded-lg transition-colors ${
      isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-800'
    }`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#1a3c5e] text-white px-4 py-3 flex items-center gap-2 shadow-md sticky top-0 z-40">
        <span className="text-xl">⚽</span>
        <div>
          <p className="font-bold text-sm leading-none">Panini WC 2026</p>
          <p className="text-[10px] opacity-60 leading-none mt-0.5">FIFA World Cup™ Album Tracker</p>
        </div>
      </header>
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around px-2 py-1 z-50 safe-area-inset-bottom">
        <NavLink to="/" end className={navClass}>
          <span>🏠</span>
          <span>Album</span>
        </NavLink>
        <NavLink to="/trade" className={navClass}>
          <span>🔄</span>
          <span>Trade</span>
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  )
}
