import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from '../components/AnimatedCard'

const API = 'https://smartintern-backend-j6gf.onrender.com'

function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
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
  const [slowWarning, setSlowWarning] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

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

  async function handleSendOtp() {
    if (!validate()) return
    setLoading(true)
    setError('')
    setSlowWarning(false)

    const wakeTimer = setTimeout(() => setSlowWarning(true), 5000)

    try {
      const res = await fetch(`${API}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); return }
      setStep(2)
      startResendCooldown()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      clearTimeout(wakeTimer)
      setSlowWarning(false)
      setLoading(false)
    }
  }

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
      window.dispatchEvent(new Event('storage'))
      navigate('/resume')
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
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
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

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box'
  }

  const labelStyle = {
    fontSize: '13px', color: 'var(--text2)',
    marginBottom: '6px', display: 'block'
  }

  const fieldDelays = [0.1, 0.18, 0.26, 0.34]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: 'clamp(28px, 5vw, 40px)'
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <div
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'Space Mono', fontSize: '22px',
              color: 'var(--accent)', marginBottom: '8px', cursor: 'pointer'
            }}
          >
            SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            {step === 1
              ? 'Create your account to get started'
              : `Enter the code sent to ${form.email}`}
          </p>
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: fieldDelays[0] }}
              >
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="name" placeholder="John Doe"
                  value={form.name} onChange={handleChange} style={inputStyle} />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: fieldDelays[1] }}
              >
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} style={inputStyle} />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: fieldDelays[2] }}
              >
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange} style={inputStyle} />
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: fieldDelays[3] }}
              >
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="••••••••"
                  value={form.confirmPassword} onChange={handleChange} style={inputStyle} />
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: '#f87171', fontSize: '13px', margin: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Slow warning */}
              <AnimatePresence>
                {slowWarning && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ color: 'var(--text2)', fontSize: '12px', textAlign: 'center', margin: 0 }}
                  >
                    ⏳ Server is waking up, please wait 20–30 seconds...
                  </motion.p>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.42 }}
                style={{ marginTop: '8px' }}
              >
                <AnimatedButton
                  onClick={handleSendOtp}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'var(--accent)', border: 'none',
                    borderRadius: '8px', color: '#fff',
                    fontSize: '15px', fontWeight: '600',
                    boxShadow: '0 0 20px var(--glow)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Sending OTP...' : 'Send Verification Code →'}
                </AnimatedButton>
              </motion.div>
            </motion.div>

          ) : (
            /* ── STEP 2: OTP ── */
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* OTP input */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <label style={labelStyle}>6-Digit Verification Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={e => { setOtp(e.target.value); setError('') }}
                  maxLength={6}
                  style={{
                    ...inputStyle,
                    textAlign: 'center', fontSize: '28px',
                    fontWeight: '700', letterSpacing: '12px'
                  }}
                />
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="err2"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: '#f87171', fontSize: '13px', margin: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                style={{ marginTop: '8px' }}
              >
                <AnimatedButton
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'var(--accent)', border: 'none',
                    borderRadius: '8px', color: '#fff',
                    fontSize: '15px', fontWeight: '600',
                    boxShadow: '0 0 20px var(--glow)',
                    cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                    opacity: (loading || otp.length !== 6) ? 0.7 : 1
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account ✓'}
                </AnimatedButton>
              </motion.div>

              {/* Resend + Back */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.26 }}
                style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}
              >
                <motion.span
                  onClick={() => { setStep(1); setError(''); setOtp('') }}
                  whileHover={{ opacity: 0.7 }}
                  style={{ color: 'var(--text2)', fontSize: '13px', cursor: 'pointer' }}
                >
                  ← Change email
                </motion.span>
                <motion.span
                  onClick={handleResend}
                  whileHover={resendCooldown === 0 ? { opacity: 0.75 } : {}}
                  style={{
                    color: resendCooldown > 0 ? 'var(--text2)' : 'var(--accent)',
                    fontSize: '13px',
                    cursor: resendCooldown > 0 ? 'default' : 'pointer'
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text2)' }}
        >
          Already have an account?{' '}
          <motion.span
            onClick={() => navigate('/login')}
            whileHover={{ opacity: 0.75 }}
            style={{ color: 'var(--accent)', cursor: 'pointer' }}
          >
            Sign in here
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Register