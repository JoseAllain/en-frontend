import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const pageClass =
  'grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'
const cardClass =
  'grid min-w-0 gap-[18px] rounded-[24px] border border-white/10 bg-[#0d1118]/80 p-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl'
const panelHeaderClass = 'flex items-start justify-between gap-4'
const eyebrowClass = 'm-0 mb-2 text-[0.74rem] uppercase tracking-[0.18em] text-[#ffb47a]'
const titleClass = 'm-0 text-[1.6rem] font-semibold tracking-[-0.03em] text-[#f4efe5]'
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-[18px] py-3 font-bold text-[#f4efe5] transition-transform duration-150 hover:-translate-y-px'
const listStackClass = 'grid gap-3'
const listItemBaseClass =
  'flex min-w-0 items-center justify-between gap-3 rounded-[20px] border px-[14px] py-[14px] text-left text-[#f4efe5] transition'
const listItemActiveClass = `${listItemBaseClass} border-[#ffb47a66] bg-[#ffb47a14]`
const listItemInactiveClass = `${listItemBaseClass} border-white/10 bg-white/[0.04]`
const textButtonClass =
  'inline-flex items-center justify-center rounded-full bg-white/5 px-3 py-1.5 text-[#ffb47a] transition-transform duration-150 hover:-translate-y-px'
const inlineActionsClass = 'flex flex-wrap items-center gap-2'
const pillClass =
  'inline-flex items-center justify-center rounded-full bg-white/10 px-[10px] py-[6px] text-[0.8rem] text-[#f4efe5]'
const helperClass = 'm-0 text-[rgba(243,239,230,0.78)]'
const formClass = 'grid gap-4'
const labelClass = 'grid gap-2 text-[0.94rem] text-[#f4efe5]'
const inputClass =
  'w-full rounded-2xl border border-white/10 bg-[#07090ebe] px-4 py-3 text-[#f4efe5] outline-none placeholder:text-[#f4efe580] focus:outline-none focus:ring-2 focus:ring-[#ff9f5a73]'
const formActionsClass = 'flex flex-wrap gap-3'
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff9f5a,#f06d37)] px-[18px] py-3 font-bold text-[#120f11] transition-transform duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60'
const dangerButtonClass =
  'inline-flex items-center justify-center rounded-full border border-[#ff75752e] bg-[#ff4a4a24] px-[18px] py-3 font-bold text-[#ffd0d0] transition-transform duration-150 hover:-translate-y-px'

function UsersPage({
  token,
  users,
  selectedUserId,
  setSelectedUserId,
  syncUsers,
  createUser,
  updateUser,
  deleteUser,
  loadNotes,
  loading,
}) {
  const navigate = useNavigate()
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' })
  const [editingUserId, setEditingUserId] = useState(null)

  function startEditUser(user) {
    setEditingUserId(user.id)
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
    })
  }

  function resetForm() {
    setEditingUserId(null)
    setUserForm({ name: '', email: '', password: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      name: userForm.name,
      email: userForm.email,
      password: userForm.password,
    }

    if (editingUserId) {
      await updateUser(editingUserId, payload)
    } else {
      await createUser(payload)
    }

    const { validSelection } = await syncUsers(editingUserId || selectedUserId, token)
    if (validSelection) {
      await loadNotes(validSelection, 'all', token)
      setSelectedUserId(validSelection)
    }

    resetForm()
  }

  async function handleDelete(user) {
    if (!window.confirm(`Eliminar a ${user.name} (${user.email})?`)) {
      return
    }

    await deleteUser(user.id)
    const { validSelection } = await syncUsers(user.id === selectedUserId ? null : selectedUserId, token)

    if (validSelection) {
      await loadNotes(validSelection, 'all', token)
      setSelectedUserId(validSelection)
    }

    if (!validSelection) {
      navigate('/app/dashboard')
    }

    if (editingUserId === user.id) {
      resetForm()
    }
  }

  return (
    <section className={pageClass}>
      <article className={cardClass}>
        <div className={panelHeaderClass}>
          <div>
            <p className={eyebrowClass}>Listado</p>
            <h3 className={titleClass}>Usuarios</h3>
          </div>
          <button type="button" className={secondaryButtonClass} onClick={resetForm}>
            Limpiar formulario
          </button>
        </div>

        <div className={listStackClass}>
          {users.map((user) => (
            <button
              type="button"
              key={user.id}
              className={user.id === selectedUserId ? listItemActiveClass : listItemInactiveClass}
              onClick={() => {
                setSelectedUserId(user.id)
                navigate('/app/notes/all')
              }}
            >
              <span className="min-w-0">
                <strong className="block overflow-wrap:anywhere">{user.name}</strong>
                <small className="block overflow-wrap:anywhere text-[rgba(243,239,230,0.78)]">
                  {user.email}
                </small>
              </span>
              <span className={inlineActionsClass}>
                <span className={pillClass}>#{user.id}</span>
                <button
                  type="button"
                  className={textButtonClass}
                  onClick={(event) => {
                    event.stopPropagation()
                    startEditUser(user)
                  }}
                >
                  Editar
                </button>
              </span>
            </button>
          ))}

          {!users.length ? <p className={helperClass}>No hay usuarios cargados aún.</p> : null}
        </div>
      </article>

      <article className={cardClass}>
        <div className={panelHeaderClass}>
          <div>
            <p className={eyebrowClass}>Formulario</p>
            <h3 className={titleClass}>{editingUserId ? 'Editar usuario' : 'Nuevo usuario'}</h3>
          </div>
          {editingUserId ? <span className={pillClass}>Editando #{editingUserId}</span> : null}
        </div>

        <form className={formClass} onSubmit={handleSubmit}>
          <label className={labelClass}>
            Nombre
            <input
              className={inputClass}
              value={userForm.name}
              onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))}
              type="text"
              required
            />
          </label>
          <label className={labelClass}>
            Correo
            <input
              className={inputClass}
              value={userForm.email}
              onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
              type="email"
              required
            />
          </label>
          <label className={labelClass}>
            Contraseña
            <input
              className={inputClass}
              value={userForm.password}
              onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))}
              type="password"
              required
            />
          </label>

          <div className={formActionsClass}>
            <button type="submit" className={primaryButtonClass} disabled={loading}>
              {loading ? 'Guardando...' : editingUserId ? 'Actualizar usuario' : 'Crear usuario'}
            </button>
            {editingUserId ? (
              <button type="button" className={secondaryButtonClass} onClick={resetForm}>
                Cancelar edición
              </button>
            ) : null}
          </div>
        </form>

        {editingUserId ? (
          <button
            type="button"
            className={dangerButtonClass}
            onClick={() => handleDelete(users.find((user) => user.id === editingUserId))}
          >
            Eliminar usuario
          </button>
        ) : null}
      </article>
    </section>
  )
}

export default UsersPage
