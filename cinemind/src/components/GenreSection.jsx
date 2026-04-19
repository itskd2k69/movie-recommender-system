import { useState, useEffect } from 'react'

// const API = 'http://127.0.0.1:8000'       // local development
const API = 'https://movie-recommender-system-dcma.onrender.com' // production (Vercel deploy)

// TMDB genre list (static - these never change)
const GENRES = [
  { id: 28,    name: 'Action',          icon: '💥' },
  { id: 12,    name: 'Adventure',       icon: '🗺️' },
  { id: 16,    name: 'Animation',       icon: '🎨' },
  { id: 35,    name: 'Comedy',          icon: '😂' },
  { id: 80,    name: 'Crime',           icon: '🔫' },
  { id: 99,    name: 'Documentary',     icon: '📽️' },
  { id: 18,    name: 'Drama',           icon: '🎭' },
  { id: 10751, name: 'Family',          icon: '👨‍👩‍👧' },
  { id: 14,    name: 'Fantasy',         icon: '🧙' },
  { id: 36,    name: 'History',         icon: '📜' },
  { id: 27,    name: 'Horror',          icon: '👻' },
  { id: 10402, name: 'Music',           icon: '🎵' },
  { id: 9648,  name: 'Mystery',         icon: '🔍' },
  { id: 10749, name: 'Romance',         icon: '❤️' },
  { id: 878,   name: 'Sci-Fi',          icon: '🚀' },
  { id: 53,    name: 'Thriller',        icon: '😱' },
  { id: 10752, name: 'War',             icon: '⚔️' },
  { id: 37,    name: 'Western',         icon: '🤠' },
]

// Reuse the Card + Grid from parent — pass as props
export default function GenreSection({ onSelectMovie, CardComponent, GridComponent }) {
  const [activeGenre, setActiveGenre] = useState(null)
  const [movies, setMovies]           = useState([])
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    if (!activeGenre) return
    setLoading(true); setMovies([])
    fetch(`${API}/movies/genre/${activeGenre.id}?limit=18`)
      .then(r => r.json())
      .then(d => setMovies(Array.isArray(d) ? d : []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [activeGenre])

  return (
    <section style={{ marginBottom: 56 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        marginBottom: 24, animation: 'fadeUp 0.4s ease both',
      }}>
        <div style={{ width: 4, height: 28, background: 'var(--red)', borderRadius: 2, marginRight: 14 }} />
        <span style={{ fontSize: 20, marginRight: 10 }}>🎭</span>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--white)' }}>Browse by Genre</h2>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Pick a genre to explore movies</p>
        </div>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--border2), transparent)', marginLeft: 16 }} />
      </div>

      {/* Genre pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        {GENRES.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGenre(activeGenre?.id === g.id ? null : g)}
            style={{
              padding: '8px 16px', borderRadius: 8,
              border: activeGenre?.id === g.id ? '1px solid var(--red)' : '1px solid var(--border)',
              background: activeGenre?.id === g.id ? 'var(--red-dim)' : 'var(--bg2)',
              color: activeGenre?.id === g.id ? 'var(--red)' : 'var(--text2)',
              fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => { if (activeGenre?.id !== g.id) { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text)' }}}
            onMouseLeave={e => { if (activeGenre?.id !== g.id) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}}
          >
            <span>{g.icon}</span>
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* Movies grid */}
      {activeGenre && (
        <div style={{ animation: 'fadeUp 0.35s ease both' }}>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 18 }}>
            Showing popular <span style={{ color: 'var(--red)' }}>{activeGenre.name}</span> movies
          </p>
          {loading ? (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: '24px 16px',
            }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 12 }} />
                  <div className="skeleton" style={{ height: 13, marginTop: 8, borderRadius: 4, width: '80%' }} />
                </div>
              ))}
            </div>
          ) : movies.length > 0 ? (
            <GridComponent movies={movies} onSelect={onSelectMovie} cols={6} />
          ) : (
            <p style={{ color: 'var(--text3)', fontSize: 14 }}>No movies found for this genre.</p>
          )}
        </div>
      )}
    </section>
  )
}
