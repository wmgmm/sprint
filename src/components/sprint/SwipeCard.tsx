import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORY_COLOR } from '../../data/categories';
import { useHaptics } from '../../hooks/useHaptics';
import { SWIPE_VELOCITY_THRESHOLD, SWIPE_OFFSET_THRESHOLD } from '../../lib/constants';

export function SwipeCard() {
  const { shuffledCases, currentCardIndex, swipeRight, swipeLeft } = useAppStore();
  const card = shuffledCases[currentCardIndex];
  const nextCard = shuffledCases[currentCardIndex + 1];
  const { pulse } = useHaptics();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [key, setKey] = useState(0);

  // Border glow: red left, green right
  const borderColor = useTransform(
    x,
    [-80, 0, 80],
    ['rgba(255,59,48,0.5)', 'rgba(0,0,0,0.06)', 'rgba(52,199,89,0.5)']
  );

  const commitSwipe = (direction: 'left' | 'right') => {
    const target = direction === 'right' ? 500 : -500;
    animate(x, target, { type: 'tween', duration: 0.25 }).then(() => {
      if (direction === 'right') {
        pulse(10);
        swipeRight();
      } else {
        swipeLeft();
      }
      x.set(0);
      setKey(k => k + 1);
    });
  };

  const bind = useDrag(
    ({ movement: [mx], velocity: [vx], last, cancel }) => {
      if (!last) { x.set(mx); setIsDragging(true); return; }
      setIsDragging(false);
      if (Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD || Math.abs(mx) > SWIPE_OFFSET_THRESHOLD) {
        commitSwipe(mx > 0 ? 'right' : 'left');
      } else {
        animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
      }
      void cancel;
    },
    { axis: 'x', filterTaps: true, preventScrollAxis: 'y' }
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') commitSwipe('right');
      if (e.key === 'ArrowLeft')  commitSwipe('left');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentCardIndex]);

  if (!card) return null;

  const catColor = CATEGORY_COLOR[card.cat];

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Direction hints */}
      <div className="flex justify-between w-full px-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--apple-red)' }}>SKIP</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--apple-green)' }}>SAVE</span>
      </div>

      <div className="relative w-full" style={{ height: 400 }}>
        {/* Next card shadow */}
        {nextCard && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-card)',
              transform: 'scale(0.95) translateY(10px)',
              opacity: 0.6,
            }}
          />
        )}

        {/* Main swipe card */}
        <motion.div
          key={key}
          {...(bind() as object)}
          style={{
            x, rotate, opacity,
            borderColor,
            borderWidth: isDragging ? '2px' : '1px',
            borderStyle: 'solid',
            boxShadow: isDragging ? 'none' : 'var(--shadow-card-hover)',
          }}
          className="absolute inset-0 rounded-2xl p-6 flex flex-col cursor-grab active:cursor-grabbing select-none"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...{ style: { x, rotate, opacity, borderColor: (borderColor as any), borderWidth: isDragging ? '2px' : '1px', borderStyle: 'solid', background: 'var(--bg-card)', boxShadow: isDragging ? 'none' : 'var(--shadow-card-hover)' } } as object}
        >
          {/* Card number + category */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#{card.id}</span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}33` }}
            >
              {card.cat}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold mb-2 leading-tight" style={{ color: 'var(--text-primary)' }}>
            {card.title}
          </h2>

          {/* Description */}
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {card.desc}
          </p>

          {/* Prompt block - grows to fill remaining space */}
          <div
            className="rounded-xl p-3 flex-1 flex flex-col min-h-0"
            style={{ background: 'var(--bg-page)' }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-1.5 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              Prompt
            </p>
            <p className="text-xs font-mono leading-relaxed overflow-auto flex-1" style={{ color: 'var(--text-primary)' }}>
              {card.prompt}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Manual buttons */}
      <div className="flex gap-4 mt-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => commitSwipe('left')}
          aria-label="Skip"
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
          style={{ background: 'rgba(255,59,48,0.10)', border: '1px solid rgba(255,59,48,0.25)', color: 'var(--apple-red)' }}
        >
          ✕
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => commitSwipe('right')}
          aria-label="Save"
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
          style={{ background: 'rgba(52,199,89,0.12)', border: '1px solid rgba(52,199,89,0.3)', color: 'var(--apple-green)' }}
        >
          ✓
        </motion.button>
      </div>
    </div>
  );
}
