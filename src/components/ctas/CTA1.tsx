import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

export default function CTA1({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (isStatic) return;
    const timeout = setTimeout(() => { onComplete?.(); }, settings.ctaDuration);
    return () => clearTimeout(timeout);
  }, [settings.ctaDuration, onComplete, isStatic]);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1080")' }}
      />

      {/* Deep cinematic gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/70 to-black/20" />

      {/* Subtle red glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-10 bg-gradient-to-t from-red-900/60 to-transparent" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full px-7 pt-14 pb-12 justify-between">

        {/* Top — Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex items-center gap-3"
        >
          {/* Logo mark */}
          <div className="relative w-18 h-18 flex items-center justify-center">
            <img src="/SuperAltoround.png" alt="SuperAlto" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-2xl tracking-[0.15em] uppercase">
            <span className="text-white">SUPER</span>
            <span className="text-red-600">ALTO</span>
            <span className="text-white">.AI</span>
          </span>
        </motion.div>

        {/* Middle — Hero headline */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-red-400 text-sm font-bold uppercase tracking-[0.25em] mb-3">Albania's #1 Car Platform</p>
            <h1 className="text-[2.8rem] font-black text-white leading-[0.95] tracking-tight">
              Find Your<br />
              <span className="text-red-500">Perfect Car</span><br />
              Today.
            </h1>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-4"
          >
            {[
              { value: '15,000+', label: 'Cars' },
              { value: '100%', label: 'Free' },
              { value: 'AI', label: 'Powered' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl py-3 flex flex-col items-center"
              >
                <span className="text-white font-black text-xl leading-none">{stat.value}</span>
                <span className="text-white/50 text-xs font-medium mt-1 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom — URL + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col gap-1 items-center"
        >
          <div className="h-px w-12 bg-red-500 mb-3" />
          <p className="text-2xl font-black tracking-tight text-center">
            <span className="text-white">SUPER</span>
            <span className="text-red-600">ALTO</span>
            <span className="text-white">.AI</span>
          </p>
          <p className="text-white/50 text-sm font-medium tracking-wide text-center">Search smarter. Find faster.</p>
        </motion.div>

      </div>
    </motion.div>
  );
}
