import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'https://smartintern-backend-j6gf.onrender.com'

function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = form, 2 = OTP
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  // CLIENT-SIDE VALIDATION (same as original)
  function validate() {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields'); return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address'); return false
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return false
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); return false
    }
    return true
  }

  // STEP 1: Send OTP
  async function handleSendOtp() {
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); return }
      setStep(2)
      startResendCooldown()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // STEP 2: Verify OTP
  async function handleVerifyOtp() {
    if (!otp || otp.length !== 6) { setError('Please enter the 6-digit OTP'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Verification failed'); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/resume') // ← same as original
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function startResendCooldown() {
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to resend OTP'); return }
      startResendCooldown()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Styles (exactly your originals) ──
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
            {step === 1 ? 'Create your account to get started' : `Enter the code sent to ${form.email}`}
          </p>
        </div>

        {step === 1 ? (
          /* ── STEP 1: Registration Form ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" placeholder="John Doe"
                value={form.name} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••"
                value={form.confirmPassword} onChange={handleChange} style={inputStyle} />
            </div>

            {error && <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>}

            <button onClick={handleSendOtp} disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'var(--accent)', border: 'none',
              borderRadius: '8px', color: '#fff',
              fontSize: '15px', fontWeight: '600',
              boxShadow: '0 0 20px var(--glow)',
              marginTop: '8px', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Sending OTP...' : 'Send Verification Code →'}
            </button>
          </div>
        ) : (
          /* ── STEP 2: OTP Verification ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>6-Digit Verification Code</label>
              <input
                type="text" placeholder="000000"
                value={otp}
                onChange={e => { setOtp(e.target.value); setError('') }}
                maxLength={6}
                style={{
                  ...inputStyle,
                  textAlign: 'center', fontSize: '28px',
                  fontWeight: '700', letterSpacing: '12px'
                }}
              />
            </div>

            {error && <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>}

            <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} style={{
              width: '100%', padding: '13px',
              background: 'var(--accent)', border: 'none',
              borderRadius: '8px', color: '#fff',
              fontSize: '15px', fontWeight: '600',
              boxShadow: '0 0 20px var(--glow)',
              marginTop: '8px', cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
              opacity: (loading || otp.length !== 6) ? 0.7 : 1
            }}>
              {loading ? 'Verifying...' : 'Verify & Create Account ✓'}
            </button>

            {/* Resend + Back */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span
                onClick={() => { setStep(1); setError(''); setOtp('') }}
                style={{ color: 'var(--text2)', fontSize: '13px', cursor: 'pointer' }}>
                ← Change email
              </span>
              <span
                onClick={handleResend}
                style={{
                  color: resendCooldown > 0 ? 'var(--text2)' : 'var(--accent)',
                  fontSize: '13px',
                  cursor: resendCooldown > 0 ? 'default' : 'pointer'
                }}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: 'var(--text2)'
        }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: 'var(--accent)', cursor: 'pointer' }}>
            Sign in here
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register