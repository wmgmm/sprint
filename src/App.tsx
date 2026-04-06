import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { LandingPage } from './components/landing/LandingPage';
import { SprintMode } from './components/sprint/SprintMode';
import { SprintResults } from './components/sprint/SprintResults';
import { CtaModal } from './components/shared/CtaModal';
import { Storefront } from './components/storefront/Storefront';

function App() {
  const view = useAppStore(s => s.view);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div>
        <AnimatePresence mode="wait">
          {view === 'landing'  && <LandingPage    key="landing"  />}
          {view === 'sprint'   && <SprintMode      key="sprint"   />}
          {view === 'browse'   && <Storefront       key="browse"   />}
          {view === 'results'  && <SprintResults   key="results"  />}
        </AnimatePresence>
      </div>

      <CtaModal />
    </div>
  );
}

export default App;
