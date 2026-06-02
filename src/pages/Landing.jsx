import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedButton, FadeIn } from '../components/AnimatedCard'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Responsive styles injected once ── */}
      <style>{`
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 60px;
          border-bottom: 1px solid var(--border);
          background: var(--bg2);
        }
        .landing-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          background: radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%);
        }
        .hero-title {
          font-size: 56px;
          line-height: 1.1;
          margin-bottom: 24px;
          max-width: 700px;
        }
        .hero-subtitle {
          font-size: 18px;
          color: var(--text2);
          max-width: 500px;
          line-height: 1.7;
          margin-bottom: 40px;
        }
        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero-btn-primary {
          padding: 14px 32px;
          background: var(--accent);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 0 30px var(--glow);
        }
        .hero-btn-secondary {
          padding: 14px 32px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-size: 16px;
        }
        .features-section {
          padding: 80px 60px;
          background: var(--bg2);
          border-top: 1px solid var(--border);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        .landing-footer {
          padding: 20px 60px;
          border-top: 1px solid var(--border);
          background: var(--bg2);
          text-align: center;
          color: var(--text3);
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .landing-nav {
            padding: 14px 20px;
          }
          .landing-nav .nav-logo {
            font-size: 16px !important;
          }
          .landing-nav .nav-btn {
            padding: 7px 14px !important;
            font-size: 13px !important;
          }
          .landing-hero {
            padding: 50px 20px;
          }
          .hero-title {
            font-size: 34px;
            line-height: 1.15;
            margin-bottom: 16px;
          }
          .hero-subtitle {
            font-size: 15px;
            margin-bottom: 28px;
          }
          .hero-btn-primary, .hero-btn-secondary {
            padding: 12px 22px;
            font-size: 15px;
            width: 100%;
            text-align: center;
          }
          .hero-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
          }
          .features-section {
            padding: 50px 20px;
          }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .landing-footer {
            padding: 16px 20px;
            font-size: 12px;
          }
        }
      `}</style>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="landing-nav"
      >
        <div className="nav-logo" style={{ fontFamily: 'Space Mono', fontSize: '20px', color: 'var(--accent)' }}>
          SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <AnimatedButton onClick={() => navigate('/login')} className="nav-btn" style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text)', fontSize: '14px'
          }}>
            Login
          </AnimatedButton>
          <AnimatedButton onClick={() => navigate('/register')} className="nav-btn" style={{
            padding: '8px 20px', background: 'var(--accent)',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '14px'
          }}>
            Get Started
          </AnimatedButton>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="landing-hero">

        <FadeIn delay={0.1}>
          <div style={{
            display: 'inline-block', padding: '6px 16px',
            background: 'var(--glow)', border: '1px solid var(--accent)',
            borderRadius: '20px', fontSize: '13px', color: 'var(--accent2)',
            marginBottom: '24px'
          }}>
            ✦ AI Powered Internship Matching
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="hero-title">
            Find Internships That <span style={{ color: 'var(--accent)' }}>Match Your Skills</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="hero-subtitle">
            Upload your resume and let our AI find the perfect internship for you.
            Get match scores, skill gap analysis and career guidance.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="hero-buttons">
            <AnimatedButton onClick={() => navigate('/register')} className="hero-btn-primary" style={{
              padding: '14px 32px', background: 'var(--accent)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '16px', fontWeight: '600',
              boxShadow: '0 0 30px var(--glow)'
            }}>
              Get Started Free →
            </AnimatedButton>
            <AnimatedButton onClick={() => navigate('/search')} className="hero-btn-secondary" style={{
              padding: '14px 32px', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '10px',
              color: 'var(--text)', fontSize: '16px'
            }}>
              Browse Internships
            </AnimatedButton>
          </div>
        </FadeIn>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <FadeIn>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '48px' }}>
            Why <span style={{ color: 'var(--accent)' }}>SmartIntern AI?</span>
          </h2>
        </FadeIn>

        <div className="features-grid">
          {[
            { icon: '🧠', title: 'AI Resume Analysis', desc: 'Our AI reads your resume and extracts your skills automatically' },
            { icon: '🎯', title: 'Smart Matching', desc: 'Get matched to internships that actually fit your profile' },
            { icon: '📈', title: 'Skill Gap Analysis', desc: 'Know exactly what skills you need to land your dream internship' }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
              style={{
                padding: '28px', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: '12px',
                textAlign: 'center', cursor: 'default'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Space Grotesk' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.6' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        © 2026 SmartIntern AI — Built for PM Internship Scheme
      </footer>

    </div>
  )
}

export default Landing
