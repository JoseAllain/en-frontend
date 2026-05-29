import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

const pageClass =
  'grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] max-h-155'
const cardClass =
  'grid min-w-0 gap-[18px] rounded-[24px] border border-white/10 bg-[#0d1118]/80 p-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl'
const eyebrowClass = 'm-0 mb-2 text-[0.74rem] uppercase tracking-[0.18em] text-[#ffb47a]'
const titleClass = 'm-0 text-[1.6rem] font-semibold text-[#f4efe5]'
const panelHeaderClass = 'flex items-start justify-between gap-4'
const tabsRowClass = 'flex flex-wrap gap-3 center'
const filterButtonBaseClass =
  'flex items-center justify-center rounded-2xl border font-medium transition-transform duration-150 hover:-translate-y-px min-h-10 max-h-14 min-w-18 px-3'
const filterButtonActiveClass = `${filterButtonBaseClass} border-transparent bg-[#f3efe6] text-[#121521]`
const filterButtonInactiveClass = `${filterButtonBaseClass} border-white/10 bg-white/5 text-[#f4efe5]`
const noteCardClass =
  'grid min-w-0 gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-left'
const noteHeadClass = 'flex items-start justify-between gap-4'
const listStackClass = 'grid gap-3'
const pillClass =
  'inline-flex items-center justify-center rounded-full bg-white/10 px-[10px] py-[6px] text-[0.8rem] text-[#f4efe5]'
const mutedPillClass =
  'inline-flex items-center justify-center rounded-full bg-white/[0.05] px-[10px] py-[6px] text-[0.8rem] text-[#f4efe5b8]'
const metaClass = 'grid gap-1 text-[rgba(243,239,230,0.6)]'
const helperClass = 'm-0 text-[rgba(243,239,230,0.78)]'
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-[18px] py-3 font-bold text-[#f4efe5] transition-transform duration-150 hover:-translate-y-px'
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff9f5a,#f06d37)] px-[18px] py-3 font-bold text-[#120f11] transition-transform duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60'
const dangerButtonClass =
  'inline-flex items-center justify-center rounded-full border border-[#ff75752e] bg-[#ff4a4a24] px-[18px] py-3 font-bold text-[#ffd0d0] transition-transform duration-150 hover:-translate-y-px'
const formClass = 'grid gap-4'
const inputClass =
  'w-full rounded-2xl border border-white/10 bg-[#07090ebe] px-4 py-3 text-[#f4efe5] outline-none placeholder:text-[#f4efe580] focus:outline-none focus:ring-2 focus:ring-[#ff9f5a73]'
const labelClass = 'grid gap-2 text-[0.94rem] text-[#f4efe5]'
const tagClass =
  'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.8rem] text-[#f4efe5]'
const tagRemoveButtonClass =
  'inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[0.74rem] text-[#f4efe5]'
const tinyButtonClass =
  'inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.82rem] font-semibold text-[#f4efe5] transition-transform duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60'

function formatDate(value) {
  if (!value) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function NotesPage({
  sessionUser,
  notes,
  loadNotes,
  createNote,
  updateNote,
  deleteNote,
  toggleArchive,
  addCategoryToNote,
  removeCategoryFromNote,
  loading,
}) {
  const params = useParams()
  const filter = ['all', 'active', 'archived'].includes(params.filter) ? params.filter : 'all'
  const [noteForm, setNoteForm] = useState({ title: '', content: '' })
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [categoryFilterInput, setCategoryFilterInput] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [noteCategoryInput, setNoteCategoryInput] = useState({})
  const userId = sessionUser?.userId

  useEffect(() => {
    if (!userId) {
      return
    }

    void loadNotes(userId, filter, categoryFilter)
  }, [categoryFilter, filter, loadNotes, userId])

  function startEditNote(note) {
    setEditingNoteId(note.id)
    setNoteForm({
      title: note.title || '',
      content: note.content || '',
    })
  }

  function resetForm() {
    setEditingNoteId(null)
    setNoteForm({ title: '', content: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!userId) {
      return
    }

    const payload = editingNoteId
      ? { title: noteForm.title, content: noteForm.content }
      : { title: noteForm.title, content: noteForm.content, userId }

    if (editingNoteId) {
      await updateNote(editingNoteId, payload)
    } else {
      await createNote(payload)
    }

    await loadNotes(userId, filter, categoryFilter)
    resetForm()
  }

  async function handleDelete(note) {
    if (!window.confirm('Eliminar esta nota?')) {
      return
    }

    await deleteNote(note.id)
    await loadNotes(userId, filter, categoryFilter)

    if (editingNoteId === note.id) {
      resetForm()
    }
  }

  async function handleArchive(note) {
    await toggleArchive(note.id, note.archived)
    await loadNotes(userId, filter, categoryFilter)
  }

  async function handleApplyCategoryFilter(event) {
    event.preventDefault()
    setCategoryFilter(categoryFilterInput.trim())
  }

  function handleClearCategoryFilter() {
    setCategoryFilter('')
    setCategoryFilterInput('')
  }

  async function handleAddCategory(noteId) {
    const categoryName = (noteCategoryInput[noteId] || '').trim()

    if (!categoryName || !userId) {
      return
    }

    await addCategoryToNote(noteId, categoryName)
    await loadNotes(userId, filter, categoryFilter)
    setNoteCategoryInput((current) => ({ ...current, [noteId]: '' }))
  }

  async function handleRemoveCategory(noteId, categoryName) {
    if (!userId) {
      return
    }

    await removeCategoryFromNote(noteId, categoryName)
    await loadNotes(userId, filter, categoryFilter)
  }

  return (
    <section className={pageClass}>
      <article className={`${cardClass} grid-rows-[auto_auto_auto_1fr]`}>
        <div className={`${panelHeaderClass} max-h-20`}>
          <div>
            <p className={eyebrowClass}>Contexto</p>
            <h3 className={titleClass}>Tus notas</h3>
          </div>
        </div>

        <div className={tabsRowClass}>
          <NavLink
            className={({ isActive }) =>
              isActive || filter === 'all' ? filterButtonActiveClass : filterButtonInactiveClass
            }
            to="/app/notes/all"
          >
            Todas
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive || filter === 'active' ? filterButtonActiveClass : filterButtonInactiveClass
            }
            to="/app/notes/active"
          >
            Activas
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive || filter === 'archived' ? filterButtonActiveClass : filterButtonInactiveClass
            }
            to="/app/notes/archived"
          >
            Archivadas
          </NavLink>
        </div>

        <form className="flex flex-wrap items-center gap-3" onSubmit={handleApplyCategoryFilter}>
          <input
            className={`${inputClass} min-w-[220px] flex-1 py-2`}
            value={categoryFilterInput}
            onChange={(event) => setCategoryFilterInput(event.target.value)}
            placeholder="Filtrar por categoría (ej: trabajo)"
            type="text"
          />
          <button type="submit" className={tinyButtonClass} disabled={loading}>
            Filtrar
          </button>
          <button
            type="button"
            className={tinyButtonClass}
            onClick={handleClearCategoryFilter}
            disabled={loading || !categoryFilter}
          >
            Limpiar filtro
          </button>
          {categoryFilter ? <span className={pillClass}>Categoria: {categoryFilter}</span> : null}
        </form>

        <div className={`${listStackClass} scrollbar-hidden max-h-92 overflow-y-auto`}>
          {notes.map((note) => (
            <article className={`${noteCardClass} max-h-88`} key={note.id}>
              <div className={noteHeadClass}>
                <div>
                  <span className={note.archived ? mutedPillClass : pillClass}>
                    {note.archived ? 'Archivada' : 'Activa'}
                  </span>
                  <h4 className="m-0 mt-2 text-[1.15rem] font-semibold tracking-[-0.02em] text-[#f4efe5]">
                    {note.title}
                  </h4>
                </div>
                <span className={pillClass}>#{note.id}</span>
              </div>

              <p className="m-0 overflow-wrap:anywhere text-[rgba(243,239,230,0.78)]">{note.content}</p>

              <div className="flex flex-wrap items-center gap-2">
                {note.categories?.length ? (
                  note.categories.map((category) => (
                    <span className={tagClass} key={`${note.id}-${category}`}>
                      <span>{category}</span>
                      <button
                        type="button"
                        className={tagRemoveButtonClass}
                        onClick={() => handleRemoveCategory(note.id, category)}
                        aria-label={`Quitar categoría ${category}`}
                      >
                        x
                      </button>
                    </span>
                  ))
                ) : (
                  <span className={mutedPillClass}>Sin categorías</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  className={`${inputClass} min-w-[190px] flex-1 py-2`}
                  value={noteCategoryInput[note.id] || ''}
                  onChange={(event) =>
                    setNoteCategoryInput((current) => ({
                      ...current,
                      [note.id]: event.target.value,
                    }))
                  }
                  placeholder="Nueva categoría"
                  type="text"
                />
                <button
                  type="button"
                  className={tinyButtonClass}
                  onClick={() => handleAddCategory(note.id)}
                  disabled={loading || !(noteCategoryInput[note.id] || '').trim()}
                >
                  Añadir categoría
                </button>
              </div>

              <div className={metaClass}>
                <small>Creada: {formatDate(note.createdAt)}</small>
                <small>Actualizada: {formatDate(note.updatedAt)}</small>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" className={secondaryButtonClass} onClick={() => startEditNote(note)}>
                  Editar
                </button>
                <button type="button" className={secondaryButtonClass} onClick={() => handleArchive(note)}>
                  {note.archived ? 'Desarchivar' : 'Archivar'}
                </button>
                <button type="button" className={dangerButtonClass} onClick={() => handleDelete(note)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}

          {!notes.length ? <p className={helperClass}>No hay notas para este filtro.</p> : null}
        </div>
      </article>

      <article className={cardClass}>
        <div className={panelHeaderClass}>
          <div>
            <p className={eyebrowClass}>Editor</p>
            <h3 className={titleClass}>{editingNoteId ? 'Editar nota' : 'Nueva nota'}</h3>
          </div>
          {editingNoteId ? <span className={pillClass}>Editando #{editingNoteId}</span> : null}
        </div>

        <form className={formClass} onSubmit={handleSubmit}>
          <label className={labelClass}>
            Título
            <input
              className={inputClass}
              value={noteForm.title}
              onChange={(event) => setNoteForm((current) => ({ ...current, title: event.target.value }))}
              type="text"
              required
            />
          </label>
          <label className={labelClass}>
            Contenido
            <textarea
              className={`${inputClass} min-h-[220px] resize-y`}
              value={noteForm.content}
              onChange={(event) => setNoteForm((current) => ({ ...current, content: event.target.value }))}
              rows="9"
              required
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className={primaryButtonClass} disabled={loading || !userId}>
              {loading ? 'Guardando...' : editingNoteId ? 'Actualizar nota' : 'Crear nota'}
            </button>
            <button type="button" className={secondaryButtonClass} onClick={resetForm}>
              Limpiar
            </button>
          </div>
        </form>

        <p className={helperClass}>
          Las notas se guardan para tu cuenta y luego puedes archivarlas o filtrarlas sin salir de esta vista.
        </p>
      </article>
    </section>
  )
}

export default NotesPage
