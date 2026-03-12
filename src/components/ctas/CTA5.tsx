/**
 * CTA 5 — Vibrant purple/blue gradient with bouncy animations
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

const CAR_URLS = [
  'https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&auto=format&fit=crop&q=85', // silver Porsche
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=900&auto=format&fit=crop&q=85', // grey supercar
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&auto=format&fit=crop&q=85', // dark sports car
];

export default function CTA5({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();
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
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  return (
    <motion.div
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
      style={{ background: '#0a0520' }}
    >
      {/* ── Car background ── */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${carUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 50%',
        }}
      />

      {/* Purple/blue overlay */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(160deg, rgba(10,5,32,0.95) 0%, rgba(45,0,79,0.82) 40%, rgba(10,5,32,0.92) 100%)',
      }} />

      {/* Animated background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl z-[2]"
        style={{ background: 'rgba(99,51,200,0.25)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ repeat: Infinity, duration: 5, delay: 1, ease: 'easeInOut' }}
        className="absolute bottom-20 left-5 w-40 h-40 rounded-full blur-3xl z-[2]"
        style={{ background: 'rgba(59,130,246,0.2)' }}
      />

      <div className="relative z-10 flex flex-col h-full px-7 pt-14 pb-12 justify-between">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <img src="/SuperAltoround.png" alt="SuperAlto" className="w-17 h-17 object-contain" />
          <span className="font-black text-2xl tracking-[0.12em] uppercase">
            <span style={{ color: '#fff' }}>Super</span>
            <span style={{ color: '#ef4444' }}>Alto</span>
              <span style={{ color: '#fff' }}>.AI</span>
          </span>
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring' }}
          >
            <p className="text-purple-300/60 text-xs font-bold uppercase tracking-[0.3em] mb-3">
              AI-Powered · 100% Free
            </p>
            <h1 className="text-[2.8rem] font-black text-white leading-[0.93] tracking-tight">
              Stop<br />Searching.<br />
              <span style={{ color: '#a78bfa' }}>Start Driving.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(167,139,250,0.2)',
            }}
          >
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Albania's answer to car search</p>
            <p className="text-white font-bold text-base">15,000+ cars. One smart search.</p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-[1px] w-16 mb-2"
            style={{ background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.6), transparent)' }} />
          <p className="font-black text-xl text-center">
            <span className="text-white">SUPER</span>
            <span className="text-red-600">ALTO</span>
            <span className="text-white">.AI</span>
          </p>
          <p className="text-white/40 text-xs text-center tracking-wide">Free · No sign-up · Instant results</p>
        </motion.div>

      </div>
    </motion.div>
  );
}