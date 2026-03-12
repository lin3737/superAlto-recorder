import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Car = {
  id: string;
  title: string;
  price: string;
  km: string;
  fuel: string;
  transmission: string;
  location: string;
  image: string;
};

type Settings = {
  coverDuration: number;
  infoDuration: number;
  ctaDuration: number;
  colorScheme: 'red' | 'blue' | 'dark';
  filterIntensity: number;
  transitionDuration: number;
  transitionEase: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  carsToShow: number;
  // Firestore search params
  searchMake: string;
  searchCity: string;
  searchMinPrice: number;
  searchMaxPrice: number;
  // Fetched listings
  listings: Car[];
  searchLabel: string;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
  coverDuration: 2000,
  infoDuration: 5000,
  ctaDuration: 3000,
  colorScheme: 'red',
  filterIntensity: 0.8,
  transitionDuration: 0.8,
  transitionEase: 'linear',
  carsToShow: 15,
  searchMake: '',
  searchCity: '',
  searchMinPrice: 0,
  searchMaxPrice: 0,
  listings: [],
  searchLabel: '',
};

const STORAGE_KEY = 'superalto_settings';

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    // Merge with defaults so new fields are always present
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
