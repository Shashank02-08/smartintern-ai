import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleLogin() {
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    // Backend connection will go here later
    alert('Login coming soon!')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)'
    }}>

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '40px'
      }}>

        {/* Logo */}
        <div style={{
          textAlign: 'center', marginBottom: '32px'
        }}>
          <div style={{
            fontFamily: 'Space Mono', fontSize: '22px', color: 'var(--accent)',
            marginBottom: '8px'
          }}>
            SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            Welcome back! Sign in to continue
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 16px',
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px 16px',
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>
          )}

          <button onClick={handleLogin} style={{
            width: '100%', padding: '13px',
            background: 'var(--accent)', border: 'none',
            borderRadius: '8px', color: '#fff',
            fontSize: '15px', fontWeight: '600',
            boxShadow: '0 0 20px var(--glow)',
            marginTop: '8px'
          }}>
            Sign In →
          </button>

        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: 'var(--text2)'
        }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: 'var(--accent)', cursor: 'pointer' }}
          >
            Register here
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login