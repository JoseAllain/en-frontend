import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const shellClass =
  'relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#0c0f16] px-4 py-4 text-[#f3efe6] md:px-6 md:py-6'
const backdropClass =
  'pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#11131a_0%,#161b28_45%,#0c0f16_100%)]'
const glowOrangeClass =
  'pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(235,124,56,0.28)_0%,transparent_70%)] blur-3xl'
const glowBlueClass =
  'pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(24,44,84,0.8)_0%,transparent_70%)] blur-3xl'
const panelClass = 'relative z-10 mx-auto grid w-full max-w-[920px] gap-6'
const cardClass =
  'rounded-[24px] border border-white/10 bg-[#0d1118]/80 p-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl'
const eyebrowClass = 'm-0 mb-2 text-[0.74rem] uppercase tracking-[0.18em] text-[#ffb47a]'
const titleClass = 'm-0 text-[clamp(2rem,4vw,4.2rem)] leading-[0.98] tracking-[-0.04em]'
const copyClass = 'm-0 text-[rgba(243,239,230,0.78)]'
const tabsRowClass = 'flex flex-wrap gap-3'
const tabBaseClass =
  'inline-flex items-center justify-center rounded-full border-0 px-4 py-3 font-medium transition-transform duration-150 hover:-translate-y-px'
const tabActiveClass = `${tabBaseClass} bg-[#f3efe6] text-[#121521]`
const tabInactiveClass = `${tabBaseClass} bg-white/5 text-[#f4efe5]`
const bannerClass = 'rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3'
const formClass = 'grid gap-4'
const labelClass = 'grid gap-2 text-[0.94rem] text-[#f4efe5]'
const inputClass =
  'w-full rounded-2xl border border-white/10 bg-[#07090ebe] px-4 py-3 text-[#f4efe5] outline-none placeholder:text-[#f4efe580] focus:outline-none focus:ring-2 focus:ring-[#ff9f5a73]'
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff9f5a,#f06d37)] px-[18px] py-3 font-bold text-[#120f11] transition-transform duration-150 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60'
const helperClass = 'm-0 text-[rgba(243,239,230,0.78)]'

function AuthPage({ onLogin, onRegister, loading, message }) {
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState('login')

  async function handleLogin(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: formData.get('loginEmail'),
      password: formData.get('loginPassword'),
    }

    await onLogin(payload)
    navigate('/app/dashboard', { replace: true })
  }

  async function handleRegister(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('registerName'),
      email: formData.get('registerEmail'),
      password: formData.get('registerPassword'),
    }

    await onRegister(payload)
    setAuthMode('login')
    event.currentTarget.reset()
  }

  return (
    <main className={shellClass}>
      <div aria-hidden="true" className={backdropClass} />
      <div aria-hidden="true" className={glowOrangeClass} />
      <div aria-hidden="true" className={glowBlueClass} />

      <section className={panelClass}>
        <div className="grid gap-2">
          <p className={eyebrowClass}>Ensolvers challenge</p>
          <h1 className={titleClass}>Tu cuenta, tus notas.</h1>
          <p className={copyClass}>
            Regístrate, entra con tu cuenta y gestiona tus notas activas o archivadas.
          </p>
        </div>

        <div className={tabsRowClass}>
          <button
            type="button"
            className={authMode === 'login' ? tabActiveClass : tabInactiveClass}
            onClick={() => setAuthMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={authMode === 'register' ? tabActiveClass : tabInactiveClass}
            onClick={() => setAuthMode('register')}
          >
            Crear usuario
          </button>
        </div>

        {message ? <div className={bannerClass}>{message}</div> : null}

        {authMode === 'login' ? (
          <form className={`${cardClass} ${formClass}`} onSubmit={handleLogin}>
            <label className={labelClass}>
              Correo
              <input className={inputClass} name="loginEmail" type="email" placeholder="tu@correo.com" required />
            </label>
            <label className={labelClass}>
              Contraseña
              <input
                className={inputClass}
                name="loginPassword"
                type="password"
                placeholder="••••••••"
                required
              />
            </label>
            <button type="submit" className={primaryButtonClass} disabled={loading}>
              {loading ? 'Validando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form className={`${cardClass} ${formClass}`} onSubmit={handleRegister}>
            <label className={labelClass}>
              Nombre
              <input className={inputClass} name="registerName" type="text" placeholder="Nombre completo" required />
            </label>
            <label className={labelClass}>
              Correo
              <input className={inputClass} name="registerEmail" type="email" placeholder="tu@correo.com" required />
            </label>
            <label className={labelClass}>
              Contraseña
              <input
                className={inputClass}
                name="registerPassword"
                type="password"
                placeholder="Crea una contraseña"
                required
              />
            </label>
            <button type="submit" className={primaryButtonClass} disabled={loading}>
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>
          </form>
        )}

        <p className={helperClass}>
          Si todavía no tienes cuenta, crea una y luego inicia sesión con tus credenciales.
        </p>
      </section>
    </main>
  )
}

export default AuthPage
