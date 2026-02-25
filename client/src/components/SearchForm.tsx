import { useState, useRef, useEffect } from 'react';
import { AIRPORTS } from '@flydeal/types';

interface SearchFormProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
  }) => void;
  initialValues?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    adults?: number;
  };
  compact?: boolean;
  loading?: boolean;
}

export default function SearchForm({
  onSearch,
  initialValues = {},
  compact = false,
  loading = false,
}: SearchFormProps) {
  const [origin, setOrigin] = useState(initialValues.origin || '');
  const [destination, setDestination] = useState(initialValues.destination || '');
  const [departureDate, setDepartureDate] = useState(initialValues.departureDate || '');
  const [returnDate, setReturnDate] = useState(initialValues.returnDate || '');
  const [adults, setAdults] = useState(initialValues.adults || 1);
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>(
    initialValues.returnDate ? 'roundtrip' : 'oneway'
  );

  const [originSuggestions, setOriginSuggestions] = useState<typeof AIRPORTS>([]);
  const [destSuggestions, setDestSuggestions] = useState<typeof AIRPORTS>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

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

  const selectOrigin = (code: string) => {
    setOrigin(code);
    setShowOriginSuggestions(false);
  };

  const selectDest = (code: string) => {
    setDestination(code);
    setShowDestSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) return;

    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      adults,
    });
  };

  const today = new Date().toISOString().split('T')[0];

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1" ref={originRef}>
          <input
            type="text"
            value={origin}
            onChange={(e) => handleOriginChange(e.target.value)}
            onFocus={() => setShowOriginSuggestions(true)}
            placeholder="From"
            className="input"
            maxLength={3}
            required
          />
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {originSuggestions.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => selectOrigin(airport.code)}
                  className="px-4 py-2 hover:bg-primary-50 cursor-pointer"
                >
                  <span className="font-medium">{airport.code}</span>
                  <span className="text-gray-500 ml-2">
                    {airport.city}, {airport.country}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex-1" ref={destRef}>
          <input
            type="text"
            value={destination}
            onChange={(e) => handleDestChange(e.target.value)}
            onFocus={() => setShowDestSuggestions(true)}
            placeholder="To"
            className="input"
            maxLength={3}
            required
          />
          {showDestSuggestions && destSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {destSuggestions.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => selectDest(airport.code)}
                  className="px-4 py-2 hover:bg-primary-50 cursor-pointer"
                >
                  <span className="font-medium">{airport.code}</span>
                  <span className="text-gray-500 ml-2">
                    {airport.city}, {airport.country}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          min={today}
          className="input flex-1"
          required
        />

        <button
          type="submit"
          disabled={loading || !origin || !destination || !departureDate}
          className="btn btn-primary whitespace-nowrap"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            checked={tripType === 'roundtrip'}
            onChange={() => setTripType('roundtrip')}
            className="w-4 h-4 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Round trip</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            checked={tripType === 'oneway'}
            onChange={() => setTripType('oneway')}
            className="w-4 h-4 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">One way</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative" ref={originRef}>
          <label htmlFor="origin" className="label">
            From
          </label>
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) => handleOriginChange(e.target.value)}
            onFocus={() => setShowOriginSuggestions(true)}
            placeholder="Airport code (e.g., JFK)"
            className="input"
            maxLength={3}
            required
          />
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {originSuggestions.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => selectOrigin(airport.code)}
                  className="px-4 py-3 hover:bg-primary-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary-600">{airport.code}</span>
                    <span className="text-xs text-gray-400">{airport.country}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{airport.city} - {airport.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative" ref={destRef}>
          <label htmlFor="destination" className="label">
            To
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => handleDestChange(e.target.value)}
            onFocus={() => setShowDestSuggestions(true)}
            placeholder="Airport code (e.g., LHR)"
            className="input"
            maxLength={3}
            required
          />
          {showDestSuggestions && destSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {destSuggestions.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => selectDest(airport.code)}
                  className="px-4 py-3 hover:bg-primary-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary-600">{airport.code}</span>
                    <span className="text-xs text-gray-400">{airport.country}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{airport.city} - {airport.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="departureDate" className="label">
            Departure Date
          </label>
          <input
            id="departureDate"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={today}
            className="input"
            required
          />
        </div>

        {tripType === 'roundtrip' && (
          <div>
            <label htmlFor="returnDate" className="label">
              Return Date
            </label>
            <input
              id="returnDate"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={departureDate || today}
              className="input"
              required={tripType === 'roundtrip'}
            />
          </div>
        )}

        <div>
          <label htmlFor="adults" className="label">
            Passengers
          </label>
          <select
            id="adults"
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            className="input"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Adult' : 'Adults'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !origin || !destination || !departureDate}
        className="btn btn-primary w-full py-3 text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Searching...
          </span>
        ) : (
          'Search Flights'
        )}
      </button>
    </form>
  );
}
