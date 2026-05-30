import { motion } from 'framer-motion'

export function AnimatedCard({ children, style, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      style={style}
      whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedButton({ children, style, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      style={style}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}

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