import { NavLink, Link, Outlet, useLocation } from 'react-router'
import { Moon, Sun, Fire } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useProgress } from '../store/progress'
import { streak } from '../lib/progress'

const nav = [
  { to: '/paths', label: 'Paths' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/programs', label: 'Programs we mapped' },
  { to: '/progress', label: 'My progress' },
]

export function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="Audit home">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" className="fill-ink" />
        <rect x="6" y="17" width="20" height="7" rx="2" fill="var(--marker)" />
        <path d="M9 22 15.5 8h1L23 22" fill="none" className="stroke-paper" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className="font-display text-[1.35rem] font-semibold tracking-tight">Audit</span>
    </Link>
  )
}

export default function Shell() {
  const { theme, setTheme, activity, activePath } = useProgress()
  const days = streak(activity)
  const { pathname } = useLocation()
  const dark = theme === 'dark' || (theme === null && document.documentElement.classList.contains('dark'))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-dvh flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
          <Wordmark />
          <nav aria-label="Main" className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to === '/paths' && activePath ? `/path/${activePath}` : n.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-[0.95rem] transition-colors ${
                    isActive || (n.to === '/paths' && pathname.startsWith('/path'))
                      ? 'bg-sunken text-ink font-semibold'
                      : 'text-ink-soft hover:text-ink hover:bg-sunken/60'
                  }`
                }
              >
                {n.to === '/paths' && activePath ? 'My path' : n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {days > 0 && (
              <Link
                to="/progress"
                className="flex items-center gap-1.5 border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-streak"
                title={`${days}-day study streak`}
              >
                <Fire weight="fill" size={16} aria-hidden="true" />
                <span className="tabular">{days}</span>
                <span className="sr-only">day streak</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setTheme(dark ? 'light' : 'dark')}
              className="grid size-10 place-items-center text-ink-soft hover:bg-sunken hover:text-ink transition-colors"
              aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        <nav aria-label="Main mobile" className="md:hidden flex gap-1 overflow-x-auto px-4 pb-2">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to === '/paths' && activePath ? `/path/${activePath}` : n.to}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 text-sm ${isActive ? 'bg-sunken font-semibold' : 'text-ink-soft'}`
              }
            >
              {n.to === '/paths' && activePath ? 'My path' : n.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8 text-sm text-ink-faint flex flex-wrap gap-x-8 gap-y-2 justify-between">
          <p>Every lecture here is free and belongs to its creators. Audit links to it and keeps your place.</p>
          <p>Your progress is stored in this browser only.</p>
        </div>
      </footer>
    </div>
  )
}
