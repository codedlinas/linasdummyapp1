import { useState, useRef, useEffect } from 'react';
import { AIRPORTS } from '@flydeal/types';

interface AlertFormProps {
  onSubmit: (data: {
    origin: string;
    destination: string;
    maxPrice: number;
    email: string;
  }) => void;
  initialValues?: {
    origin?: string;
    destination?: string;
    maxPrice?: number;
  };
  loading?: boolean;
}

export default function AlertForm({ onSubmit, initialValues = {}, loading = false }: AlertFormProps) {
  const [origin, setOrigin] = useState(initialValues.origin || '');
  const [destination, setDestination] = useState(initialValues.destination || '');
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice?.toString() || '');
  const [email, setEmail] = useState('');

  const [originSuggestions, setOriginSuggestions] = useState<typeof AIRPORTS>([]);
  const [destSuggestions, setDestSuggestions] = useState<typeof AIRPORTS>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValues.origin) setOrigin(initialValues.origin);
    if (initialValues.destination) setDestination(initialValues.destination);
    if (initialValues.maxPrice) setMaxPrice(initialValues.maxPrice.toString());
  }, [initialValues.origin, initialValues.destination, initialValues.maxPrice]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterAirports = (query: string) => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    ).slice(0, 6);
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value.toUpperCase());
    setOriginSuggestions(filterAirports(value));
    setShowOriginSuggestions(true);
  };

  const handleDestChange = (value: string) => {
    setDestination(value.toUpperCase());
    setDestSuggestions(filterAirports(value));
    setShowDestSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !maxPrice || !email) return;

    onSubmit({
      origin,
      destination,
      maxPrice: parseFloat(maxPrice),
      email,
    });

    setOrigin('');
    setDestination('');
    setMaxPrice('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative" ref={originRef}>
          <label htmlFor="alert-origin" className="label">
            From
          </label>
          <input
            id="alert-origin"
            type="text"
            value={origin}
            onChange={(e) => handleOriginChange(e.target.value)}
            onFocus={() => setShowOriginSuggestions(true)}
            placeholder="Airport code"
            className="input"
            maxLength={3}
            required
          />
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
              {originSuggestions.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => {
                    setOrigin(airport.code);
                    setShowOriginSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-primary-50 cursor-pointer text-sm"
                >
                  <span className="font-medium">{airport.code}</span>
                  <span className="text-gray-500 ml-2">{airport.city}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative" ref={destRef}>
          <label htmlFor="alert-destination" className="label">
            To
          </label>
          <input
            id="alert-destination"
            type="text"
            value={destination}
            onChange={(e) => handleDestChange(e.target.value)}
            onFocus={() => setShowDestSuggestions(true)}
            placeholder="Airport code"
            className="input"
            maxLength={3}
            required
          />
          {showDestSuggestions && destSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
              {destSuggestions.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => {
                    setDestination(airport.code);
                    setShowDestSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-primary-50 cursor-pointer text-sm"
                >
                  <span className="font-medium">{airport.code}</span>
                  <span className="text-gray-500 ml-2">{airport.city}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="alert-maxPrice" className="label">
            Max Price (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="alert-maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="500"
              className="input pl-7"
              min="1"
              step="1"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="alert-email" className="label">
            Email for notifications
          </label>
          <input
            id="alert-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !origin || !destination || !maxPrice || !email}
        className="btn btn-primary w-full"
      >
        {loading ? 'Creating Alert...' : 'Create Price Alert'}
      </button>
    </form>
  );
}
