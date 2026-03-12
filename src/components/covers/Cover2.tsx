/**
 * Cover — Urban Luxury Night City
 * Deep black + crimson red — car bottom half, text top half
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

const CAR_URLS = [
  'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1580414057395-94d1f9675a5f?w=900&auto=format&fit=crop&q=85',
];

export default function CoverUrbanLuxury({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
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
    setTypedText('');
    if (isStatic) { setTypedText(searchText); return; }
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
      style={{ background: '#080000' }}
    >
      {/* ── CAR IMAGE — full background ── */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${carUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 50%',
        }}
      />

      {/* ── TOP dark gradient — covers ~55% so text is readable, car shows below ── */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(4,0,0,0.88) 0%, rgba(4,0,0,0.72) 22%, rgba(4,0,0,0.38) 42%, rgba(4,0,0,0.1) 58%, transparent 72%)',
      }} />

      <div className="absolute bottom-0 left-0 right-0 h-[18%] z-[1]" style={{
        background: 'linear-gradient(to top, rgba(4,0,0,0.6) 0%, transparent 100%)',
      }} />

      {/* ── Red glow behind car center ── */}
      <div className="absolute z-[2] pointer-events-none"
        style={{
          left: '50%', top: '68%',
          width: '300px', height: '130px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(220,38,38,0.2) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }} />

      {/* ── Grain texture ── */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '150px 150px',
        }} />

      {/* ── Red top accent line ── */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[2px] z-[10]"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.7) 30%, rgba(239,68,68,1) 50%, rgba(220,38,38,0.7) 70%, transparent)',
          transformOrigin: 'center',
        }}
      />

      {/* ── LOGO ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[30] flex items-center justify-center"
      >
        <img src="/SuperAltoLogo2.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
      </motion.div>

      {/* ── MAIN CONTENT — top 55% of screen ── */}
      <div className="absolute z-[20] flex flex-col gap-8"
        style={{ top: '20%', left: '7%', right: '14%' }}
      >
        {/* Headline */}
        <motion.div
          initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '50px',
            fontWeight: 700,
            lineHeight: 1.0,
            color: '#f8f2ee',
            textShadow: '0 2px 24px rgba(0,0,0,0.95)',
            margin: 0,
          }}>
            Search smarter.
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #ef4444 0%, #f87171 55%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontStyle: 'italic',
            }}>
              Find faster.
            </span>
          </h1>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(8,0,0,0.6)',
              border: '1px solid rgba(220,38,38,0.28)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.65), 0 0 28px rgba(220,38,38,0.07)',
            }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(239,68,68,0.7)' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: 'rgba(255,255,255,0.82)',
              letterSpacing: '0.01em',
              flex: 1,
            }}>
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                style={{
                  display: 'inline-block',
                  width: '1.5px', height: '13px',
                  background: '#ef4444',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  borderRadius: '1px',
                  boxShadow: '0 0 5px rgba(239,68,68,0.8)',
                }}
              />
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Thin divider between text zone and car zone ── */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.65, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute z-[10]"
        style={{
          top: '54%', left: '7%', right: '7%', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.3) 25%, rgba(239,68,68,0.45) 50%, rgba(220,38,38,0.3) 75%, transparent)',
          transformOrigin: 'left',
        }}
      />

      {/* ── Right vertical decoration ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="absolute right-5 z-[20] flex flex-col items-center gap-2"
        style={{ top: '20%' }}
      >
        <div style={{ width: '1px', height: '44px', background: 'linear-gradient(to bottom, transparent, rgba(220,38,38,0.3))' }} />
        <span style={{
          writingMode: 'vertical-rl',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '8px',
          letterSpacing: '0.24em',
          color: 'rgba(220,38,38,0.28)',
          textTransform: 'uppercase',
        }}>Search · AI · Now</span>
        <div style={{ width: '1px', height: '44px', background: 'linear-gradient(to top, transparent, rgba(220,38,38,0.3))' }} />
      </motion.div>

      {/* ── Bottom footer text ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="absolute bottom-8 left-7 right-7 z-[20] flex flex-col gap-1.5 items-center"
      >
       
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.99)',
          letterSpacing: '0.03em',
          lineHeight: 1.4,
          margin: 0,
          textAlign: 'center',
        }}>
          The AI-powered search engine<br />that finds what you're looking for.
        </p>
      </motion.div>

      {/* ── Bottom red accent bar ── */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] z-[20]"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.5) 35%, rgba(239,68,68,0.75) 50%, rgba(220,38,38,0.5) 65%, transparent)',
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  );
}