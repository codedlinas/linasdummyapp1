import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HistoryItem {
  id: number;
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
  nonStop: boolean;
  resultsCount: number;
  lowestPrice?: number;
  createdAt: string;
  query: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
  };
}

function HistoryCard({ 
  item, 
  onDelete 
}: { 
  item: HistoryItem;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="card card-hover">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-gray-900">{item.originLocationCode}</span>
            <ArrowIcon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{item.destinationLocationCode}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span>{formatDate(item.departureDate)}</span>
            {item.returnDate && (
              <>
                <span>-</span>
                <span>{formatDate(item.returnDate)}</span>
              </>
            )}
            <span>•</span>
            <span>{item.adults} {item.adults === 1 ? 'passenger' : 'passengers'}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Searched {formatDateTime(item.createdAt)}
          </p>
        </div>
        
        <div className="flex items-center justify-between md:justify-end space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Results</p>
            <p className="text-lg font-semibold text-gray-900">{item.resultsCount}</p>
          </div>
          
          {item.lowestPrice && (
            <div className="text-center">
              <p className="text-sm text-gray-500">Lowest</p>
              <p className="text-lg font-semibold text-green-600">${item.lowestPrice.toFixed(2)}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Link
              to={`/search?origin=${item.originLocationCode}&dest=${item.destinationLocationCode}&date=${item.departureDate}${item.returnDate ? `&return=${item.returnDate}` : ''}&pax=${item.adults}`}
              className="btn btn-secondary text-sm"
            >
              Search Again
            </Link>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="skeleton h-5 w-32 mb-2" />
          <div className="skeleton h-4 w-48 mb-2" />
          <div className="skeleton h-3 w-24" />
        </div>
        <div className="flex items-center space-x-6">
          <div className="skeleton h-12 w-16" />
          <div className="skeleton h-12 w-16" />
          <div className="skeleton h-10 w-28" />
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

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch('/api/history?limit=20');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
        setTotal(data.meta?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setHistory(history.filter((h) => h.id !== id));
        setTotal(total - 1);
      }
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  }

  async function handleClearAll() {
    if (!confirm('Are you sure you want to clear all search history?')) return;
    
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setHistory([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search History</h1>
          <p className="text-gray-500">Your recent flight searches</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <HistorySkeleton />
          <HistorySkeleton />
          <HistorySkeleton />
        </div>
      ) : history.length > 0 ? (
        <>
          <p className="text-sm text-gray-500">{total} search{total !== 1 ? 'es' : ''} total</p>
          <div className="space-y-4">
            {history.map((item) => (
              <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No search history yet</p>
          <p className="text-sm text-gray-400 mt-2 mb-4">Your searches will appear here</p>
          <Link to="/search" className="btn btn-primary">
            Search Flights
          </Link>
        </div>
      )}
    </div>
  );
}

export default History;
