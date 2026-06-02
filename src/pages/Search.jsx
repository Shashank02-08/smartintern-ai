import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedButton, FadeIn, StaggerContainer, StaggerItem, PageTransition } from '../components/AnimatedCard'

const BACKEND = 'https://smartintern-backend-j6gf.onrender.com'

function Search() {
  const navigate = useNavigate()
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => { fetchInternships() }, [])

  async function fetchInternships() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (location) params.append('location', location)
      const res = await fetch(`${BACKEND}/api/internships?${params}`)
      const data = await res.json()
      setInternships(data)
    } catch (err) {
      console.error('Failed to fetch internships:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    fetchInternships()
  }

  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('storage'))
    navigate('/login')
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

        <style>{`
          .search-nav {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 60px; border-bottom: 1px solid var(--border);
            background: var(--bg2);
          }
          .search-nav-btns { display: flex; gap: 12px; }
          .search-body { padding: 40px 60px; }
          .search-bar-row {
            display: flex; gap: 12px; margin-bottom: 32px;
          }
          .search-input {
            flex: 1; padding: 12px 16px; background: var(--bg2);
            border: 1px solid var(--border); border-radius: 10px;
            color: var(--text); font-size: 14px; outline: none;
            transition: border-color 0.2s;
          }
          .search-input:focus { border-color: var(--accent); }
          .search-cards { display: flex; flex-direction: column; gap: 16px; }

          @media (max-width: 768px) {
            .search-nav { padding: 12px 16px; }
            .search-nav-btns { gap: 8px; }
            .search-nav-btns button { padding: 6px 12px !important; font-size: 12px !important; }
            .search-body { padding: 20px 16px; }
            .search-bar-row { flex-direction: column; gap: 10px; }
            .search-input { width: 100%; box-sizing: border-box; }
          }
        `}</style>

        {/* Navbar */}
        <motion.nav
          className="search-nav"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            onClick={() => navigate('/')}
            style={{ fontFamily: 'Space Mono', fontSize: '20px', color: 'var(--accent)', cursor: 'pointer' }}
          >
            SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
          </div>
          <div className="search-nav-btns">
            {isLoggedIn ? (
              <>
                <AnimatedButton onClick={() => navigate('/dashboard')} style={{
                  padding: '8px 20px', background: 'transparent',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
                }}>Dashboard</AnimatedButton>
                <AnimatedButton onClick={() => navigate('/profile')} style={{
                  padding: '8px 20px', background: 'var(--accent)',
                  border: 'none', borderRadius: '8px',
                  color: '#fff', fontSize: '14px', cursor: 'pointer'
                }}>Profile</AnimatedButton>
                <AnimatedButton danger onClick={handleLogout} style={{
                  padding: '8px 20px', background: 'transparent',
                  border: '1px solid #f87171', borderRadius: '8px',
                  color: '#f87171', fontSize: '14px', cursor: 'pointer'
                }}>Logout</AnimatedButton>
              </>
            ) : (
              <>
                <AnimatedButton onClick={() => navigate('/login')} style={{
                  padding: '8px 20px', background: 'transparent',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
                }}>Login</AnimatedButton>
                <AnimatedButton onClick={() => navigate('/register')} style={{
                  padding: '8px 20px', background: 'var(--accent)',
                  border: 'none', borderRadius: '8px',
                  color: '#fff', fontSize: '14px', cursor: 'pointer'
                }}>Get Started</AnimatedButton>
              </>
            )}
          </div>
        </motion.nav>

        <div className="search-body">

          {/* Header */}
          <FadeIn delay={0.1}>
            <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
              Find <span style={{ color: 'var(--accent)' }}>Internships</span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '15px', marginBottom: '28px' }}>
              Browse {internships.length > 0 ? internships.length : '40'} real AICTE internships
            </p>
          </FadeIn>

          {/* Search Bar */}
          <FadeIn delay={0.15}>
            <form onSubmit={handleSearch} className="search-bar-row">
              <input
                className="search-input"
                placeholder="Search by role, company or skill..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <input
                className="search-input"
                placeholder="Location..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ maxWidth: '200px' }}
              />
              <AnimatedButton type="submit" style={{
                padding: '12px 24px', background: 'var(--accent)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
              }}>Search</AnimatedButton>
            </form>
          </FadeIn>

          {/* Results count */}
          {!loading && (
            <FadeIn delay={0.2}>
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px' }}>
                Showing {internships.length} internship{internships.length !== 1 ? 's' : ''}
              </p>
            </FadeIn>
          )}

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}
            >
              <p style={{ fontSize: '16px' }}>Loading internships...</p>
            </motion.div>
          )}

          {/* Cards */}
          {!loading && (
            <StaggerContainer className="search-cards">
              {internships.map((intern, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    style={{
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '20px',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: '16px'
                    }}
                    whileHover={{ borderColor: 'var(--accent)', boxShadow: '0 0 16px rgba(99,102,241,0.1)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '16px', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>
                        {intern.title}
                      </h3>
                      <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '10px' }}>
                        {intern.company} • {intern.location} • {intern.duration}
                      </p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {(intern.skills_required || intern.skills || []).slice(0, 5).map((skill, j) => (
                          <span key={j} style={{
                            padding: '3px 8px', background: 'var(--bg3)',
                            border: '1px solid var(--border)', borderRadius: '20px',
                            fontSize: '11px', color: 'var(--accent2)'
                          }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '130px' }}>
                      {intern.stipend && (
                        <p style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '600', marginBottom: '10px' }}>
                          {intern.stipend}
                        </p>
                      )}
                      <a href={intern.apply_link} target="_blank" rel="noopener noreferrer">
                        <AnimatedButton style={{
                          padding: '8px 18px', background: 'var(--accent)',
                          border: 'none', borderRadius: '8px',
                          color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                        }}>Apply Now</AnimatedButton>
                      </a>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {!loading && internships.length === 0 && (
            <FadeIn>
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                <p style={{ fontSize: '16px' }}>No internships found. Try a different search.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default Search
