import { useState, useEffect } from 'react'

// const API = 'http://127.0.0.1:8000'       // local development
const API = 'https://movie-recommender-system-dcma.onrender.com' // production (Vercel deploy)

// ── Email validator ───────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null
  const isError = type === 'error'
  return (
    <div style={{
      position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, animation: 'slideDown 0.3s ease both',
      background: isError ? 'rgba(230,57,70,0.95)' : 'rgba(34,197,94,0.95)',
      color: '#fff', padding: '12px 24px', borderRadius: 10,
      fontSize: 14, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: 10,
      maxWidth: '90vw', textAlign: 'center',
    }}>
      <span>{isError ? '⚠️' : '✅'}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1, marginLeft: 8 }}>×</button>
    </div>
  )
}

export default function Login({ onLogin, onGoRegister }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState({ message: '', type: 'error' })

  const showToast = (message, type = 'error') => setToast({ message, type })
  const hideToast = () => setToast({ message: '', type: 'error' })

  const submit = async () => {
    // Validate email
    if (!email) { showToast('Please enter your email'); return }
    if (!isValidEmail(email)) { showToast('Please enter a valid email (e.g. user@gmail.com)'); return }
    if (!password) { showToast('Please enter your password'); return }

    setLoading(true)
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await r.json()
      if (!r.ok) { showToast(data.detail || 'Invalid email or password'); return }
      localStorage.setItem('cinemind_user', JSON.stringify(data.user))
      showToast('Welcome back! 🎬', 'success')
      setTimeout(() => onLogin(data.user), 800)
    } catch {
      showToast('Cannot connect to server. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(230,57,70,0.06) 0%, transparent 60%)',
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          animation: 'scaleIn 0.4s ease both',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--red)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 8px 24px var(--red-glow)' }}>🎬</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 4, color: 'var(--white)' }}>
              CINE<span style={{ color: 'var(--red)' }}>MIND</span>
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Sign in to your account</p>
          </div>

          {/* Fields */}
          <form autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@gmail.com" autoComplete="off" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" onEnter={submit} autoComplete="current-password" />
          </form>

          {/* Submit */}
          <button
            onClick={submit} disabled={loading}
            style={{ width: '100%', marginTop: 24, padding: '14px', background: loading ? 'rgba(230,57,70,0.5)' : 'var(--red)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px var(--red-glow)' }}
          >
            {loading ? 'Signing in…' : 'SIGN IN'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
            Don't have an account?{' '}
            <span onClick={onGoRegister} style={{ color: 'var(--red)', cursor: 'pointer', fontWeight: 500 }}>Create one</span>
          </p>
        </div>
      </div>
    </>
  )
}

function Field({ label, type, value, onChange, placeholder, onEnter, autoComplete = 'off' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${focused ? 'var(--red)' : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxShadow: focused ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none' }}
      />
    </div>
  )
}
