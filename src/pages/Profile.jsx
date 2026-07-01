import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedButton, FadeIn, StaggerContainer, StaggerItem, PageTransition } from '../components/AnimatedCard'

const BACKEND = 'https://smartintern-backend-j6gf.onrender.com'
const CROP_SIZE = 300

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function Profile() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', college: '', degree: '', year: '', skills: [], bio: '', photo: ''
  })
  const fileInputRef = useRef(null)

  // ── Crop modal state ──
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState(null)
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 })
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 })
  const [cropZoom, setCropZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 })

  useEffect(() => { fetchProfile() }, [])

  // Reclamp pan offset whenever zoom changes, so the image never reveals empty space
  useEffect(() => {
    if (!imgNaturalSize.width || !imgNaturalSize.height) return
    const { maxOffsetX, maxOffsetY } = getMaxOffsets(cropZoom)
    setCropOffset(prev => ({
      x: clamp(prev.x, -maxOffsetX, maxOffsetX),
      y: clamp(prev.y, -maxOffsetY, maxOffsetY)
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropZoom, imgNaturalSize])

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
        name: data.name || '', email: data.email || '', phone: data.phone || '',
        college: data.college || '', degree: data.degree || '', year: data.year || '',
        skills: data.skills || [], bio: data.bio || '', photo: data.photo || ''
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
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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

  // ── Photo selection: opens the crop modal, does NOT save anything yet ──
  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file')
      setTimeout(() => setMessage(''), 2000)
      e.target.value = ''
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage('Image must be under 8MB')
      setTimeout(() => setMessage(''), 2000)
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const img = new Image()
      img.onload = () => {
        setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
        setCropImageSrc(dataUrl)
        setCropOffset({ x: 0, y: 0 })
        setCropZoom(1)
        setShowCropModal(true)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Crop math helpers (mirrors what's drawn on screen exactly) ──
  function getScaledSize(zoom) {
    if (!imgNaturalSize.width || !imgNaturalSize.height) return { displayWidth: 0, displayHeight: 0 }
    const baseScale = Math.max(CROP_SIZE / imgNaturalSize.width, CROP_SIZE / imgNaturalSize.height)
    const scale = baseScale * zoom
    return { displayWidth: imgNaturalSize.width * scale, displayHeight: imgNaturalSize.height * scale }
  }

  function getMaxOffsets(zoom) {
    const { displayWidth, displayHeight } = getScaledSize(zoom)
    return {
      maxOffsetX: Math.max(0, (displayWidth - CROP_SIZE) / 2),
      maxOffsetY: Math.max(0, (displayHeight - CROP_SIZE) / 2)
    }
  }

  function getEventPos(e) {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    return { x: e.clientX, y: e.clientY }
  }

  function handleCropDragStart(e) {
    setDragging(true)
    const pos = getEventPos(e)
    dragStartRef.current = { x: pos.x, y: pos.y, offsetX: cropOffset.x, offsetY: cropOffset.y }
  }

  function handleCropDragMove(e) {
    if (!dragging) return
    const pos = getEventPos(e)
    const dx = pos.x - dragStartRef.current.x
    const dy = pos.y - dragStartRef.current.y
    const { maxOffsetX, maxOffsetY } = getMaxOffsets(cropZoom)
    setCropOffset({
      x: clamp(dragStartRef.current.offsetX + dx, -maxOffsetX, maxOffsetX),
      y: clamp(dragStartRef.current.offsetY + dy, -maxOffsetY, maxOffsetY)
    })
  }

  function handleCropDragEnd() {
    setDragging(false)
  }

  function handleCropCancel() {
    setShowCropModal(false)
    setCropImageSrc(null)
  }

  function handleCropApply() {
    const img = new Image()
    img.onload = () => {
      const baseScale = Math.max(CROP_SIZE / imgNaturalSize.width, CROP_SIZE / imgNaturalSize.height)
      const scale = baseScale * cropZoom
      const displayWidth = imgNaturalSize.width * scale
      const displayHeight = imgNaturalSize.height * scale
      const left = (CROP_SIZE - displayWidth) / 2 + cropOffset.x
      const top = (CROP_SIZE - displayHeight) / 2 + cropOffset.y

      const canvas = document.createElement('canvas')
      canvas.width = CROP_SIZE
      canvas.height = CROP_SIZE
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, left, top, displayWidth, displayHeight)

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
      setProfile(prev => ({ ...prev, photo: croppedDataUrl }))
      setShowCropModal(false)
      setCropImageSrc(null)
      setMessage('Photo ready — click Save Profile to apply')
      setTimeout(() => setMessage(''), 2500)
    }
    img.src = cropImageSrc
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('storage'))
    navigate('/login')
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'var(--bg3)',
    border: '1px solid var(--border)', borderRadius: '8px',
    color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  }
  const labelStyle = {
    fontSize: '12px', color: 'var(--text2)', marginBottom: '6px',
    display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em'
  }

  const cropDisplay = getScaledSize(cropZoom)
  const cropLeft = (CROP_SIZE - cropDisplay.displayWidth) / 2 + cropOffset.x
  const cropTop = (CROP_SIZE - cropDisplay.displayHeight) / 2 + cropOffset.y

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text2)', fontSize: '16px'
    }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loading profile...</motion.div>
    </div>
  )

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

        <style>{`
          .prof-nav {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 60px; border-bottom: 1px solid var(--border);
            background: var(--bg2);
          }
          .prof-nav-btns { display: flex; gap: 12px; }
          .prof-body { padding: 40px 60px; max-width: 900px; margin: 0 auto; }
          .prof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

          @media (max-width: 768px) {
            .prof-nav { padding: 12px 16px; }
            .prof-nav-btns { gap: 6px; }
            .prof-nav-btns button { padding: 6px 10px !important; font-size: 12px !important; }
            .prof-body { padding: 20px 16px; }
            .prof-grid { grid-template-columns: 1fr; gap: 16px; }
          }
        `}</style>

        {/* Navbar */}
        <motion.nav
          className="prof-nav"
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
          <div className="prof-nav-btns">
            <AnimatedButton onClick={() => navigate('/dashboard')} style={{
              padding: '8px 20px', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
            }}>Dashboard</AnimatedButton>
            <AnimatedButton onClick={() => navigate('/search')} style={{
              padding: '8px 20px', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
            }}>Search</AnimatedButton>
            <AnimatedButton danger onClick={handleLogout} style={{
              padding: '8px 20px', background: 'transparent',
              border: '1px solid #f87171', borderRadius: '8px',
              color: '#f87171', fontSize: '14px', cursor: 'pointer'
            }}>Logout</AnimatedButton>
          </div>
        </motion.nav>

        <div className="prof-body">

          {/* Header */}
          <FadeIn delay={0.1}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px'
            }}>
              <h1 style={{ fontSize: '28px' }}>
                My <span style={{ color: 'var(--accent)' }}>Profile</span>
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {message && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: '14px', color: 'var(--success)' }}
                  >{message}</motion.span>
                )}
                <AnimatedButton
                  onClick={() => editing ? saveProfile() : setEditing(true)}
                  style={{
                    padding: '8px 20px',
                    background: editing ? 'var(--success)' : 'var(--accent)',
                    border: 'none', borderRadius: '8px',
                    color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : editing ? '✅ Save Profile' : '✏️ Edit Profile'}
                </AnimatedButton>
              </div>
            </div>
          </FadeIn>

          <div className="prof-grid">

            {/* Left Column */}
            <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Avatar Card */}
              <StaggerItem>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '24px', textAlign: 'center'
                }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <motion.div
                    whileHover={{ scale: editing ? 1.08 : 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => editing && fileInputRef.current?.click()}
                    style={{
                      width: '80px', height: '80px', borderRadius: '50%',
                      background: 'var(--glow)', border: '2px solid var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '28px', margin: '0 auto 16px',
                      cursor: editing ? 'pointer' : 'default',
                      overflow: 'hidden', position: 'relative'
                    }}
                  >
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : '👤'}
                    {editing && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                        fontSize: '10px', textAlign: 'center', padding: '2px 0'
                      }}>
                        Change
                      </div>
                    )}
                  </motion.div>
                  {editing ? (
                    <input name="name" value={profile.name} onChange={handleChange}
                      style={{ ...inputStyle, textAlign: 'center', fontSize: '18px', fontWeight: '600' }} />
                  ) : (
                    <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>{profile.name}</h2>
                  )}
                  <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>
                    {profile.degree || 'No degree added yet'}
                  </p>
                </div>
              </StaggerItem>

              {/* Contact Info */}
              <StaggerItem>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '24px'
                }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>Contact Info</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: 'Email', name: 'email', type: 'email' },
                      { label: 'Phone', name: 'phone', type: 'text' },
                    ].map(field => (
                      <div key={field.name}>
                        <label style={labelStyle}>{field.label}</label>
                        {editing ? (
                          <input type={field.type} name={field.name} value={profile[field.name]}
                            onChange={handleChange} style={inputStyle} />
                        ) : (
                          <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                            {profile[field.name] || 'Not added yet'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* Right Column */}
            <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Academic Info */}
              <StaggerItem>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '24px'
                }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>Academic Info</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: 'College', name: 'college' },
                      { label: 'Degree', name: 'degree' },
                      { label: 'Year', name: 'year' },
                    ].map(field => (
                      <div key={field.name}>
                        <label style={labelStyle}>{field.label}</label>
                        {editing ? (
                          <input type="text" name={field.name} value={profile[field.name]}
                            onChange={handleChange} style={inputStyle} />
                        ) : (
                          <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                            {profile[field.name] || 'Not added yet'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>

              {/* Skills */}
              <StaggerItem>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '24px'
                }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>Skills</h3>
                  {editing && (
                    <input
                      type="text" placeholder="Type a skill and press Enter"
                      style={{ ...inputStyle, marginBottom: '12px' }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const skill = e.target.value.trim()
                          if (!profile.skills.includes(skill))
                            setProfile({ ...profile, skills: [...profile.skills, skill] })
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
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          style={{
                            padding: '6px 12px', background: 'var(--bg3)',
                            border: '1px solid var(--accent)', borderRadius: '20px',
                            fontSize: '13px', color: 'var(--accent2)',
                            display: 'flex', alignItems: 'center', gap: '6px'
                          }}
                        >
                          {skill}
                          {editing && (
                            <span
                              onClick={() => setProfile({ ...profile, skills: profile.skills.filter((_, j) => j !== i) })}
                              style={{ cursor: 'pointer', opacity: 0.6, fontSize: '14px' }}
                            >×</span>
                          )}
                        </motion.span>
                      ))
                    )}
                  </div>
                </div>
              </StaggerItem>

              {/* Bio */}
              <StaggerItem>
                <div style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '24px'
                }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>Bio</h3>
                  {editing ? (
                    <textarea name="bio" value={profile.bio} onChange={handleChange} rows={4}
                      style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} />
                  ) : (
                    <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.7' }}>
                      {profile.bio || 'No bio added yet'}
                    </p>
                  )}
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* Resume Section */}
          <FadeIn delay={0.3}>
            <div style={{
              marginTop: '24px', background: 'var(--bg2)',
              border: '1px solid var(--border)', borderRadius: '12px',
              padding: '24px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>Resume</h3>
                <p style={{ fontSize: '13px', color: 'var(--text2)' }}>Upload your resume for AI matching</p>
              </div>
              <AnimatedButton onClick={() => navigate('/resume')} style={{
                padding: '10px 20px', background: 'var(--accent)',
                border: 'none', borderRadius: '8px',
                color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}>Update Resume →</AnimatedButton>
            </div>
          </FadeIn>
        </div>

        {/* Crop Modal */}
        {showCropModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '24px', width: '340px', maxWidth: '100%'
              }}
            >
              <h3 style={{ fontSize: '16px', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>
                Reposition Photo
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '16px' }}>
                Drag to move, use the slider to zoom
              </p>

              <div
                onMouseDown={handleCropDragStart}
                onMouseMove={handleCropDragMove}
                onMouseUp={handleCropDragEnd}
                onMouseLeave={handleCropDragEnd}
                onTouchStart={handleCropDragStart}
                onTouchMove={handleCropDragMove}
                onTouchEnd={handleCropDragEnd}
                style={{
                  width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px`, maxWidth: '100%',
                  borderRadius: '50%', overflow: 'hidden', position: 'relative',
                  margin: '0 auto 20px', background: '#000',
                  cursor: dragging ? 'grabbing' : 'grab',
                  border: '2px solid var(--accent)', touchAction: 'none'
                }}
              >
                {cropImageSrc && (
                  <img
                    src={cropImageSrc}
                    alt="Crop preview"
                    draggable={false}
                    style={{
                      position: 'absolute',
                      left: `${cropLeft}px`,
                      top: `${cropTop}px`,
                      width: `${cropDisplay.displayWidth}px`,
                      height: `${cropDisplay.displayHeight}px`,
                      maxWidth: 'none',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                )}
              </div>

              <label style={{ ...labelStyle, textAlign: 'center', display: 'block' }}>Zoom</label>
              <input
                type="range" min="1" max="3" step="0.01"
                value={cropZoom}
                onChange={e => setCropZoom(parseFloat(e.target.value))}
                style={{ width: '100%', marginBottom: '20px' }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleCropCancel} style={{
                  flex: 1, padding: '10px', background: 'transparent',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
                }}>Cancel</button>
                <button onClick={handleCropApply} style={{
                  flex: 1, padding: '10px', background: 'var(--accent)',
                  border: 'none', borderRadius: '8px',
                  color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}>Apply</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default Profile
