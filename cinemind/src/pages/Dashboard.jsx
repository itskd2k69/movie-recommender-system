import { useState, useEffect } from 'react'

// const API = 'http://127.0.0.1:8000'       // local development
const API = 'https://movie-rec-466x.onrender.com' // production (Vercel deploy)

const GENRE_ICONS = {
  'Action':'💥','Adventure':'🗺️','Animation':'🎨','Comedy':'😂',
  'Crime':'🔫','Documentary':'📽️','Drama':'🎭','Fantasy':'🧙',
  'Horror':'👻','Mystery':'🔍','Romance':'❤️','Science Fiction':'🚀',
  'Thriller':'😱','Western':'🤠',
}

const ALL_GENRES = [
  'Action','Adventure','Animation','Comedy','Crime','Documentary',
  'Drama','Fantasy','Horror','Mystery','Romance','Science Fiction',
  'Thriller','Western',
]

const GENRE_NAME_TO_ID = {
  'Action':28,'Adventure':12,'Animation':16,'Comedy':35,'Crime':80,
  'Documentary':99,'Drama':18,'Fantasy':14,'Horror':27,'Mystery':9648,
  'Romance':10749,'Science Fiction':878,'Thriller':53,'Western':37,
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem('cinemind_recent') || '[]') } catch { return [] }
}

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('cinemind_watchlist') || '[]') } catch { return [] }
}

function removeFromWatchlist(tmdbId) {
  const list = getWatchlist().filter(m => m.tmdb_id !== tmdbId)
  localStorage.setItem('cinemind_watchlist', JSON.stringify(list))
}

// ── Mini Movie Card ───────────────────────────────────────────────────────────
const MiniCard = ({ movie, onClick, onRemove }) => {
  const [hov, setHov] = useState(false)
  const year = (movie.release_date || '').slice(0, 4)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', cursor: 'pointer', flexShrink: 0, width: 110 }}
    >
      <div
        onClick={() => onClick?.(movie.tmdb_id)}
        style={{
          borderRadius: 8, overflow: 'hidden', aspectRatio: '2/3',
          background: 'var(--bg3)',
          border: `1px solid ${hov ? 'var(--red)' : 'var(--border)'}`,
          transition: 'all 0.2s',
          transform: hov ? 'translateY(-4px)' : 'none',
          boxShadow: hov ? '0 12px 32px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        {movie.poster_url
          ? <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎬</div>
        }
      </div>
      {/* Remove button */}
      {onRemove && hov && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(movie.tmdb_id) }}
          style={{
            position: 'absolute', top: 4, right: 4,
            width: 22, height: 22, borderRadius: '50%',
            background: 'rgba(230,57,70,0.9)', border: 'none',
            color: '#fff', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
      )}
      <p style={{ fontSize: 11, color: hov ? '#fff' : 'var(--text2)', marginTop: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {movie.title}
      </p>
      {year && <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{year}</p>}
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHead = ({ icon, title, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
    <div style={{ width: 4, height: 24, background: 'var(--red)', borderRadius: 2 }} />
    <span style={{ fontSize: 18 }}>{icon}</span>
    <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--white)' }}>{title}</h2>
    {count != null && (
      <span style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 12, border: '1px solid var(--border)' }}>{count}</span>
    )}
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--border2), transparent)', marginLeft: 8 }} />
  </div>
)

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard({ user, onSelectMovie, onUpdateUser, onBack }) {
  const [recent, setRecent]       = useState(getRecentlyViewed())
  const [watchlist, setWatchlist] = useState(getWatchlist())
  const [editMode, setEditMode]   = useState(false)
  const [editGenres, setEditGenres] = useState(user?.favorite_genres || [])
  const [saving, setSaving]       = useState(false)

  // Stats
  const totalViewed  = recent.length
  const genreCounts  = {}
  ;(user?.favorite_genres || []).forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1 })
  const topGenre     = (user?.favorite_genres || [])[0] || 'None'

  const toggleEditGenre = (name) => {
    setEditGenres(prev => {
      if (prev.includes(name)) return prev.filter(g => g !== name)
      if (prev.length >= 3) return prev
      return [...prev, name]
    })
  }

  const saveGenres = async () => {
    setSaving(true)
    try {
      // Update in localStorage
      const updated = { ...user, favorite_genres: editGenres }
      localStorage.setItem('cinemind_user', JSON.stringify(updated))
      onUpdateUser(updated)
      setEditMode(false)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveWatchlist = (tmdbId) => {
    removeFromWatchlist(tmdbId)
    setWatchlist(getWatchlist())
  }

  return (
    <div style={{ padding: '40px 40px', maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.4s ease both' }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{ marginBottom: 28, background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}
      >← Back to Home</button>

      {/* Top row: Profile + Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>

        {/* Profile Card */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0, boxShadow: '0 4px 16px var(--red-glow)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--white)' }}>{user?.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{user?.email}</p>
            </div>
          </div>

          {/* Favorite Genres */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase' }}>Favorite Genres</p>
              <button
                onClick={() => { setEditMode(!editMode); setEditGenres(user?.favorite_genres || []) }}
                style={{ fontSize: 12, color: 'var(--red)', background: 'none', border: '1px solid rgba(230,57,70,0.3)', padding: '3px 10px', borderRadius: 6, cursor: 'pointer' }}
              >{editMode ? 'Cancel' : 'Edit'}</button>
            </div>

            {!editMode ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(user?.favorite_genres || []).length > 0
                  ? (user.favorite_genres).map(g => (
                      <span key={g} style={{ padding: '5px 12px', borderRadius: 20, background: 'var(--red-dim)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>{GENRE_ICONS[g] || '🎬'}</span>{g}
                      </span>
                    ))
                  : <p style={{ fontSize: 13, color: 'var(--text3)' }}>No genres selected</p>
                }
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>Select up to 3 genres ({editGenres.length}/3)</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {ALL_GENRES.map(g => {
                    const sel    = editGenres.includes(g)
                    const maxed  = editGenres.length >= 3 && !sel
                    return (
                      <button key={g} onClick={() => !maxed && toggleEditGenre(g)}
                        style={{ padding: '4px 10px', borderRadius: 20, border: sel ? '1px solid var(--red)' : '1px solid var(--border)', background: sel ? 'var(--red-dim)' : 'var(--bg3)', color: sel ? 'var(--red)' : maxed ? 'var(--text3)' : 'var(--text2)', fontSize: 11, cursor: maxed ? 'not-allowed' : 'pointer', opacity: maxed ? 0.4 : 1, transition: 'all 0.15s' }}>
                        {GENRE_ICONS[g]} {g}
                      </button>
                    )
                  })}
                </div>
                <button onClick={saveGenres} disabled={saving}
                  style={{ padding: '8px 20px', background: 'var(--red)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px' }}>
          <p style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Your Stats</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { icon: '🎬', label: 'Movies Viewed',  value: totalViewed },
              { icon: '⭐', label: 'Watchlist',       value: watchlist.length },
              { icon: '🎯', label: 'Genres Selected', value: (user?.favorite_genres || []).length },
              { icon: '🏆', label: 'Top Genre',       value: topGenre },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '16px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', marginTop: 8 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Genre taste bar */}
          {(user?.favorite_genres || []).length > 0 && (
            <div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>Taste Profile</p>
              {(user.favorite_genres).map((g, i) => (
                <div key={g} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{GENRE_ICONS[g]} {g}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>#{i+1}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 4 }}>
                    <div style={{ height: '100%', borderRadius: 4, background: 'var(--red)', width: `${100 - i * 25}%`, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', marginBottom: 24 }}>
        <SectionHead icon="🕐" title="Recently Viewed" count={recent.length} />
        {recent.length > 0 ? (
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
            {recent.map(m => <MiniCard key={m.tmdb_id} movie={m} onClick={onSelectMovie} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text3)' }}>
            <p style={{ fontSize: 40, marginBottom: 8, opacity: 0.3 }}>🕐</p>
            <p style={{ fontSize: 14 }}>No movies viewed yet. Start browsing!</p>
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px' }}>
        <SectionHead icon="⭐" title="My Watchlist" count={watchlist.length} />
        {watchlist.length > 0 ? (
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {watchlist.map(m => (
              <MiniCard key={m.tmdb_id} movie={m} onClick={onSelectMovie} onRemove={handleRemoveWatchlist} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text3)' }}>
            <p style={{ fontSize: 40, marginBottom: 8, opacity: 0.3 }}>⭐</p>
            <p style={{ fontSize: 14 }}>Your watchlist is empty. Click ⭐ on any movie to save it!</p>
          </div>
        )}
      </div>
    </div>
  )
}
