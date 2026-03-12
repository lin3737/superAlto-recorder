/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Play, Square, Settings } from 'lucide-react';
import { SettingsProvider } from './context/SettingsContext';
import InfoScreen from './components/InfoScreen';
import SettingsScreen from './components/SettingsScreen';

// Cover variants
import Cover1 from './components/covers/Cover1';
import Cover2 from './components/covers/Cover2';
import Cover3 from './components/covers/Cover3';
import Cover4 from './components/covers/Cover4';
import Cover5 from './components/covers/Cover5';
import Cover6 from './components/covers/Cover6';
import Cover7 from './components/covers/Cover7';
import Cover8 from './components/covers/Cover8';
import Cover9 from './components/covers/Cover9';
import Cover10 from './components/covers/Cover10';

// CTA variants
import CTA1 from './components/ctas/CTA1';
import CTA2 from './components/ctas/CTA2';
import CTA3 from './components/ctas/CTA3';
import CTA4 from './components/ctas/CTA4';
import CTA5 from './components/ctas/CTA5';
import CTA6 from './components/ctas/CTA6';
import CTA7 from './components/ctas/CTA7';
import CTA8 from './components/ctas/CTA8';
import CTA9 from './components/ctas/CTA9';
import CTA10 from './components/ctas/CTA10';

const COVERS = [Cover1, Cover2, Cover3, Cover4, Cover5, Cover6, Cover7, Cover8, Cover9, Cover10];
const CTAS = [CTA1, CTA2, CTA3, CTA4, CTA5, CTA6, CTA7, CTA8, CTA9, CTA10];

// Module-level cache: a single shared index so cover N is always paired with CTA N.
// Picked once per page load, resets on refresh.
let _sharedIndex = -1;

function getSharedIndex(): number {
  if (_sharedIndex === -1) {
    _sharedIndex = Math.floor(Math.random() * COVERS.length);
  }
  return _sharedIndex;
}

// Get the linked variant number - if either cover or cta param is specified, use that for both
function getLinkedVariant(coverParam: string | null, ctaParam: string | null): number {
  // Check cover param first
  if (coverParam !== null) {
    const n = parseInt(coverParam, 10);
    if (!isNaN(n) && n >= 1 && n <= COVERS.length) return n - 1;
  }
  // Then check cta param
  if (ctaParam !== null) {
    const n = parseInt(ctaParam, 10);
    if (!isNaN(n) && n >= 1 && n <= CTAS.length) return n - 1;
  }
  // If neither specified, use random shared index
  return getSharedIndex();
}

const pathToScreen: Record<string, 'cover' | 'info' | 'cta'> = {
  '/cover': 'cover',
  '/listings': 'info',
  '/cta': 'cta',
};

const screenToPath: Record<string, string> = {
  cover: '/cover',
  info: '/listings',
  cta: '/cta',
};

function AdFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialScreen = pathToScreen[location.pathname] ?? 'cover';
  const [currentScreen, setCurrentScreen] = useState<'cover' | 'info' | 'cta'>(initialScreen);
  const [isPlaying, setIsPlaying] = useState(false);

  // Resolve cover/cta variant — always the same pair number, stable for the whole page load
  const searchParams = useMemo(() => new URLSearchParams(location.search), []);
  const hasExplicitVariant = searchParams.has('cover') || searchParams.has('cta');
  const variantIndex = useMemo(() => 
    getLinkedVariant(searchParams.get('cover'), searchParams.get('cta')), 
    []
  );
  const CoverComponent = COVERS[variantIndex];
  const CTAComponent = CTAS[variantIndex];

  useEffect(() => {
    const path = screenToPath[currentScreen];
    // Normalize URL params: use ?cover=X for cover screen, ?cta=X for cta screen, no params for info
    let search = '';
    if (hasExplicitVariant) {
      if (currentScreen === 'cover') {
        search = `?cover=${variantIndex + 1}`;
      } else if (currentScreen === 'cta') {
        search = `?cta=${variantIndex + 1}`;
      }
    }
    navigate(path + search, { replace: true });
  }, [currentScreen, variantIndex, hasExplicitVariant, navigate]);

  const handlePlayToggle = () => {
    setIsPlaying(p => !p);
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-black overflow-hidden shadow-2xl sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-900 sm:h-[850px] sm:my-8">
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button 
          onClick={handlePlayToggle}
          className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/70 transition"
        >
          {isPlaying ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/70 transition"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {currentScreen === 'cover' ? (
          <CoverComponent
            key="cover"
            isStatic={!isPlaying}
            onComplete={isPlaying ? () => setCurrentScreen('info') : undefined} 
          />
        ) : currentScreen === 'info' ? (
          <InfoScreen 
            key="info"
            isStatic={!isPlaying}
            onComplete={isPlaying ? () => setCurrentScreen('cta') : undefined} 
          />
        ) : (
          <CTAComponent
            key="cta"
            isStatic={!isPlaying}
            onComplete={isPlaying ? () => setCurrentScreen('cover') : undefined} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 sm:p-8 font-sans">
          <Routes>
            <Route path="/" element={<AdFlow />} />
            <Route path="/cover" element={<AdFlow />} />
            <Route path="/listings" element={<AdFlow />} />
            <Route path="/cta" element={<AdFlow />} />
            <Route path="/settings" element={
              <div className="w-full h-full max-w-md mx-auto bg-white overflow-hidden shadow-2xl sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-900 sm:h-[850px]">
                <SettingsScreen />
              </div>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}
