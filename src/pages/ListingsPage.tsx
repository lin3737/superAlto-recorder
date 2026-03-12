import { useState } from 'react';
import InfoScreen from '../components/InfoScreen';

export default function ListingsPage() {
  const [key, setKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 sm:p-8 font-sans">
      <div className="relative w-full h-full max-w-md mx-auto bg-black overflow-hidden shadow-2xl sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-900 sm:h-[850px] sm:my-8">
        <InfoScreen
          key={key}
          onComplete={() => setKey(k => k + 1)}
        />
      </div>
    </div>
  );
}
