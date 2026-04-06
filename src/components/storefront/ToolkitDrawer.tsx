import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORY_COLOR } from '../../data/categories';
import { ExportButton } from '../shared/ExportButton';

export function ToolkitDrawer() {
  const { isToolkitOpen, setToolkitOpen, savedCases, removeFromToolkit } = useAppStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setToolkitOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setToolkitOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isToolkitOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isToolkitOpen]);

  return (
    <AnimatePresence>
      {isToolkitOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setToolkitOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-sm"
            style={{
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-drawer)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            aria-label="Your Toolkit"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Your Toolkit
                </h2>
                {savedCases.length > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--apple-blue)', color: '#fff' }}
                  >
                    {savedCases.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setToolkitOpen(false)}
                aria-label="Close toolkit"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18, padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {savedCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <p className="text-3xl mb-3">🧰</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Your toolkit is empty</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Add prompts from the grid to get started</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {savedCases.map(uc => (
                    <motion.div
                      key={uc.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="rounded-xl p-3.5 flex flex-col gap-1.5"
                      style={{ background: 'var(--bg-page)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                              style={{
                                background: `${CATEGORY_COLOR[uc.cat]}18`,
                                color: CATEGORY_COLOR[uc.cat],
                              }}
                            >
                              {uc.cat}
                            </span>
                          </div>
                          <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                            {uc.title}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromToolkit(uc.id)}
                          aria-label={`Remove ${uc.title}`}
                          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{ background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11 }}
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs font-mono leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {uc.prompt}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with export */}
            <div
              className="px-4 py-4"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div className="flex gap-2">
                <ExportButton />
              </div>
              {savedCases.length > 0 && (
                <button
                  onClick={() => { savedCases.forEach(uc => useAppStore.getState().removeFromToolkit(uc.id)); }}
                  className="w-full mt-2 text-xs py-2 transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                >
                  Clear all
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
