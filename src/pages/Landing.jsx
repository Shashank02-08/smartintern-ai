import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedButton, FadeIn } from '../components/AnimatedCard'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 60px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)'
        }}
      >
        <div style={{ fontFamily: 'Space Mono', fontSize: '20px', color: 'var(--accent)' }}>
          SmartIntern<span style={{ color: 'var(--text)' }}>AI</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <AnimatedButton onClick={() => navigate('/login')} style={{
            padding: '8px 20px', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text)', fontSize: '14px'
          }}>
            Login
          </AnimatedButton>
          <AnimatedButton onClick={() => navigate('/register')} style={{
            padding: '8px 20px', background: 'var(--accent)',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '14px'
          }}>
            Get Started
          </AnimatedButton>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 20px',
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, var(--bg) 70%)'
      }}>

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
          <h1 style={{ fontSize: '56px', lineHeight: '1.1', marginBottom: '24px', maxWidth: '700px' }}>
            Find Internships That <span style={{ color: 'var(--accent)' }}>Match Your Skills</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p style={{
            fontSize: '18px', color: 'var(--text2)', maxWidth: '500px',
            lineHeight: '1.7', marginBottom: '40px'
          }}>
            Upload your resume and let our AI find the perfect internship for you.
            Get match scores, skill gap analysis and career guidance.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <AnimatedButton onClick={() => navigate('/register')} style={{
              padding: '14px 32px', background: 'var(--accent)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '16px', fontWeight: '600',
              boxShadow: '0 0 30px var(--glow)'
            }}>
              Get Started Free →
            </AnimatedButton>
            <AnimatedButton onClick={() => navigate('/search')} style={{
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
      <div style={{
        padding: '80px 60px', background: 'var(--bg2)',
        borderTop: '1px solid var(--border)'
      }}>
        <FadeIn>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '48px' }}>
            Why <span style={{ color: 'var(--accent)' }}>SmartIntern AI?</span>
          </h2>
        </FadeIn>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px', maxWidth: '900px', margin: '0 auto'
        }}>
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
      <footer style={{
        padding: '20px 60px', borderTop: '1px solid var(--border)',
        background: 'var(--bg2)', textAlign: 'center',
        color: 'var(--text3)', fontSize: '13px'
      }}>
        © 2026 SmartIntern AI — Built for PM Internship Scheme
      </footer>

    </div>
  )
}

export default Landing