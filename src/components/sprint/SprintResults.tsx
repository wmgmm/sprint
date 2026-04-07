import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORY_COLOR } from '../../data/categories';
import { ExportButton } from '../shared/ExportButton';

export function SprintResults() {
  const { savedCases, setView, setShowCtaModal, initSprint } = useAppStore();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const topCat = savedCases.length > 0
    ? Object.entries(
        savedCases.reduce((acc, uc) => { acc[uc.cat] = (acc[uc.cat] || 0) + 1; return acc; }, {} as Record<string, number>)
      ).sort(([, a], [, b]) => b - a)[0]?.[0]
    : null;

  const copyPrompt = (id: number, prompt: string) => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen px-5 py-8"
      style={{ background: 'var(--bg-page)', paddingTop: 'max(32px, env(safe-area-inset-top))' }}
    >
      <div className="max-w-lg mx-auto">
        {/* Stats */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Sprint Complete!
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Here's your AI toolkit</p>

          <div className="flex justify-center gap-4 mt-6">
            <div className="card px-6 py-4 text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{savedCases.length}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Saved</p>
            </div>
            {topCat && (
              <div className="card px-6 py-4 text-center">
                <p className="text-lg font-bold" style={{ color: CATEGORY_COLOR[topCat as keyof typeof CATEGORY_COLOR] }}>
                  {topCat}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Top Category</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <ExportButton />
          <button
            onClick={initSprint}
            className="flex-1 rounded-full py-3 text-sm font-semibold transition-colors"
            style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            Sprint Again
          </button>
        </div>

        {/* Saved list */}
        {savedCases.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
            <p className="text-4xl mb-3">🌱</p>
            <p>No prompts saved this time. Try again!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {savedCases.map((uc, i) => (
              <motion.div
                key={uc.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${CATEGORY_COLOR[uc.cat]}18`, color: CATEGORY_COLOR[uc.cat] }}
                  >
                    {uc.cat}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{uc.title}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{uc.desc}</p>
                <div className="rounded-xl p-3 flex items-start justify-between gap-2" style={{ background: 'var(--bg-page)' }}>
                  <p className="text-xs font-mono leading-relaxed flex-1" style={{ color: 'var(--text-primary)' }}>{uc.prompt}</p>
                  <button
                    onClick={() => copyPrompt(uc.id, uc.prompt)}
                    className="text-xs font-medium shrink-0 transition-colors px-2 py-1.5 rounded-lg"
                    style={{ color: copiedId === uc.id ? 'var(--apple-green)' : 'var(--apple-blue)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {copiedId === uc.id ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10 mb-4">
          <button
            onClick={() => setShowCtaModal(true)}
            className="text-xs underline transition-colors"
            style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            About The Matts / Train Your Team
          </button>
        </div>
        <button
          onClick={() => setView('landing')}
          className="w-full py-3 text-xs transition-colors"
          style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Back to home
        </button>
      </div>
    </motion.div>
  );
}
