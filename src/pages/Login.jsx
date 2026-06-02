import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedButton, FadeIn, PageTransition } from '../components/AnimatedCard'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    try {
      setLoading(true)
      const res = await fetch('https://smartintern-backend-j6gf.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('storage'))
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)',
        padding: '20px'
      }}>

        <style>{`
          .login-card {
            width: 100%; max-width: 420px;
            background: var(--bg2); border: 1px solid var(--border);
            border-radius: 16px; padding: 40px;
          }
          .login-input:focus { border-color: var(--accent) !important; }
          @media (max-width: 480px) {
            .login-card { padding: 28px 20px; border-radius: 12px; }
          }
        `}</style>

        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >

          {/* Logo */}
          <FadeIn delay={0.1}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                onClick={() => navigate('/')}
                style={{
                  fontFamily: 'Space Mono', fontSize: '22px', color: 'var(--accent)',
                  marginBottom: '8px', cursor: 'pointer', display: 'inline-block'
                }}
              >
                SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
                Welcome back! Sign in to continue
              </p>
            </div>
          </FadeIn>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <FadeIn delay={0.15}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>
                  Email
                </label>
                <input
                  type="email" name="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  className="login-input"
                  style={inputStyle}
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px', display: 'block' }}>
                  Password
                </label>
                <input
                  type="password" name="password"
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  className="login-input"
                  style={inputStyle}
                />
              </div>
            </FadeIn>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ color: '#f87171', fontSize: '13px' }}
              >{error}</motion.p>
            )}

            <FadeIn delay={0.25}>
              <AnimatedButton onClick={handleLogin} style={{
                width: '100%', padding: '13px',
                background: 'var(--accent)', border: 'none',
                borderRadius: '8px', color: '#fff',
                fontSize: '15px', fontWeight: '600',
                boxShadow: '0 0 20px var(--glow)',
                marginTop: '8px', cursor: 'pointer',
                opacity: loading ? 0.7 : 1
              }}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </AnimatedButton>
            </FadeIn>

          </div>

          {/* Footer */}
          <FadeIn delay={0.3}>
            <p style={{
              textAlign: 'center', marginTop: '24px',
              fontSize: '14px', color: 'var(--text2)'
            }}>
              Don't have an account?{' '}
              <motion.span
                onClick={() => navigate('/register')}
                style={{ color: 'var(--accent)', cursor: 'pointer' }}
                whileHover={{ opacity: 0.8 }}
              >
                Register here
              </motion.span>
            </p>
          </FadeIn>

        </motion.div>
      </div>
    </PageTransition>
  )
}

export default Login
