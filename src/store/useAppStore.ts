import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UseCase, type Category, useCases } from '../data/useCases';
import { shuffle } from '../lib/shuffle';
import { SPRINT_DURATION_SECONDS } from '../lib/constants';

export type View = 'landing' | 'sprint' | 'browse' | 'results';

interface AppState {
  // Navigation
  view: View;
  setView: (v: View) => void;

  // Sprint state
  shuffledCases: UseCase[];
  currentCardIndex: number;
  savedCases: UseCase[];
  discardedIds: Set<number>;
  timerSeconds: number;
  isTimerRunning: boolean;

  // Sprint actions
  initSprint: () => void;
  swipeRight: () => void;
  swipeLeft: () => void;
  tickTimer: () => void;
  endSprint: () => void;

  // Storefront / browse state
  activeFilters: Set<Category>;
  searchQuery: string;
  isToolkitOpen: boolean;

  // Storefront / browse actions
  toggleFilter: (cat: Category) => void;
  setSearchQuery: (q: string) => void;
  setToolkitOpen: (v: boolean) => void;
  addToToolkit: (uc: UseCase) => void;
  removeFromToolkit: (id: number) => void;

  // Shared
  showCtaModal: boolean;
  setShowCtaModal: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      view: 'landing',
      setView: (v) => set({ view: v }),

      // Sprint
      shuffledCases: [],
      currentCardIndex: 0,
      savedCases: [],
      discardedIds: new Set(),
      timerSeconds: SPRINT_DURATION_SECONDS,
      isTimerRunning: false,

      initSprint: () => set({
        shuffledCases: shuffle(useCases),
        currentCardIndex: 0,
        discardedIds: new Set(),
        timerSeconds: SPRINT_DURATION_SECONDS,
        isTimerRunning: true,
        view: 'sprint',
        // Note: savedCases intentionally NOT reset - unified basket
      }),

      swipeRight: () => {
        const { shuffledCases, currentCardIndex, savedCases } = get();
        const card = shuffledCases[currentCardIndex];
        if (!card) return;
        const next = currentCardIndex + 1;
        const alreadySaved = savedCases.some(s => s.id === card.id);
        const newSaved = alreadySaved ? savedCases : [...savedCases, card];
        if (next >= shuffledCases.length) {
          set({ savedCases: newSaved, currentCardIndex: next, isTimerRunning: false, view: 'results' });
        } else {
          set({ savedCases: newSaved, currentCardIndex: next });
        }
      },

      swipeLeft: () => {
        const { shuffledCases, currentCardIndex, discardedIds } = get();
        const card = shuffledCases[currentCardIndex];
        if (!card) return;
        const next = currentCardIndex + 1;
        const newDiscarded = new Set(discardedIds);
        newDiscarded.add(card.id);
        if (next >= shuffledCases.length) {
          set({ discardedIds: newDiscarded, currentCardIndex: next, isTimerRunning: false, view: 'results' });
        } else {
          set({ discardedIds: newDiscarded, currentCardIndex: next });
        }
      },

      tickTimer: () => {
        const { timerSeconds } = get();
        if (timerSeconds <= 1) {
          set({ timerSeconds: 0, isTimerRunning: false, view: 'results' });
        } else {
          set({ timerSeconds: timerSeconds - 1 });
        }
      },

      endSprint: () => set({ isTimerRunning: false, view: 'results' }),

      // Storefront
      activeFilters: new Set(),
      searchQuery: '',
      isToolkitOpen: false,

      toggleFilter: (cat) => {
        const filters = new Set(get().activeFilters);
        if (filters.has(cat)) { filters.delete(cat); } else { filters.add(cat); }
        set({ activeFilters: filters });
      },

      setSearchQuery: (q) => set({ searchQuery: q }),
      setToolkitOpen: (v) => set({ isToolkitOpen: v }),

      addToToolkit: (uc) => {
        const { savedCases } = get();
        if (!savedCases.find(s => s.id === uc.id)) {
          set({ savedCases: [...savedCases, uc] });
        }
      },

      removeFromToolkit: (id) => {
        set({ savedCases: get().savedCases.filter(s => s.id !== id) });
      },

      // Shared
      showCtaModal: false,
      setShowCtaModal: (v) => set({ showCtaModal: v }),
    }),
    {
      name: 'ai-discovery-toolkit',
      // Only persist the basket - not view, timer, sprint state, etc.
      partialize: (state) => ({ savedCases: state.savedCases }),
    }
  )
);
