import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import AlertForm from '../components/AlertForm';
import { FlightCardSkeleton } from '../components/SkeletonLoader';
import { searchFlights, createAlert } from '../api';
import type { FlightOffer, FlightSearchResponse } from '@flydeal/types';

type SortOption = 'price' | 'duration' | 'stops';

function getDurationMinutes(duration: string): number {
  const match = duration.match(/PT(\d+)H(\d+)?M?/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + minutes;
}

function getStops(flight: FlightOffer): number {
  return flight.itineraries[0].segments.length - 1;
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<FlightSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [creatingAlert, setCreatingAlert] = useState(false);

  const initialValues = {
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    departureDate: searchParams.get('departureDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    adults: parseInt(searchParams.get('adults') || '1'),
  };

  useEffect(() => {
    if (initialValues.origin && initialValues.destination && initialValues.departureDate) {
      handleSearch(initialValues);
    }
  }, []);

  const handleSearch = async (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
  }) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const newParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      adults: String(params.adults),
    });
    if (params.returnDate) {
      newParams.set('returnDate', params.returnDate);
    }
    setSearchParams(newParams);

    try {
      const data = await searchFlights(params);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAlert = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setShowAlertModal(true);
    setAlertSuccess(false);
  };

  const handleCreateAlert = async (data: {
    origin: string;
    destination: string;
    maxPrice: number;
    email: string;
  }) => {
    setCreatingAlert(true);
    try {
      await createAlert(data);
      setAlertSuccess(true);
      setTimeout(() => {
        setShowAlertModal(false);
        setAlertSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert');
    } finally {
      setCreatingAlert(false);
    }
  };

  const sortedResults = results?.data
    ? [...results.data].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return parseFloat(a.price.total) - parseFloat(b.price.total);
          case 'duration':
            return (
              getDurationMinutes(a.itineraries[0].duration) -
              getDurationMinutes(b.itineraries[0].duration)
            );
          case 'stops':
            return getStops(a) - getStops(b);
          default:
            return 0;
        }
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Flights</h1>
        <p className="text-gray-600">Find the best deals on flights worldwide</p>
      </div>

      <div className="card mb-8">
        <SearchForm
          onSearch={handleSearch}
          initialValues={initialValues}
          loading={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <FlightCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && results && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {results.data.length}
              </span>{' '}
              flights found
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input py-2 w-auto"
              >
                <option value="price">Price (Low to High)</option>
                <option value="duration">Duration (Shortest)</option>
                <option value="stops">Stops (Fewest)</option>
              </select>
            </div>
          </div>

          {sortedResults.length === 0 ? (
            <div className="card text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No flights found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search criteria or selecting different dates
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedResults.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  carriers={results.dictionaries?.carriers}
                  onSetAlert={() => handleSetAlert(flight)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !results && !error && (
        <div className="card text-center py-16">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Ready to find your flight?
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter your travel details above to search for the best flight deals
          </p>
        </div>
      )}

      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowAlertModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {alertSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Alert Created!
                </h3>
                <p className="text-gray-500">
                  We'll notify you when the price drops
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Create Price Alert
                </h2>
                <p className="text-gray-500 mb-6">
                  Get notified when prices drop for this route
                </p>

                <AlertForm
                  onSubmit={handleCreateAlert}
                  initialValues={{
                    origin: selectedFlight?.itineraries[0].segments[0].departure.iataCode,
                    destination:
                      selectedFlight?.itineraries[0].segments[
                        selectedFlight.itineraries[0].segments.length - 1
                      ].arrival.iataCode,
                    maxPrice: selectedFlight
                      ? Math.round(parseFloat(selectedFlight.price.total) * 0.9)
                      : undefined,
                  }}
                  loading={creatingAlert}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
