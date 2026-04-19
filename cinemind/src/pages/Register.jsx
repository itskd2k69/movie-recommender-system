// import { useState, useEffect } from 'react'

// const API = 'http://127.0.0.1:8000'

// const GENRES = [
//   'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
//   'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
//   'Romance', 'Science Fiction', 'Thriller', 'Western',
// ]

// // ── Email validator ───────────────────────────────────────────────────────────
// function isValidEmail(email) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
// }

// // ── Password strength ─────────────────────────────────────────────────────────
// function getStrength(password) {
//   if (!password) return { level: 0, label: '', color: '' }
//   let score = 0
//   if (password.length >= 6)  score++
//   if (password.length >= 10) score++
//   if (/[A-Z]/.test(password)) score++
//   if (/[0-9]/.test(password)) score++
//   if (/[^A-Za-z0-9]/.test(password)) score++

//   if (score <= 1) return { level: 1, label: 'Weak',   color: '#ef4444' }
//   if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' }
//   return              { level: 3, label: 'Strong', color: '#22c55e' }
// }

// // ── Toast ─────────────────────────────────────────────────────────────────────
// function Toast({ message, type = 'error', onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500)
//     return () => clearTimeout(t)
//   }, [message])

//   if (!message) return null
//   const isError = type === 'error'
//   return (
//     <div style={{
//       position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
//       zIndex: 9999, animation: 'slideDown 0.3s ease both',
//       background: isError ? 'rgba(230,57,70,0.95)' : 'rgba(34,197,94,0.95)',
//       color: '#fff', padding: '12px 24px', borderRadius: 10,
//       fontSize: 14, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
//       boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
//       display: 'flex', alignItems: 'center', gap: 10,
//       maxWidth: '90vw', textAlign: 'center',
//     }}>
//       <span>{isError ? '⚠️' : '✅'}</span>
//       <span>{message}</span>
//       <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1, marginLeft: 8 }}>×</button>
//     </div>
//   )
// }

// export default function Register({ onRegister, onGoLogin }) {
//   const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '', favorite_genre: '' })
//   const [loading, setLoading] = useState(false)
//   const [toast, setToast] = useState({ message: '', type: 'error' })
//   const strength          = getStrength(form.password)

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
//   const showToast = (message, type = 'error') => setToast({ message, type })
//   const hideToast = () => setToast({ message: '', type: 'error' })

//   const submit = async () => {
//     if (!form.name.trim())          { showToast('Please enter your full name'); return }
//     if (!form.email)                { showToast('Please enter your email'); return }
//     if (!isValidEmail(form.email))  { showToast('Invalid email. Use format: user@gmail.com'); return }
//     if (!form.password)             { showToast('Please enter a password'); return }
//     if (form.password.length < 6)  { showToast('Password must be at least 6 characters'); return }
//     if (form.password !== form.confirm) { showToast('Passwords do not match!'); return }

//     setLoading(true)
//     try {
//       const r = await fetch(`${API}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: form.name.trim(),
//           email: form.email.trim().toLowerCase(),
//           password: form.password,
//           favorite_genre: form.favorite_genre,
//         }),
//       })
//       const data = await r.json()
//       if (!r.ok) { showToast(data.detail || 'Registration failed'); return }
//       localStorage.setItem('cinemind_user', JSON.stringify(data.user))
//       showToast('Account created! Welcome 🎬', 'success')
//       setTimeout(() => onRegister(data.user), 800)
//     } catch {
//       showToast('Cannot connect to server. Make sure backend is running.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <Toast message={toast.message} type={toast.type} onClose={hideToast} />

//       <div style={{
//         minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
//         background: 'var(--bg)',
//         backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(230,57,70,0.06) 0%, transparent 60%)',
//         padding: '40px 20px',
//       }}>
//         <div style={{
//           width: '100%', maxWidth: 480,
//           background: 'var(--bg2)', border: '1px solid var(--border)',
//           borderRadius: 20, padding: '40px 36px',
//           boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
//           animation: 'scaleIn 0.4s ease both',
//         }}>
//           {/* Logo */}
//           <div style={{ textAlign: 'center', marginBottom: 32 }}>
//             <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--red)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 8px 24px var(--red-glow)' }}>🎬</div>
//             <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 4, color: 'var(--white)' }}>
//               CINE<span style={{ color: 'var(--red)' }}>MIND</span>
//             </h1>
//             <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Create your account</p>
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {/* Name */}
//             <Field label="Full Name *" type="text" value={form.name} onChange={v => set('name', v)} placeholder="John Doe" />

//             {/* Email with validation indicator */}
//             <div>
//               <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email *</label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type="email" value={form.email}
//                   onChange={e => set('email', e.target.value)}
//                   placeholder="you@gmail.com"
//                   style={{ width: '100%', padding: '12px 40px 12px 14px', background: 'var(--bg3)', border: `1px solid ${form.email ? (isValidEmail(form.email) ? '#22c55e' : '#ef4444') : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
//                 />
//                 {form.email && (
//                   <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
//                     {isValidEmail(form.email) ? '✅' : '❌'}
//                   </span>
//                 )}
//               </div>
//               {form.email && !isValidEmail(form.email) && (
//                 <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Use format: name@domain.com</p>
//               )}
//             </div>

//             {/* Password with strength indicator */}
//             <div>
//               <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password *</label>
//               <input
//                 type="password" value={form.password}
//                 onChange={e => set('password', e.target.value)}
//                 placeholder="Min. 6 characters"
//                 style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${form.password ? strength.color : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
//               />
//               {/* Strength bar */}
//               {form.password && (
//                 <div style={{ marginTop: 8 }}>
//                   <div style={{ display: 'flex', gap: 4 }}>
//                     {[1, 2, 3].map(i => (
//                       <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= strength.level ? strength.color : 'var(--bg3)', transition: 'background 0.3s' }} />
//                     ))}
//                   </div>
//                   <p style={{ fontSize: 11, color: strength.color, marginTop: 4 }}>
//                     Password strength: {strength.label}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm password */}
//             <div>
//               <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Confirm Password *</label>
//               <input
//                 type="password" value={form.confirm}
//                 onChange={e => set('confirm', e.target.value)}
//                 placeholder="Repeat password"
//                 onKeyDown={e => e.key === 'Enter' && submit()}
//                 style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${form.confirm ? (form.confirm === form.password ? '#22c55e' : '#ef4444') : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
//               />
//               {form.confirm && form.confirm !== form.password && (
//                 <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Passwords do not match</p>
//               )}
//             </div>

//             {/* Favorite Genre */}
//             <div>
//               <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
//                 Favorite Genre <span style={{ color: 'var(--text3)', fontWeight: 300 }}>(optional)</span>
//               </label>
//               <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>
//                 We'll show movies from your favorite genre on the home page 🎯
//               </p>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                 {GENRES.map(g => (
//                   <button
//                     key={g} onClick={() => set('favorite_genre', form.favorite_genre === g ? '' : g)}
//                     style={{ padding: '5px 12px', borderRadius: 20, border: form.favorite_genre === g ? '1px solid var(--red)' : '1px solid var(--border)', background: form.favorite_genre === g ? 'var(--red-dim)' : 'var(--bg3)', color: form.favorite_genre === g ? 'var(--red)' : 'var(--text3)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
//                   >{g}</button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={submit} disabled={loading}
//             style={{ width: '100%', marginTop: 24, padding: '14px', background: loading ? 'rgba(230,57,70,0.5)' : 'var(--red)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px var(--red-glow)' }}
//           >
//             {loading ? 'Creating account…' : 'CREATE ACCOUNT'}
//           </button>

//           <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
//             Already have an account?{' '}
//             <span onClick={onGoLogin} style={{ color: 'var(--red)', cursor: 'pointer', fontWeight: 500 }}>Sign in</span>
//           </p>
//         </div>
//       </div>
//     </>
//   )
// }

// function Field({ label, type, value, onChange, placeholder, onEnter }) {
//   const [focused, setFocused] = useState(false)
//   return (
//     <div>
//       <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
//       <input
//         type={type} value={value}
//         onChange={e => onChange(e.target.value)}
//         placeholder={placeholder}
//         onFocus={() => setFocused(true)}
//         onBlur={() => setFocused(false)}
//         onKeyDown={e => e.key === 'Enter' && onEnter?.()}
//         style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${focused ? 'var(--red)' : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxShadow: focused ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none' }}
//       />
//     </div>
//   )
// }


import { useState, useEffect } from 'react'

// const API = 'http://127.0.0.1:8000'       // local development
const API = 'https://movie-rec-466x.onrender.com' // production (Vercel deploy)

const GENRES = [
  { name: 'Action',          icon: '💥' },
  { name: 'Adventure',       icon: '🗺️' },
  { name: 'Animation',       icon: '🎨' },
  { name: 'Comedy',          icon: '😂' },
  { name: 'Crime',           icon: '🔫' },
  { name: 'Documentary',     icon: '📽️' },
  { name: 'Drama',           icon: '🎭' },
  { name: 'Fantasy',         icon: '🧙' },
  { name: 'Horror',          icon: '👻' },
  { name: 'Mystery',         icon: '🔍' },
  { name: 'Romance',         icon: '❤️' },
  { name: 'Science Fiction', icon: '🚀' },
  { name: 'Thriller',        icon: '😱' },
  { name: 'Western',         icon: '🤠' },
]

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

function getStrength(password) {
  if (!password) return { level: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 6)  score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { level: 1, label: 'Weak',   color: '#ef4444' }
  if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' }
  return              { level: 3, label: 'Strong', color: '#22c55e' }
}

function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    if (!message) return
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
      display: 'flex', alignItems: 'center', gap: 10, maxWidth: '90vw',
    }}>
      <span>{isError ? '⚠️' : '✅'}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', marginLeft: 8 }}>×</button>
    </div>
  )
}

export default function Register({ onRegister, onGoLogin }) {
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [selectedGenres, setSelectedGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast]   = useState({ message: '', type: 'error' })
  const strength            = getStrength(form.password)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const showToast = (msg, type = 'error') => setToast({ message: msg, type })
  const hideToast = () => setToast({ message: '', type: 'error' })

  const toggleGenre = (name) => {
    setSelectedGenres(prev => {
      if (prev.includes(name)) return prev.filter(g => g !== name)
      if (prev.length >= 3) {
        showToast('You can select maximum 3 genres')
        return prev
      }
      return [...prev, name]
    })
  }

  const submit = async () => {
    if (!form.name.trim())         { showToast('Please enter your full name'); return }
    if (!form.email)               { showToast('Please enter your email'); return }
    if (!isValidEmail(form.email)) { showToast('Invalid email. Use format: user@gmail.com'); return }
    if (!form.password)            { showToast('Please enter a password'); return }
    if (form.password.length < 6)  { showToast('Password must be at least 6 characters'); return }
    if (form.password !== form.confirm) { showToast('Passwords do not match!'); return }

    setLoading(true)
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:             form.name.trim(),
          email:            form.email.trim().toLowerCase(),
          password:         form.password,
          favorite_genres:  selectedGenres,
        }),
      })
      const data = await r.json()
      if (!r.ok) { showToast(data.detail || 'Registration failed'); return }
      localStorage.setItem('cinemind_user', JSON.stringify(data.user))
      showToast('Account created! Welcome 🎬', 'success')
      setTimeout(() => onRegister(data.user), 800)
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
        backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(230,57,70,0.06) 0%, transparent 60%)',
        padding: '40px 20px',
      }}>
        <div style={{
          width: '100%', maxWidth: 500,
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
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Create your account</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <Field label="Full Name *" type="text" value={form.name} onChange={v => set('name', v)} placeholder="John Doe" />

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email" value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@gmail.com"
                  style={{ width: '100%', padding: '12px 40px 12px 14px', background: 'var(--bg3)', border: `1px solid ${form.email ? (isValidEmail(form.email) ? '#22c55e' : '#ef4444') : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                />
                {form.email && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>{isValidEmail(form.email) ? '✅' : '❌'}</span>}
              </div>
              {form.email && !isValidEmail(form.email) && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Use format: name@domain.com</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password *</label>
              <input
                type="password" value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Min. 6 characters"
                style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${form.password ? strength.color : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
              />
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= strength.level ? strength.color : 'var(--bg3)', transition: 'background 0.3s' }} />)}
                  </div>
                  <p style={{ fontSize: 11, color: strength.color, marginTop: 4 }}>Strength: {strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Confirm Password *</label>
              <input
                type="password" value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                placeholder="Repeat password"
                onKeyDown={e => e.key === 'Enter' && submit()}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${form.confirm ? (form.confirm === form.password ? '#22c55e' : '#ef4444') : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
              />
              {form.confirm && form.confirm !== form.password && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Passwords do not match</p>}
            </div>

            {/* Favorite Genres — multi select up to 3 */}
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Favorite Genres
                <span style={{ color: 'var(--text3)', fontWeight: 300, textTransform: 'none', letterSpacing: 0, marginLeft: 8, fontSize: 11 }}>
                  (pick up to 3 — optional)
                </span>
              </label>

              {/* Selected count indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 28, height: 6, borderRadius: 3,
                    background: i < selectedGenres.length ? 'var(--red)' : 'var(--bg3)',
                    transition: 'background 0.3s',
                  }} />
                ))}
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                  {selectedGenres.length}/3 selected
                </span>
              </div>

              <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>
                We'll show 6 movies from each genre on your home page 🎯
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {GENRES.map(g => {
                  const selected = selectedGenres.includes(g.name)
                  const maxed    = selectedGenres.length >= 3 && !selected
                  return (
                    <button
                      key={g.name}
                      onClick={() => !maxed && toggleGenre(g.name)}
                      style={{
                        padding: '6px 12px', borderRadius: 20,
                        border: selected ? '1px solid var(--red)' : '1px solid var(--border)',
                        background: selected ? 'var(--red-dim)' : 'var(--bg3)',
                        color: selected ? 'var(--red)' : maxed ? 'var(--text3)' : 'var(--text2)',
                        fontSize: 12, cursor: maxed ? 'not-allowed' : 'pointer',
                        opacity: maxed ? 0.4 : 1,
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <span>{g.icon}</span>
                      <span>{g.name}</span>
                      {selected && <span style={{ fontSize: 10 }}>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <button
            onClick={submit} disabled={loading}
            style={{ width: '100%', marginTop: 24, padding: '14px', background: loading ? 'rgba(230,57,70,0.5)' : 'var(--red)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px var(--red-glow)' }}
          >
            {loading ? 'Creating account…' : 'CREATE ACCOUNT'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
            Already have an account?{' '}
            <span onClick={onGoLogin} style={{ color: 'var(--red)', cursor: 'pointer', fontWeight: 500 }}>Sign in</span>
          </p>
        </div>
      </div>
    </>
  )
}

function Field({ label, type, value, onChange, placeholder, onEnter }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        style={{ width: '100%', padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${focused ? 'var(--red)' : 'var(--border)'}`, borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxShadow: focused ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none' }}
      />
    </div>
  )
}
