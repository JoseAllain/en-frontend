import { useNavigate } from 'react-router-dom'

const pageClass = 'grid gap-5'
const heroGridClass =
  'grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'
const statsGridClass = 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
const cardClass =
  'grid min-w-0 gap-[18px] rounded-[24px] border border-white/10 bg-[#0d1118]/80 p-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl'
const eyebrowClass = 'm-0 mb-2 text-[0.74rem] uppercase tracking-[0.18em] text-[#ffb47a]'
const titleClass = 'm-0 text-[1.6rem] font-semibold tracking-[-0.03em] text-[#f4efe5]'
const copyClass = 'm-0 text-[rgba(243,239,230,0.78)]'
const panelHeaderClass = 'flex items-start justify-between gap-4'
const pillRowClass = 'flex flex-wrap gap-3'
const stackButtonsClass = 'flex flex-wrap gap-3'
const helperClass = 'm-0 text-[rgba(243,239,230,0.78)]'
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-[18px] py-3 font-bold text-[#f4efe5] transition-transform duration-150 hover:-translate-y-px'
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff9f5a,#f06d37)] px-[18px] py-3 font-bold text-[#120f11] transition-transform duration-150 hover:-translate-y-px'
const summaryCardClass =
  'grid min-w-0 gap-2 rounded-[24px] border border-white/10 bg-[#0d1118]/80 p-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl'
const pillClass =
  'inline-flex items-center justify-center rounded-full bg-white/10 px-[10px] py-[6px] text-[0.8rem] text-[#f4efe5]'

function DashboardPage({ notes, currentUser, sessionUser }) {
  const navigate = useNavigate()
  const activeNotes = notes.filter((note) => !note.archived)
  const archivedNotes = notes.filter((note) => note.archived)

  const summaryCards = [
    { label: 'Notas activas', value: activeNotes.length },
    { label: 'Notas archivadas', value: archivedNotes.length },
    { label: 'Sesión', value: currentUser?.email || sessionUser?.email || 'Sin sesión' },
  ]

  return (
    <section className={pageClass}>
      <div className={heroGridClass}>
        <article className={cardClass}>
          <div className={panelHeaderClass}>
            <div className="min-w-0">
              <p className={eyebrowClass}>Tu espacio</p>
              <h3 className={titleClass}>{currentUser?.email || sessionUser?.email || 'Sin sesión'}</h3>
            </div>
            <button type="button" className={secondaryButtonClass} onClick={() => navigate('/app/notes/all')}>
              Ir a notas
            </button>
          </div>

          <p className={copyClass}>Acá ves el resumen de tu actividad y acceso rápido a tus notas.</p>
          <div className={pillRowClass}>
            <span className={pillClass}>Activas: {activeNotes.length}</span>
            <span className={pillClass}>Archivadas: {archivedNotes.length}</span>
          </div>
        </article>

        <article className={cardClass}>
          <div className={panelHeaderClass}>
            <div>
              <p className={eyebrowClass}>Accesos rápidos</p>
              <h3 className={titleClass}>Flujo personal</h3>
            </div>
          </div>
          <div className={stackButtonsClass}>
            <button type="button" className={primaryButtonClass} onClick={() => navigate('/app/notes/all')}>
              Crear o editar notas
            </button>
          </div>
          <p className={helperClass}>
            El front usa rutas reales para navegar entre tu resumen y tus notas personales.
          </p>
        </article>
      </div>

      <div className={statsGridClass}>
        {summaryCards.map((card) => (
          <article className={summaryCardClass} key={card.label}>
            <span className="block overflow-wrap:anywhere text-[rgba(243,239,230,0.78)]">
              {card.label}
            </span>
            <strong className="block text-[clamp(1.2rem,2vw,1.8rem)] text-[#f4efe5]">
              {card.value}
            </strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
