import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useCases } from '../../data/useCases';
import { CategoryPills } from '../layout/CategoryPills';
import { PromptCard } from './PromptCard';
import { ToolkitDrawer } from './ToolkitDrawer';

export function Storefront() {
  const { setView, searchQuery, setSearchQuery, activeFilters, savedCases, setToolkitOpen, setShowCtaModal } = useAppStore();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return useCases.filter(uc => {
      const matchesCat = activeFilters.size === 0 || activeFilters.has(uc.cat);
      const matchesSearch = !q || uc.title.toLowerCase().includes(q) || uc.desc.toLowerCase().includes(q) || uc.prompt.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, activeFilters]);

  return (
    <motion.div
      key="browse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 glass px-4 py-3"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
      >
        {/* Top row: back + title + toolkit button */}
        <div className="flex items-center justify-between mb-3 max-w-6xl mx-auto">
          <button
            onClick={() => setView('landing')}
            className="text-sm font-medium transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--apple-blue)' }}
            aria-label="Back to home"
          >
            ← Home
          </button>

          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            AI Prompt Library
          </h1>

          {/* Toolkit / basket button */}
          <button
            onClick={() => setToolkitOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
            style={{ background: 'var(--apple-blue)', color: '#fff', border: 'none', cursor: 'pointer' }}
            aria-label={`Open toolkit (${savedCases.length} saved)`}
          >
            🧰 Toolkit
            {savedCases.length > 0 && (
              <motion.span
                key={savedCases.length}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#fff', color: 'var(--apple-blue)' }}
              >
                {savedCases.length}
              </motion.span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-3 max-w-6xl mx-auto">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none"
            style={{ color: 'var(--text-tertiary)' }}
          >
            🔍
          </span>
          <input
            type="search"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none"
            style={{
              background: 'rgba(0,0,0,0.06)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
            aria-label="Search prompts"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="max-w-6xl mx-auto">
          <CategoryPills />
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-1">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {filtered.length} prompt{filtered.length !== 1 ? 's' : ''}
          {(searchQuery || activeFilters.size > 0) ? ' found' : ' available'}
        </p>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-24 pt-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No prompts found</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))' }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(uc => (
                <PromptCard key={uc.id} uc={uc} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 py-3 text-center"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => setShowCtaModal(true)}
          className="text-xs transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
        >
          About The Matts / Train Your Team
        </button>
      </div>

      {/* Toolkit drawer */}
      <ToolkitDrawer />
    </motion.div>
  );
}
