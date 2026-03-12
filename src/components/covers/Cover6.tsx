/**
 * Cover 6 — Modern teal/cyan premium design with car background
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

const CAR_URLS = [
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1617531653520-bd466a55fcdc?w=900&auto=format&fit=crop&q=85',
];

export default function Cover6({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();
  const campaign = campaigns.find(c => c.id === settings.activeCampaignId) || campaigns[0];
  const searchText = settings.searchLabel || campaign.searchString;
  const title = settings.searchMake ? `Searching for a ${settings.searchMake}?` : campaign.title;
  const [typedText, setTypedText] = useState('');
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
    if (isStatic) { setTypedText(searchText); return; }
    setTypedText('');
    const textToType = searchText;
    const duration = settings.coverDuration;
    const interval = duration / textToType.length;
    let i = 0;
    const iv = setInterval(() => {
      if (i <= textToType.length) { setTypedText(textToType.slice(0, i)); i++; } else clearInterval(iv);
    }, interval);
    const t = setTimeout(() => onComplete?.(), duration + 500);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [searchText, settings.coverDuration, onComplete, isStatic]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: '#030d14' }}
    >
      {/* Car background */}
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

      {/* Dark teal overlay */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(3,13,20,0.75) 0%, rgba(8,30,40,0.2) 35%, rgba(3,13,20,0.1) 60%, rgba(3,13,20,0.7) 100%)',
      }} />

      {/* Teal glow accents */}
      <div className="absolute inset-0 z-[2]" style={{
        background: 'radial-gradient(ellipse 90% 50% at 50% 40%, rgba(20,184,166,0.12) 0%, transparent 70%)',
      }} />

      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 z-[10]"
        style={{
          height: '2px',
          background: 'linear-gradient(to right, transparent, rgba(7, 69, 61, 0.6) 25%, rgba(12, 99, 86, 0.8) 50%, rgba(20,184,166,0.5) 75%, transparent)',
          transformOrigin: 'left',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] flex items-center justify-center"
      >
        <img src="/image.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
      </motion.div>

      {/* Main content */}
      <div className="absolute z-[20]"
        style={{ top: '22%', left: '7%', right: '7%' }}
      >
        {/* Headline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '44px',
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#ffffff',
            textShadow: '0 4px 32px rgba(0,0,0,0.9)',
            margin: 0,
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}>
            {title}
          </h1>
        </motion.div>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: '#5eead4',
            letterSpacing: '0.02em',
            margin: 0,
            marginBottom: '24px',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          AI-powered search engine for Albania's best cars
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
            style={{
              background: 'rgba(20,184,166,0.12)',
              border: '1px solid rgba(94,234,212,0.4)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 40px rgba(20,184,166,0.15)',
            }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#5eead4' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '0.01em',
              flex: 1,
            }}>
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                style={{
                  display: 'inline-block',
                  width: '1.5px', height: '14px',
                  background: '#14b8a6',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  borderRadius: '1px',
                  boxShadow: '0 0 5px rgba(20,184,166,0.6)',
                }}
              />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom footer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-7 right-7 z-[20] flex flex-col gap-1.5 items-center"
      >
       
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '20px',
          color: 'rgba(181, 164, 164, 0.78)',
          letterSpacing: '0.03em',
          lineHeight: 1.4,
          margin: 0,
          textAlign: 'center',
        }}>
          15,000+ cars · AI-powered · 100% Free
        </p>
      </motion.div>

      {/* Advertising slogan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 left-0 right-0 z-[20] text-center"
      >
        <p style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '18px',
          fontWeight: 700,
          color: '#ffffff',
          textShadow: '0 2px 16px rgba(0,0,0,0.8)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Your Dream Car is Just a Click Away
        </p>
      </motion.div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] z-[20]"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(20,184,166,0.5) 35%, rgba(94,234,212,0.7) 50%, rgba(20,184,166,0.5) 65%, transparent)',
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  );
}
