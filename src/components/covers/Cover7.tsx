/**
 * Cover 7 — Warm orange/sunset split-screen layout
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

export default function Cover7({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();
  const campaign = campaigns.find(c => c.id === settings.activeCampaignId) || campaigns[0];
  const searchText = settings.searchLabel || campaign.searchString;
  const title = settings.searchMake ? `Searching for a ${settings.searchMake}?` : campaign.title;
  const [typedText, setTypedText] = useState('');

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
      initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-black"
    >
      {/* Photo top half */}
      <div className="relative h-[52%] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1080")' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] flex items-center justify-center"
      >
        <img src="/SuperAltoLogo2.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
      </motion.div>

      {/* Bottom content */}
      <div className="flex-1 relative z-10 px-6 pt-6 pb-8 flex flex-col gap-5"
        style={{ background: 'linear-gradient(to bottom, #000 0%, #1a0c00 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Albania</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">{title}</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="w-full bg-white/8 border border-red-500/30 rounded-2xl p-3.5 flex items-center gap-3">
          <Search className="text-red-400 w-5 h-5 flex-shrink-0" />
          <span className="text-white text-base font-medium flex-1">
            {typedText}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-0.5 h-5 bg-red-500 ml-1 align-middle" />
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="flex items-center justify-between">
          <span className="text-white/60 text-sm"></span>
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Search smarter</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
