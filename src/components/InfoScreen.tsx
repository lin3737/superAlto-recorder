import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Fuel, Settings2, Gauge, Search } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function InfoScreen({ onComplete, isStatic }: { onComplete?: () => void, isStatic?: boolean, key?: string }) {
  const { settings } = useSettings();
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  // Build a display list: skip cars with no image URL or a failed image, pulling extras to fill the target count
  const allListings = settings.listings.filter(c => c.image);
  const cars = (() => {
    const result = [];
    for (const car of allListings) {
      if (result.length >= settings.carsToShow) break;
      if (!failedIds.has(car.id)) result.push(car);
    }
    return result;
  })();

  const handleImageError = (carId: string, originalSrc: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.dataset.triedOriginal) {
      // First fallback: try the original URL directly
      img.dataset.triedOriginal = '1';
      img.src = originalSrc;
    } else {
      // Both proxy and original failed — remove this car from display
      setFailedIds(prev => new Set(prev).add(carId));
    }
  };
  const label = settings.searchLabel || 'Car Listings';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef<number>(0);
  const everStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isStatic) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    // Only reset to top on a fresh start, not on resume
    if (!everStartedRef.current) {
      everStartedRef.current = true;
      scrolledRef.current = 0;
      container.scrollTop = 0;
    }

    let rafId: number;
    let completeTimeout: ReturnType<typeof setTimeout>;

    const entranceDelay = everStartedRef.current && scrolledRef.current > 0
      ? 0
      : settings.transitionDuration * 1000 + 50;

    const initTimeout = setTimeout(() => {
      const totalScroll = container.scrollHeight - container.clientHeight;
      if (totalScroll <= 0) {
        completeTimeout = setTimeout(() => onComplete?.(), settings.infoDuration);
        return;
      }

      const remainingScroll = totalScroll - scrolledRef.current;
      if (remainingScroll <= 0) {
        onComplete?.();
        return;
      }

      const pixelsPerMs = totalScroll / settings.infoDuration;
      const remainingMs = remainingScroll / pixelsPerMs;
      let lastTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (lastTimestamp === null) lastTimestamp = timestamp;
        const delta = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        scrolledRef.current = Math.min(scrolledRef.current + pixelsPerMs * delta, totalScroll);
        container.scrollTop = scrolledRef.current;

        if (scrolledRef.current < totalScroll) {
          rafId = window.requestAnimationFrame(step);
        }
      };

      rafId = window.requestAnimationFrame(step);
      completeTimeout = setTimeout(() => onComplete?.(), remainingMs + 200);
    }, entranceDelay);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(completeTimeout);
      window.cancelAnimationFrame(rafId);
    };
  }, [settings.infoDuration, settings.transitionDuration, onComplete, isStatic]);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: settings.transitionDuration, ease: settings.transitionEase }}
      className="absolute inset-0 w-full h-full bg-gray-100 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white shadow-sm z-10 px-4 py-4 shrink-0">
        <h2 className="text-lg font-bold text-gray-900 truncate">
          {label}
        </h2>
        <p className="text-sm text-gray-500">
          {cars.length} results found
        </p>
      </div>

      {/* Scrollable List */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20"
      >
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-24">
            <Search className="w-12 h-12 opacity-30" />
            <p className="text-sm font-medium">No listings loaded yet.</p>
            <p className="text-xs text-center">Go to Settings and search for car listings<br/>to display them here.</p>
          </div>
        ) : (
          cars.map((car, index) => (
            <motion.div 
              key={car.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 relative"
            >
              {/* Location Ribbon */}
              <div className="absolute top-4 -right-8 bg-red-600 text-white text-xs font-bold py-1 px-10 transform rotate-45 shadow-lg z-10 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {car.location}
              </div>

              {/* Car Image */}
              {car.image ? (
                <div className="h-48 w-full relative">
                  <img 
                    src={(() => {
                      const url = car.image;
                      const stripped = url.replace(/^https?:\/\//, '');
                      const prefix = url.startsWith('https') ? 'ssl:' : '';
                      return `https://wsrv.nl/?url=${prefix}${stripped}&w=600&output=jpg&n=-1`;
                    })()}
                    alt={car.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(car.id, car.image, e)}
                  />
                </div>
              ) : null}

              {/* Car Details */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{car.title}</h3>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col items-center justify-center text-center p-2 bg-gray-50 rounded-lg">
                    <Gauge className="w-5 h-5 text-red-600 mb-1" />
                    <span className="text-xs text-gray-600 font-medium">{car.km}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2 bg-gray-50 rounded-lg">
                    <Fuel className="w-5 h-5 text-red-600 mb-1" />
                    <span className="text-xs text-gray-600 font-medium">{car.fuel}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2 bg-gray-50 rounded-lg">
                    <Settings2 className="w-5 h-5 text-red-600 mb-1" />
                    <span className="text-xs text-gray-600 font-medium">{car.transmission}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                  <span className="text-2xl font-black text-gray-900">{car.price}</span>
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    View Details <span className="text-xl">→</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
