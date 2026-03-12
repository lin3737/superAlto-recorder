/**
 * CTA 10 — Premium emerald/green theme matching Cover 10
 */
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

const CAR_URL = 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=900&auto=format&fit=crop&q=85';

export default function CTA10({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const t = setTimeout(() => onComplete?.(), settings.ctaDuration);
    return () => clearTimeout(t);
  }, [settings.ctaDuration, onComplete, isStatic]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: '#0a0015' }}
    >
      {/* Car background */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${CAR_URL}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Emerald overlay */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(to bottom, rgba(0,20,10,0.75) 0%, rgba(5,46,22,0.2) 35%, rgba(16,185,129,0.1) 60%, rgba(0,20,10,0.75) 100%)',
      }} />

      {/* Emerald glow accents */}
      <div className="absolute inset-0 z-[2]" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(16,185,129,0.15) 0%, transparent 70%)',
      }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-10 left-7 z-[20] flex items-center gap-3"
      >
        <img src="/SuperAltoround.png" alt="SuperAlto" className="h-20 w-auto object-contain" />
        <span className="font-black text-xl tracking-wide">
          <span style={{ color: '#fff' }}>SUPER</span>
          <span style={{ color: '#ad1e1e' }}>ALTO</span>
          <span style={{ color: '#fff' }}>.AI</span>
        </span>
      </motion.div>

      {/* Main content card */}
      <div className="absolute inset-0 z-[20] flex items-center justify-center px-6">
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-2xl px-8 py-10"
          style={{
            background: 'rgba(10,0,21,0.6)',
            border: '1px solid rgba(52,211,153,0.3)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 60px rgba(16,185,129,0.15)',
          }}
        >
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '32px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#ffffff',
              textAlign: 'center',
              margin: 0,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Find Your Perfect Car
          </motion.h2>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-4 mb-8"
          >
            {[
              { label: '15,000+ Cars', value: 'Largest inventory' },
              { label: 'AI-Powered', value: 'Smart search' },
              { label: '100% Free', value: 'No hidden fees' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(52,211,153,0.2)',
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#34d399',
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              textAlign: 'center',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Start Searching Now
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom footer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-7 right-7 z-[20] text-center"
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '16px',
          letterSpacing: '0.05em',
          fontWeight: 900,
          margin: 0,
          textAlign: 'center',
        }}>
          <span style={{ color: '#ffffff' }}>SUPER</span>
          <span style={{ color: '#ad1e1e' }}>ALTO</span>
          <span style={{ color: '#ffffff' }}>.AI</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
