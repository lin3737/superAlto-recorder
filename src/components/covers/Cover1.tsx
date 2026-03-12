import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import campaigns from '../../data/campaigns.json';

export default function Cover1({ onComplete, isStatic }: { onComplete?: () => void; isStatic?: boolean }) {
  const { settings } = useSettings();
  const campaign = campaigns.find(c => c.id === settings.activeCampaignId) || campaigns[0];
  const searchText = settings.searchLabel || campaign.searchString;
  const title = settings.searchMake ? `Searching for a ${settings.searchMake}?` : campaign.title;
  const [typedText, setTypedText] = useState('');
  
  useEffect(() => {
    if (isStatic) {
      setTypedText(searchText);
      return;
    }

    setTypedText('');
    const textToType = searchText;
    const duration = settings.coverDuration; // e.g. 2000ms
    const interval = duration / textToType.length;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= textToType.length) {
        setTypedText(textToType.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, interval);

    const timeout = setTimeout(() => {
      onComplete?.();
    }, duration + 500); // Add a small buffer after typing finishes

    return () => {
      clearInterval(typingInterval);
      clearTimeout(timeout);
    };
  }, [searchText, settings.coverDuration, onComplete, isStatic]);

  const getFilterClass = () => {
    switch (settings.colorScheme) {
      case 'red': return 'bg-red-900/60 mix-blend-multiply';
      case 'blue': return 'bg-blue-900/60 mix-blend-multiply';
      case 'dark': return 'bg-black/60 mix-blend-multiply';
      default: return 'bg-red-900/60 mix-blend-multiply';
    }
  };

  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1080")' }}
      />
      
      {/* Color Filter */}
      <div 
        className={`absolute inset-0 z-10 ${getFilterClass()}`}
        style={{ opacity: settings.filterIntensity }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

      {/* TOP — Logo */}
      <motion.div
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-[40] flex items-center justify-center"
      >
        <img src="/SuperAltoLogo2.png" alt="SuperAlto" className="h-50 w-auto object-contain" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 w-full px-6 flex flex-col items-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            {title}
          </h1>
        </motion.div>

        {/* Glassmorphism Search Bar */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl flex items-center gap-3"
        >
          <Search className="text-white/70 w-6 h-6" />
          <div className="flex-1 h-8 flex items-center">
            <span className="text-white text-lg font-medium">
              {typedText}
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-0.5 h-5 bg-white ml-1 align-middle"
              />
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
