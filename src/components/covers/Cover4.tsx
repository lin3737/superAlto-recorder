/**
 * Cover 4 — Billboard / Stats — "Why SuperAlto" ad, not search-focused
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

const CAR_URLS = [
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=85',
];

const STATS = [
  { value: '15K+', label: 'Active listings' },
  { value: '#1',     label: 'In Albania' },
  { value: 'AI',     label: 'Smart search' },
];

export default function Cover4({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();
  const campaign = campaigns.find(c => c.id === settings.activeCampaignId) || campaigns[0];
  const searchText = settings.searchLabel || campaign.searchString;
  const title = settings.searchMake ? `Searching for a ${settings.searchMake}?` : campaign.title;
  const [carUrl, setCarUrl] = useState(CAR_URLS[0]);

  useEffect(() => {
    let current = 0;
    const tryLoad = () => {
      if (current >= CAR_URLS.length) return;
      const img = new window.Image();
      img.onload = () => setCarUrl(CAR_URLS[current]);
      img.onerror = () => { current++; tryLoad(); };
      img.src = CAR_URLS[current];
    };
    tryLoad();
  }, []);

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.coverDuration + 500);
    return () => clearTimeout(t);
  }, [settings.coverDuration, onComplete, isStatic]);

  return (
    <motion.div
      initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: '#040b18' }}
    >
      {/* ── Car photo ── */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${carUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
        }}
      />

      {/* Overlay — dark top, lighter in middle to show car */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(4,11,24,0.97) 0%, rgba(4,11,24,0.65) 35%, rgba(4,11,24,0.35) 55%, rgba(4,11,24,0.92) 88%, rgba(4,11,24,0.99) 100%)',
      }} />

      {/* Blue glow accents */}
      <div className="absolute inset-0 z-[2]" style={{
        background: 'radial-gradient(ellipse 110% 60% at 50% 35%, rgba(59,130,246,0.15) 0%, transparent 65%)',
      }} />
      
      {/* Subtle spotlight effect */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-0 z-[2]" 
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(59,130,246,0.08) 0%, transparent 50%)',
        }} 
      />

      {/* Grain */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '150px',
        }}
      />

      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1., ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 z-[10]"
        style={{
          height: '2.5px',
          background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.5) 25%, rgba(147,197,253,1) 50%, rgba(59,130,246,0.5) 75%, transparent)',
          transformOrigin: 'left',
          boxShadow: '0 0 16px rgba(59,130,246,0.4)',
        }}
      />

      {/* TOP — Logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] flex items-center justify-center"
      >
        <img src="/image.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
      </motion.div>

      {/* ── CONTENT ── */}
      <div className="absolute inset-0 z-[20] flex flex-col px-6 pt-10 pb-8">

        {/* ── BIG HEADLINE — billboard style ── */}
        <div className="mt-28">
          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: 'rgba(96,165,250,0.85)',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Your Dream Awaits
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '52px',
              fontWeight: 900,
              lineHeight: 0.92,
              color: '#ffffff',
              textShadow: '0 6px 48px rgba(0,0,0,0.9)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Discover Your<br />
            <span style={{
              background: 'linear-gradient(120deg, #60a5fa 0%, #93c5fd 45%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Perfect Drive
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              marginTop: '12px',
              letterSpacing: '0.01em',
            }}
          >
            Albania's smartest way to find cars
          </motion.p>
        </div>

        {/* ── STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-auto flex items-stretch gap-0"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '20px',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 200 }}
              className="flex-1 flex flex-col items-center justify-center py-5"
              style={{
                borderRight: i < STATS.length - 1 ? '1px solid rgba(59,130,246,0.18)' : 'none',
              }}
            >
              <span style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '28px',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1,
                marginBottom: '6px',
                letterSpacing: '-0.01em',
              }}>
                {s.value}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: 'rgba(147,197,253,0.7)',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA line ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="flex items-center justify-center mt-6"
          style={{ 
            borderTop: '1px solid rgba(59,130,246,0.15)', 
            paddingTop: '18px' 
          }}
        >
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.02em',
          }}>
            Browse • Compare • Drive
          </span>
        </motion.div>

      </div>

      {/* Bottom line */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 1.2 }}
        className="absolute bottom-0 left-0 right-0 z-[10]"
        style={{
          height: '1.5px',
          background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.35) 30%, rgba(59,130,246,0.5) 50%, rgba(59,130,246,0.35) 70%, transparent)',
          transformOrigin: 'left',
          boxShadow: '0 0 12px rgba(59,130,246,0.3)',
        }}
      />
    </motion.div>
  );
}