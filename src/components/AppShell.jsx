import { NavLink, Outlet, useLocation } from 'react-router-dom'

const shellBaseClass =
  'relative min-h-screen overflow-hidden bg-[#0c0f16] px-4 py-4 text-[#f3efe6] md:px-6 md:py-6'
const shellBackdropClass =
  'pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#11131a_0%,#161b28_45%,#0c0f16_100%)]'
const shellGlowOrangeClass =
  'pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(235,124,56,0.28)_0%,transparent_70%)] blur-3xl'
const shellGlowBlueClass =
  'pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(24,44,84,0.8)_0%,transparent_70%)] blur-3xl'
const shellContentClass =
  'relative mx-auto grid w-full max-w-[1600px] gap-5 xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)]'
const cardClass =
  'rounded-[24px] border border-white/10 bg-[#0d1118]/80 p-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl'
const sectionTitleClass = 'm-0 text-[clamp(2rem,4vw,4.2rem)] leading-[0.98] tracking-[-0.04em]'
const eyebrowClass = 'm-0 mb-2 text-[0.74rem] uppercase tracking-[0.18em] text-[#ffb47a]'
const bodyCopyClass = 'overflow-wrap:anywhere text-[rgba(243,239,230,0.78)]'
const navBaseClass =
  'flex w-full items-center justify-start rounded-full px-4 py-3 text-left font-medium transition-transform duration-150 hover:-translate-y-px'
const navActiveClass = `${navBaseClass} bg-[#f3efe6] text-[#121521]`
const navInactiveClass = `${navBaseClass} bg-white/5 text-[#f4efe5]`
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-[18px] py-3 font-bold text-[#f4efe5] transition-transform duration-150 hover:-translate-y-px'
const bannerClass = 'rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3'

function AppShell({ currentUser, sessionUser, onLogout, message }) {
  const location = useLocation()

  const titleByPath = {
    '/app/dashboard': 'Resumen general',
    '/app/notes/all': 'Mis notas',
    '/app/notes/active': 'Notas activas',
    '/app/notes/archived': 'Notas archivadas',
  }

  const title = titleByPath[location.pathname] || 'Workspace'

  return (
    <div className={shellBaseClass}>
      <div aria-hidden="true" className={shellBackdropClass} />
      <div aria-hidden="true" className={shellGlowOrangeClass} />
      <div aria-hidden="true" className={shellGlowBlueClass} />

      <div className={shellContentClass}>
        <aside className={`${cardClass} sticky top-6 grid min-w-0 self-start gap-6`}>
          <div>
            <p className={eyebrowClass}>Workspace</p>
            <h2 className="m-0 text-[1.6rem] font-semibold tracking-[-0.03em] text-[#f4efe5]">
              Panel de control
            </h2>
            <p className={`${bodyCopyClass} mt-2 break-words`}>
              Sesión iniciada como {sessionUser?.email || currentUser?.email}
            </p>
          </div>

          <nav className="grid gap-3">
            <NavLink
              to="/app/dashboard"
              className={({ isActive }) => (isActive ? navActiveClass : navInactiveClass)}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/app/notes"
              className={({ isActive }) => (isActive ? navActiveClass : navInactiveClass)}
            >
              Notas
            </NavLink>
          </nav>

          <div className="grid gap-3">
            <p className={`${bodyCopyClass} m-0`}>
              Filtra por estado desde la vista de notas.
            </p>
            <button type="button" className={secondaryButtonClass} onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="grid min-w-0 gap-5">
          <header className={`${cardClass} grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto]`}>
            <div className="min-w-0">
              <h1 className={sectionTitleClass}>{title}</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <NavLink className={secondaryButtonClass} to="/app/notes/all">
                Nueva nota
              </NavLink>
            </div>
          </header>

          {message ? <div className={bannerClass}>{message}</div> : null}

          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
