// import { useState, useEffect, useRef, useCallback } from 'react'
// import Login from './pages/Login.jsx'
// import Register from './pages/Register.jsx'
// import GenreSection from './components/GenreSection.jsx'
// import ProsCons from './components/ProsCons.jsx'

// // ─────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────
// const API   = 'http://127.0.0.1:8000'
// const IMG_W = 'https://image.tmdb.org/t/p/w500'

// const CATEGORIES = [
//   { key: 'trending',    icon: '🔥', label: 'Trending'    },
//   { key: 'popular',     icon: '⚡', label: 'Popular'     },
//   { key: 'top_rated',   icon: '👑', label: 'Top Rated'   },
//   { key: 'now_playing', icon: '🎬', label: 'Now Playing' },
//   { key: 'upcoming',    icon: '🎟', label: 'Upcoming'    },
// ]

// // ─────────────────────────────────────────────────────────────────────────────
// // API
// // ─────────────────────────────────────────────────────────────────────────────
// async function get(path, params = {}) {
//   const url = new URL(`${API}${path}`)
//   Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
//   const r = await fetch(url, { signal: AbortSignal.timeout(25000) })
//   if (!r.ok) throw new Error(`${r.status}`)
//   return r.json()
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // HOOKS
// // ─────────────────────────────────────────────────────────────────────────────
// function useDebounce(val, ms = 350) {
//   const [dv, set] = useState(val)
//   useEffect(() => { const t = setTimeout(() => set(val), ms); return () => clearTimeout(t) }, [val, ms])
//   return dv
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // TINY COMPONENTS
// // ─────────────────────────────────────────────────────────────────────────────
// const Spinner = ({ size = 32, color = 'var(--red)' }) => (
//   <div style={{
//     width: size, height: size, borderRadius: '50%',
//     border: `2px solid rgba(255,255,255,0.05)`,
//     borderTop: `2px solid ${color}`,
//     animation: 'spin 0.75s linear infinite', flexShrink: 0,
//   }} />
// )

// const Badge = ({ children }) => (
//   <span style={{
//     padding: '3px 10px', borderRadius: 4,
//     background: 'var(--red-dim)', border: '1px solid var(--red)',
//     color: 'var(--red)', fontSize: 11, fontWeight: 500,
//     letterSpacing: 1, textTransform: 'uppercase',
//   }}>{children}</span>
// )

// const Rating = ({ value }) => {
//   if (!value) return null
//   const pct = Math.round((value / 10) * 100)
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//       <div style={{
//         width: 38, height: 38, borderRadius: '50%',
//         border: `2px solid ${value >= 7 ? '#22c55e' : value >= 5 ? '#f59e0b' : '#ef4444'}`,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         fontSize: 11, fontWeight: 600, color: 'var(--text)',
//       }}>{value.toFixed(1)}</div>
//       <div>
//         <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>User Score</div>
//         <div style={{ width: 80, height: 3, borderRadius: 3, background: 'var(--bg3)' }}>
//           <div style={{
//             width: `${pct}%`, height: '100%', borderRadius: 3,
//             background: value >= 7 ? '#22c55e' : value >= 5 ? '#f59e0b' : '#ef4444',
//             transition: 'width 0.8s ease',
//           }} />
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MOVIE CARD
// // ─────────────────────────────────────────────────────────────────────────────
// const Card = ({ movie, onClick, delay = 0, size = 'normal' }) => {
//   const [hov, setHov]       = useState(false)
//   const [loaded, setLoaded] = useState(false)
//   const year  = (movie.release_date || '').slice(0, 4)
//   const small = size === 'small'

//   return (
//     <div
//       onClick={() => onClick?.(movie.tmdb_id)}
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{ cursor: 'pointer', animation: `fadeUp 0.45s ease both`, animationDelay: `${delay}ms`, userSelect: 'none' }}
//     >
//       <div style={{
//         position: 'relative', borderRadius: small ? 8 : 12, overflow: 'hidden',
//         aspectRatio: '2/3', background: 'var(--bg3)',
//         border: `1px solid ${hov ? 'var(--red)' : 'var(--border)'}`,
//         transition: 'all 0.28s cubic-bezier(.4,0,.2,1)',
//         transform: hov ? 'translateY(-6px)' : 'translateY(0)',
//         boxShadow: hov ? '0 24px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(230,57,70,0.35)' : '0 4px 20px rgba(0,0,0,0.4)',
//       }}>
//         {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
//         {movie.poster_url ? (
//           <img src={movie.poster_url} alt={movie.title} onLoad={() => setLoaded(true)}
//             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }} />
//         ) : (
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8, padding: 12 }}>
//             <span style={{ fontSize: small ? 30 : 42 }}>🎬</span>
//             <span style={{ color: 'var(--text3)', fontSize: 11, textAlign: 'center' }}>{movie.title}</span>
//           </div>
//         )}
//         <div style={{
//           position: 'absolute', inset: 0,
//           background: 'linear-gradient(to top, rgba(8,8,15,0.95) 0%, rgba(8,8,15,0.3) 55%, transparent 100%)',
//           opacity: hov ? 1 : 0, transition: 'opacity 0.28s',
//           display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
//           padding: small ? '10px 8px' : '14px 12px', gap: 6,
//         }}>
//           {movie.vote_average > 0 && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//               <span style={{ color: '#f59e0b', fontSize: 12 }}>★</span>
//               <span style={{ color: 'var(--text)', fontSize: 12 }}>{movie.vote_average?.toFixed(1)}</span>
//             </div>
//           )}
//           <div style={{
//             background: 'var(--red)', color: '#fff', fontSize: 11, fontWeight: 600,
//             padding: small ? '4px 8px' : '5px 10px', borderRadius: 4, textAlign: 'center', letterSpacing: 0.5,
//           }}>VIEW DETAILS →</div>
//         </div>
//         {movie.vote_average > 0 && !hov && (
//           <div style={{
//             position: 'absolute', top: 8, right: 8,
//             background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(6px)',
//             borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600,
//             color: movie.vote_average >= 7 ? '#22c55e' : movie.vote_average >= 5 ? '#f59e0b' : '#ef4444',
//             border: '1px solid rgba(255,255,255,0.08)',
//           }}>★ {movie.vote_average?.toFixed(1)}</div>
//         )}
//       </div>
//       <div style={{ marginTop: 8, padding: '0 2px' }}>
//         <p style={{
//           fontSize: small ? 12 : 13, fontWeight: 400, color: hov ? '#fff' : 'var(--text)',
//           lineHeight: 1.3, transition: 'color 0.2s',
//           display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
//         }}>{movie.title}</p>
//         {year && <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{year}</p>}
//       </div>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // GRID
// // ─────────────────────────────────────────────────────────────────────────────
// const Grid = ({ movies, onSelect, cols = 6, size = 'normal' }) => {
//   if (!movies?.length) return null
//   return (
//     <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: size === 'small' ? '16px 12px' : '24px 16px' }}>
//       {movies.map((m, i) => <Card key={m.tmdb_id ?? i} movie={m} onClick={onSelect} delay={i * 35} size={size} />)}
//     </div>
//   )
// }

// const GridSkeleton = ({ cols = 6, count = 18 }) => (
//   <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '24px 16px' }}>
//     {Array.from({ length: count }).map((_, i) => (
//       <div key={i}>
//         <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 12 }} />
//         <div className="skeleton" style={{ height: 13, marginTop: 8, borderRadius: 4, width: '80%' }} />
//         <div className="skeleton" style={{ height: 11, marginTop: 5, borderRadius: 4, width: '40%' }} />
//       </div>
//     ))}
//   </div>
// )

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION HEADING
// // ─────────────────────────────────────────────────────────────────────────────
// const Section = ({ icon, title, sub, count, children }) => (
//   <section style={{ marginBottom: 56 }}>
//     <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
//       <div style={{ width: 4, height: 28, background: 'var(--red)', borderRadius: 2, marginRight: 14, flexShrink: 0 }} />
//       <span style={{ fontSize: 20, marginRight: 10 }}>{icon}</span>
//       <div>
//         <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--white)', letterSpacing: 0.2, lineHeight: 1 }}>{title}</h2>
//         {sub && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</p>}
//       </div>
//       {count != null && (
//         <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 12, border: '1px solid var(--border)' }}>{count}</span>
//       )}
//       <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--border2), transparent)', marginLeft: 16 }} />
//     </div>
//     {children}
//   </section>
// )

// // ─────────────────────────────────────────────────────────────────────────────
// // NAVBAR
// // ─────────────────────────────────────────────────────────────────────────────
// const Nav = ({ onHome, page, user, onLogout }) => (
//   <nav style={{
//     position: 'sticky', top: 0, zIndex: 200, height: 58,
//     background: 'rgba(8,8,15,0.88)', backdropFilter: 'blur(24px) saturate(1.4)',
//     borderBottom: '1px solid var(--border)',
//     display: 'flex', alignItems: 'center', padding: '0 40px', gap: 20,
//   }}>
//     <button onClick={onHome} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, color: 'inherit', cursor: 'pointer' }}>
//       <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 12px var(--red-glow)' }}>🎬</div>
//       <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: 'var(--white)', letterSpacing: 3, lineHeight: 1 }}>
//         CINE<span style={{ color: 'var(--red)' }}>MIND</span>
//       </span>
//     </button>

//     <div style={{ marginLeft: 20, fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 8 }}>
//       <span>›</span>
//       <span style={{ color: page === 'home' ? 'var(--text2)' : 'var(--red)' }}>
//         {page === 'home' ? 'Browse' : 'Movie Details'}
//       </span>
//     </div>

//     <div style={{ flex: 1 }} />

//     {/* TF-IDF indicator */}
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg2)' }}>
//       <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
//       <span style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: 0.5 }}>TF-IDF Model Active</span>
//     </div>

//     {/* User info */}
//     {user && (
//       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: 8,
//           padding: '6px 12px', borderRadius: 20,
//           background: 'var(--bg2)', border: '1px solid var(--border)',
//         }}>
//           <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>
//             {user.name?.[0]?.toUpperCase()}
//           </div>
//           <span style={{ fontSize: 13, color: 'var(--text2)' }}>{user.name}</span>
//         </div>
//         <button
//           onClick={onLogout}
//           style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text3)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
//           onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
//           onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}
//         >Logout</button>
//       </div>
//     )}

//     {page === 'details' && (
//       <button
//         onClick={onHome}
//         style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '7px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
//         onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = '#fff' }}
//         onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}
//       >← Back</button>
//     )}
//   </nav>
// )

// // ─────────────────────────────────────────────────────────────────────────────
// // SEARCH BOX
// // ─────────────────────────────────────────────────────────────────────────────
// const SearchBox = ({ onSelectId }) => {
//   const [q, setQ]             = useState('')
//   const [results, setResults] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [open, setOpen]       = useState(false)
//   const dq                    = useDebounce(q, 300)
//   const ref                   = useRef()

//   useEffect(() => {
//     if (dq.length < 2) { setResults([]); setOpen(false); return }
//     setLoading(true)
//     get('/tmdb/search', { query: dq })
//       .then(d => { const items = (d?.results || []).slice(0, 8); setResults(items); setOpen(items.length > 0) })
//       .catch(() => setResults([]))
//       .finally(() => setLoading(false))
//   }, [dq])

//   useEffect(() => {
//     const fn = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
//     document.addEventListener('mousedown', fn)
//     return () => document.removeEventListener('mousedown', fn)
//   }, [])

//   const pick = id => { setQ(''); setOpen(false); onSelectId(id) }

//   return (
//     <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
//       <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden' }}>
//         <span style={{ padding: '0 16px', color: 'var(--text3)', fontSize: 18, flexShrink: 0 }}>🔍</span>
//         <input
//           value={q} onChange={e => setQ(e.target.value)}
//           onFocus={() => results.length > 0 && setOpen(true)}
//           placeholder="Search for any movie — Inception, Interstellar, Avatar…"
//           style={{ flex: 1, padding: '15px 0', background: 'none', border: 'none', color: 'var(--text)', fontSize: 15, outline: 'none', fontWeight: 300 }}
//         />
//         {loading && <div style={{ padding: '0 16px' }}><Spinner size={18} /></div>}
//         {q && !loading && (
//           <button onClick={() => { setQ(''); setOpen(false) }} style={{ padding: '0 16px', background: 'none', border: 'none', color: 'var(--text3)', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}>×</button>
//         )}
//       </div>
//       {open && (
//         <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden', zIndex: 300, boxShadow: '0 24px 60px rgba(0,0,0,0.7)', animation: 'slideDown 0.2s ease both' }}>
//           {results.map((m, i) => {
//             const year   = (m.release_date || '').slice(0, 4)
//             const poster = m.poster_path ? `${IMG_W}${m.poster_path}` : null
//             return (
//               <div key={m.id} onClick={() => pick(m.id)}
//                 style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
//                 onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
//                 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//               >
//                 {poster
//                   ? <img src={poster} alt="" style={{ width: 32, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
//                   : <div style={{ width: 32, height: 48, borderRadius: 4, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎬</div>
//                 }
//                 <div>
//                   <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>{m.title}</p>
//                   {year && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{year}</p>}
//                 </div>
//                 {m.vote_average > 0 && <div style={{ marginLeft: 'auto', fontSize: 12, color: '#f59e0b' }}>★ {m.vote_average.toFixed(1)}</div>}
//               </div>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // HERO CAROUSEL
// // ─────────────────────────────────────────────────────────────────────────────
// const HeroCarousel = ({ movies, onSelect }) => {
//   const [idx, setIdx] = useState(0)
//   const total = Math.min(movies.length, 5)
//   const prev  = () => setIdx(i => (i - 1 + total) % total)
//   const next  = () => setIdx(i => (i + 1) % total)

//   useEffect(() => {
//     if (movies.length < 2) return
//     const t = setInterval(next, 5000)
//     return () => clearInterval(t)
//   }, [movies.length])

//   useEffect(() => {
//     const onKey = e => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
//     window.addEventListener('keydown', onKey)
//     return () => window.removeEventListener('keydown', onKey)
//   }, [total])

//   if (!movies.length) return (
//     <div style={{ height: 480, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//       <Spinner size={40} />
//     </div>
//   )

//   const m    = movies[Math.min(idx, movies.length - 1)]
//   const year = (m.release_date || '').slice(0, 4)

//   const arrowBtn = (onClick, dir) => (
//     <button onClick={onClick} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [dir]: 16, zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(8,8,15,0.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--border2)', color: '#fff', fontSize: 20, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//       onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)' }}
//       onMouseLeave={e => { e.currentTarget.style.background = 'rgba(8,8,15,0.7)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
//     >{dir === 'left' ? '‹' : '›'}</button>
//   )

//   return (
//     <div style={{ position: 'relative', height: 480, overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
//       {arrowBtn(prev, 'left')}
//       {arrowBtn(next, 'right')}
//       <img key={m.tmdb_id} src={m.backdrop_url || m.poster_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, filter: 'blur(1px) saturate(0.5)', animation: 'fadeIn 0.8s ease both' }} />
//       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(8,8,15,0.98) 0%, rgba(8,8,15,0.6) 50%, transparent 100%)' }} />
//       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, transparent 40%)' }} />
//       <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 40px', gap: 40 }}>
//         <img key={`p-${m.tmdb_id}`} src={m.poster_url} alt={m.title} onClick={() => onSelect(m.tmdb_id)}
//           style={{ height: 300, width: 200, objectFit: 'cover', borderRadius: 12, flexShrink: 0, border: '1px solid rgba(230,57,70,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', cursor: 'pointer', animation: 'scaleIn 0.5s ease both' }} />
//         <div key={`i-${m.tmdb_id}`} style={{ animation: 'fadeUp 0.5s ease both', maxWidth: 520 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
//             <Badge>#{idx + 1} Trending</Badge>
//             {year && <span style={{ fontSize: 13, color: 'var(--text3)' }}>{year}</span>}
//           </div>
//           <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(38px, 5vw, 62px)', color: 'var(--white)', letterSpacing: 3, lineHeight: 1, marginBottom: 16 }}>{m.title}</h1>
//           {m.vote_average > 0 && <Rating value={m.vote_average} />}
//           <button onClick={() => onSelect(m.tmdb_id)} style={{ marginTop: 24, background: 'var(--red)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 8px 24px var(--red-glow)', transition: 'all 0.2s' }}
//             onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(230,57,70,0.5)' }}
//             onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px var(--red-glow)' }}
//           >▶ GET RECOMMENDATIONS</button>
//         </div>
//       </div>
//       <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
//         {movies.slice(0, 5).map((_, i) => (
//           <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? 'var(--red)' : 'rgba(255,255,255,0.2)', border: 'none', padding: 0, transition: 'all 0.3s', cursor: 'pointer' }} />
//         ))}
//       </div>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // HOME PAGE
// // ─────────────────────────────────────────────────────────────────────────────
// // TMDB genre name → genre_id map for favorite genre feature
// const GENRE_NAME_TO_ID = {
//   'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35,
//   'Crime': 80, 'Documentary': 99, 'Drama': 18, 'Fantasy': 14,
//   'Horror': 27, 'Mystery': 9648, 'Romance': 10749,
//   'Science Fiction': 878, 'Thriller': 53, 'Western': 37,
// }

// const HomePage = ({ onSelect, user }) => {
//   const [cat, setCat]         = useState('trending')
//   const [movies, setMovies]   = useState([])
//   const [loading, setLoading] = useState(true)
//   const [hero, setHero]       = useState([])
//   const [heroLoad, setHeroLoad] = useState(true)
//   const [searchMovies, setSearchMovies] = useState(null)
//   const [searchQ, setSearchQ]   = useState('')
//   const [searchLoad, setSearchLoad] = useState(false)
//   const [favMovies, setFavMovies] = useState([])
//   const [favLoading, setFavLoading] = useState(false)

//   const favGenre = user?.favorite_genre || ''

//   useEffect(() => {
//     get('/home', { category: 'trending', limit: 5 })
//       .then(d => setHero(d || []))
//       .catch(() => {})
//       .finally(() => setHeroLoad(false))
//   }, [])

//   useEffect(() => {
//     setLoading(true); setMovies([])
//     get('/home', { category: cat, limit: 24 })
//       .then(d => setMovies(Array.isArray(d) ? d : []))
//       .catch(() => setMovies([]))
//       .finally(() => setLoading(false))
//   }, [cat])

//   // Load favorite genre movies
//   useEffect(() => {
//     if (!favGenre) return
//     const genreId = GENRE_NAME_TO_ID[favGenre]
//     if (!genreId) return
//     setFavLoading(true)
//     get(`/movies/genre/${genreId}`, { limit: 12 })
//       .then(d => setFavMovies(Array.isArray(d) ? d : []))
//       .catch(() => setFavMovies([]))
//       .finally(() => setFavLoading(false))
//   }, [favGenre])

//   const doSearch = useCallback(q => {
//     if (!q || q.length < 2) { setSearchMovies(null); setSearchQ(''); return }
//     setSearchQ(q); setSearchLoad(true); setSearchMovies([])
//     get('/tmdb/search', { query: q })
//       .then(d => setSearchMovies((d?.results || []).map(m => ({ tmdb_id: m.id, title: m.title, poster_url: m.poster_path ? `${IMG_W}${m.poster_path}` : null, release_date: m.release_date, vote_average: m.vote_average }))))
//       .catch(() => setSearchMovies([]))
//       .finally(() => setSearchLoad(false))
//   }, [])

//   return (
//     <div>
//       {heroLoad
//         ? <div style={{ height: 480, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={40} /></div>
//         : <HeroCarousel movies={hero} onSelect={onSelect} />
//       }

//       <div style={{ padding: '40px 40px' }}>
//         {/* Welcome banner if user has favorite genre */}
//         {favGenre && !searchMovies && (
//           <div style={{
//             marginBottom: 36, padding: '16px 20px',
//             background: 'linear-gradient(135deg, rgba(230,57,70,0.08) 0%, rgba(230,57,70,0.03) 100%)',
//             border: '1px solid rgba(230,57,70,0.2)', borderRadius: 12,
//             display: 'flex', alignItems: 'center', gap: 12,
//             animation: 'fadeUp 0.4s ease both',
//           }}>
//             <span style={{ fontSize: 24 }}>👋</span>
//             <div>
//               <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--white)' }}>
//                 Welcome back, <span style={{ color: 'var(--red)' }}>{user?.name}</span>!
//               </p>
//               <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
//                 Here are some <span style={{ color: 'var(--red)' }}>{favGenre}</span> movies picked for you based on your preference 🎯
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Search */}
//         <div style={{ marginBottom: 48, animation: 'fadeUp 0.4s ease both', position: 'relative', zIndex: 50 }}>
//           <p style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Search Any Movie</p>
//           <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
//             <SearchBox onSelectId={id => { setSearchMovies(null); setSearchQ(''); onSelect(id) }} />
//             <button
//               onClick={() => { const inp = document.querySelector('input[placeholder*="Inception"]'); if (inp?.value) doSearch(inp.value) }}
//               style={{ padding: '15px 24px', background: 'var(--red)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s' }}
//               onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
//               onMouseLeave={e => e.currentTarget.style.opacity = '1'}
//             >Search</button>
//           </div>
//         </div>

//         {searchMovies !== null ? (
//           <Section icon="🔍" title={`Results for "${searchQ}"`} count={searchMovies.length}>
//             {searchLoad ? <GridSkeleton /> : searchMovies.length > 0 ? <Grid movies={searchMovies} onSelect={onSelect} /> : <Empty text="No movies found." />}
//           </Section>
//         ) : (
//           <>
//             {/* Favorite genre section — shown first if user has preference */}
//             {favGenre && favMovies.length > 0 && (
//               <Section
//                 icon="🎯"
//                 title={`${favGenre} — Your Picks`}
//                 sub={`Handpicked ${favGenre} movies based on your preference`}
//               >
//                 {favLoading ? <GridSkeleton count={12} /> : <Grid movies={favMovies} onSelect={onSelect} />}
//               </Section>
//             )}

//             {/* Category pills */}
//             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32, animation: 'fadeUp 0.4s ease 0.1s both' }}>
//               {CATEGORIES.map(c => (
//                 <button key={c.key} onClick={() => setCat(c.key)} style={{ padding: '9px 20px', borderRadius: 8, border: cat === c.key ? '1px solid var(--red)' : '1px solid var(--border)', background: cat === c.key ? 'var(--red-dim)' : 'var(--bg2)', color: cat === c.key ? 'var(--red)' : 'var(--text2)', fontSize: 13, fontWeight: cat === c.key ? 500 : 300, transition: 'all 0.2s', cursor: 'pointer' }}>
//                   {c.icon} {c.label}
//                 </button>
//               ))}
//             </div>
//             <Section icon={CATEGORIES.find(c => c.key === cat)?.icon} title={CATEGORIES.find(c => c.key === cat)?.label} sub="Click any movie to get TF-IDF powered recommendations">
//               {loading ? <GridSkeleton /> : <Grid movies={movies} onSelect={onSelect} />}
//             </Section>

//             {/* Genre Section */}
//             <GenreSection onSelectMovie={onSelect} CardComponent={Card} GridComponent={Grid} />
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // EMPTY
// // ─────────────────────────────────────────────────────────────────────────────
// const Empty = ({ text }) => (
//   <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text3)', animation: 'fadeIn 0.4s ease both' }}>
//     <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🎭</div>
//     <p style={{ fontSize: 14 }}>{text}</p>
//   </div>
// )

// // ─────────────────────────────────────────────────────────────────────────────
// // DETAILS PAGE
// // ─────────────────────────────────────────────────────────────────────────────
// const DetailsPage = ({ tmdbId, onSelect }) => {
//   const [details, setDetails]   = useState(null)
//   const [bundle, setBundle]     = useState(null)
//   const [detailLoad, setDetailLoad] = useState(true)
//   const [recLoad, setRecLoad]   = useState(true)
//   const [tab, setTab]           = useState('tfidf')

//   useEffect(() => {
//     if (!tmdbId) return
//     setDetails(null); setBundle(null); setDetailLoad(true); setRecLoad(true)
//     get(`/movie/id/${tmdbId}`)
//       .then(d => {
//         setDetails(d); setDetailLoad(false)
//         if (d?.title) {
//           get('/movie/search', { query: d.title, tfidf_top_n: 12, genre_limit: 12 })
//             .then(b => setBundle(b)).catch(() => {}).finally(() => setRecLoad(false))
//         } else setRecLoad(false)
//       })
//       .catch(() => setDetailLoad(false))
//   }, [tmdbId])

//   if (detailLoad) return (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
//       <Spinner size={44} />
//       <p style={{ color: 'var(--text3)', fontSize: 14 }}>Loading movie details…</p>
//     </div>
//   )

//   if (!details) return <div style={{ textAlign: 'center', padding: '80px 40px' }}><p style={{ color: 'var(--text2)' }}>Could not load movie details.</p></div>

//   const year = (details.release_date || '').slice(0, 4)
//   const tfidfCards = (bundle?.tfidf_recommendations || []).filter(x => x.tmdb?.tmdb_id).map(x => ({ tmdb_id: x.tmdb.tmdb_id, title: x.tmdb.title || x.title, poster_url: x.tmdb.poster_url, release_date: x.tmdb.release_date, vote_average: x.tmdb.vote_average, score: x.score }))
//   const genreCards = bundle?.genre_recommendations || []

//   return (
//     <div className="anim-fade-in">
//       {/* Backdrop hero */}
//       <div style={{ position: 'relative', minHeight: 520, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
//         {details.backdrop_url && <img src={details.backdrop_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, filter: 'blur(3px) saturate(0.4)' }} />}
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)', opacity: 0.5, pointerEvents: 'none' }} />
//         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,15,1) 0%, rgba(8,8,15,0.75) 55%, transparent 100%)' }} />
//         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, transparent 50%)' }} />

//         <div style={{ position: 'relative', width: '100%', display: 'flex', gap: 48, alignItems: 'flex-end', padding: '48px 40px 0' }}>
//           <div style={{ flexShrink: 0, width: 230, transform: 'translateY(48px)', animation: 'scaleIn 0.5s ease 0.1s both', zIndex: 2 }}>
//             <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(230,57,70,0.25)', border: '1px solid rgba(230,57,70,0.2)' }}>
//               {details.poster_url ? <img src={details.poster_url} alt={details.title} style={{ width: '100%', display: 'block' }} /> : <div style={{ aspectRatio: '2/3', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🎬</div>}
//             </div>
//           </div>
//           <div style={{ paddingBottom: 12, flex: 1, animation: 'fadeUp 0.5s ease 0.15s both' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
//               {year && <Badge>{year}</Badge>}
//               {(details.genres || []).slice(0, 3).map(g => <span key={g.id} style={{ padding: '3px 10px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)', fontSize: 11, letterSpacing: 0.5 }}>{g.name}</span>)}
//             </div>
//             <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 58px)', color: 'var(--white)', letterSpacing: 3, lineHeight: 1.05, marginBottom: 20 }}>{details.title}</h1>
//             {details.vote_average > 0 && <Rating value={details.vote_average} />}

//             {/* Extra stats */}
//             <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
//               {details.runtime > 0 && <div style={{ fontSize: 12, color: 'var(--text3)' }}>⏱ {Math.floor(details.runtime / 60)}h {details.runtime % 60}m</div>}
//               {details.vote_count > 0 && <div style={{ fontSize: 12, color: 'var(--text3)' }}>🗳 {details.vote_count?.toLocaleString()} votes</div>}
//               {details.popularity > 0 && <div style={{ fontSize: 12, color: 'var(--text3)' }}>📈 {details.popularity?.toFixed(0)} popularity</div>}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Overview + Pros/Cons */}
//       <div style={{ padding: '72px 40px 40px', paddingLeft: 'calc(40px + 230px + 48px)', animation: 'fadeUp 0.5s ease 0.25s both', borderBottom: '1px solid var(--border)' }}>
//         <h3 style={{ fontSize: 13, color: 'var(--red)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Overview</h3>
//         <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: 15, maxWidth: 680, fontWeight: 300, marginBottom: 36 }}>
//           {details.overview || 'No overview available.'}
//         </p>

//         {/* Pros & Cons via Gemini */}
//         <ProsCons movie={details} />
//       </div>

//       {/* Recommendations */}
//       <div style={{ padding: '48px 40px' }}>
//         {/* Tab switcher */}
//         <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', width: 'fit-content', animation: 'fadeUp 0.4s ease both' }}>
//           {[
//             { key: 'tfidf', icon: '🤖', label: 'TF-IDF Recommendations', sub: 'ML Model' },
//             { key: 'genre', icon: '🎭', label: 'Genre Based', sub: 'TMDB Discover' },
//           ].map(t => (
//             <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '12px 24px', background: tab === t.key ? 'var(--red)' : 'transparent', border: 'none', color: tab === t.key ? '#fff' : 'var(--text2)', fontSize: 13, fontWeight: tab === t.key ? 600 : 300, transition: 'all 0.2s', letterSpacing: 0.3, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
//               <span>{t.icon}</span><span>{t.label}</span>
//               <span style={{ fontSize: 10, padding: '1px 6px', background: tab === t.key ? 'rgba(255,255,255,0.2)' : 'var(--bg3)', borderRadius: 10, letterSpacing: 1, color: tab === t.key ? '#fff' : 'var(--text3)' }}>{t.sub}</span>
//             </button>
//           ))}
//         </div>

//         {recLoad ? (
//           <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '32px 0' }}>
//             <Spinner size={28} />
//             <p style={{ color: 'var(--text3)', fontSize: 14 }}>Computing recommendations via TF-IDF cosine similarity…</p>
//           </div>
//         ) : (
//           <div key={tab} className="anim-fade-in">
//             {tab === 'tfidf' && (
//               <Section icon="🔎" title="Similar Movies" sub="Content-based filtering using TF-IDF on overview, genres & tagline" count={tfidfCards.length}>
//                 {tfidfCards.length > 0 ? (
//                   <>
//                     <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', padding: '0 0 8px' }}>
//                       {tfidfCards.slice(0, 5).map((m, i) => (
//                         <div key={m.tmdb_id} onClick={() => onSelect(m.tmdb_id)}
//                           style={{ flexShrink: 0, width: 140, cursor: 'pointer', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', transition: 'border-color 0.2s' }}
//                           onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
//                           onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
//                         >
//                           <p style={{ fontSize: 12, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.title}</p>
//                           <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 5 }}>Similarity: {(m.score * 100).toFixed(1)}%</div>
//                           <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 3 }}>
//                             <div style={{ height: '100%', borderRadius: 3, background: 'var(--red)', width: `${m.score * 100}%`, transition: 'width 0.8s ease' }} />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <Grid movies={tfidfCards} onSelect={onSelect} />
//                   </>
//                 ) : <Empty text="No TF-IDF recommendations found. This movie may not be in our local dataset." />}
//               </Section>
//             )}
//             {tab === 'genre' && (
//               <Section icon="🎭" title="More Like This" sub={`Popular ${(details.genres || [])[0]?.name || ''} movies`} count={genreCards.length}>
//                 {genreCards.length > 0 ? <Grid movies={genreCards} onSelect={onSelect} /> : <Empty text="No genre recommendations found." />}
//               </Section>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // ROOT APP
// // ─────────────────────────────────────────────────────────────────────────────
// export default function App() {
//   const [authPage, setAuthPage] = useState('login')   // 'login' | 'register'
//   const [user, setUser]         = useState(() => {
//     try { return JSON.parse(localStorage.getItem('cinemind_user')) } catch { return null }
//   })
//   const [page, setPage]         = useState('home')
//   const [movieId, setMovieId]   = useState(null)

//   const goDetails = useCallback(id => {
//     setMovieId(Number(id)); setPage('details')
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }, [])

//   const goHome = useCallback(() => {
//     setPage('home'); setMovieId(null)
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }, [])

//   const onLogout = () => {
//     localStorage.removeItem('cinemind_user')
//     setUser(null); setPage('home'); setMovieId(null)
//   }

//   // ── Not logged in → show auth pages ──
//   if (!user) {
//     if (authPage === 'register') return <Register onRegister={setUser} onGoLogin={() => setAuthPage('login')} />
//     return <Login onLogin={setUser} onGoRegister={() => setAuthPage('register')} />
//   }

//   // ── Logged in → show main app ──
//   return (
//     <>
//       <Nav onHome={goHome} page={page} user={user} onLogout={onLogout} />
//       <main key={`${page}-${movieId}`} className="anim-fade-in">
//         {page === 'home'
//           ? <HomePage onSelect={goDetails} user={user} />
//           : <DetailsPage tmdbId={movieId} onSelect={goDetails} />
//         }
//       </main>
//     </>
//   )
// }



import { useState, useEffect, useRef, useCallback, Component } from 'react'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GenreSection from './components/GenreSection.jsx'
import ProsCons from './components/ProsCons.jsx'

// Error boundary — prevents ProsCons crash from breaking the whole page
class SafeProsCons extends Component {
  constructor(props) { super(props); this.state = { crashed: false } }
  static getDerivedStateFromError() { return { crashed: true } }
  render() {
    if (this.state.crashed) return (
      <div style={{ padding: '16px 20px', background: 'rgba(230,57,70,0.05)', border: '1px solid rgba(230,57,70,0.15)', borderRadius: 10 }}>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>AI analysis unavailable for this movie.</p>
      </div>
    )
    return <ProsCons movie={this.props.movie} />
  }
}

const API   = 'http://127.0.0.1:8000'
const IMG_W = 'https://image.tmdb.org/t/p/w500'

const CATEGORIES = [
  { key: 'trending',    icon: '🔥', label: 'Trending'    },
  { key: 'popular',     icon: '⚡', label: 'Popular'     },
  { key: 'top_rated',   icon: '👑', label: 'Top Rated'   },
  { key: 'now_playing', icon: '🎬', label: 'Now Playing' },
  { key: 'upcoming',    icon: '🎟', label: 'Upcoming'    },
]

const MOODS = [
  { label: 'Happy',     icon: '😄', genres: [35, 16, 10751] },
  { label: 'Thrilled',  icon: '😱', genres: [53, 27, 80]    },
  { label: 'Romantic',  icon: '❤️', genres: [10749, 18]     },
  { label: 'Adventure', icon: '🚀', genres: [12, 28, 878]   },
  { label: 'Emotional', icon: '😢', genres: [18, 10749]     },
  { label: 'Inspired',  icon: '✨', genres: [99, 36, 18]    },
]

const GENRE_NAME_TO_ID = {
  'Action':28,'Adventure':12,'Animation':16,'Comedy':35,'Crime':80,
  'Documentary':99,'Drama':18,'Fantasy':14,'Horror':27,'Mystery':9648,
  'Romance':10749,'Science Fiction':878,'Thriller':53,'Western':37,
}

// ── localStorage helpers ──────────────────────────────────────────────────────
function addToRecent(movie) {
  try {
    let recent = JSON.parse(localStorage.getItem('cinemind_recent') || '[]')
    recent = [movie, ...recent.filter(m => m.tmdb_id !== movie.tmdb_id)].slice(0, 20)
    localStorage.setItem('cinemind_recent', JSON.stringify(recent))
  } catch {}
}

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('cinemind_watchlist') || '[]') } catch { return [] }
}

function toggleWatchlistItem(movie) {
  const list = getWatchlist()
  const exists = list.some(m => m.tmdb_id === movie.tmdb_id)
  const updated = exists ? list.filter(m => m.tmdb_id !== movie.tmdb_id) : [movie, ...list]
  localStorage.setItem('cinemind_watchlist', JSON.stringify(updated))
  return !exists
}

// ── API ───────────────────────────────────────────────────────────────────────
async function get(path, params = {}) {
  const url = new URL(`${API}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const r = await fetch(url, { signal: AbortSignal.timeout(25000) })
  if (!r.ok) throw new Error(`${r.status}`)
  return r.json()
}

function useDebounce(val, ms = 350) {
  const [dv, set] = useState(val)
  useEffect(() => { const t = setTimeout(() => set(val), ms); return () => clearTimeout(t) }, [val, ms])
  return dv
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const Spinner = ({ size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.05)', borderTop: '2px solid var(--red)', animation: 'spin 0.75s linear infinite', flexShrink: 0 }} />
)

const Badge = ({ children }) => (
  <span style={{ padding: '3px 10px', borderRadius: 4, background: 'var(--red-dim)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>{children}</span>
)

const Rating = ({ value }) => {
  if (!value) return null
  const pct = Math.round((value / 10) * 100)
  const col = value >= 7 ? '#22c55e' : value >= 5 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', border: `2px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{value.toFixed(1)}</div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>User Score</div>
        <div style={{ width: 80, height: 3, borderRadius: 3, background: 'var(--bg3)' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: col, transition: 'width 0.8s ease' }} />
        </div>
      </div>
    </div>
  )
}

const Card = ({ movie, onClick, delay = 0, size = 'normal' }) => {
  const [hov, setHov] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const year = (movie.release_date || '').slice(0, 4)
  const small = size === 'small'
  return (
    <div onClick={() => onClick?.(movie.tmdb_id)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ cursor: 'pointer', animation: 'fadeUp 0.45s ease both', animationDelay: `${delay}ms`, userSelect: 'none' }}>
      <div style={{ position: 'relative', borderRadius: small ? 8 : 12, overflow: 'hidden', aspectRatio: '2/3', background: 'var(--bg3)', border: `1px solid ${hov ? 'var(--red)' : 'var(--border)'}`, transition: 'all 0.28s cubic-bezier(.4,0,.2,1)', transform: hov ? 'translateY(-6px)' : 'none', boxShadow: hov ? '0 24px 48px rgba(0,0,0,0.7),0 0 0 1px rgba(230,57,70,0.35)' : '0 4px 20px rgba(0,0,0,0.4)' }}>
        {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        {movie.poster_url
          ? <img src={movie.poster_url} alt={movie.title} onLoad={() => setLoaded(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8, padding: 12 }}><span style={{ fontSize: 42 }}>🎬</span></div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,8,15,0.95) 0%,rgba(8,8,15,0.3) 55%,transparent 100%)', opacity: hov ? 1 : 0, transition: 'opacity 0.28s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: small ? '10px 8px' : '14px 12px', gap: 6 }}>
          {movie.vote_average > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: '#f59e0b', fontSize: 12 }}>★</span><span style={{ color: 'var(--text)', fontSize: 12 }}>{movie.vote_average?.toFixed(1)}</span></div>}
          <div style={{ background: 'var(--red)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 4, textAlign: 'center', letterSpacing: 0.5 }}>VIEW DETAILS →</div>
        </div>
        {movie.vote_average > 0 && !hov && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(6px)', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600, color: movie.vote_average >= 7 ? '#22c55e' : movie.vote_average >= 5 ? '#f59e0b' : '#ef4444', border: '1px solid rgba(255,255,255,0.08)' }}>★ {movie.vote_average?.toFixed(1)}</div>
        )}
      </div>
      <div style={{ marginTop: 8, padding: '0 2px' }}>
        <p style={{ fontSize: small ? 12 : 13, fontWeight: 400, color: hov ? '#fff' : 'var(--text)', lineHeight: 1.3, transition: 'color 0.2s', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{movie.title}</p>
        {year && <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{year}</p>}
      </div>
    </div>
  )
}

const Grid = ({ movies, onSelect, cols = 6, size = 'normal' }) => {
  if (!movies?.length) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: size === 'small' ? '16px 12px' : '24px 16px' }}>
      {movies.map((m, i) => <Card key={m.tmdb_id ?? i} movie={m} onClick={onSelect} delay={i * 35} size={size} />)}
    </div>
  )
}

const GridSkeleton = ({ cols = 6, count = 12 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: '24px 16px' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 13, marginTop: 8, borderRadius: 4, width: '80%' }} />
      </div>
    ))}
  </div>
)

const Section = ({ icon, title, sub, count, children }) => (
  <section style={{ marginBottom: 48 }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, animation: 'fadeUp 0.4s ease both' }}>
      <div style={{ width: 4, height: 28, background: 'var(--red)', borderRadius: 2, marginRight: 14, flexShrink: 0 }} />
      <span style={{ fontSize: 20, marginRight: 10 }}>{icon}</span>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--white)', lineHeight: 1 }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</p>}
      </div>
      {count != null && <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 12, border: '1px solid var(--border)' }}>{count}</span>}
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,var(--border2),transparent)', marginLeft: 16 }} />
    </div>
    {children}
  </section>
)

const Empty = ({ text }) => (
  <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text3)' }}>
    <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.3 }}>🎭</div>
    <p style={{ fontSize: 14 }}>{text}</p>
  </div>
)

// ── NAVBAR ────────────────────────────────────────────────────────────────────
const Nav = ({ onHome, page, user, onLogout, onDashboard }) => (
  <nav style={{ position: 'sticky', top: 0, zIndex: 200, height: 58, background: 'rgba(8,8,15,0.88)', backdropFilter: 'blur(24px) saturate(1.4)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 40px', gap: 20 }}>
    <button onClick={onHome} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, color: 'inherit', cursor: 'pointer' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 12px var(--red-glow)' }}>🎬</div>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: 'var(--white)', letterSpacing: 3, lineHeight: 1 }}>CINE<span style={{ color: 'var(--red)' }}>MIND</span></span>
    </button>
    <div style={{ marginLeft: 20, fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>›</span>
      <span style={{ color: page === 'home' ? 'var(--text2)' : page === 'dashboard' ? 'var(--red)' : 'var(--red)' }}>
        {page === 'home' ? 'Browse' : page === 'dashboard' ? 'Dashboard' : 'Movie Details'}
      </span>
    </div>
    <div style={{ flex: 1 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg2)' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
      <span style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: 0.5 }}>TF-IDF Model Active</span>
    </div>
    {user && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onDashboard} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 20, background: page === 'dashboard' ? 'var(--red-dim)' : 'var(--bg2)', border: `1px solid ${page === 'dashboard' ? 'var(--red)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff' }}>{user.name?.[0]?.toUpperCase()}</div>
          <span style={{ fontSize: 13, color: page === 'dashboard' ? 'var(--red)' : 'var(--text2)' }}>{user.name}</span>
        </button>
        <button onClick={onLogout} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text3)', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}
        >Logout</button>
      </div>
    )}
    {page === 'details' && (
      <button onClick={onHome} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '7px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}
      >← Back</button>
    )}
  </nav>
)

// ── SEARCH BOX ────────────────────────────────────────────────────────────────
const SearchBox = ({ onSelectId }) => {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const dq = useDebounce(q, 300)
  const ref = useRef()

  useEffect(() => {
    if (dq.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    get('/tmdb/search', { query: dq })
      .then(d => { const items = (d?.results || []).slice(0, 8); setResults(items); setOpen(items.length > 0) })
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [dq])

  useEffect(() => {
    const fn = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const pick = id => { setQ(''); setOpen(false); onSelectId(id) }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden' }}>
        <span style={{ padding: '0 16px', color: 'var(--text3)', fontSize: 18, flexShrink: 0 }}>🔍</span>
        <input value={q} onChange={e => setQ(e.target.value)} onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for any movie — Inception, Interstellar, Avatar…"
          style={{ flex: 1, padding: '15px 0', background: 'none', border: 'none', color: 'var(--text)', fontSize: 15, outline: 'none', fontWeight: 300 }} />
        {loading && <div style={{ padding: '0 16px' }}><Spinner size={18} /></div>}
        {q && !loading && <button onClick={() => { setQ(''); setOpen(false) }} style={{ padding: '0 16px', background: 'none', border: 'none', color: 'var(--text3)', fontSize: 20, cursor: 'pointer' }}>×</button>}
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden', zIndex: 300, boxShadow: '0 24px 60px rgba(0,0,0,0.7)', animation: 'slideDown 0.2s ease both' }}>
          {results.map((m, i) => {
            const year = (m.release_date || '').slice(0, 4)
            const poster = m.poster_path ? `${IMG_W}${m.poster_path}` : null
            return (
              <div key={m.id} onClick={() => pick(m.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {poster ? <img src={poster} alt="" style={{ width: 32, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} /> : <div style={{ width: 32, height: 48, borderRadius: 4, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎬</div>}
                <div>
                  <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>{m.title}</p>
                  {year && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{year}</p>}
                </div>
                {m.vote_average > 0 && <div style={{ marginLeft: 'auto', fontSize: 12, color: '#f59e0b' }}>★ {m.vote_average.toFixed(1)}</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── HERO CAROUSEL ─────────────────────────────────────────────────────────────
const HeroCarousel = ({ movies, onSelect }) => {
  const [idx, setIdx] = useState(0)
  const total = Math.min(movies.length, 5)
  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  useEffect(() => {
    if (movies.length < 2) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [movies.length])

  useEffect(() => {
    const fn = e => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [total])

  if (!movies.length) return <div style={{ height: 480, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={40} /></div>

  const m = movies[Math.min(idx, movies.length - 1)]
  const year = (m.release_date || '').slice(0, 4)

  const arrowBtn = (onClick, dir) => (
    <button onClick={onClick} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [dir]: 16, zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(8,8,15,0.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--border2)', color: '#fff', fontSize: 20, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(8,8,15,0.7)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
    >{dir === 'left' ? '‹' : '›'}</button>
  )

  return (
    <div style={{ position: 'relative', height: 480, overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
      {arrowBtn(prev, 'left')}
      {arrowBtn(next, 'right')}
      <img key={m.tmdb_id} src={m.backdrop_url || m.poster_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, filter: 'blur(1px) saturate(0.5)', animation: 'fadeIn 0.8s ease both' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(8,8,15,0.98) 0%,rgba(8,8,15,0.6) 50%,transparent 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,var(--bg) 0%,transparent 40%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 40px', gap: 40 }}>
        <img key={`p-${m.tmdb_id}`} src={m.poster_url} alt={m.title} onClick={() => onSelect(m.tmdb_id)}
          style={{ height: 300, width: 200, objectFit: 'cover', borderRadius: 12, flexShrink: 0, border: '1px solid rgba(230,57,70,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', cursor: 'pointer', animation: 'scaleIn 0.5s ease both' }} />
        <div key={`i-${m.tmdb_id}`} style={{ animation: 'fadeUp 0.5s ease both', maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Badge>#{idx + 1} Trending</Badge>
            {year && <span style={{ fontSize: 13, color: 'var(--text3)' }}>{year}</span>}
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(38px,5vw,62px)', color: 'var(--white)', letterSpacing: 3, lineHeight: 1, marginBottom: 16 }}>{m.title}</h1>
          {m.vote_average > 0 && <Rating value={m.vote_average} />}
          <button onClick={() => onSelect(m.tmdb_id)} style={{ marginTop: 24, background: 'var(--red)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 8px 24px var(--red-glow)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(230,57,70,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px var(--red-glow)' }}
          >▶ GET RECOMMENDATIONS</button>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {movies.slice(0, 5).map((_, i) => <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? 'var(--red)' : 'rgba(255,255,255,0.2)', border: 'none', padding: 0, transition: 'all 0.3s', cursor: 'pointer' }} />)}
      </div>
    </div>
  )
}

// ── MOOD SECTION ──────────────────────────────────────────────────────────────
const MoodSection = ({ onSelect }) => {
  const [activeMood, setActiveMood] = useState(null)
  const [movies, setMovies]         = useState([])
  const [loading, setLoading]       = useState(false)

  const pickMood = async (mood) => {
    if (activeMood?.label === mood.label) { setActiveMood(null); setMovies([]); return }
    setActiveMood(mood); setLoading(true); setMovies([])
    try {
      const genreId = mood.genres[0]
      const d = await get(`/movies/genre/${genreId}`, { limit: 12 })
      setMovies(Array.isArray(d) ? d : [])
    } catch { setMovies([]) }
    finally { setLoading(false) }
  }

  return (
    <Section icon="🎭" title="Browse by Mood" sub="How are you feeling today?">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: activeMood ? 24 : 0 }}>
        {MOODS.map(mood => (
          <button key={mood.label} onClick={() => pickMood(mood)}
            style={{ padding: '10px 20px', borderRadius: 50, border: activeMood?.label === mood.label ? '1px solid var(--red)' : '1px solid var(--border)', background: activeMood?.label === mood.label ? 'var(--red-dim)' : 'var(--bg2)', color: activeMood?.label === mood.label ? 'var(--red)' : 'var(--text2)', fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{mood.icon}</span><span>{mood.label}</span>
          </button>
        ))}
      </div>
      {activeMood && (
        <div style={{ animation: 'fadeUp 0.3s ease both' }}>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
            {activeMood.icon} Showing <span style={{ color: 'var(--red)' }}>{activeMood.label}</span> movies for your mood
          </p>
          {loading ? <GridSkeleton count={12} /> : <Grid movies={movies} onSelect={onSelect} />}
        </div>
      )}
    </Section>
  )
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
const HomePage = ({ onSelect, user }) => {
  const [cat, setCat]     = useState('trending')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [hero, setHero]   = useState([])
  const [heroLoad, setHeroLoad] = useState(true)
  const [searchMovies, setSearchMovies] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const [searchLoad, setSearchLoad] = useState(false)
  const [favData, setFavData] = useState({}) // genreName → movies[]

  const favGenres = user?.favorite_genres || []

  useEffect(() => {
    get('/home', { category: 'trending', limit: 5 }).then(d => setHero(d || [])).catch(() => {}).finally(() => setHeroLoad(false))
  }, [])

  useEffect(() => {
    setLoading(true); setMovies([])
    get('/home', { category: cat, limit: 24 }).then(d => setMovies(Array.isArray(d) ? d : [])).catch(() => setMovies([])).finally(() => setLoading(false))
  }, [cat])

  // Load favorite genre movies — 6 per genre
  useEffect(() => {
    if (!favGenres.length) return
    favGenres.forEach(genre => {
      const id = GENRE_NAME_TO_ID[genre]
      if (!id) return
      get(`/movies/genre/${id}`, { limit: 6 })
        .then(d => setFavData(prev => ({ ...prev, [genre]: Array.isArray(d) ? d : [] })))
        .catch(() => {})
    })
  }, [user?.favorite_genres?.join(',')])

  const doSearch = useCallback(q => {
    if (!q || q.length < 2) { setSearchMovies(null); setSearchQ(''); return }
    setSearchQ(q); setSearchLoad(true); setSearchMovies([])
    get('/tmdb/search', { query: q })
      .then(d => setSearchMovies((d?.results || []).map(m => ({ tmdb_id: m.id, title: m.title, poster_url: m.poster_path ? `${IMG_W}${m.poster_path}` : null, release_date: m.release_date, vote_average: m.vote_average }))))
      .catch(() => setSearchMovies([])).finally(() => setSearchLoad(false))
  }, [])

  return (
    <div>
      {heroLoad ? <div style={{ height: 480, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={40} /></div>
        : <HeroCarousel movies={hero} onSelect={onSelect} />}

      <div style={{ padding: '40px 40px' }}>
        {/* Welcome banner */}
        {favGenres.length > 0 && !searchMovies && (
          <div style={{ marginBottom: 32, padding: '14px 20px', background: 'linear-gradient(135deg,rgba(230,57,70,0.08),rgba(230,57,70,0.03))', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp 0.4s ease both' }}>
            <span style={{ fontSize: 22 }}>👋</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--white)' }}>Welcome back, <span style={{ color: 'var(--red)' }}>{user?.name}</span>!</p>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                Here are movies from your favourite genres: {favGenres.map((g, i) => <span key={g}><span style={{ color: 'var(--red)' }}>{g}</span>{i < favGenres.length - 1 ? ', ' : ''}</span>)}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: 40, animation: 'fadeUp 0.4s ease both', position: 'relative', zIndex: 50 }}>
          <p style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Search Any Movie</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <SearchBox onSelectId={id => { setSearchMovies(null); setSearchQ(''); onSelect(id) }} />
            <button onClick={() => { const inp = document.querySelector('input[placeholder*="Inception"]'); if (inp?.value) doSearch(inp.value) }}
              style={{ padding: '15px 24px', background: 'var(--red)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, flexShrink: 0, cursor: 'pointer' }}>Search</button>
          </div>
        </div>

        {searchMovies !== null ? (
          <Section icon="🔍" title={`Results for "${searchQ}"`} count={searchMovies.length}>
            {searchLoad ? <GridSkeleton /> : searchMovies.length > 0 ? <Grid movies={searchMovies} onSelect={onSelect} /> : <Empty text="No movies found." />}
          </Section>
        ) : (
          <>
            {/* ── Personalized genre rows ── */}
            {favGenres.map(genre => (
              <Section key={genre} icon="🎯" title={`${genre} — Your Picks`} sub={`Top ${genre} movies based on your preference`}>
                {favData[genre] ? <Grid movies={favData[genre]} onSelect={onSelect} cols={6} /> : <GridSkeleton count={6} cols={6} />}
              </Section>
            ))}

            {/* ── Category pills ── */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setCat(c.key)}
                  style={{ padding: '9px 20px', borderRadius: 8, border: cat === c.key ? '1px solid var(--red)' : '1px solid var(--border)', background: cat === c.key ? 'var(--red-dim)' : 'var(--bg2)', color: cat === c.key ? 'var(--red)' : 'var(--text2)', fontSize: 13, fontWeight: cat === c.key ? 500 : 300, transition: 'all 0.2s', cursor: 'pointer' }}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <Section icon={CATEGORIES.find(c => c.key === cat)?.icon} title={CATEGORIES.find(c => c.key === cat)?.label} sub="Click any movie to get TF-IDF powered recommendations">
              {loading ? <GridSkeleton /> : <Grid movies={movies} onSelect={onSelect} />}
            </Section>

            {/* ── Mood section ── */}
            <MoodSection onSelect={onSelect} />

            {/* ── Browse by genre ── */}
            <GenreSection onSelectMovie={onSelect} CardComponent={Card} GridComponent={Grid} />
          </>
        )}
      </div>
    </div>
  )
}

// ── DETAILS PAGE ──────────────────────────────────────────────────────────────
const DetailsPage = ({ tmdbId, onSelect }) => {
  const [details, setDetails]     = useState(null)
  const [bundle, setBundle]       = useState(null)
  const [detailLoad, setDetailLoad] = useState(true)
  const [recLoad, setRecLoad]     = useState(true)
  const [tab, setTab]             = useState('tfidf')
  const [inWatchlist, setInWatchlist] = useState(false)
  const [wToast, setWToast]       = useState('')

  // Effect 1: fetch movie details
  useEffect(() => {
    if (!tmdbId) return
    setDetails(null); setBundle(null); setDetailLoad(true); setRecLoad(true)
    get(`/movie/id/${tmdbId}`)
      .then(d => {
        setDetails(d)
        setDetailLoad(false)
        setInWatchlist(getWatchlist().some(m => m.tmdb_id === tmdbId))
        addToRecent({ tmdb_id: d.tmdb_id, title: d.title, poster_url: d.poster_url, release_date: d.release_date, vote_average: d.vote_average })
      })
      .catch(() => {
        setDetailLoad(false)
        setRecLoad(false)
        setBundle({ tfidf_recommendations: [], genre_recommendations: [] })
      })
  }, [tmdbId])

  // Effect 2: fetch recommendations when details are ready
  useEffect(() => {
    if (!details?.title) return
    setRecLoad(true)
    get('/movie/search', { query: details.title, tfidf_top_n: 12, genre_limit: 12 })
      .then(b => {
        setBundle(b)
        setRecLoad(false)
      })
      .catch(() => {
        setBundle({ tfidf_recommendations: [], genre_recommendations: [] })
        setRecLoad(false)
      })
  }, [details?.tmdb_id])

  const handleWatchlist = () => {
    if (!details) return
    const added = toggleWatchlistItem({ tmdb_id: details.tmdb_id, title: details.title, poster_url: details.poster_url, release_date: details.release_date, vote_average: details.vote_average })
    setInWatchlist(added)
    setWToast(added ? '⭐ Added to Watchlist!' : '🗑️ Removed from Watchlist')
    setTimeout(() => setWToast(''), 2500)
  }

  if (detailLoad) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}><Spinner size={44} /><p style={{ color: 'var(--text3)', fontSize: 14 }}>Loading movie details…</p></div>
  if (!details) return <div style={{ textAlign: 'center', padding: '80px 40px' }}><p style={{ color: 'var(--text2)' }}>Could not load movie details.</p></div>

  const year = (details.release_date || '').slice(0, 4)
  const tfidfCards = (bundle?.tfidf_recommendations || []).filter(x => x.tmdb?.tmdb_id).map(x => ({ tmdb_id: x.tmdb.tmdb_id, title: x.tmdb.title || x.title, poster_url: x.tmdb.poster_url, release_date: x.tmdb.release_date, vote_average: x.tmdb.vote_average, score: x.score }))
  const genreCards = bundle?.genre_recommendations || []

  return (
    <div className="anim-fade-in">
      {/* Watchlist toast */}
      {wToast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'rgba(34,197,94,0.95)', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'slideDown 0.3s ease both' }}>{wToast}</div>
      )}

      {/* Backdrop hero */}
      <div style={{ position: 'relative', minHeight: 520, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        {details.backdrop_url && <img src={details.backdrop_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, filter: 'blur(3px) saturate(0.4)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(8,8,15,1) 0%,rgba(8,8,15,0.75) 55%,transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,var(--bg) 0%,transparent 50%)' }} />
        <div style={{ position: 'relative', width: '100%', display: 'flex', gap: 48, alignItems: 'flex-end', padding: '48px 40px 0' }}>
          <div style={{ flexShrink: 0, width: 230, transform: 'translateY(48px)', animation: 'scaleIn 0.5s ease 0.1s both', zIndex: 2 }}>
            <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.9),0 0 0 1px rgba(230,57,70,0.25)' }}>
              {details.poster_url ? <img src={details.poster_url} alt={details.title} style={{ width: '100%', display: 'block' }} /> : <div style={{ aspectRatio: '2/3', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🎬</div>}
            </div>
          </div>
          <div style={{ paddingBottom: 12, flex: 1, animation: 'fadeUp 0.5s ease 0.15s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              {year && <Badge>{year}</Badge>}
              {(details.genres || []).slice(0, 3).map(g => <span key={g.id} style={{ padding: '3px 10px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)', fontSize: 11 }}>{g.name}</span>)}
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px,5vw,58px)', color: 'var(--white)', letterSpacing: 3, lineHeight: 1.05, marginBottom: 20 }}>{details.title}</h1>
            {details.vote_average > 0 && <Rating value={details.vote_average} />}
            <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {details.runtime > 0 && <span style={{ fontSize: 12, color: 'var(--text3)' }}>⏱ {Math.floor(details.runtime/60)}h {details.runtime%60}m</span>}
              {details.vote_count > 0 && <span style={{ fontSize: 12, color: 'var(--text3)' }}>🗳 {details.vote_count?.toLocaleString()} votes</span>}
              {/* Watchlist button */}
              <button onClick={handleWatchlist}
                style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${inWatchlist ? '#22c55e' : 'var(--border)'}`, background: inWatchlist ? 'rgba(34,197,94,0.1)' : 'var(--bg2)', color: inWatchlist ? '#22c55e' : 'var(--text2)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{inWatchlist ? '⭐' : '☆'}</span>
                <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div style={{ padding: '72px 40px 40px', paddingLeft: 'calc(40px + 230px + 48px)', animation: 'fadeUp 0.5s ease 0.25s both', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 13, color: 'var(--red)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Overview</h3>
        <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: 15, maxWidth: 680, fontWeight: 300, marginBottom: 36 }}>{details.overview || 'No overview available.'}</p>
      </div>

      {/* Pros/Cons — isolated so it never breaks recommendations below */}
      <div style={{ padding: '32px 40px', paddingLeft: 'calc(40px + 230px + 48px)', borderBottom: '1px solid var(--border)' }}>
        <SafeProsCons movie={details} />
      </div>

      {/* Recommendations */}
      <div style={{ padding: '48px 40px' }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', width: 'fit-content', animation: 'fadeUp 0.4s ease both' }}>
          {[{ key: 'tfidf', icon: '🤖', label: 'TF-IDF Recommendations', sub: 'ML Model' }, { key: 'genre', icon: '🎭', label: 'Genre Based', sub: 'TMDB Discover' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '12px 24px', background: tab === t.key ? 'var(--red)' : 'transparent', border: 'none', color: tab === t.key ? '#fff' : 'var(--text2)', fontSize: 13, fontWeight: tab === t.key ? 600 : 300, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span>{t.icon}</span><span>{t.label}</span>
              <span style={{ fontSize: 10, padding: '1px 6px', background: tab === t.key ? 'rgba(255,255,255,0.2)' : 'var(--bg3)', borderRadius: 10, color: tab === t.key ? '#fff' : 'var(--text3)' }}>{t.sub}</span>
            </button>
          ))}
        </div>

        {recLoad ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '32px 0' }}>
            <Spinner size={28} />
            <p style={{ color: 'var(--text3)', fontSize: 14 }}>Computing TF-IDF recommendations…</p>
          </div>
        ) : (
          <div key={tab} className="anim-fade-in">
            {tab === 'tfidf' && (
              <Section icon="🔎" title="Similar Movies" sub="Content-based filtering using TF-IDF" count={tfidfCards.length}>
                {tfidfCards.length > 0 ? (
                  <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                      {tfidfCards.slice(0, 5).map((m, i) => (
                        <div key={m.tmdb_id} onClick={() => onSelect(m.tmdb_id)}
                          style={{ flexShrink: 0, width: 140, cursor: 'pointer', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', transition: 'border-color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <p style={{ fontSize: 12, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.title}</p>
                          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 5 }}>Similarity: {(m.score * 100).toFixed(1)}%</div>
                          <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 3 }}>
                            <div style={{ height: '100%', borderRadius: 3, background: 'var(--red)', width: `${m.score * 100}%`, transition: 'width 0.8s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Grid movies={tfidfCards} onSelect={onSelect} />
                  </>
                ) : <Empty text="No TF-IDF recommendations found for this movie." />}
              </Section>
            )}
            {tab === 'genre' && (
              <Section icon="🎭" title="More Like This" sub={`Popular ${(details.genres || [])[0]?.name || ''} movies`} count={genreCards.length}>
                {genreCards.length > 0 ? <Grid movies={genreCards} onSelect={onSelect} /> : <Empty text="No genre recommendations found." />}
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [authPage, setAuthPage] = useState('login')
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cinemind_user')) } catch { return null }
  })
  const [page, setPage]     = useState('home')
  const [movieId, setMovieId] = useState(null)

  const goDetails = useCallback(id => {
    setMovieId(Number(id)); setPage('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goHome = useCallback(() => {
    setPage('home'); setMovieId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goDashboard = useCallback(() => {
    setPage('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const onLogout = () => {
    localStorage.removeItem('cinemind_user')
    setUser(null); setPage('home'); setMovieId(null)
  }

  const onUpdateUser = (updated) => {
    setUser(updated)
    localStorage.setItem('cinemind_user', JSON.stringify(updated))
  }

  if (!user) {
    if (authPage === 'register') return <Register onRegister={setUser} onGoLogin={() => setAuthPage('login')} />
    return <Login onLogin={setUser} onGoRegister={() => setAuthPage('register')} />
  }

  return (
    <>
      <Nav onHome={goHome} page={page} user={user} onLogout={onLogout} onDashboard={goDashboard} />
      <main key={`${page}-${movieId}`} className="anim-fade-in">
        {page === 'home'      && <HomePage onSelect={goDetails} user={user} />}
        {page === 'details'   && <DetailsPage tmdbId={movieId} onSelect={goDetails} />}
        {page === 'dashboard' && <Dashboard user={user} onSelectMovie={id => { goDetails(id) }} onUpdateUser={onUpdateUser} onBack={goHome} />}
      </main>
    </>
  )
}
