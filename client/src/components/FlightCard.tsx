import type { FlightOffer } from '@flydeal/types';
import { AIRLINE_NAMES } from '@flydeal/types';

interface FlightCardProps {
  flight: FlightOffer;
  onSetAlert?: () => void;
  carriers?: Record<string, string>;
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+)H(\d+)?M?/);
  if (!match) return isoDuration;
  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return `${hours}h ${minutes}m`;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function FlightCard({ flight, onSetAlert, carriers }: FlightCardProps) {
  const outbound = flight.itineraries[0];
  const returnItinerary = flight.itineraries[1];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const airline = flight.validatingAirlineCodes[0];
  const airlineName = carriers?.[airline] || AIRLINE_NAMES[airline] || airline;
  
  const stops = outbound.segments.length - 1;
  const stopsText = stops === 0 ? 'Nonstop' : stops === 1 ? '1 stop' : `${stops} stops`;

  return (
    <div className="card group">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <span className="text-primary-600 font-bold text-sm">{airline}</span>
          </div>
          <div className="lg:hidden">
            <p className="font-medium text-gray-900">{airlineName}</p>
            <p className="text-sm text-gray-500">{stopsText}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(firstSegment.departure.at)}
              </p>
              <p className="text-sm text-gray-500">{firstSegment.departure.iataCode}</p>
            </div>

            <div className="flex-1 flex flex-col items-center px-2">
              <p className="text-xs text-gray-400 mb-1">{formatDuration(outbound.duration)}</p>
              <div className="w-full flex items-center">
                <div className="flex-1 h-px bg-gray-300" />
                <svg
                  className="w-4 h-4 text-gray-400 -mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <p className="text-xs text-gray-500 mt-1">{stopsText}</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(lastSegment.arrival.at)}
              </p>
              <p className="text-sm text-gray-500">{lastSegment.arrival.iataCode}</p>
            </div>
          </div>

          {returnItinerary && (
            <div className="flex items-center gap-2 md:gap-4 pt-2 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {formatTime(returnItinerary.segments[0].departure.at)}
                </p>
                <p className="text-sm text-gray-500">
                  {returnItinerary.segments[0].departure.iataCode}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center px-2">
                <p className="text-xs text-gray-400 mb-1">
                  {formatDuration(returnItinerary.duration)}
                </p>
                <div className="w-full flex items-center">
                  <div className="flex-1 h-px bg-gray-300" />
                  <svg
                    className="w-4 h-4 text-gray-400 -mx-1 rotate-180"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {returnItinerary.segments.length - 1 === 0
                    ? 'Nonstop'
                    : `${returnItinerary.segments.length - 1} stop${returnItinerary.segments.length - 1 > 1 ? 's' : ''}`}
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {formatTime(
                    returnItinerary.segments[returnItinerary.segments.length - 1].arrival.at
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {returnItinerary.segments[returnItinerary.segments.length - 1].arrival.iataCode}
                </p>
              </div>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-4 text-sm text-gray-500">
            <span>{airlineName}</span>
            <span>•</span>
            <span>{formatDate(firstSegment.departure.at)}</span>
            {returnItinerary && (
              <>
                <span>-</span>
                <span>{formatDate(returnItinerary.segments[0].departure.at)}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(flight.price.total).toFixed(0)}
            </p>
            <p className="text-sm text-gray-500">
              {flight.travelerPricings.length > 1 ? 'total' : 'per person'}
            </p>
          </div>
          
          {onSetAlert && (
            <button
              onClick={onSetAlert}
              className="btn btn-primary whitespace-nowrap"
            >
              Set Alert
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
