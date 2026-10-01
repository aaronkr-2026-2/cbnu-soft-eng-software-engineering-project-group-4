import { BookOpen, ChartNoAxesCombined, House, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Homepage', to: '/', icon: House },
  { label: 'Topics', to: '/topics', icon: BookOpen },
  { label: 'My Progress', to: '/progress', icon: ChartNoAxesCombined },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export function AppSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/8 bg-[#111318] p-5">
      <NavLink className="mb-12 flex items-center gap-3 px-2 text-lg font-semibold tracking-tight text-white" to="/">
        <span className="grid size-9 place-items-center rounded-xl bg-violet-500 font-serif text-xl">S</span>
        Speakly
      </NavLink>
      <nav className="space-y-2">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? 'bg-violet-500/15 text-violet-200' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
