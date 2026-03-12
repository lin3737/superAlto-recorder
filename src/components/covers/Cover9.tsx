/**
 * Cover 9 — Bold silver & orange, staggered word-by-word title reveal
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

export default function Cover9({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();
  const campaign = campaigns.find(c => c.id === settings.activeCampaignId) || campaigns[0];
  const searchText = settings.searchLabel || campaign.searchString;
  const title = settings.searchMake ? `Searching for a ${settings.searchMake}?` : campaign.title;
  const [typedText, setTypedText] = useState('');
  const words = title.split(' ');

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
      initial={{ y: 0 }} animate={{ y: 0 }} exit={{ y: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-black"
    >
      {/* Orange accent strip on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-amber-400 z-20" />

      {/* Background car image */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-85"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&auto=format&fit=crop&q=85")' }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/40 via-slate-900/20 to-orange-950/30" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] flex items-center justify-center"
      >
        <img src="/image.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
      </motion.div>

      <div className="relative z-20 flex flex-col h-full px-8 pt-10 pb-10 justify-between">
        <div>
          {/* Big staggered title */}
          <div className="flex flex-col gap-0 mt-32">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className={`text-5xl font-black leading-[0.9] tracking-tight ${i === words.length - 1 ? 'text-amber-400' : 'text-white'}`}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Search bar at bottom */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="w-full bg-white/8 border border-amber-400/30 rounded-xl p-3.5 flex items-center gap-3"
          style={{ boxShadow: '0 0 20px rgba(251,191,36,0.1)' }}>
          <Search className="text-amber-400 w-5 h-5 flex-shrink-0" />
          <span className="text-white text-sm font-medium flex-1">
            {typedText}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-0.5 h-4 bg-amber-400 ml-1 align-middle" />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
