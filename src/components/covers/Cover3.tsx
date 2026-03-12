/**
 * Cover 3 — Minimal white / luxury with large countdown feel
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

const CAR_URLS = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618843986365-8e7c3a3a1e3b?w=900&auto=format&fit=crop&q=80',
];

export default function Cover3({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
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
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* ── Car background image ── */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${carUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
        }}
      />

      {/* Fade from top */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0) 72%)',
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-[25%] z-[1]" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)',
      }} />

      {/* Top accent bar */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[2.5px] z-[10]"
        style={{
          background: 'linear-gradient(to right, transparent, #c8a96e 25%, #e8c98e 50%, #c8a96e 75%, transparent)',
          transformOrigin: 'left',
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

      <div className="relative z-10 flex flex-col h-full px-7 pt-16 pb-8">

        {/* CENTER — campaign.title + search bar below it */}
        <div className="absolute bottom-20 left-0 right-0 px-7 z-10 flex flex-col items-start">

          {/* Big title in center of car */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-black leading-tight mb-6"
            style={{
              color: '#fff',
              fontFamily: "'Georgia', serif",
              textShadow: '0 2px 24px rgba(0,0,0,0.6)',
            }}
          >
            {title}
          </motion.h1>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-center gap-3 rounded-2xl p-4"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span className="text-base font-medium flex-1" style={{ color: '#fff' }}>
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}
                style={{
                  display: 'inline-block', width: '2px', height: '18px',
                  background: '#fff', marginLeft: '2px', verticalAlign: 'middle',
                  borderRadius: '1px',
                }}
              />
            </span>
            <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#fff' }}>
              <ArrowRight className="w-4 h-4" style={{ color: '#1a1210' }} />
            </div>
          </motion.div>

        </div>

        {/* spacer so footer stays at bottom */}
        <div className="mt-auto" />
      </div>
    </motion.div>
  );
}