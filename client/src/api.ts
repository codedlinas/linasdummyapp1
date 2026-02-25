import type {
  FlightSearchParams,
  FlightSearchResponse,
  PriceAlert,
  SearchHistory,
  Deal,
  ApiStatus,
} from '@flydeal/types';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
  const queryParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    adults: String(params.adults || 1),
  });

  if (params.returnDate) {
    queryParams.set('returnDate', params.returnDate);
  }
  if (params.children) {
    queryParams.set('children', String(params.children));
  }
  if (params.infants) {
    queryParams.set('infants', String(params.infants));
  }
  if (params.travelClass) {
    queryParams.set('travelClass', params.travelClass);
  }
  if (params.nonStop !== undefined) {
    queryParams.set('nonStop', String(params.nonStop));
  }
  if (params.maxPrice) {
    queryParams.set('maxPrice', String(params.maxPrice));
  }

  const response = await fetch(`${API_BASE}/flights/search?${queryParams}`);
  return handleResponse<FlightSearchResponse>(response);
}

export async function getApiStatus(): Promise<ApiStatus> {
  const response = await fetch(`${API_BASE}/flights/status`);
  return handleResponse<ApiStatus>(response);
}

export async function getDeals(): Promise<{ data: Deal[]; meta: { count: number } }> {
  const response = await fetch(`${API_BASE}/deals`);
  return handleResponse<{ data: Deal[]; meta: { count: number } }>(response);
}

export async function createAlert(alert: {
  origin: string;
  destination: string;
  maxPrice: number;
  email: string;
}): Promise<PriceAlert> {
  const response = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alert),
  });
  return handleResponse<PriceAlert>(response);
}

export async function getAlerts(email?: string): Promise<{ data: PriceAlert[]; meta: { count: number } }> {
  const url = email ? `${API_BASE}/alerts?email=${encodeURIComponent(email)}` : `${API_BASE}/alerts`;
  const response = await fetch(url);
  return handleResponse<{ data: PriceAlert[]; meta: { count: number } }>(response);
}

export async function deleteAlert(id: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/alerts/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ success: boolean; message: string }>(response);
}

export async function getHistory(limit?: number): Promise<{ data: SearchHistory[]; meta: { count: number } }> {
  const url = limit ? `${API_BASE}/history?limit=${limit}` : `${API_BASE}/history`;
  const response = await fetch(url);
  return handleResponse<{ data: SearchHistory[]; meta: { count: number } }>(response);
}
