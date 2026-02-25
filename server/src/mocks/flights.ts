import { FlightOffer, Deal } from '../../../types/index.js';

const airlines: Record<string, string> = {
  'AA': 'American Airlines',
  'UA': 'United Airlines',
  'DL': 'Delta Air Lines',
  'BA': 'British Airways',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'KL': 'KLM Royal Dutch',
  'EK': 'Emirates',
  'SQ': 'Singapore Airlines',
  'JL': 'Japan Airlines',
  'NH': 'ANA',
  'QF': 'Qantas',
  'AC': 'Air Canada',
  'LX': 'Swiss International',
  'IB': 'Iberia',
  'TK': 'Turkish Airlines',
  'QR': 'Qatar Airways',
  'EY': 'Etihad Airways'
};

const cities: Record<string, string> = {
  'JFK': 'New York',
  'LAX': 'Los Angeles',
  'LHR': 'London',
  'CDG': 'Paris',
  'NRT': 'Tokyo',
  'HND': 'Tokyo',
  'SIN': 'Singapore',
  'DXB': 'Dubai',
  'FRA': 'Frankfurt',
  'AMS': 'Amsterdam',
  'SFO': 'San Francisco',
  'ORD': 'Chicago',
  'MIA': 'Miami',
  'BCN': 'Barcelona',
  'FCO': 'Rome',
  'SYD': 'Sydney',
  'HKG': 'Hong Kong',
  'ICN': 'Seoul',
  'BKK': 'Bangkok',
  'DEL': 'Delhi'
};

function generateFlightId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `PT${hours}H${mins}M`;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function formatDateTime(date: Date): string {
  return date.toISOString().slice(0, 19);
}

interface RouteConfig {
  origin: string;
  destination: string;
  baseDuration: number;
  basePrice: number;
  carriers: string[];
}

const popularRoutes: RouteConfig[] = [
  { origin: 'JFK', destination: 'LHR', baseDuration: 420, basePrice: 450, carriers: ['BA', 'AA', 'UA', 'DL'] },
  { origin: 'LAX', destination: 'NRT', baseDuration: 660, basePrice: 650, carriers: ['JL', 'NH', 'AA', 'UA'] },
  { origin: 'JFK', destination: 'CDG', baseDuration: 450, basePrice: 480, carriers: ['AF', 'DL', 'AA'] },
  { origin: 'SFO', destination: 'SIN', baseDuration: 960, basePrice: 750, carriers: ['SQ', 'UA'] },
  { origin: 'LAX', destination: 'LHR', baseDuration: 600, basePrice: 520, carriers: ['BA', 'AA', 'UA'] },
  { origin: 'ORD', destination: 'FRA', baseDuration: 510, basePrice: 550, carriers: ['LH', 'UA', 'AA'] },
  { origin: 'MIA', destination: 'BCN', baseDuration: 540, basePrice: 490, carriers: ['IB', 'AA'] },
  { origin: 'JFK', destination: 'DXB', baseDuration: 780, basePrice: 680, carriers: ['EK', 'DL'] },
  { origin: 'LAX', destination: 'SYD', baseDuration: 900, basePrice: 850, carriers: ['QF', 'UA', 'DL'] },
  { origin: 'SFO', destination: 'HKG', baseDuration: 840, basePrice: 720, carriers: ['UA', 'AA'] }
];

function generateMockFlightOffer(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | undefined,
  passengers: number,
  carrier: string,
  priceMultiplier: number,
  durationMinutes: number,
  stops: number
): FlightOffer {
  const id = generateFlightId();
  const depTime = new Date(departureDate + 'T' + 
    String(6 + Math.floor(Math.random() * 14)).padStart(2, '0') + ':' +
    String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':00');
  
  const basePrice = 200 + Math.floor(Math.random() * 600);
  const totalPrice = Math.round(basePrice * priceMultiplier * passengers);
  
  const segments = [];
  let currentDep = depTime;
  
  if (stops === 0) {
    const arrTime = addHours(currentDep, durationMinutes / 60);
    segments.push({
      departure: {
        iataCode: origin,
        terminal: String(Math.floor(Math.random() * 8) + 1),
        at: formatDateTime(currentDep)
      },
      arrival: {
        iataCode: destination,
        terminal: String(Math.floor(Math.random() * 8) + 1),
        at: formatDateTime(arrTime)
      },
      carrierCode: carrier,
      carrierName: airlines[carrier] || carrier,
      number: String(100 + Math.floor(Math.random() * 900)),
      aircraft: { code: Math.random() > 0.5 ? '777' : '787' },
      duration: formatDuration(durationMinutes),
      numberOfStops: 0
    });
  } else {
    const layoverCodes = ['FRA', 'AMS', 'CDG', 'LHR', 'DXB', 'SIN', 'ICN'].filter(
      c => c !== origin && c !== destination
    );
    const layover = layoverCodes[Math.floor(Math.random() * layoverCodes.length)];
    const firstLeg = Math.floor(durationMinutes * 0.4);
    const secondLeg = durationMinutes - firstLeg;
    
    const arrTime1 = addHours(currentDep, firstLeg / 60);
    segments.push({
      departure: {
        iataCode: origin,
        terminal: String(Math.floor(Math.random() * 8) + 1),
        at: formatDateTime(currentDep)
      },
      arrival: {
        iataCode: layover,
        terminal: String(Math.floor(Math.random() * 8) + 1),
        at: formatDateTime(arrTime1)
      },
      carrierCode: carrier,
      carrierName: airlines[carrier] || carrier,
      number: String(100 + Math.floor(Math.random() * 900)),
      aircraft: { code: Math.random() > 0.5 ? '777' : '787' },
      duration: formatDuration(firstLeg),
      numberOfStops: 0
    });
    
    const depTime2 = addHours(arrTime1, 1.5 + Math.random() * 2);
    const arrTime2 = addHours(depTime2, secondLeg / 60);
    segments.push({
      departure: {
        iataCode: layover,
        terminal: String(Math.floor(Math.random() * 8) + 1),
        at: formatDateTime(depTime2)
      },
      arrival: {
        iataCode: destination,
        terminal: String(Math.floor(Math.random() * 8) + 1),
        at: formatDateTime(arrTime2)
      },
      carrierCode: carrier,
      carrierName: airlines[carrier] || carrier,
      number: String(100 + Math.floor(Math.random() * 900)),
      aircraft: { code: Math.random() > 0.5 ? '777' : '787' },
      duration: formatDuration(secondLeg),
      numberOfStops: 0
    });
  }
  
  const itineraries = [{
    duration: formatDuration(durationMinutes + (stops * 90)),
    segments
  }];
  
  if (returnDate) {
    const returnDepTime = new Date(returnDate + 'T' + 
      String(6 + Math.floor(Math.random() * 14)).padStart(2, '0') + ':' +
      String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':00');
    const returnArrTime = addHours(returnDepTime, durationMinutes / 60);
    
    itineraries.push({
      duration: formatDuration(durationMinutes),
      segments: [{
        departure: {
          iataCode: destination,
          terminal: String(Math.floor(Math.random() * 8) + 1),
          at: formatDateTime(returnDepTime)
        },
        arrival: {
          iataCode: origin,
          terminal: String(Math.floor(Math.random() * 8) + 1),
          at: formatDateTime(returnArrTime)
        },
        carrierCode: carrier,
        carrierName: airlines[carrier] || carrier,
        number: String(100 + Math.floor(Math.random() * 900)),
        aircraft: { code: Math.random() > 0.5 ? '777' : '787' },
        duration: formatDuration(durationMinutes),
        numberOfStops: 0
      }]
    });
  }
  
  const travelerPricings = [];
  for (let i = 0; i < passengers; i++) {
    travelerPricings.push({
      travelerId: String(i + 1),
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: {
        currency: 'USD',
        total: String(totalPrice / passengers),
        base: String(Math.round((totalPrice / passengers) * 0.85))
      },
      fareDetailsBySegment: segments.map((_, idx) => ({
        segmentId: String(idx + 1),
        cabin: Math.random() > 0.7 ? 'BUSINESS' : 'ECONOMY',
        fareBasis: 'EOBAU',
        class: 'E',
        includedCheckedBags: {
          quantity: 1
        }
      }))
    });
  }
  
  return {
    id,
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: !returnDate,
    lastTicketingDate: departureDate,
    numberOfBookableSeats: 5 + Math.floor(Math.random() * 4),
    itineraries,
    price: {
      currency: 'USD',
      total: String(totalPrice),
      base: String(Math.round(totalPrice * 0.85)),
      fees: [{
        amount: String(Math.round(totalPrice * 0.05)),
        type: 'SUPPLIER'
      }],
      grandTotal: String(totalPrice)
    },
    pricingOptions: {
      fareType: ['PUBLISHED'],
      includedCheckedBagsOnly: true
    },
    validatingAirlineCodes: [carrier],
    travelerPricings
  };
}

export function generateMockFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  passengers: number = 1
): FlightOffer[] {
  const route = popularRoutes.find(
    r => r.origin === origin && r.destination === destination
  ) || popularRoutes.find(
    r => r.destination === origin && r.origin === destination
  );
  
  const baseDuration = route?.baseDuration || 300 + Math.floor(Math.random() * 600);
  const carriers = route?.carriers || ['AA', 'UA', 'DL'];
  
  const flights: FlightOffer[] = [];
  
  carriers.forEach(carrier => {
    flights.push(generateMockFlightOffer(
      origin, destination, departureDate, returnDate, passengers,
      carrier, 0.9 + Math.random() * 0.3, baseDuration, 0
    ));
    
    if (Math.random() > 0.3) {
      flights.push(generateMockFlightOffer(
        origin, destination, departureDate, returnDate, passengers,
        carrier, 0.7 + Math.random() * 0.3, baseDuration + 120, 1
      ));
    }
  });
  
  const extraCarriers = Object.keys(airlines).filter(c => !carriers.includes(c));
  const numExtra = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numExtra && i < extraCarriers.length; i++) {
    const carrier = extraCarriers[Math.floor(Math.random() * extraCarriers.length)];
    flights.push(generateMockFlightOffer(
      origin, destination, departureDate, returnDate, passengers,
      carrier, 0.8 + Math.random() * 0.5, baseDuration + Math.floor(Math.random() * 180), 
      Math.random() > 0.5 ? 1 : 0
    ));
  }
  
  return flights.sort((a, b) => parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal));
}

export function generateMockDeals(): Deal[] {
  const today = new Date();
  const deals: Deal[] = [];
  
  popularRoutes.forEach(route => {
    const daysAhead = 14 + Math.floor(Math.random() * 45);
    const departureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    const carrier = route.carriers[Math.floor(Math.random() * route.carriers.length)];
    const discount = 0.6 + Math.random() * 0.25;
    
    deals.push({
      origin: route.origin,
      originCity: cities[route.origin] || route.origin,
      destination: route.destination,
      destinationCity: cities[route.destination] || route.destination,
      price: Math.round(route.basePrice * discount),
      currency: 'USD',
      airline: airlines[carrier] || carrier,
      departureDate: departureDate.toISOString().split('T')[0]
    });
  });
  
  return deals.sort((a, b) => a.price - b.price);
}

export { airlines, cities };
