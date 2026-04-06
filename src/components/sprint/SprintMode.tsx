import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { GlassHeader } from '../layout/GlassHeader';
import { SwipeCard } from './SwipeCard';
import { useTimer } from '../../hooks/useTimer';

export function SprintMode() {
  useTimer();
  const { shuffledCases, currentCardIndex } = useAppStore();
  const remaining = shuffledCases.length - currentCardIndex;

  return (
    <motion.div
      key="sprint"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-page)' }}
    >
      <GlassHeader />

      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-20 pb-8">
        {remaining > 0 ? (
          <>
            <p className="text-xs mb-6" style={{ color: 'var(--text-tertiary)' }}>
              {remaining} remaining
            </p>
            <SwipeCard />
          </>
        ) : (
          <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
            <p className="text-4xl mb-3">✓</p>
            <p>All cards reviewed!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
