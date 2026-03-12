/**
 * CTA 7 — Orange/warm split photo + bold CTA card
 */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function CTA7({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  return (
    <motion.div
      initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-black"
    >
      {/* Photo top */}
      <div className="relative h-[45%] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1080")' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] flex items-center justify-center">
          <img src="/SuperAltoLogo2.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="absolute bottom-6 left-6 flex items-center gap-2 bg-red-500 rounded-full px-3 py-1.5">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-bold uppercase tracking-wide">Verified Listings</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-7 pt-7 pb-10 flex flex-col justify-between"
        style={{ background: 'linear-gradient(to bottom, #000 0%, #120800 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-red-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">Albania's Best</p>
          <h1 className="text-[2.6rem] font-black text-white leading-[0.92] tracking-tight">
            Your Next Car<br />
            <span className="text-red-500">Starts Here.</span>
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex gap-4">
          {[['15K+', 'Cars'], ['Free', 'Search'], ['AI', 'Powered']].map(([v, l]) => (
            <div key={l} className="flex-1 border border-red-500/20 rounded-xl p-3 flex flex-col items-center">
              <span className="text-red-500 font-black text-xl leading-none">{v}</span>
              <span className="text-white/40 text-xs uppercase tracking-widest mt-1">{l}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          className="flex flex-col items-center gap-2">
          <p className="font-black text-xl text-center">
            <span className="text-white">SUPER</span>
            <span className="text-red-600">ALTO</span>
            <span className="text-white">.AI</span>
          </p>
          <p className="text-white text-xs text-center">Search smarter. Find faster.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
