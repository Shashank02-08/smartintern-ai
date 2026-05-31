import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND = 'https://smartintern-backend-j6gf.onrender.com'

function Profile() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    year: '',
    skills: [],
    bio: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    try {
      const res = await fetch(`${BACKEND}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) { navigate('/login'); return }
      setProfile({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        college: data.college || '',
        degree: data.degree || '',
        year: data.year || '',
        skills: data.skills || [],
        bio: data.bio || ''
      })
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile() {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    try {
      setSaving(true)
      const res = await fetch(`${BACKEND}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      })
      if (res.ok) {
        setMessage('Profile saved!')
        setEditing(false)
        setTimeout(() => setMessage(''), 2000)
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
  }

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
    outline: 'none'
  }

  const labelStyle = {
    fontSize: '12px', color: 'var(--text2)',
    marginBottom: '6px', display: 'block',
    textTransform: 'uppercase', letterSpacing: '0.05em'
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text2)', fontSize: '16px'
    }}>
      Loading profile...
    </div>
  )

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
          <button onClick={() => navigate('/search')} style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text)', fontSize: '14px'
          }}>
            Search
          </button>
          <button onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/')
          }} style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid var(--danger)', borderRadius: '8px',
            color: 'var(--danger)', fontSize: '14px'
          }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 60px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '28px' }}>
            My <span style={{ color: 'var(--accent)' }}>Profile</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {message && (
              <span style={{ fontSize: '14px', color: 'var(--success)' }}>{message}</span>
            )}
            <button
              onClick={() => editing ? saveProfile() : setEditing(true)}
              style={{
                padding: '8px 20px',
                background: editing ? 'var(--success)' : 'var(--accent)',
                border: 'none', borderRadius: '8px',
                color: '#fff', fontSize: '14px', fontWeight: '600'
              }}
            >
              {saving ? 'Saving...' : editing ? '✅ Save Profile' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Avatar Card */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px', textAlign: 'center'
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--glow)', border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', margin: '0 auto 16px'
              }}>
                👤
              </div>
              {editing ? (
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  style={{ ...inputStyle, textAlign: 'center', fontSize: '18px', fontWeight: '600' }}
                />
              ) : (
                <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>{profile.name}</h2>
              )}
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>
                {profile.degree || 'No degree added yet'}
              </p>
            </div>

            {/* Contact Info */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>
                Contact Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Phone', name: 'phone', type: 'text' },
                ].map(field => (
                  <div key={field.name}>
                    <label style={labelStyle}>{field.label}</label>
                    {editing ? (
                      <input
                        type={field.type}
                        name={field.name}
                        value={profile[field.name]}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    ) : (
                      <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                        {profile[field.name] || 'Not added yet'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Academic Info */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>
                Academic Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'College', name: 'college' },
                  { label: 'Degree', name: 'degree' },
                  { label: 'Year', name: 'year' },
                ].map(field => (
                  <div key={field.name}>
                    <label style={labelStyle}>{field.label}</label>
                    {editing ? (
                      <input
                        type="text"
                        name={field.name}
                        value={profile[field.name]}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    ) : (
                      <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                        {profile[field.name] || 'Not added yet'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>
                Skills
              </h3>
              {editing && (
                <input
                  type="text"
                  placeholder="Type a skill and press Enter"
                  style={{ ...inputStyle, marginBottom: '12px' }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const skill = e.target.value.trim()
                      if (!profile.skills.includes(skill)) {
                        setProfile({ ...profile, skills: [...profile.skills, skill] })
                      }
                      e.target.value = ''
                    }
                  }}
                />
              )}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {profile.skills.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--text3)' }}>No skills added yet</p>
                ) : (
                  profile.skills.map((skill, i) => (
                    <span key={i} style={{
                      padding: '6px 12px', background: 'var(--bg3)',
                      border: '1px solid var(--accent)', borderRadius: '20px',
                      fontSize: '13px', color: 'var(--accent2)',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      {skill}
                      {editing && (
                        <span
                          onClick={() => setProfile({ ...profile, skills: profile.skills.filter((_, j) => j !== i) })}
                          style={{ cursor: 'pointer', opacity: 0.6, fontSize: '14px' }}
                        >×</span>
                      )}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Bio */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>
                Bio
              </h3>
              {editing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                />
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.7' }}>
                  {profile.bio || 'No bio added yet'}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Resume Section */}
        <div style={{
          marginTop: '24px', background: 'var(--bg2)',
          border: '1px solid var(--border)', borderRadius: '12px',
          padding: '24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>
              Resume
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
              Upload your resume for AI matching
            </p>
          </div>
          <button onClick={() => navigate('/resume')} style={{
            padding: '10px 20px', background: 'var(--accent)',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '14px', fontWeight: '600'
          }}>
            Update Resume →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile