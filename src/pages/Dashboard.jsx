import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND = 'https://smartintern-backend-j6gf.onrender.com'

function matchColor(score) {
  if (score >= 80) return '#22d3a5'
  if (score >= 60) return '#f59e0b'
  return '#f87171'
}

function Dashboard() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
    fetchMatches()
  }, [])

  async function fetchMatches() {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    try {
      setLoading(true)
      const res = await fetch(`${BACKEND}/api/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()

      if (res.status === 400 && data.error === 'No resume uploaded yet') {
        setError('no_resume')
        return
      }

      if (!res.ok) {
        setError('failed')
        return
      }

      setMatches(data)
    } catch (err) {
      setError('failed')
    } finally {
      setLoading(false)
    }
  }

  const skillGaps = matches.length > 0
    ? [...new Set(matches.flatMap(m => m.skill_gaps || []))].slice(0, 6)
    : []

  const bestMatch = matches.length > 0 ? matches[0].match_score : 0

  // ── Logout handler ──
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('storage')) // tells App.jsx to re-check auth
    navigate('/login')
  }

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
          <button onClick={() => navigate('/search')} style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
          }}>
            Search
          </button>
          <button onClick={() => navigate('/profile')} style={{
            padding: '8px 20px', background: 'var(--accent)',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '14px', cursor: 'pointer'
          }}>
            Profile
          </button>
          <button onClick={handleLogout} style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid #f87171', borderRadius: '8px',
            color: '#f87171', fontSize: '14px', cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 60px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
            Welcome back, <span style={{ color: 'var(--accent)' }}>
              {user?.name || 'Student'}!
            </span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '15px' }}>
            Here are your AI matched internships based on your resume
          </p>
        </div>

        {/* No Resume State */}
        {error === 'no_resume' && (
          <div style={{
            background: 'var(--glow)', border: '1px solid var(--accent)',
            borderRadius: '12px', padding: '40px', textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h2 style={{ fontSize: '22px', marginBottom: '12px' }}>
              Upload your resume to get matches!
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '24px' }}>
              Our AI needs your resume to find the best internships for you
            </p>
            <button onClick={() => navigate('/resume')} style={{
              padding: '12px 28px', background: 'var(--accent)',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer'
            }}>
              Upload Resume →
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>Finding your matches...</p>
            <p style={{ fontSize: '13px', opacity: 0.6 }}>First load may take up to 60 seconds ☕</p>
          </div>
        )}

        {/* Stats Row */}
        {!loading && matches.length > 0 && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px', marginBottom: '40px'
            }}>
              {[
                { label: 'Total Matches', value: matches.length, icon: '🎯' },
                { label: 'Best Match', value: `${bestMatch}%`, icon: '⭐' },
                { label: 'Skills Detected', value: matches[0]?.skill_gaps ? matches[0].skill_gaps.length : 0, icon: '🧠' },
                { label: 'Skill Gaps', value: skillGaps.length, icon: '📈' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '20px',
                  display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                  <div>
                    <p style={{ fontSize: '22px', fontWeight: '600', color: 'var(--accent)' }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text2)' }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

              {/* Matched Internships */}
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '20px', fontFamily: 'Space Grotesk' }}>
                  Your Matches
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {matches.map((internship, index) => (
                    <div key={index} style={{
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '20px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'border-color 0.2s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div>
                        <h3 style={{ fontSize: '16px', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>
                          {internship.title}
                        </h3>
                        <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '10px' }}>
                          {internship.company} • {internship.location}
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {(internship.skills || []).slice(0, 4).map((skill, i) => (
                            <span key={i} style={{
                              padding: '3px 8px', background: 'var(--bg3)',
                              border: '1px solid var(--border)', borderRadius: '20px',
                              fontSize: '11px', color: 'var(--accent2)'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', minWidth: '120px' }}>
                        <div style={{
                          fontSize: '24px', fontWeight: '700',
                          color: matchColor(internship.match_score), marginBottom: '4px'
                        }}>
                          {internship.match_score}%
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '10px' }}>
                          match score
                        </p>
                        <a href={internship.apply_link} target="_blank" rel="noopener noreferrer">
                          <button style={{
                            padding: '6px 16px', background: 'var(--accent)',
                            border: 'none', borderRadius: '6px',
                            color: '#fff', fontSize: '12px', fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            Apply
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gap Panel */}
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '20px', fontFamily: 'Space Grotesk' }}>
                  Skill Gaps
                </h2>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '20px', marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>
                    Learn these to improve your match scores
                  </p>
                  {skillGaps.length === 0 ? (
                    <p style={{ fontSize: '14px', color: 'var(--success)' }}>
                      🎉 Great skills! No major gaps found.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {skillGaps.map(skill => (
                        <div key={skill} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '10px 14px', background: 'var(--bg3)',
                          border: '1px solid var(--border)', borderRadius: '8px'
                        }}>
                          <span style={{ fontSize: '14px' }}>{skill}</span>
                          <span style={{ fontSize: '11px', color: 'var(--warning)' }}>Learn →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload Resume CTA */}
                <div style={{
                  background: 'var(--glow)', border: '1px solid var(--accent)',
                  borderRadius: '12px', padding: '20px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text)' }}>
                    Update your resume for better matches
                  </p>
                  <button onClick={() => navigate('/resume')} style={{
                    width: '100%', padding: '10px',
                    background: 'var(--accent)', border: 'none',
                    borderRadius: '8px', color: '#fff',
                    fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Upload Resume →
                  </button>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
