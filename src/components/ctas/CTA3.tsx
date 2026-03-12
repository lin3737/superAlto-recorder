/**
 * CTA 3 — Clean white/minimal with bold number showcase - matching Cover 3
 */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function CTA3({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  const stats = [
    { value: '15K+', label: 'Cars Listed' },
    { value: '50K+', label: 'Users' },
    { value: '#1', label: 'In Albania' },
    { value: 'Free', label: 'Always' },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-white"
    >
      {/* Top gold accent bar */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[2.5px] z-20"
        style={{
          background: 'linear-gradient(to right, transparent, #c8a96e 25%, #e8c98e 50%, #c8a96e 75%, transparent)',
          transformOrigin: 'left',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-7 pt-16 pb-10 justify-between">
        {/* Brand - matching Cover 3 */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-4 pb-5 mb-2"
          style={{ borderBottom: '2px solid rgba(220,38,38,0.25)' }}
        >
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center overflow-hidden p-2"
            style={{ background: '#fff', boxShadow: '0 6px 24px rgba(0,0,0,0.18)' }}
          >
            <img src="/SuperAltoround.png" alt="SuperAlto" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight gap-0.5">
            <span className="font-black text-2xl tracking-tight" style={{ lineHeight: 1 }}>
              <span style={{ color: '#111' }}>Super</span>
              <span style={{ color: '#a50707' }}>Alto</span>
              <span style={{ color: '#111' }}>.ai</span>
            </span>
            <span className="text-xs font-semibold uppercase" style={{ color: '#666', letterSpacing: '0.16em' }}>
              Albania's #1 Car Platform
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#c8a96e' }}>The numbers speak</p>
          <h1 className="text-5xl font-black leading-[0.9] tracking-tight" style={{ fontFamily: "'Georgia', serif", color: '#111' }}>
            The Best<br />Car Search Engine <br /><span style={{ color: '#a50707' }}>in Albania.</span>
          </h1>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 + i * 0.08 }}
              className="rounded-2xl p-4 flex flex-col"
              style={{ 
                border: '1.5px solid rgba(200,169,110,0.3)',
                background: 'linear-gradient(135deg, rgba(200,169,110,0.03) 0%, rgba(232,201,142,0.05) 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <span className="text-4xl font-black leading-none" style={{ color: '#111' }}>{s.value}</span>
              <span className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#999' }}>{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* URL */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-3 pt-4"
          style={{ borderTop: '2px solid rgba(200,169,110,0.25)' }}
        >
          <span className="font-black text-xl text-center">
            <span style={{ color: '#0c0b0b' }}>SUPER</span>
            <span style={{ color: '#a50707' }}>ALTO</span>
            <span style={{ color: '#0a0808' }}>.AI</span>
          </span>
          
        </motion.div>
      </div>
    </motion.div>
  );
}
