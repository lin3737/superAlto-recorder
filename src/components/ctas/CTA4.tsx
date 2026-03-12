/**
 * CTA 4 — Modern blue premium — matching Cover 4
 */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

export default function CTA4({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  return (
    <motion.div
      initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#060d1a' }}
    >
      {/* Blue car background */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 50%',
        }}
      />
      {/* Dark blue overlay — subtle, car shows through */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(160deg, rgba(6,13,26,0.92) 0%, rgba(15,30,80,0.82) 50%, rgba(6,13,26,0.93) 100%)' }} />
      {/* Soft blue radial glow */}
      <div className="absolute inset-0 z-[2]" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)' }} />

      <div className="absolute top-0 left-0 right-0 h-[2px] z-[5]"
        style={{ background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.45) 50%, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] z-[5]"
        style={{ background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.45) 50%, transparent)' }} />

      <div className="relative z-10 flex flex-col h-full px-7 pt-14 pb-12 justify-between w-full">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2.5">
         
        </motion.div>

        {/* Main content */}
        <div className="flex flex-col gap-7 items-center text-center">

          {/* Big logo */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="w-40 h-40 rounded-2xl flex items-center justify-center overflow-hidden p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.4))',
              border: '2px solid rgba(59,130,246,0.5)',
              boxShadow: '0 0 28px rgba(59,130,246,0.25)',
            }}>
            <img src="/SuperAltoround.png" alt="SuperAlto" className="w-full h-full object-contain" />
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h1 className="text-4xl font-black text-white leading-[0.95]">
              Drive Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Dream Car
              </span><br />Home.
            </h1>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex gap-8">
            {[['15K+', 'Cars'], ['100%', 'Free'], ['AI', 'Search']].map(([v, l]) => (
              <div key={l} className="flex flex-col items-center gap-0.5">
                <span className="text-blue-400 font-black text-2xl leading-none">{v}</span>
                <span className="text-white/40 text-xs uppercase tracking-widest">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-1">
          <div className="h-[1px] w-16 mb-2"
            style={{ background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.6), transparent)' }} />
          <p className="font-black text-xl tracking-tight text-center">
            <span className="text-white">SUPER</span>
            <span className="text-red-600">ALTO</span>
            <span className="text-white">.AI</span>
          </p>
          <p className="text-white/30 text-xs tracking-widest text-center">Albania's Finest Car Platform</p>
        </motion.div>

      </div>
    </motion.div>
  );
}