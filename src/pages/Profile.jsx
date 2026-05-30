import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    college: 'Delhi University',
    degree: 'B.Tech Computer Science',
    year: '3rd Year',
    skills: ['React', 'JavaScript', 'Python', 'CSS', 'MongoDB'],
    bio: 'Passionate developer looking for exciting internship opportunities in tech.'
  })

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
          <button
            onClick={() => setEditing(!editing)}
            style={{
              padding: '8px 20px',
              background: editing ? 'var(--success)' : 'var(--accent)',
              border: 'none', borderRadius: '8px',
              color: '#fff', fontSize: '14px', fontWeight: '600'
            }}
          >
            {editing ? '✅ Save Profile' : '✏️ Edit Profile'}
          </button>
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
                {profile.degree}
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
                      <p style={{ fontSize: '14px', color: 'var(--text)' }}>{profile[field.name]}</p>
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
                      <p style={{ fontSize: '14px', color: 'var(--text)' }}>{profile[field.name]}</p>
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {profile.skills.map(skill => (
                  <span key={skill} style={{
                    padding: '6px 12px', background: 'var(--bg3)',
                    border: '1px solid var(--accent)', borderRadius: '20px',
                    fontSize: '13px', color: 'var(--accent2)'
                  }}>
                    {skill}
                  </span>
                ))}
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
                  {profile.bio}
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
              Last updated — upload a new one anytime
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