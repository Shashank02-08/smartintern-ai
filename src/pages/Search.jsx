import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInternships()
  }, [])

  async function fetchInternships() {
    try {
      setLoading(true)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 60000)
      const res = await fetch(
        `https://smartintern-backend-j6gf.onrender.com/api/internships?q=${query}&location=${location}`,
        { signal: controller.signal }
      )
      clearTimeout(timeout)
      const data = await res.json()
      setInternships(data)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Render waking up, retrying...')
        fetchInternships()
      } else {
        console.error('Failed to fetch internships:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  const filtered = internships.filter(i => {
    const matchQuery = i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.company.toLowerCase().includes(query.toLowerCase()) ||
      i.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
    const matchLocation = location === '' || i.location.toLowerCase().includes(location.toLowerCase())
    return matchQuery && matchLocation
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 60px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)'
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ fontFamily: 'Space Mono', fontSize: '20px', color: 'var(--accent)', cursor: 'pointer' }}
        >
          SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text)', fontSize: '14px'
          }}>
            Dashboard
          </button>
          <button onClick={() => navigate('/profile')} style={{
            padding: '8px 20px', background: 'var(--accent)',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '14px'
          }}>
            Profile
          </button>
        </div>
      </nav>

      {/* Search Header */}
      <div style={{
        padding: '48px 60px 32px',
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)',
        borderBottom: '1px solid var(--border)'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>
          Find <span style={{ color: 'var(--accent)' }}>Internships</span>
        </h1>

        <div style={{ display: 'flex', gap: '16px', maxWidth: '700px' }}>
          <input
            type="text"
            placeholder="Search by role, company or skill…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, padding: '12px 16px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
              outline: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Location…"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{
              width: '160px', padding: '12px 16px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '32px 60px' }}>

        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '24px' }}>
          Showing {filtered.length} internship{filtered.length !== 1 ? 's' : ''}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Loading internships...</p>
              <p style={{ fontSize: '13px', opacity: 0.6 }}>First load may take up to 60 seconds ☕</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px',
              color: 'var(--text2)', fontSize: '16px'
            }}>
              No internships found. Try a different search!
            </div>
          ) : (
            filtered.map((internship, index) => (
              <div key={internship._id || index} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>
                    {internship.title}
                  </h3>
                  <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '12px' }}>
                    {internship.company} • {internship.location} • {internship.duration}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {internship.skills.map((skill, i) => (
                      <span key={i} style={{
                        padding: '4px 10px', background: 'var(--bg3)',
                        border: '1px solid var(--border)', borderRadius: '20px',
                        fontSize: '12px', color: 'var(--accent2)'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '140px' }}>
                  <p style={{ color: 'var(--success)', fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>
                    {internship.stipend}
                  </p>
                  <a href={internship.apply_link} target="_blank" rel="noopener noreferrer">
                    <button style={{
                      padding: '8px 20px', background: 'var(--accent)',
                      border: 'none', borderRadius: '8px',
                      color: '#fff', fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Apply Now
                    </button>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Search