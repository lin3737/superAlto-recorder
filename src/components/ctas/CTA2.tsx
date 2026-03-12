/**
 * CTA 2 — Red crimson theme with car background
 */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function CTA2({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  const perks = ['15,000+ cars listed', 'Free AI search', 'New listings daily', 'Trusted by thousands'];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
      style={{ background: '#0a0000' }}
    >
      {/* Car background photo */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&auto=format&fit=crop&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(10,0,0,0.85) 0%, rgba(26,5,5,0.75) 60%, rgba(10,0,0,0.9) 100%)' }} />

      <div className="relative z-10 flex flex-col h-full px-7 pt-14 pb-12 justify-between">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-3">
          <div className="relative w-18 h-18 flex items-center justify-center">
            <img src="/SuperAltoround.png" alt="SuperAlto" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-2xl tracking-[0.15em] uppercase">
            <span className="text-white">SUPER</span>
            <span style={{ color: '#ef4444' }}>ALTO</span>
            <span className="text-white">.AI</span>
          </span>
        </motion.div>

        {/* Main copy */}
        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4" style={{ color: '#ef4444' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(239,68,68,0.8)' }}>Join 50,000+ users</span>
            </div>
            <h1 className="text-[2.6rem] font-black text-white leading-[0.95] tracking-tight">
              Albania's<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Smartest</span><br />Car Search.
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="flex flex-col gap-2">
            {perks.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                <span className="text-white/80 text-sm font-medium">{p}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom text */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="flex flex-col gap-2 items-center">
          <p className="font-black text-xl tracking-tight text-center">
            <span className="text-white">SUPER</span>
            <span style={{ color: '#ef4444' }}>ALTO</span>
            <span className="text-white">.AI</span>
          </p>
          <p className="text-white/30 text-xs text-center">100% Free · No registration required</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
