import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORIES } from '../../data/categories';
import type { Category } from '../../data/useCases';

export function CategoryPills() {
  const { activeFilters, toggleFilter } = useAppStore();

  const clearAll = () => {
    activeFilters.forEach(cat => toggleFilter(cat));
  };

  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
      <motion.button
        layout
        whileTap={{ scale: 0.94 }}
        onClick={clearAll}
        className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
        style={{
          background: activeFilters.size === 0 ? 'var(--text-primary)' : 'rgba(0,0,0,0.06)',
          color: activeFilters.size === 0 ? '#fff' : 'var(--text-secondary)',
          border: 'none',
        }}
      >
        All
      </motion.button>

      {CATEGORIES.map(cat => {
        const active = activeFilters.has(cat.name as Category);
        return (
          <motion.button
            layout
            key={cat.name}
            whileTap={{ scale: 0.94 }}
            onClick={() => toggleFilter(cat.name as Category)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: active ? `${cat.color}18` : 'rgba(0,0,0,0.06)',
              color: active ? cat.color : 'var(--text-secondary)',
              border: active ? `1px solid ${cat.color}44` : '1px solid transparent',
            }}
          >
            {cat.name}
          </motion.button>
        );
      })}
    </div>
  );
}
