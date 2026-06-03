import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton, FadeIn, PageTransition } from '../components/AnimatedCard'

const API = 'https://smartintern-backend-j6gf.onrender.com'

function Login() {
  const navigate = useNavigate()

  // Main login
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot password flow: null | 'email' | 'otp' | 'password'
  const [forgotStep, setForgotStep] = useState(null)
  const [fpEmail, setFpEmail] = useState('')
  const [fpOtp, setFpOtp] = useState('')
  const [fpPassword, setFpPassword] = useState('')
  const [fpConfirm, setFpConfirm] = useState('')
  const [fpError, setFpError] = useState('')
  const [fpLoading, setFpLoading] = useState(false)
  const [fpSuccess, setFpSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [slowWarning, setSlowWarning] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError('Please fill in all fields'); return
    }
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('storage'))
      navigate('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Forgot Password handlers ──

  function startResendCooldown() {
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  async function handleSendResetOtp(email) {
    setFpLoading(true)
    setFpError('')
    setSlowWarning(false)
    const wakeTimer = setTimeout(() => setSlowWarning(true), 5000)
    try {
      const res = await fetch(`${API}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) { setFpError(data.error || 'Failed to send OTP'); return }
      setForgotStep('otp')
      startResendCooldown()
    } catch {
      setFpError('Something went wrong. Please try again.')
    } finally {
      clearTimeout(wakeTimer)
      setSlowWarning(false)
      setFpLoading(false)
    }
  }

  async function handleVerifyResetOtp() {
  if (fpOtp.length !== 6) { setFpError('Please enter the 6-digit OTP'); return }
  setFpLoading(true)
  setFpError('')
  try {
    const res = await fetch(`${API}/api/verify-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fpEmail, otp: fpOtp })
    })
    const data = await res.json()
    if (!res.ok) { setFpError(data.error || 'Invalid OTP'); return }
    setForgotStep('password')
  } catch {
    setFpError('Something went wrong. Please try again.')
  } finally {
    setFpLoading(false)
  }
}

  async function handleResetPassword() {
    if (!fpPassword || !fpConfirm) { setFpError('Please fill in all fields'); return }
    if (fpPassword !== fpConfirm) { setFpError('Passwords do not match'); return }
    if (fpPassword.length < 6) { setFpError('Password must be at least 6 characters'); return }
    setFpLoading(true)
    setFpError('')
    try {
      const res = await fetch(`${API}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp, new_password: fpPassword })
      })
      const data = await res.json()
      if (!res.ok) { setFpError(data.error || 'Reset failed'); return }
      setFpSuccess(true)
      setTimeout(() => {
        setForgotStep(null)
        setFpSuccess(false)
        setFpEmail(''); setFpOtp(''); setFpPassword(''); setFpConfirm('')
      }, 2500)
    } catch {
      setFpError('Something went wrong. Please try again.')
    } finally {
      setFpLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s'
  }

  const labelStyle = {
    fontSize: '13px', color: 'var(--text2)',
    marginBottom: '6px', display: 'block'
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
                {forgotStep === null && 'Welcome back! Sign in to continue'}
                {forgotStep === 'email' && 'Enter your email to reset password'}
                {forgotStep === 'otp' && `Enter the code sent to ${fpEmail}`}
                {forgotStep === 'password' && 'Set your new password'}
              </p>
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">

            {/* ── LOGIN FORM ── */}
            {forgotStep === null && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <FadeIn delay={0.15}>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input type="email" name="email" placeholder="you@example.com"
                        value={form.email} onChange={handleChange}
                        className="login-input" style={inputStyle} />
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.2}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                        <motion.span
                          onClick={() => { setForgotStep('email'); setFpEmail(form.email); setFpError('') }}
                          whileHover={{ opacity: 0.75 }}
                          style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer' }}
                        >
                          Forgot password?
                        </motion.span>
                      </div>
                      <input type="password" name="password" placeholder="••••••••"
                        value={form.password} onChange={handleChange}
                        className="login-input" style={inputStyle} />
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
                    <AnimatedButton onClick={handleLogin} disabled={loading} style={{
                      width: '100%', padding: '13px',
                      background: 'var(--accent)', border: 'none',
                      borderRadius: '8px', color: '#fff',
                      fontSize: '15px', fontWeight: '600',
                      boxShadow: '0 0 20px var(--glow)',
                      marginTop: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}>
                      {loading ? 'Signing in...' : 'Sign In →'}
                    </AnimatedButton>
                  </FadeIn>
                </div>

                <FadeIn delay={0.3}>
                  <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text2)' }}>
                    Don't have an account?{' '}
                    <motion.span
                      onClick={() => navigate('/register')}
                      style={{ color: 'var(--accent)', cursor: 'pointer' }}
                      whileHover={{ opacity: 0.8 }}
                    >Register here</motion.span>
                  </p>
                </FadeIn>
              </motion.div>
            )}

            {/* ── FORGOT: ENTER EMAIL ── */}
            {forgotStep === 'email' && (
              <motion.div
                key="fp-email"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" placeholder="you@example.com"
                      value={fpEmail}
                      onChange={e => { setFpEmail(e.target.value); setFpError('') }}
                      className="login-input" style={inputStyle} />
                  </div>

                  {fpError && (
                    <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      style={{ color: '#f87171', fontSize: '13px' }}>{fpError}</motion.p>
                  )}

                  <AnimatePresence>
                    {slowWarning && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ color: 'var(--text2)', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                        ⏳ Server is waking up, please wait 20–30 seconds...
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <AnimatedButton
                    onClick={() => handleSendResetOtp(fpEmail)}
                    disabled={fpLoading}
                    style={{
                      width: '100%', padding: '13px', background: 'var(--accent)',
                      border: 'none', borderRadius: '8px', color: '#fff',
                      fontSize: '15px', fontWeight: '600', boxShadow: '0 0 20px var(--glow)',
                      cursor: fpLoading ? 'not-allowed' : 'pointer', opacity: fpLoading ? 0.7 : 1
                    }}>
                    {fpLoading ? 'Sending OTP...' : 'Send Reset Code →'}
                  </AnimatedButton>

                  <motion.span
                    onClick={() => { setForgotStep(null); setFpError('') }}
                    whileHover={{ opacity: 0.7 }}
                    style={{ color: 'var(--text2)', fontSize: '13px', cursor: 'pointer', textAlign: 'center' }}
                  >← Back to login</motion.span>
                </div>
              </motion.div>
            )}

            {/* ── FORGOT: ENTER OTP ── */}
            {forgotStep === 'otp' && (
              <motion.div
                key="fp-otp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>6-Digit Reset Code</label>
                    <input
                      type="text" placeholder="000000"
                      value={fpOtp}
                      onChange={e => { setFpOtp(e.target.value); setFpError('') }}
                      maxLength={6}
                      style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', fontWeight: '700', letterSpacing: '12px' }}
                    />
                  </div>

                  {fpError && (
                    <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      style={{ color: '#f87171', fontSize: '13px' }}>{fpError}</motion.p>
                  )}

                  <AnimatedButton
                    onClick={handleVerifyResetOtp}
                    disabled={fpLoading || fpOtp.length !== 6}
                    style={{
                      width: '100%', padding: '13px', background: 'var(--accent)',
                      border: 'none', borderRadius: '8px', color: '#fff',
                      fontSize: '15px', fontWeight: '600', boxShadow: '0 0 20px var(--glow)',
                      cursor: (fpLoading || fpOtp.length !== 6) ? 'not-allowed' : 'pointer',
                      opacity: (fpLoading || fpOtp.length !== 6) ? 0.7 : 1
                    }}>
                    {fpLoading ? 'Verifying...' : 'Verify Code →'}
                  </AnimatedButton>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <motion.span
                      onClick={() => { setForgotStep('email'); setFpError(''); setFpOtp('') }}
                      whileHover={{ opacity: 0.7 }}
                      style={{ color: 'var(--text2)', fontSize: '13px', cursor: 'pointer' }}
                    >← Change email</motion.span>
                    <motion.span
                      onClick={() => resendCooldown === 0 && handleSendResetOtp(fpEmail)}
                      whileHover={resendCooldown === 0 ? { opacity: 0.75 } : {}}
                      style={{
                        color: resendCooldown > 0 ? 'var(--text2)' : 'var(--accent)',
                        fontSize: '13px', cursor: resendCooldown > 0 ? 'default' : 'pointer'
                      }}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FORGOT: NEW PASSWORD ── */}
            {forgotStep === 'password' && (
              <motion.div
                key="fp-password"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {fpSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: 'center', padding: '20px 0' }}
                    >
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                      <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>Password Reset!</h3>
                      <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Redirecting to login...</p>
                    </motion.div>
                  ) : (
                    <>
                      <div>
                        <label style={labelStyle}>New Password</label>
                        <input type="password" placeholder="••••••••"
                          value={fpPassword}
                          onChange={e => { setFpPassword(e.target.value); setFpError('') }}
                          className="login-input" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Confirm New Password</label>
                        <input type="password" placeholder="••••••••"
                          value={fpConfirm}
                          onChange={e => { setFpConfirm(e.target.value); setFpError('') }}
                          className="login-input" style={inputStyle} />
                      </div>

                      {fpError && (
                        <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          style={{ color: '#f87171', fontSize: '13px' }}>{fpError}</motion.p>
                      )}

                      <AnimatedButton
                        onClick={handleResetPassword}
                        disabled={fpLoading}
                        style={{
                          width: '100%', padding: '13px', background: 'var(--accent)',
                          border: 'none', borderRadius: '8px', color: '#fff',
                          fontSize: '15px', fontWeight: '600', boxShadow: '0 0 20px var(--glow)',
                          cursor: fpLoading ? 'not-allowed' : 'pointer', opacity: fpLoading ? 0.7 : 1
                        }}>
                        {fpLoading ? 'Resetting...' : 'Reset Password ✓'}
                      </AnimatedButton>
                    </>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default Login