import { useState, useEffect } from 'react'

const GEMINI_KEY  = import.meta.env.VITE_GEMINI_API_KEY
const MISTRAL_KEY = import.meta.env.VITE_MISTRAL_API_KEY

// ── Gemini call ──────────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024, responseMimeType: 'application/json' },
      }),
    }
  )
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!raw) throw new Error('Empty response from Gemini')
  return raw
}

// ── Mistral call ─────────────────────────────────────────────────────────────
async function callMistral(prompt) {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message || 'Mistral error')
  const raw = json?.choices?.[0]?.message?.content || ''
  if (!raw) throw new Error('Empty response from Mistral')
  return raw
}

// ── Parse JSON from raw text ──────────────────────────────────────────────────
function parseJSON(raw) {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Cannot parse JSON')
    return JSON.parse(match[0])
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProsCons({ movie }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [source, setSource]   = useState('') // 'gemini' or 'mistral'

  useEffect(() => {
    if (!movie?.title) return
    setData(null); setError(''); setSource('')
    fetchProsCons()
  }, [movie?.tmdb_id])

  const fetchProsCons = async () => {
    setLoading(true)
    try {
      const genres   = (movie.genres || []).map(g => g.name).join(', ') || 'Unknown'
      const rating   = movie.vote_average ? `${movie.vote_average}/10` : 'N/A'
      const overview = movie.overview || 'No overview available'
      const year     = (movie.release_date || '').slice(0, 4) || 'Unknown'

      const prompt = `You are a movie critic. For the movie "${movie.title}" (${year}), genre: ${genres}, rating: ${rating}.
Overview: "${overview}"

Give exactly 3 pros (reasons to watch) and 3 cons (reasons not to watch). Be specific to THIS movie.
Respond with ONLY a valid JSON object, no markdown, no explanation:
{"pros":["reason 1","reason 2","reason 3"],"cons":["reason 1","reason 2","reason 3"]}`

      let raw = null

      // ── Try Gemini first ──
      if (GEMINI_KEY) {
        try {
          raw = await callGemini(prompt)
          setSource('gemini')
        } catch (e) {
          console.warn('Gemini failed, switching to Mistral:', e.message)
          raw = null
        }
      }

      // ── Fallback to Mistral ──
      if (!raw && MISTRAL_KEY) {
        try {
          raw = await callMistral(prompt)
          setSource('mistral')
        } catch (e) {
          console.warn('Mistral also failed:', e.message)
          raw = null
        }
      }

      if (!raw) {
        setError('AI analysis unavailable right now. Both Gemini and Mistral are busy. Try again in a minute.')
        return
      }

      const parsed = parseJSON(raw)
      if (!parsed.pros || !parsed.cons) {
        setError('Could not parse AI response. Please try again.')
        return
      }
      setData(parsed)

    } catch (e) {
      setError(`Unexpected error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.05)', borderTop: '2px solid var(--red)', animation: 'spin 0.75s linear infinite', flexShrink: 0 }} />
      <div>
        <p style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>Analysing movie with AI…</p>
        <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 4 }}>Trying Gemini → Mistral fallback</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ background: 'rgba(230,57,70,0.05)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 14, padding: '20px 24px' }}>
      <p style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</p>
      <button onClick={fetchProsCons} style={{ marginTop: 10, padding: '6px 16px', background: 'var(--red)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer' }}>
        Retry
      </button>
    </div>
  )

  if (!data) return null

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 24, background: 'var(--red)', borderRadius: 2 }} />
        <span style={{ fontSize: 18 }}>🤖</span>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--white)' }}>AI Movie Analysis</h3>
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 10,
          background: source === 'mistral' ? 'rgba(255,165,0,0.1)' : 'rgba(34,197,94,0.1)',
          border: `1px solid ${source === 'mistral' ? 'rgba(255,165,0,0.3)' : 'rgba(34,197,94,0.3)'}`,
          color: source === 'mistral' ? 'orange' : '#22c55e',
          letterSpacing: 1, textTransform: 'uppercase',
        }}>
          {source === 'mistral' ? 'MISTRAL' : 'GEMINI'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pros */}
        <div style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#22c55e' }}>Why Watch It</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(data.pros || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#22c55e', fontWeight: 700, marginTop: 1 }}>{i + 1}</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div style={{ background: 'rgba(230,57,70,0.04)', border: '1px solid rgba(230,57,70,0.15)', borderRadius: 12, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#ff6b6b' }}>Think Before Watching</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(data.cons || []).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#ff6b6b', fontWeight: 700, marginTop: 1 }}>{i + 1}</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
