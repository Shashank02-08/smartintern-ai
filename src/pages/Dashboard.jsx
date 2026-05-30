import { useNavigate } from 'react-router-dom'

const DUMMY_MATCHES = [
  { id: 1, title: 'Frontend Developer Intern', company: 'TechCorp', match: 92, skills: ['React', 'CSS', 'JavaScript'], stipend: '₹15,000/month', location: 'Remote' },
  { id: 2, title: 'UI/UX Design Intern', company: 'DesignHub', match: 85, skills: ['Figma', 'Adobe XD'], stipend: '₹10,000/month', location: 'Mumbai' },
  { id: 3, title: 'Backend Developer Intern', company: 'Startup X', match: 74, skills: ['Node.js', 'MongoDB'], stipend: '₹12,000/month', location: 'Remote' },
  { id: 4, title: 'Machine Learning Intern', company: 'AI Labs', match: 61, skills: ['Python', 'TensorFlow'], stipend: '₹25,000/month', location: 'Hyderabad' },
]

const SKILL_GAPS = ['TensorFlow', 'Docker', 'GraphQL', 'TypeScript']

function matchColor(score) {
  if (score >= 80) return '#22d3a5'
  if (score >= 60) return '#f59e0b'
  return '#f87171'
}

function Dashboard() {
  const navigate = useNavigate()

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
            color: 'var(--text)', fontSize: '14px'
          }}>
            Search
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

      <div style={{ padding: '40px 60px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
            Welcome back, <span style={{ color: 'var(--accent)' }}>Student!</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '15px' }}>
            Here are your AI matched internships based on your resume
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', marginBottom: '40px'
        }}>
          {[
            { label: 'Total Matches', value: '4', icon: '🎯' },
            { label: 'Best Match', value: '92%', icon: '⭐' },
            { label: 'Skills Detected', value: '8', icon: '🧠' },
            { label: 'Skill Gaps', value: '4', icon: '📈' },
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
              {DUMMY_MATCHES.map(internship => (
                <div key={internship.id} style={{
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
                      {internship.skills.map(skill => (
                        <span key={skill} style={{
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
                      color: matchColor(internship.match), marginBottom: '4px'
                    }}>
                      {internship.match}%
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '10px' }}>
                      match score
                    </p>
                    <button style={{
                      padding: '6px 16px', background: 'var(--accent)',
                      border: 'none', borderRadius: '6px',
                      color: '#fff', fontSize: '12px', fontWeight: '600'
                    }}>
                      Apply
                    </button>
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
                Learn these skills to improve your match scores
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SKILL_GAPS.map(skill => (
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
                fontSize: '13px', fontWeight: '600'
              }}>
                Upload Resume →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard