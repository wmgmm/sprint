import { useState } from 'react';
import { motion } from 'framer-motion';
import type { UseCase } from '../../data/useCases';
import { CATEGORY_COLOR } from '../../data/categories';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  uc: UseCase;
}

export function PromptCard({ uc }: Props) {
  const { savedCases, addToToolkit } = useAppStore();
  const [copied, setCopied] = useState(false);
  const isSaved = savedCases.some(s => s.id === uc.id);
  const catColor = CATEGORY_COLOR[uc.cat];

  const handleAdd = () => {
    if (!isSaved) addToToolkit(uc);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(uc.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="card flex flex-col p-5 h-full"
    >
      {/* Category + number */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: `${catColor}18`, color: catColor }}
        >
          {uc.cat}
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#{uc.id}</span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold mb-1.5 leading-snug" style={{ color: 'var(--text-primary)' }}>
        {uc.title}
      </h3>

      {/* Description */}
      <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
        {uc.desc}
      </p>

      {/* Prompt preview */}
      <div
        className="rounded-xl p-3 mb-4 relative group"
        style={{ background: 'var(--bg-page)' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
          Prompt
        </p>
        <p className="text-xs font-mono leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary)' }}>
          {uc.prompt}
        </p>
        <button
          onClick={copyPrompt}
          className="absolute top-3 right-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: copied ? 'var(--apple-green)' : 'var(--apple-blue)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>

      {/* Add to Toolkit button */}
      <motion.button
        whileTap={{ scale: isSaved ? 1 : 0.96 }}
        onClick={handleAdd}
        disabled={isSaved}
        className="w-full rounded-full py-2.5 text-sm font-semibold transition-all"
        style={{
          background: isSaved ? 'rgba(52,199,89,0.12)' : 'var(--apple-blue)',
          color: isSaved ? 'var(--apple-green)' : '#fff',
          border: isSaved ? '1px solid rgba(52,199,89,0.3)' : 'none',
          cursor: isSaved ? 'default' : 'pointer',
          boxShadow: isSaved ? 'none' : '0 1px 8px rgba(0,113,227,0.25)',
        }}
        aria-label={isSaved ? 'Added to toolkit' : `Add ${uc.title} to toolkit`}
      >
        {isSaved ? '✓ Added to Toolkit' : 'Add to Toolkit'}
      </motion.button>
    </motion.div>
  );
}
