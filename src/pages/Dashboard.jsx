import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton, FadeIn, StaggerContainer, StaggerItem, PageTransition, StatCard } from '../components/AnimatedCard'

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

  // Resume viewer state
  const [resumeUrl, setResumeUrl] = useState(null)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [showResume, setShowResume] = useState(false)
  const [hasResume, setHasResume] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
    fetchMatches()
    checkResume()
  }, [])

  // Check if user has a resume by reading profile — lightweight, no file download
  async function checkResume() {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`${BACKEND}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.resume_uploaded === true) setHasResume(true)
    } catch {
      // silent fail
    }
  }

  // Fetch PDF blob and open viewer
  async function handleViewResume() {
    if (showResume) { setShowResume(false); return }

    if (resumeUrl) { setShowResume(true); return } // already fetched

    const token = localStorage.getItem('token')
    if (!token) return

    setResumeLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/resume/file`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setResumeUrl(url)
      setShowResume(true)
    } catch {
      // silent fail
    } finally {
      setResumeLoading(false)
    }
  }

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
        setError('no_resume'); return
      }
      if (!res.ok) { setError('failed'); return }
      setMatches(data)
    } catch {
      setError('failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('storage'))
    navigate('/login')
  }

  const skillGaps = matches.length > 0
    ? [...new Set(matches.flatMap(m => m.skill_gaps || []))].slice(0, 6)
    : []
  const bestMatch = matches.length > 0 ? matches[0].match_score : 0

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

        <style>{`
          .dash-nav {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 60px; border-bottom: 1px solid var(--border);
            background: var(--bg2);
          }
          .dash-nav-btns { display: flex; gap: 12px; align-items: center; }
          .dash-body { padding: 40px 60px; }
          .dash-stats {
            display: grid; grid-template-columns: repeat(4, 1fr);
            gap: 16px; margin-bottom: 40px;
          }
          .dash-main { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }

          @media (max-width: 768px) {
            .dash-nav { padding: 12px 16px; }
            .dash-nav-btns { gap: 8px; }
            .dash-nav-btns button { padding: 6px 12px !important; font-size: 12px !important; }
            .dash-body { padding: 24px 16px; }
            .dash-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
            .dash-main { grid-template-columns: 1fr; gap: 20px; }
          }
        `}</style>

        {/* Navbar */}
        <motion.nav
          className="dash-nav"
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
          <div className="dash-nav-btns">
            <AnimatedButton onClick={() => navigate('/search')} style={{
              padding: '8px 20px', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
            }}>Search</AnimatedButton>
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
          </div>
        </motion.nav>

        <div className="dash-body">

          <FadeIn delay={0.1}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
                Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.name || 'Student'}!</span>
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '15px' }}>
                Here are your AI matched internships based on your resume
              </p>
            </div>
          </FadeIn>

          {/* ── Resume Viewer Card ── */}
          {hasResume && (
            <FadeIn delay={0.15}>
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '14px', marginBottom: '28px', overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div style={{
                  padding: '16px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>📄</span>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '2px' }}>Your Resume</p>
                      <p style={{ fontSize: '12px', color: 'var(--text2)' }}>Uploaded & analyzed by AI</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* View / Hide toggle */}
                    <AnimatedButton
                      onClick={handleViewResume}
                      style={{
                        padding: '7px 16px', background: 'transparent',
                        border: '1px solid var(--border)', borderRadius: '8px',
                        color: 'var(--text)', fontSize: '13px', cursor: 'pointer'
                      }}
                    >
                      {resumeLoading ? '⏳ Loading...' : showResume ? '🙈 Hide PDF' : '👁 View PDF'}
                    </AnimatedButton>

                    {/* Download — fetch blob and trigger download */}
                    <AnimatedButton
                      onClick={async () => {
                        const token = localStorage.getItem('token')
                        const res = await fetch(`${BACKEND}/api/resume/file`, {
                          headers: { 'Authorization': `Bearer ${token}` }
                        })
                        const blob = await res.blob()
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url; a.download = 'resume.pdf'; a.click()
                        URL.revokeObjectURL(url)
                      }}
                      style={{
                        padding: '7px 16px', background: 'transparent',
                        border: '1px solid var(--accent)', borderRadius: '8px',
                        color: 'var(--accent)', fontSize: '13px', cursor: 'pointer'
                      }}
                    >
                      ⬇ Download
                    </AnimatedButton>

                    {/* Re-upload */}
                    <AnimatedButton
                      onClick={() => navigate('/resume')}
                      style={{
                        padding: '7px 16px', background: 'var(--accent)',
                        border: 'none', borderRadius: '8px',
                        color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                        boxShadow: '0 0 12px var(--glow)'
                      }}
                    >
                      🔄 Re-upload
                    </AnimatedButton>
                  </div>
                </div>

                {/* Embedded PDF Viewer — slides open/closed */}
                <AnimatePresence>
                  {showResume && resumeUrl && (
                    <motion.div
                      key="dash-pdf"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 660 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}
                    >
                      {/* Viewer toolbar */}
                      <div style={{
                        padding: '10px 20px', background: 'var(--bg3)',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        borderBottom: '1px solid var(--border)'
                      }}>
                        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>resume.pdf</span>
                        <span style={{
                          marginLeft: 'auto', fontSize: '11px', color: 'var(--accent)',
                          background: 'var(--glow)', padding: '2px 10px',
                          borderRadius: '20px', border: '1px solid var(--accent)'
                        }}>
                          PDF Preview
                        </span>
                      </div>
                      <object
                        data={resumeUrl}
                        type="application/pdf"
                        style={{
                          width: '100%', height: '620px',
                          display: 'block', background: '#fff'
                        }}
                      >
                        {/* Mobile fallback — Google Docs viewer */}
                        <div style={{
                          height: '160px', display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: '12px',
                          color: 'var(--text2)', fontSize: '14px'
                        }}>
                          <span style={{ fontSize: '32px' }}>📄</span>
                          <p>Browser can't preview PDF inline.</p>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <AnimatedButton onClick={async () => {
                              const token = localStorage.getItem('token')
                              const res = await fetch(`${BACKEND}/api/resume/file`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                              })
                              const blob = await res.blob()
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url; a.download = 'resume.pdf'; a.click()
                              URL.revokeObjectURL(url)
                            }} style={{
                              padding: '8px 20px', background: 'var(--accent)',
                              border: 'none', borderRadius: '8px', color: '#fff',
                              fontSize: '13px', cursor: 'pointer'
                            }}>⬇ Download to View</AnimatedButton>
                          </div>
                        </div>
                      </object>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          )}

          {error === 'no_resume' && (
            <FadeIn delay={0.2}>
              <div style={{
                background: 'var(--glow)', border: '1px solid var(--accent)',
                borderRadius: '12px', padding: '40px', textAlign: 'center', marginBottom: '32px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                <h2 style={{ fontSize: '22px', marginBottom: '12px' }}>Upload your resume to get matches!</h2>
                <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '24px' }}>
                  Our AI needs your resume to find the best internships for you
                </p>
                <AnimatedButton onClick={() => navigate('/resume')} style={{
                  padding: '12px 28px', background: 'var(--accent)',
                  border: 'none', borderRadius: '8px', color: '#fff',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer'
                }}>Upload Resume →</AnimatedButton>
              </div>
            </FadeIn>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}
            >
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Finding your matches...</p>
              <p style={{ fontSize: '13px', opacity: 0.6 }}>First load may take up to 60 seconds ☕</p>
            </motion.div>
          )}

          {!loading && matches.length > 0 && (
            <>
              <div className="dash-stats">
                {[
                  { label: 'Total Matches', value: matches.length, icon: '🎯' },
                  { label: 'Best Match', value: `${bestMatch}%`, icon: '⭐' },
                  { label: 'Skills Detected', value: matches[0]?.skill_gaps ? matches[0].skill_gaps.length : 0, icon: '🧠' },
                  { label: 'Skill Gaps', value: skillGaps.length, icon: '📈' },
                ].map((stat, i) => (
                  <StatCard key={i} index={i} style={{
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '20px',
                    display: 'flex', alignItems: 'center', gap: '16px'
                  }}>
                    <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                    <div>
                      <p style={{ fontSize: '22px', fontWeight: '600', color: 'var(--accent)' }}>{stat.value}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text2)' }}>{stat.label}</p>
                    </div>
                  </StatCard>
                ))}
              </div>

              <div className="dash-main">
                <div>
                  <FadeIn delay={0.15}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px', fontFamily: 'Space Grotesk' }}>Your Matches</h2>
                  </FadeIn>
                  <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {matches.map((internship, index) => (
                      <StaggerItem key={index}>
                        <motion.div
                          style={{
                            background: 'var(--bg2)', border: '1px solid var(--border)',
                            borderRadius: '12px', padding: '20px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          }}
                          whileHover={{ borderColor: 'var(--accent)', boxShadow: '0 0 16px rgba(99,102,241,0.1)' }}
                          transition={{ duration: 0.2 }}
                        >
                          <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
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
                                }}>{skill}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', minWidth: '110px' }}>
                            <div style={{
                              fontSize: '24px', fontWeight: '700',
                              color: matchColor(internship.match_score), marginBottom: '4px'
                            }}>{internship.match_score}%</div>
                            <p style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '10px' }}>match score</p>
                            <a href={internship.apply_link} target="_blank" rel="noopener noreferrer">
                              <AnimatedButton style={{
                                padding: '6px 16px', background: 'var(--accent)',
                                border: 'none', borderRadius: '6px',
                                color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                              }}>Apply</AnimatedButton>
                            </a>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>

                <div>
                  <FadeIn delay={0.2}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px', fontFamily: 'Space Grotesk' }}>Skill Gaps</h2>
                  </FadeIn>
                  <FadeIn delay={0.25}>
                    <div style={{
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '20px', marginBottom: '16px'
                    }}>
                      <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>
                        Learn these to improve your match scores
                      </p>
                      {skillGaps.length === 0 ? (
                        <p style={{ fontSize: '14px', color: 'var(--success)' }}>🎉 Great skills! No major gaps found.</p>
                      ) : (
                        <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {skillGaps.map(skill => (
                            <StaggerItem key={skill}>
                              <motion.div
                                style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                  padding: '10px 14px', background: 'var(--bg3)',
                                  border: '1px solid var(--border)', borderRadius: '8px'
                                }}
                                whileHover={{ borderColor: 'var(--accent)', x: 4 }}
                                transition={{ duration: 0.15 }}
                              >
                                <span style={{ fontSize: '14px' }}>{skill}</span>
                                <span style={{ fontSize: '11px', color: 'var(--warning)' }}>Learn →</span>
                              </motion.div>
                            </StaggerItem>
                          ))}
                        </StaggerContainer>
                      )}
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.3}>
                    <div style={{
                      background: 'var(--glow)', border: '1px solid var(--accent)',
                      borderRadius: '12px', padding: '20px', textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text)' }}>
                        Update your resume for better matches
                      </p>
                      <AnimatedButton onClick={() => navigate('/resume')} style={{
                        width: '100%', padding: '10px', background: 'var(--accent)',
                        border: 'none', borderRadius: '8px', color: '#fff',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                      }}>Upload Resume →</AnimatedButton>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default Dashboard
