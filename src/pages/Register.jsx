import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleRegister() {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    // Backend connection will go here later
    alert('Register coming soon!')
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
    outline: 'none'
  }

  const labelStyle = {
    fontSize: '13px', color: 'var(--text2)',
    marginBottom: '6px', display: 'block'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)',
      padding: '40px 20px'
    }}>

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '40px'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div 
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'Space Mono', fontSize: '22px',
              color: 'var(--accent)', marginBottom: '8px', cursor: 'pointer'
            }}>
            SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>
          )}

          <button onClick={handleRegister} style={{
            width: '100%', padding: '13px',
            background: 'var(--accent)', border: 'none',
            borderRadius: '8px', color: '#fff',
            fontSize: '15px', fontWeight: '600',
            boxShadow: '0 0 20px var(--glow)',
            marginTop: '8px'
          }}>
            Create Account →
          </button>

        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: 'var(--text2)'
        }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: 'var(--accent)', cursor: 'pointer' }}
          >
            Sign in here
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register