/**
 * Cover 5 — Vibrant gradient purple/blue social-media style
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

const CAR_URLS = [
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=900&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=900&auto=format&fit=crop&q=85',
];

export default function Cover5({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
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
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0520' }}
    >
      {/* ── Car background ── */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${carUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 50%',
        }}
      />

      {/* Purple/blue overlay — lighter so car shows through */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(160deg, rgba(10,5,32,0.65) 0%, rgba(45,0,79,0.45) 40%, rgba(10,5,32,0.70) 100%)',
      }} />

      {/* Floating blobs — same colors as CTA5 */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute top-16 right-8 w-32 h-32 rounded-full blur-3xl z-[2]"
        style={{ background: 'rgba(99,51,200,0.25)' }}
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-24 left-4 w-24 h-24 rounded-full blur-3xl z-[2]"
        style={{ background: 'rgba(59,130,246,0.2)' }}
      />

      {/* ── LOGO ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] flex items-center justify-center"
      >
        <img src="/SuperAltoLogo2.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
      </motion.div>

      <div className="relative z-10 w-full px-6 flex flex-col items-center gap-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black text-white leading-tight drop-shadow-xl">{title}</h1>
          <p className="mt-3 text-sm font-medium" style={{ color: 'rgba(167,139,250,0.7)' }}>Just type what you want</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="w-full max-w-sm rounded-3xl p-4 flex items-center gap-3 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(167,139,250,0.25)',
          }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#a78bfa' }} />
          <span className="text-white text-base font-medium flex-1">
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}
              style={{
                display: 'inline-block', width: '2px', height: '18px',
                background: '#a78bfa', marginLeft: '2px', verticalAlign: 'middle', borderRadius: '1px',
              }}
            />
          </span>
        </motion.div>

      </div>

      {/* ── Bottom footer text ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="absolute bottom-8 left-7 right-7 z-[20] flex flex-col gap-1.5 items-center"
      >
       
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '20px',
          color: 'rgba(205, 184, 184, 0.81)',
          letterSpacing: '0.03em',
          lineHeight: 1.4,
          margin: 0,
          textAlign: 'center',
        }}>
          The AI-powered search engine<br />that finds what you're looking for.
        </p>
      </motion.div>
    </motion.div>
  );
}