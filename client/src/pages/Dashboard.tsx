import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { DealCardSkeleton } from '../components/SkeletonLoader';
import { getDeals, getAlerts } from '../api';
import type { Deal, PriceAlert } from '@flydeal/types';
import { AIRLINE_NAMES } from '@flydeal/types';

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+)H(\d+)?M?/);
  if (!match) return isoDuration;
  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return `${hours}h ${minutes}m`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadDeals();
    loadAlerts();
  }, []);

  const loadDeals = async () => {
    try {
      const response = await getDeals();
      setDeals(response.data);
    } catch (error) {
      console.error('Failed to load deals:', error);
    } finally {
      setLoadingDeals(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const response = await getAlerts();
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleQuickSearch = (params: {
    origin: string;
    destination: string;
    departureDate: string;
  }) => {
    setSearchLoading(true);
    const searchParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      adults: '1',
    });
    navigate(`/search?${searchParams}`);
  };

  const handleDealClick = (deal: Deal) => {
    const searchParams = new URLSearchParams({
      origin: deal.origin,
      destination: deal.destination,
      departureDate: deal.departureDate,
      ...(deal.returnDate && { returnDate: deal.returnDate }),
      adults: '1',
    });
    navigate(`/search?${searchParams}`);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Flight Deal
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Compare prices from multiple airlines and save on your next adventure
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
            <SearchForm
              onSearch={handleQuickSearch}
              compact
              loading={searchLoading}
            />
          </div>
        </div>

        <div className="h-16 bg-gray-50" style={{
          clipPath: 'ellipse(75% 100% at 50% 100%)',
          marginBottom: '-1px'
        }} />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {alerts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Price Alerts</h2>
              <button
                onClick={() => navigate('/alerts')}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View All
              </button>
            </div>

            {loadingAlerts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card">
                    <div className="skeleton h-5 w-24 mb-2" />
                    <div className="skeleton h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="card cursor-pointer"
                    onClick={() => {
                      const params = new URLSearchParams({
                        origin: alert.origin,
                        destination: alert.destination,
                        departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0],
                        adults: '1',
                      });
                      navigate(`/search?${params}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {alert.origin} → {alert.destination}
                        </p>
                        <p className="text-sm text-gray-500">
                          Alert when under ${alert.maxPrice}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-primary-600">
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
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trending Deals</h2>
              <p className="text-gray-500 mt-1">Popular routes with great prices</p>
            </div>
          </div>

          {loadingDeals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <DealCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => handleDealClick(deal)}
                  className="card cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {deal.origin} → {deal.destination}
                      </p>
                      <p className="text-sm text-gray-500">
                        {AIRLINE_NAMES[deal.airline] || deal.airline}
                      </p>
                    </div>
                    <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(deal.departureDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {deal.returnDate && (
                        <>
                          {' - '}
                          {new Date(deal.returnDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDuration(deal.duration)}
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-2xl font-bold text-primary-600">
                        ${deal.price}
                      </p>
                    </div>
                    <span className="text-primary-600 font-medium text-sm group-hover:underline">
                      View Deal →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FlyDeal?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We help you find the best flight deals and never miss a price drop
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-card flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600">
                Compare prices across multiple airlines instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-card flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Price Alerts
              </h3>
              <p className="text-gray-600">
                Get notified when prices drop on your favorite routes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-card flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Find deals you won't see anywhere else
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
