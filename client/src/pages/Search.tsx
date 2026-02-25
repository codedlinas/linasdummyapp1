import { useState, FormEvent } from 'react';
import type { FlightOffer, SearchQuery, FlightSearchResponse } from '@flydeal/types';

interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

function FlightCard({ flight, carriers }: { flight: FlightOffer; carriers: Record<string, string> }) {
  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const stops = outbound.segments.length - 1;
  const airlineName = carriers[flight.validatingAirlineCodes[0]] || flight.validatingAirlineCodes[0];

  return (
    <div className="card card-hover">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-sky-600">{airlineName}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{flight.validatingAirlineCodes[0]} {firstSegment.number}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900">{formatTime(firstSegment.departure.at)}</p>
              <p className="text-sm text-gray-500">{firstSegment.departure.iataCode}</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <p className="text-xs text-gray-500 mb-1">{formatDuration(outbound.duration)}</p>
              <div className="w-full flex items-center">
                <div className="h-px bg-gray-300 flex-1" />
                <div className="mx-2">
                  {stops === 0 ? (
                    <span className="text-xs text-green-600 font-medium">Direct</span>
                  ) : (
                    <span className="text-xs text-orange-600 font-medium">{stops} stop{stops > 1 ? 's' : ''}</span>
                  )}
                </div>
                <div className="h-px bg-gray-300 flex-1" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900">{formatTime(lastSegment.arrival.at)}</p>
              <p className="text-sm text-gray-500">{lastSegment.arrival.iataCode}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div className="md:text-right">
            <p className="text-2xl font-bold text-sky-600">${flight.price.grandTotal}</p>
            <p className="text-xs text-gray-500">{flight.price.currency}</p>
          </div>
          <button className="btn btn-primary mt-0 md:mt-3">Select</button>
        </div>
      </div>
    </div>
  );
}

function FlightSkeleton() {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="flex items-center space-x-4">
            <div className="skeleton h-12 w-16" />
            <div className="flex-1 skeleton h-4" />
            <div className="skeleton h-12 w-16" />
          </div>
        </div>
        <div className="flex items-center justify-between md:flex-col md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div className="skeleton h-8 w-20 mb-2" />
          <div className="skeleton h-10 w-24" />
        </div>
      </div>
    </div>
  );
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  const hours = match[1] || '0';
  const minutes = match[2] || '0';
  return `${hours}h ${minutes}m`;
}

function Search() {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FlightOffer[]>([]);
  const [carriers, setCarriers] = useState<Record<string, string>>({});
  const [searched, setSearched] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Airport[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  async function searchAirports(query: string): Promise<Airport[]> {
    if (query.length < 2) return [];
    const res = await fetch(`/api/flights/airports/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.success ? data.data : [];
  }

  async function handleOriginChange(value: string) {
    setOrigin(value);
    if (value.length >= 2) {
      const suggestions = await searchAirports(value);
      setOriginSuggestions(suggestions);
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  }

  async function handleDestChange(value: string) {
    setDestination(value);
    if (value.length >= 2) {
      const suggestions = await searchAirports(value);
      setDestSuggestions(suggestions);
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(false);
    }
  }

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    const query: SearchQuery = {
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate,
      adults: passengers,
    };

    if (tripType === 'round-trip' && returnDate) {
      query.returnDate = returnDate;
    }

    try {
      const res = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      const data: { success: boolean; data?: FlightSearchResponse; error?: string } = await res.json();
      
      if (data.success && data.data) {
        setResults(data.data.data);
        setCarriers(data.data.dictionaries?.carriers || {});
      } else {
        console.error('Search failed:', data.error);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Flights</h1>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tripType"
                checked={tripType === 'round-trip'}
                onChange={() => setTripType('round-trip')}
                className="mr-2 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">Round trip</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tripType"
                checked={tripType === 'one-way'}
                onChange={() => setTripType('one-way')}
                className="mr-2 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">One way</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label className="label">From</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => handleOriginChange(e.target.value)}
                onFocus={() => originSuggestions.length > 0 && setShowOriginSuggestions(true)}
                onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                placeholder="City or airport"
                className="input"
                required
              />
              {showOriginSuggestions && originSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
                  {originSuggestions.map((airport) => (
                    <li
                      key={airport.iataCode}
                      className="px-4 py-2 hover:bg-sky-50 cursor-pointer"
                      onClick={() => {
                        setOrigin(airport.iataCode);
                        setShowOriginSuggestions(false);
                      }}
                    >
                      <span className="font-medium">{airport.iataCode}</span>
                      <span className="text-gray-500 ml-2">{airport.city}, {airport.country}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <label className="label">To</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestChange(e.target.value)}
                onFocus={() => destSuggestions.length > 0 && setShowDestSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                placeholder="City or airport"
                className="input"
                required
              />
              {showDestSuggestions && destSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
                  {destSuggestions.map((airport) => (
                    <li
                      key={airport.iataCode}
                      className="px-4 py-2 hover:bg-sky-50 cursor-pointer"
                      onClick={() => {
                        setDestination(airport.iataCode);
                        setShowDestSuggestions(false);
                      }}
                    >
                      <span className="font-medium">{airport.iataCode}</span>
                      <span className="text-gray-500 ml-2">{airport.city}, {airport.country}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="label">Departure</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={minDate}
                className="input"
                required
              />
            </div>

            {tripType === 'round-trip' && (
              <div>
                <label className="label">Return</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || minDate}
                  className="input"
                />
              </div>
            )}

            <div>
              <label className="label">Passengers</label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="input"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-primary px-8" disabled={loading}>
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? 'Searching...' : `${results.length} flights found`}
            </h2>
            {results.length > 0 && (
              <span className="text-sm text-gray-500">
                Sorted by price (lowest first)
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              <FlightSkeleton />
              <FlightSkeleton />
              <FlightSkeleton />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((flight) => (
                <FlightCard key={flight.id} flight={flight} carriers={carriers} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500">No flights found for your search criteria</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your dates or destinations</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
