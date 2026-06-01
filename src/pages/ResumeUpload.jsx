import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKEND = 'https://smartintern-backend-j6gf.onrender.com'

function ResumeUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState('')

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
    const dropped = e.dataTransfer.files[0]
    handleFile(dropped)
  }

  async function handleUpload() {
    if (!file) return

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const res = await fetch(`${BACKEND}/api/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      setUploaded(true)

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)',
      display: 'flex', flexDirection: 'column'
    }}>

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
        <button onClick={() => navigate('/dashboard')} style={{
          padding: '8px 20px', background: 'transparent',
          border: '1px solid var(--border)', borderRadius: '8px',
          color: 'var(--text)', fontSize: '14px', cursor: 'pointer'
        }}>
          Skip for now →
        </button>
      </nav>

      {/* Main Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 20px'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>
            Upload Your <span style={{ color: 'var(--accent)' }}>Resume</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '16px' }}>
            Our AI will analyze your resume and match you with the best internships
          </p>
        </div>

        {!uploaded ? (
          <div style={{ width: '100%', maxWidth: '500px' }}>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
              style={{
                border: `2px dashed ${dragging ? 'var(--accent)' : file ? 'var(--success)' : 'var(--border)'}`,
                borderRadius: '16px', padding: '60px 40px',
                textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'var(--glow)' : 'var(--bg2)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {file ? '📄' : '☁️'}
              </div>
              <p style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text)' }}>
                {file ? file.name : 'Drag & drop your resume here'}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'or click to browse — PDF only'}
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
                {error}
              </p>
            )}

            {/* Upload Button */}
            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  width: '100%', padding: '14px',
                  background: uploading ? 'var(--bg3)' : 'var(--accent)',
                  border: 'none', borderRadius: '10px',
                  color: '#fff', fontSize: '16px', fontWeight: '600',
                  marginTop: '20px', cursor: uploading ? 'not-allowed' : 'pointer',
                  boxShadow: uploading ? 'none' : '0 0 20px var(--glow)',
                  transition: 'all 0.2s'
                }}
              >
                {uploading ? '🔍 Analyzing Resume...' : 'Upload & Analyze →'}
              </button>
            )}

          </div>
        ) : (

          /* Success State */
          <div style={{
            textAlign: 'center', maxWidth: '400px',
            background: 'var(--bg2)', border: '1px solid var(--success)',
            borderRadius: '16px', padding: '48px'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--success)' }}>
              Resume Uploaded!
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '32px' }}>
              Your resume has been analyzed successfully. Let's find your perfect internship!
            </p>
            <button onClick={() => navigate('/dashboard')} style={{
              width: '100%', padding: '13px',
              background: 'var(--accent)', border: 'none',
              borderRadius: '8px', color: '#fff',
              fontSize: '15px', fontWeight: '600',
              boxShadow: '0 0 20px var(--glow)'
            }}>
              View My Matches →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeUpload