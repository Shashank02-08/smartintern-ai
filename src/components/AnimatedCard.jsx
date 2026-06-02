import { motion } from 'framer-motion'

// ── Animated card with hover lift + border glow ──
export function AnimatedCard({ children, style, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      style={style}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, borderColor: 'var(--accent)', boxShadow: '0 0 20px rgba(99,102,241,0.15)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// ── Animated button with scale + glow ──
export function AnimatedButton({ children, style, onClick, className, danger }) {
  return (
    <motion.button
      onClick={onClick}
      style={style}
      className={className}
      whileHover={{
        scale: 1.06,
        boxShadow: danger
          ? '0 0 16px rgba(248,113,113,0.4)'
          : '0 0 16px rgba(99,102,241,0.35)'
      }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}

// ── Fade in from below with optional delay ──
export function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Staggered container — children animate in one by one ──
export function StaggerContainer({ children, style }) {
  return (
    <motion.div
      style={style}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } }
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger child — use inside StaggerContainer ──
export function StaggerItem({ children, style }) {
  return (
    <motion.div
      style={style}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Page wrapper — smooth fade+slide on mount ──
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ── Stat card with pop-in animation ──
export function StatCard({ children, style, index = 0 }) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04, boxShadow: '0 0 18px rgba(99,102,241,0.12)' }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      {children}
    </motion.div>
  )
}
