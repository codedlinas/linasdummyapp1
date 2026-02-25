import { FlightOffer, FlightSearchResponse, Deal } from '../../../types/index.js';

function generateFlightId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `PT${hours}H${mins}M`;
}

function addHours(date: string, hours: number): string {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d.toISOString().slice(0, 19);
}

function addMinutes(date: string, minutes: number): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString().slice(0, 19);
}

const ROUTES: Record<string, { airlines: string[]; basePrice: number; durationMin: number; durationMax: number }> = {
  'JFK-LHR': { airlines: ['BA', 'VS', 'AA', 'DL'], basePrice: 450, durationMin: 420, durationMax: 520 },
  'JFK-CDG': { airlines: ['AF', 'DL', 'AA'], basePrice: 520, durationMin: 450, durationMax: 560 },
  'LAX-NRT': { airlines: ['JL', 'NH', 'AA', 'UA'], basePrice: 680, durationMin: 660, durationMax: 780 },
  'LAX-SYD': { airlines: ['QF', 'UA', 'DL'], basePrice: 980, durationMin: 900, durationMax: 1080 },
  'SFO-LHR': { airlines: ['BA', 'VS', 'UA'], basePrice: 580, durationMin: 600, durationMax: 720 },
  'ORD-FRA': { airlines: ['LH', 'UA', 'AA'], basePrice: 620, durationMin: 540, durationMax: 660 },
  'MIA-MAD': { airlines: ['IB', 'AA'], basePrice: 490, durationMin: 540, durationMax: 640 },
  'BOS-DXB': { airlines: ['EK'], basePrice: 780, durationMin: 780, durationMax: 900 },
  'ATL-AMS': { airlines: ['KL', 'DL'], basePrice: 550, durationMin: 540, durationMax: 660 },
  'SEA-HKG': { airlines: ['CX', 'UA'], basePrice: 720, durationMin: 840, durationMax: 960 },
  'DFW-FCO': { airlines: ['AA', 'AY'], basePrice: 650, durationMin: 660, durationMax: 780 },
  'YYZ-LHR': { airlines: ['BA', 'AC'], basePrice: 480, durationMin: 420, durationMax: 500 },
  'JFK-SIN': { airlines: ['SQ', 'EK'], basePrice: 850, durationMin: 1080, durationMax: 1260 },
  'LAX-HND': { airlines: ['JL', 'NH'], basePrice: 720, durationMin: 720, durationMax: 840 },
};

function generateFlightOffer(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | null,
  adults: number,
  index: number
): FlightOffer {
  const routeKey = `${origin}-${destination}`;
  const reverseRouteKey = `${destination}-${origin}`;
  const routeInfo = ROUTES[routeKey] || ROUTES[reverseRouteKey] || {
    airlines: ['AA', 'UA', 'DL'],
    basePrice: 400 + Math.random() * 300,
    durationMin: 180,
    durationMax: 600,
  };

  const airline = routeInfo.airlines[index % routeInfo.airlines.length];
  const priceVariation = 0.7 + Math.random() * 0.6;
  const basePrice = Math.round(routeInfo.basePrice * priceVariation);
  const totalPrice = basePrice * adults;
  
  const durationMinutes = Math.round(
    routeInfo.durationMin + Math.random() * (routeInfo.durationMax - routeInfo.durationMin)
  );
  
  const stops = index % 3 === 0 ? 0 : index % 3 === 1 ? 1 : 2;
  const departureTime = `${departureDate}T${String(6 + (index * 2) % 16).padStart(2, '0')}:${String((index * 17) % 60).padStart(2, '0')}:00`;

  const segments: any[] = [];
  
  if (stops === 0) {
    segments.push({
      departure: {
        iataCode: origin,
        terminal: String((index % 4) + 1),
        at: departureTime,
      },
      arrival: {
        iataCode: destination,
        terminal: String((index % 5) + 1),
        at: addMinutes(departureTime, durationMinutes),
      },
      carrierCode: airline,
      number: String(100 + index * 7),
      aircraft: { code: index % 2 === 0 ? '777' : '787' },
      duration: formatDuration(durationMinutes),
      id: '1',
      numberOfStops: 0,
      blacklistedInEU: false,
    });
  } else {
    const layoverAirports = ['ORD', 'ATL', 'DFW', 'AMS', 'FRA', 'DXB'];
    const layover = layoverAirports.filter(a => a !== origin && a !== destination)[index % 4];
    const firstLegDuration = Math.round(durationMinutes * 0.4);
    const layoverTime = 60 + (index % 3) * 30;
    const secondLegDuration = durationMinutes - firstLegDuration;

    segments.push({
      departure: {
        iataCode: origin,
        terminal: String((index % 4) + 1),
        at: departureTime,
      },
      arrival: {
        iataCode: layover,
        at: addMinutes(departureTime, firstLegDuration),
      },
      carrierCode: airline,
      number: String(100 + index * 7),
      aircraft: { code: '737' },
      duration: formatDuration(firstLegDuration),
      id: '1',
      numberOfStops: 0,
      blacklistedInEU: false,
    });

    segments.push({
      departure: {
        iataCode: layover,
        at: addMinutes(departureTime, firstLegDuration + layoverTime),
      },
      arrival: {
        iataCode: destination,
        terminal: String((index % 5) + 1),
        at: addMinutes(departureTime, durationMinutes + layoverTime),
      },
      carrierCode: airline,
      number: String(200 + index * 3),
      aircraft: { code: index % 2 === 0 ? '787' : 'A350' },
      duration: formatDuration(secondLegDuration),
      id: '2',
      numberOfStops: 0,
      blacklistedInEU: false,
    });
  }

  const itineraries: any[] = [
    {
      duration: formatDuration(durationMinutes + (stops > 0 ? 60 + (index % 3) * 30 : 0)),
      segments,
    },
  ];

  if (returnDate) {
    const returnDuration = durationMinutes + (Math.random() - 0.5) * 60;
    const returnTime = `${returnDate}T${String(8 + (index * 3) % 14).padStart(2, '0')}:${String((index * 23) % 60).padStart(2, '0')}:00`;
    
    itineraries.push({
      duration: formatDuration(Math.round(returnDuration)),
      segments: [
        {
          departure: {
            iataCode: destination,
            terminal: String((index % 5) + 1),
            at: returnTime,
          },
          arrival: {
            iataCode: origin,
            terminal: String((index % 4) + 1),
            at: addMinutes(returnTime, Math.round(returnDuration)),
          },
          carrierCode: airline,
          number: String(300 + index * 11),
          aircraft: { code: index % 2 === 0 ? '777' : '787' },
          duration: formatDuration(Math.round(returnDuration)),
          id: String(segments.length + 1),
          numberOfStops: 0,
          blacklistedInEU: false,
        },
      ],
    });
  }

  return {
    id: generateFlightId(),
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: !returnDate,
    lastTicketingDate: departureDate,
    numberOfBookableSeats: 5 + (index % 4),
    itineraries,
    price: {
      currency: 'USD',
      total: String(totalPrice),
      base: String(Math.round(totalPrice * 0.85)),
      fees: [
        { amount: String(Math.round(totalPrice * 0.15)), type: 'SUPPLIER' },
      ],
      grandTotal: String(totalPrice),
    },
    pricingOptions: {
      fareType: ['PUBLISHED'],
      includedCheckedBagsOnly: true,
    },
    validatingAirlineCodes: [airline],
    travelerPricings: Array.from({ length: adults }, (_, i) => ({
      travelerId: String(i + 1),
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: {
        currency: 'USD',
        total: String(basePrice),
        base: String(Math.round(basePrice * 0.85)),
      },
      fareDetailsBySegment: segments.map((seg, segIdx) => ({
        segmentId: String(segIdx + 1),
        cabin: 'ECONOMY',
        fareBasis: 'YOWUS',
        class: 'Y',
        includedCheckedBags: {
          quantity: 1,
        },
      })),
    })),
  };
}

export function searchMockFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | null,
  adults: number = 1
): FlightSearchResponse {
  const offers: FlightOffer[] = [];
  const numOffers = 8 + Math.floor(Math.random() * 5);

  for (let i = 0; i < numOffers; i++) {
    offers.push(generateFlightOffer(origin, destination, departureDate, returnDate, adults, i));
  }

  offers.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));

  return {
    data: offers,
    meta: {
      count: offers.length,
    },
    dictionaries: {
      carriers: {
        AA: 'American Airlines',
        UA: 'United Airlines',
        DL: 'Delta Air Lines',
        BA: 'British Airways',
        LH: 'Lufthansa',
        AF: 'Air France',
        KL: 'KLM Royal Dutch Airlines',
        EK: 'Emirates',
        QR: 'Qatar Airways',
        SQ: 'Singapore Airlines',
        CX: 'Cathay Pacific',
        NH: 'All Nippon Airways',
        JL: 'Japan Airlines',
        QF: 'Qantas',
        VS: 'Virgin Atlantic',
        IB: 'Iberia',
        AY: 'Finnair',
        SK: 'SAS',
        TK: 'Turkish Airlines',
        EY: 'Etihad Airways',
        AC: 'Air Canada',
      },
      aircraft: {
        '777': 'Boeing 777',
        '787': 'Boeing 787',
        '737': 'Boeing 737',
        A350: 'Airbus A350',
        A380: 'Airbus A380',
      },
      currencies: {
        USD: 'US Dollar',
      },
      locations: {},
    },
  };
}

export function getMockDeals(): Deal[] {
  const routes = [
    { origin: 'JFK', destination: 'LHR', price: 389, airline: 'BA', duration: 'PT7H20M', stops: 0 },
    { origin: 'LAX', destination: 'NRT', price: 599, airline: 'JL', duration: 'PT11H45M', stops: 0 },
    { origin: 'SFO', destination: 'CDG', price: 449, airline: 'AF', duration: 'PT10H30M', stops: 0 },
    { origin: 'ORD', destination: 'FRA', price: 529, airline: 'LH', duration: 'PT9H15M', stops: 0 },
    { origin: 'MIA', destination: 'MAD', price: 399, airline: 'IB', duration: 'PT8H50M', stops: 0 },
    { origin: 'BOS', destination: 'DXB', price: 649, airline: 'EK', duration: 'PT13H10M', stops: 0 },
    { origin: 'ATL', destination: 'AMS', price: 479, airline: 'KL', duration: 'PT9H05M', stops: 0 },
    { origin: 'SEA', destination: 'HKG', price: 589, airline: 'CX', duration: 'PT14H20M', stops: 1 },
    { origin: 'DFW', destination: 'FCO', price: 549, airline: 'AA', duration: 'PT11H30M', stops: 1 },
    { origin: 'YYZ', destination: 'LHR', price: 419, airline: 'BA', duration: 'PT7H00M', stops: 0 },
    { origin: 'JFK', destination: 'SIN', price: 699, airline: 'SQ', duration: 'PT18H45M', stops: 0 },
    { origin: 'LAX', destination: 'SYD', price: 789, airline: 'QF', duration: 'PT15H30M', stops: 0 },
  ];

  const today = new Date();
  
  return routes.map((route, index) => {
    const departureDate = new Date(today);
    departureDate.setDate(today.getDate() + 14 + index * 3);
    
    const returnDate = new Date(departureDate);
    returnDate.setDate(departureDate.getDate() + 7 + (index % 5));

    return {
      id: `deal-${index + 1}`,
      origin: route.origin,
      destination: route.destination,
      price: route.price + Math.round(Math.random() * 50 - 25),
      currency: 'USD',
      airline: route.airline,
      departureDate: departureDate.toISOString().split('T')[0],
      returnDate: returnDate.toISOString().split('T')[0],
      stops: route.stops,
      duration: route.duration,
    };
  });
}
