import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useCases } from '../../data/useCases';
import { CATEGORIES } from '../../data/categories';

export function LandingPage() {
  const { initSprint, setView } = useAppStore();

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col min-h-screen px-6"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Centred content grows to fill available space */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
        {/* Category dots */}
        <div className="flex gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: cat.color }}
            />
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold mb-3"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: "'Inter', sans-serif" }}
        >
          The Matts AI Discovery Sprint
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-lg max-w-xs mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {useCases.length} AI use cases. 5 minutes. Your AI toolkit, built.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm max-w-sm mb-10"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Swipe right to save, left to skip. Or browse all prompts at your own pace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={initSprint}
            className="btn-primary px-8 py-3.5 text-sm"
            style={{ boxShadow: '0 2px 12px rgba(0, 113, 227, 0.35)' }}
          >
            Start 5-Minute Sprint
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setView('browse')}
            className="btn-secondary px-8 py-3.5 text-sm"
          >
            Browse Prompts
          </motion.button>
        </motion.div>
      </div>

      {/* Footer sits naturally below content - never overlaps */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-xs text-center pb-8"
        style={{
          color: 'var(--text-tertiary)',
          paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
        }}
      >
        Created by Dr. Matt Mort & Mr. Matt Hayden · Cardiff University
      </motion.p>
    </motion.div>
  );
}
