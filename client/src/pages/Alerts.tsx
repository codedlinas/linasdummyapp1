import { useState, useEffect, FormEvent } from 'react';
import type { PriceAlert } from '@flydeal/types';

function AlertForm({ onSubmit, loading }: { onSubmit: (data: Partial<PriceAlert>) => void; loading: boolean }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate,
      returnDate: returnDate || undefined,
      targetPrice: Number(targetPrice),
      notificationEmail: email || undefined,
    });
    setOrigin('');
    setDestination('');
    setDepartureDate('');
    setReturnDate('');
    setTargetPrice('');
    setEmail('');
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Alert</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="label">From (Airport Code)</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="e.g., JFK"
            className="input"
            maxLength={3}
            required
          />
        </div>
        <div>
          <label className="label">To (Airport Code)</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., LAX"
            className="input"
            maxLength={3}
            required
          />
        </div>
        <div>
          <label className="label">Departure Date</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={minDate}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">Return Date (optional)</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate || minDate}
            className="input"
          />
        </div>
        <div>
          <label className="label">Target Price ($)</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="e.g., 200"
            className="input"
            min="1"
            required
          />
        </div>
        <div>
          <label className="label">Notification Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </div>
    </form>
  );
}

function AlertCard({ 
  alert, 
  onToggle, 
  onDelete 
}: { 
  alert: PriceAlert; 
  onToggle: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className={`card card-hover border-l-4 ${alert.isActive ? 'border-sky-500' : 'border-gray-300'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-gray-900">{alert.originLocationCode}</span>
            <ArrowIcon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{alert.destinationLocationCode}</span>
            {!alert.isActive && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Paused</span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(alert.departureDate)}
            {alert.returnDate && ` - ${formatDate(alert.returnDate)}`}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Created {formatDate(alert.createdAt)}
          </p>
        </div>
        
        <div className="flex items-center justify-between md:justify-end space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Target</p>
            <p className="text-lg font-semibold text-sky-600">${alert.targetPrice}</p>
          </div>
          
          {alert.currentPrice && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Current</p>
              <p className={`text-lg font-semibold ${
                alert.currentPrice <= alert.targetPrice ? 'text-green-600' : 'text-gray-900'
              }`}>
                ${alert.currentPrice}
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggle(alert.id, !alert.isActive)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                alert.isActive
                  ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={alert.isActive ? 'Pause alert' : 'Activate alert'}
            >
              {alert.isActive ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => onDelete(alert.id)}
              className="px-3 py-1 rounded text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Delete alert"
            >
              Delete
            </button>
          </div>
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

function Alerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(alertData: Partial<PriceAlert>) {
    setCreating(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });
      const data = await res.json();
      if (data.success) {
        setAlerts([data.data, ...alerts]);
      }
    } catch (error) {
      console.error('Failed to create alert:', error);
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(id: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setAlerts(alerts.map((a) => (a.id === id ? data.data : a)));
      }
    } catch (error) {
      console.error('Failed to toggle alert:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this alert?')) return;
    
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAlerts(alerts.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Price Alerts</h1>
        <p className="text-gray-500">Get notified when prices drop below your target</p>
      </div>

      <AlertForm onSubmit={handleCreate} loading={creating} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Alerts</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="skeleton h-20 w-full" />
              </div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No price alerts yet</p>
            <p className="text-sm text-gray-400 mt-2">Create your first alert above</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export default Alerts;
