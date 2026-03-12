/**
 * Cover 8 — Frosted glass morphism on car background, centered pill
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

export default function Cover8({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
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
      initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1080")' }} />
      <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px]" />

      {/* Big frosted card */}
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', damping: 18 }}
        className="relative z-20 w-[88%] bg-white/12 backdrop-blur-2xl border border-white/20 rounded-3xl p-7 shadow-2xl">
        {/* Logo row */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-20 h-20 flex items-center justify-center">
            <img src="/SuperAltoround.png" alt="SuperAlto" className="w-full h-full object-contain" />
          </div>
          <span className="font-black tracking-widest text-xl uppercase">
            <span style={{ color: '#080707' }}>Super</span>
            <span style={{ color: '#850e0e' }}>Alto</span>
          </span>
        </div>

     <h1 className="text-3xl font-black mb-6 leading-tight">
  <span style={{ color: '#ffffff' }}>
    {title.split(' ').slice(0, -1).join(' ')}{' '}
  </span>
  <span style={{ color: '#850e0e' }}>
    {title.split(' ').slice(-1)}
  </span>
</h1>
        {/* Search field */}
        <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-3.5 flex items-center gap-3">
          <Search className="text-white/60 w-5 h-5 flex-shrink-0" />
          <span className="text-white text-base font-medium flex-1 min-w-0 truncate">
            {typedText}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-0.5 h-5 bg-white ml-1 align-middle" />
          </span>
          <ChevronRight className="text-white/40 w-5 h-5 flex-shrink-0" />
        </div>

        <p className="text-xs mt-4 text-center tracking-widest uppercase">
          <span className="text-white/40">SUPER</span>
          <span className="text-white/40">ALTO</span>
          <span className="text-white/40">.AI · Albania's #1 Car Platform</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
