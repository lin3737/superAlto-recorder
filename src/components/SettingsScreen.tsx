import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import type { Car } from '../context/SettingsContext';

const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK_URL as string;

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(settings.searchLabel || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultCount, setResultCount] = useState<number | null>(settings.listings.length || null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Step 1: Send natural-language query to n8n to extract structured filters
      const n8nRes = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      if (!n8nRes.ok) throw new Error(`Filter extraction failed (${n8nRes.status})`);

      const n8nJson = await n8nRes.json();

      // n8n returns { output: "<JSON string>" }
      const parsed = typeof n8nJson.output === 'string'
        ? JSON.parse(n8nJson.output)
        : n8nJson.output ?? n8nJson;

      const filters = parsed?.filters ?? parsed;

      const makes: string[] = filters?.makes ?? [];
      const models: string[] = filters?.models ?? [];
      const location: string = filters?.location ?? '';
      const minPrice: number | null = filters?.minPrice != null ? Number(filters.minPrice) : null;
      const maxPrice: number | null = filters?.maxPrice != null ? Number(filters.maxPrice) : null;
      const fuelType: string = filters?.fuelType ?? '';
      const transmission: string = filters?.transmission ?? '';

      // Strategy: if makes are specified, query Firestore by make directly so we get
      // ALL matching docs instead of a random slice of 16k+ documents.
      // The collection has two schema variants: some docs use "make", others use "Make".
      // Run both in parallel and merge + deduplicate by doc id.
      let snapDocs: import('firebase/firestore').QueryDocumentSnapshot[] = [];

      if (makes.length > 0 && makes.length <= 30) {
        const [snapLower, snapUpper] = await Promise.all([
          getDocs(query(collection(db, 'cars-data'), where('make', 'in', makes))),
          getDocs(query(collection(db, 'cars-data'), where('Make', 'in', makes))),
        ]);
        const seen = new Set<string>();
        for (const doc of [...snapLower.docs, ...snapUpper.docs]) {
          if (!seen.has(doc.id)) { seen.add(doc.id); snapDocs.push(doc); }
        }
      } else {
        // No make filter — fetch a large batch and filter client-side
        const snap = await getDocs(query(collection(db, 'cars-data'), limit(Math.max(settings.carsToShow * 50, 2000))));
        snapDocs = snap.docs;
      }

      const cars: Car[] = snapDocs
        .map((doc) => {
          const d = doc.data();
          // Handle both schema variants: make/Make, model/Model, fuelType/fuel_type
          const makeName = (d.make || d.Make || '').trim();
          const modelName = (d.model || d.Model || '').trim();
          const fuelName = (d.fuel || d.fuelType || d.fuel_type || '').trim();
          const locationName = (d.location || d.city || '').trim();
          const priceNum = typeof d.price === 'number' ? d.price : Number(String(d.price ?? '').replace(/[^0-9.]/g, '')) || 0;
          const image = Array.isArray(d.images) && d.images.length > 0
            ? d.images[0]
            : (d.image || d.mainImage || d.thumbnail || '');
          const title = d.title || [makeName, modelName, d.year].filter(Boolean).join(' ') || doc.id;
          const kmRaw = d.km ?? d.mileage ?? d.kilometers ?? null;
          const kmStr = kmRaw != null
            ? `${Number(String(kmRaw).replace(/[^0-9]/g, '')).toLocaleString()} km`
            : '—';
          return {
            id: doc.id,
            title,
            price: priceNum ? `€${priceNum.toLocaleString()}` : (d.price ? String(d.price) : '—'),
            km: kmStr,
            fuel: fuelName || '—',
            transmission: (d.transmission || d.gearbox || '—').trim(),
            location: locationName.toUpperCase(),
            image,
            // raw values for client-side filtering (all lowercased)
            _priceNum: priceNum,
            _make: makeName.toLowerCase(),
            _model: modelName.toLowerCase(),
            _location: locationName.toLowerCase(),
            _fuel: fuelName.toLowerCase(),
            _transmission: (d.transmission || d.gearbox || '').toLowerCase(),
          };
        })
        // Client-side filters
        .filter((car: any) => {
          if (makes.length > 0 && !makes.some(m => car._make === m.toLowerCase())) return false;
          if (models.length > 0 && !models.some(m => car._model.includes(m.toLowerCase()))) return false;
          if (location && !car._location.includes(location.toLowerCase())) return false;
          if (minPrice != null && car._priceNum < minPrice) return false;
          if (maxPrice != null && car._priceNum > maxPrice) return false;
          if (fuelType && !car._fuel.includes(fuelType.toLowerCase())) return false;
          if (transmission && !car._transmission.includes(transmission.toLowerCase())) return false;
          return true;
        })
        // Sort by price ascending
        .sort((a: any, b: any) => a._priceNum - b._priceNum)
        .slice(0, settings.carsToShow)
        .map(({ _priceNum, _make, _model, _location, _fuel, _transmission, ...car }: any) => car as Car);

      const label = filters?.searchQuery || searchQuery.trim();

      updateSettings({
        searchMake: makes[0] ?? '',
        searchCity: location,
        searchMinPrice: minPrice ?? 0,
        searchMaxPrice: maxPrice ?? 0,
        listings: cars,
        searchLabel: label,
      });

      setResultCount(cars.length);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pb-12">

        {/* AI-powered search */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-1">Search Listings</h2>
          <p className="text-xs text-gray-400 mb-3">Describe what you're looking for in plain language.</p>
          <div className="space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. BMW in Tirana between 20k and 25k"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Searching…</>
              ) : (
                <><Search className="w-4 h-4" /> Search</>
              )}
            </button>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
            )}
            {!error && resultCount !== null && (
              <p className="text-xs text-center text-gray-500">
                {resultCount === 0 ? 'No listings found.' : `${resultCount} listing${resultCount !== 1 ? 's' : ''} loaded.`}
              </p>
            )}
          </div>
        </section>

        {/* Durations */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-2">Transition Speeds (ms)</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cover Screen Duration</label>
              <input 
                type="range" 
                min="1000" max="5000" step="500"
                value={settings.coverDuration}
                onChange={(e) => updateSettings({ coverDuration: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-xs text-gray-500 mt-0.5">{settings.coverDuration}ms</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Listing Screen Duration</label>
              <input 
                type="range" 
                min="2000" max="10000" step="1000"
                value={settings.infoDuration}
                onChange={(e) => updateSettings({ infoDuration: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-xs text-gray-500 mt-0.5">{settings.infoDuration}ms</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">CTA Screen Duration</label>
              <input 
                type="range" 
                min="1000" max="5000" step="500"
                value={settings.ctaDuration}
                onChange={(e) => updateSettings({ ctaDuration: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-xs text-gray-500 mt-0.5">{settings.ctaDuration}ms</div>
            </div>
          </div>
        </section>

        {/* Listings — Cars to Show */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-2">Listings — Cars to Show</h2>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Number of Cars</label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={settings.carsToShow}
              onChange={(e) => updateSettings({ carsToShow: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-xs text-gray-500 mt-0.5">{settings.carsToShow} cars</div>
          </div>
        </section>

      </div>
    </div>
  );
}
