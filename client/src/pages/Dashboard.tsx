import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Deal, PriceAlert } from '@flydeal/types';

interface DealCardProps {
  deal: Deal;
}

function DealCard({ deal }: DealCardProps) {
  return (
    <div className="card card-hover">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{deal.originCity}</span>
            <ArrowIcon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{deal.destinationCity}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {deal.originLocationCode} → {deal.destinationLocationCode}
          </p>
        </div>
        {deal.isHot && (
          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
            Hot Deal
          </span>
        )}
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-500">{deal.airline}</p>
          <p className="text-sm text-gray-500">{formatDate(deal.departureDate)}</p>
        </div>
        <div className="text-right">
          {deal.discount && (
            <span className="text-xs text-green-600 font-medium">-{deal.discount}%</span>
          )}
          <p className="text-2xl font-bold text-sky-600">
            ${deal.price}
          </p>
        </div>
      </div>
    </div>
  );
}

function DealSkeleton() {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="skeleton h-5 w-40 mb-2" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="skeleton h-4 w-28 mb-1" />
          <div className="skeleton h-4 w-20" />
        </div>
        <div className="skeleton h-8 w-16" />
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: PriceAlert }) {
  return (
    <div className="card card-hover border-l-4 border-sky-500">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{alert.originLocationCode}</span>
            <ArrowIcon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{alert.destinationLocationCode}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{formatDate(alert.departureDate)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Target: ${alert.targetPrice}</p>
          {alert.currentPrice && (
            <p className={`text-lg font-semibold ${
              alert.currentPrice <= alert.targetPrice ? 'text-green-600' : 'text-gray-900'
            }`}>
              ${alert.currentPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function Dashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dealsRes, alertsRes] = await Promise.all([
          fetch('/api/deals/trending'),
          fetch('/api/alerts'),
        ]);
        
        const dealsData = await dealsRes.json();
        const alertsData = await alertsRes.json();
        
        if (dealsData.success) setDeals(dealsData.data);
        if (alertsData.success) setAlerts(alertsData.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Next Adventure</h1>
          <p className="text-sky-100 mb-6">Discover the best flight deals and save on your travels</p>
          <Link to="/search" className="inline-flex items-center bg-white text-sky-600 px-6 py-3 rounded-lg font-medium hover:bg-sky-50 transition-colors">
            Search Flights
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Trending Deals</h2>
          <Link to="/search" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              <DealSkeleton />
              <DealSkeleton />
              <DealSkeleton />
            </>
          ) : deals.length > 0 ? (
            deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No trending deals available
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Price Alerts</h2>
          <Link to="/alerts" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
            Manage alerts →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            <div className="card">
              <div className="skeleton h-16 w-full" />
            </div>
            <div className="card">
              <div className="skeleton h-16 w-full" />
            </div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-500 mb-4">No price alerts set up yet</p>
            <Link to="/alerts" className="btn btn-primary">
              Create Alert
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
