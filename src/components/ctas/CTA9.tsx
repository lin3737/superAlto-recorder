/**
 * CTA 9 — Bold silver/orange staggered reveal with left accent strip
 */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

export default function CTA9({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  const items = [
    { bold: 'Albania\'s', normal: 'Largest' },
    { bold: 'Car', normal: 'Marketplace' },
    { bold: '100%', normal: 'Free Search' },
  ];

  return (
    <motion.div
      initial={{ y: 0 }} animate={{ y: 0 }} exit={{ y: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-black"
    >
      {/* Orange accent strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-amber-400 z-20" />

      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&auto=format&fit=crop&q=85")' }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black via-slate-900/95 to-orange-950/40" />

      <div className="relative z-20 flex flex-col h-full pl-8 pr-6 pt-14 pb-10 justify-between">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-3">
          <img src="/SuperAltoround.png" alt="SuperAlto" className="h-20 w-auto object-contain" />
          <span className="font-black tracking-widest text-xl uppercase">
            <span style={{ color: '#eae1e1' }}>Super</span>
            <span style={{ color: '#850e0e' }}>Alto</span>
            <span style={{ color: '#dbcece' }}>.AI</span>
          </span>
        </motion.div>

        {/* Staggered rows */}
        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.15 }}
              className="border-b border-amber-900/30 pb-4 last:border-0">
              <p className="text-amber-400 font-black text-4xl leading-none">{item.bold}</p>
              <p className="text-white/60 text-xl font-medium leading-tight">{item.normal}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="flex flex-col items-center text-center">
          <p className="font-black text-2xl tracking-tight">
            <span style={{ color: '#d6cdcd' }}>SUPER</span>
            <span style={{ color: '#850e0e' }}>ALTO</span>
            <span style={{ color: '#cec3c3' }}>.AI</span>
          </p>
          <p className="text-white/40 text-sm">Search smarter. Find faster.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
