import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from '../components/AnimatedCard'

const BACKEND = 'https://smartintern-backend-j6gf.onrender.com'

function ResumeUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState('')
  const [showPdf, setShowPdf] = useState(true)
  // Store blob URL in state — only created once after upload, never auto-triggers download
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

  function handleFile(selectedFile) {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please upload a PDF file only')
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function handleUpload() {
    if (!file) return
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const res = await fetch(`${BACKEND}/api/resume/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Upload failed'); return }

      // Create blob URL only now — after successful upload, stored in state
      const url = URL.createObjectURL(file)
      setPdfBlobUrl(url)
      setUploaded(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Programmatic download — never auto-triggers
  function handleDownload() {
    if (!pdfBlobUrl) return
    const a = document.createElement('a')
    a.href = pdfBlobUrl
    a.download = file?.name || 'resume.pdf'
    a.click()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)',
      display: 'flex', flexDirection: 'column'
    }}>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 60px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)'
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ fontFamily: 'Space Mono', fontSize: '20px', color: 'var(--accent)', cursor: 'pointer' }}
        >
          SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
        </div>
        <AnimatedButton
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
          }}
        >
          Skip for now →
        </AnimatedButton>
      </motion.nav>

      {/* Main Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 20px'
      }}>
        <AnimatePresence mode="wait">
          {!uploaded ? (
            /* ── Upload State ── */
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ textAlign: 'center', marginBottom: '48px' }}
              >
                <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>
                  Upload Your <span style={{ color: 'var(--accent)' }}>Resume</span>
                </h1>
                <p style={{ color: 'var(--text2)', fontSize: '16px' }}>
                  Our AI will analyze your resume and match you with the best internships
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ width: '100%' }}
              >
                <motion.div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                  animate={{
                    borderColor: dragging ? 'var(--accent)' : file ? 'var(--success)' : 'var(--border)',
                    background: dragging ? 'rgba(99,102,241,0.07)' : 'var(--bg2)',
                    boxShadow: dragging
                      ? '0 0 24px rgba(99,102,241,0.18)'
                      : file ? '0 0 16px rgba(34,197,94,0.1)' : 'none'
                  }}
                  whileHover={{ borderColor: 'var(--accent)', boxShadow: '0 0 20px rgba(99,102,241,0.13)', scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '16px', padding: '60px 40px',
                    textAlign: 'center', cursor: 'pointer',
                  }}
                >
                  <motion.div
                    key={file ? 'file' : 'empty'}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
                    style={{ fontSize: '48px', marginBottom: '16px' }}
                  >
                    {file ? '📄' : '☁️'}
                  </motion.div>
                  <p style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text)' }}>
                    {file ? file.name : 'Drag & drop your resume here'}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'or click to browse — PDF only'}
                  </p>
                  <input
                    id="file-input" type="file" accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: '#f87171', fontSize: '13px', marginTop: '12px', textAlign: 'center', width: '100%' }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {file && (
                  <motion.div
                    key="upload-btn"
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ width: '100%', marginTop: '20px' }}
                  >
                    <AnimatedButton
                      onClick={handleUpload}
                      disabled={uploading}
                      style={{
                        width: '100%', padding: '14px',
                        background: uploading ? 'var(--bg3)' : 'var(--accent)',
                        border: 'none', borderRadius: '10px',
                        color: '#fff', fontSize: '16px', fontWeight: '600',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        boxShadow: uploading ? 'none' : '0 0 20px var(--glow)',
                        opacity: uploading ? 0.75 : 1
                      }}
                    >
                      {uploading ? '🔍 Analyzing Resume...' : 'Upload & Analyze →'}
                    </AnimatedButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          ) : (
            /* ── Success + PDF Viewer State ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{ width: '100%', maxWidth: '860px' }}
            >
              {/* Success Header Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1, type: 'spring', bounce: 0.25 }}
                style={{
                  background: 'var(--bg2)', border: '1px solid var(--success)',
                  borderRadius: '16px', padding: '24px 28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: '16px',
                  boxShadow: '0 0 32px rgba(34,197,94,0.08)',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, type: 'spring', bounce: 0.5 }}
                    style={{ fontSize: '36px' }}
                  >
                    ✅
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.35 }}
                      style={{ fontSize: '18px', color: 'var(--success)', marginBottom: '4px' }}
                    >
                      Resume Uploaded Successfully!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.35 }}
                      style={{ color: 'var(--text2)', fontSize: '12px' }}
                    >
                      {file?.name} • {(file?.size / 1024).toFixed(1)} KB • Text extracted ✓
                    </motion.p>
                  </div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.35 }}
                  style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
                >
                  <AnimatedButton
                    onClick={() => setShowPdf(p => !p)}
                    style={{
                      padding: '8px 16px', background: 'transparent',
                      border: '1px solid var(--border)', borderRadius: '8px',
                      color: 'var(--text)', fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    {showPdf ? '🙈 Hide PDF' : '👁 View PDF'}
                  </AnimatedButton>

                  {/* Download via button click only — no <a> tag */}
                  <AnimatedButton
                    onClick={handleDownload}
                    style={{
                      padding: '8px 16px', background: 'transparent',
                      border: '1px solid var(--accent)', borderRadius: '8px',
                      color: 'var(--accent)', fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    ⬇ Download
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={() => navigate('/dashboard')}
                    style={{
                      padding: '8px 16px', background: 'var(--accent)',
                      border: 'none', borderRadius: '8px',
                      color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      boxShadow: '0 0 16px var(--glow)'
                    }}
                  >
                    View My Matches →
                  </AnimatedButton>
                </motion.div>
              </motion.div>

              {/* Embedded PDF Viewer */}
              <AnimatePresence>
                {showPdf && pdfBlobUrl && (
                  <motion.div
                    key="pdf-viewer"
                    initial={{ opacity: 0, scaleY: 0.95, originY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      borderRadius: '16px', overflow: 'hidden'
                    }}
                  >
                    {/* Toolbar */}
                    <div style={{
                      padding: '11px 20px', borderBottom: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      background: 'var(--bg3)'
                    }}>
                      <span style={{ fontSize: '14px' }}>📄</span>
                      <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{file?.name}</span>
                      <span style={{
                        marginLeft: 'auto', fontSize: '11px', color: 'var(--accent)',
                        background: 'var(--glow)', padding: '3px 10px',
                        borderRadius: '20px', border: '1px solid var(--accent)'
                      }}>
                        PDF Preview
                      </span>
                    </div>

                    {/* ✅ <object> instead of <iframe> — renders blob PDFs correctly in all browsers */}
                    <object
                      data={pdfBlobUrl}
                      type="application/pdf"
                      style={{
                        width: '100%', height: '640px',
                        display: 'block', background: '#fff'
                      }}
                    >
                      {/* Fallback if browser can't embed */}
                      <div style={{
                        height: '200px', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '12px',
                        color: 'var(--text2)', fontSize: '14px'
                      }}>
                        <span style={{ fontSize: '32px' }}>📄</span>
                        <p>Your browser can't preview PDFs inline.</p>
                        <AnimatedButton onClick={handleDownload} style={{
                          padding: '8px 20px', background: 'var(--accent)',
                          border: 'none', borderRadius: '8px', color: '#fff',
                          fontSize: '13px', cursor: 'pointer'
                        }}>
                          ⬇ Download to View
                        </AnimatedButton>
                      </div>
                    </object>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ResumeUpload
