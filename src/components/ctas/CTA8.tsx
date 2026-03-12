/**
 * CTA 8 — Glassmorphism card on blurred car photo
 */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Car, TrendingUp, Globe } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function CTA8({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  const features = [
    { icon: Car, label: '15,000+ Cars' },
    { icon: TrendingUp, label: 'AI Ranking' },
    { icon: Globe, label: 'All Albania' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1080")' }} />
      <div className="absolute inset-0 z-10 bg-black/55 backdrop-blur-[3px]" />

      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', damping: 16 }}
        className="relative z-20 w-[88%] bg-white/12 backdrop-blur-2xl border border-white/20 rounded-3xl p-7 shadow-2xl">
        {/* Logo row */}
        <div className="flex items-center gap-3 mb-7">
          <img src="/SuperAltoround.png" alt="SuperAlto" className="h-20 w-auto object-contain" />
          <span className="font-black tracking-widest text-xl uppercase">
            <span style={{ color: '#080707' }}>Super</span>
            <span style={{ color: '#850e0e' }}>Alto</span>
            <span style={{ color: '#080707' }}>.AI</span>
          </span>
        </div>

        <h1 className="text-3xl font-black mb-1 leading-tight">
          <span style={{ color: '#ffffff' }}>Find Your Car</span><br />
          <span style={{ color: '#850e0e' }}>in Seconds.</span>
        </h1>
        <p className="text-white/50 text-sm mb-6">AI-powered search. 100% free.</p>

        <div className="flex gap-3 mb-7">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex-1 bg-white/8 border border-white/10 rounded-xl py-3 flex flex-col items-center gap-1">
              <Icon className="w-4 h-4 text-white/70" />
              <span className="text-white/60 text-xs font-medium text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-2 border-t border-white/10 pt-5">
          <span className="font-black text-lg text-center">
            <span className="text-white">SUPER</span>
            <span style={{ color: '#850e0e' }}>ALTO</span>
            <span className="text-white">.AI</span>
          </span>
          <span className="text-white/40 text-xs tracking-widest uppercase">Search smarter · Find faster</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
