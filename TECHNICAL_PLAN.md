# FlyDeal Technical Plan

A comprehensive technical specification for building a cheap flight ticket finder web application.

---

## 1. Project Structure

```
/workspace
├── package.json                    # Root package.json for monorepo workspaces
├── tsconfig.base.json              # Shared TypeScript configuration
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variable template
├── README.md                       # Project documentation
│
├── /types                          # Shared TypeScript types
│   ├── package.json                # Types package configuration
│   ├── tsconfig.json               # Types-specific TS config
│   ├── index.ts                    # Main export file for all types
│   ├── flight.ts                   # FlightOffer, FlightSegment, Airport types
│   ├── search.ts                   # SearchQuery, SearchResult types
│   ├── alert.ts                    # PriceAlert type definitions
│   └── api.ts                      # API request/response types
│
├── /server                         # Express backend application
│   ├── package.json                # Server dependencies
│   ├── tsconfig.json               # Server TS configuration
│   ├── nodemon.json                # Nodemon dev configuration
│   ├── /src
│   │   ├── index.ts                # Application entry point, server startup
│   │   ├── app.ts                  # Express app configuration, middleware
│   │   ├── /config
│   │   │   ├── index.ts            # Configuration loader (env vars)
│   │   │   └── database.ts         # SQLite database connection setup
│   │   ├── /routes
│   │   │   ├── index.ts            # Route aggregator
│   │   │   ├── flights.ts          # /api/flights/* endpoints
│   │   │   ├── deals.ts            # /api/deals endpoints
│   │   │   ├── alerts.ts           # /api/alerts/* endpoints
│   │   │   └── history.ts          # /api/history endpoints
│   │   ├── /services
│   │   │   ├── amadeus.ts          # Amadeus API client and auth
│   │   │   ├── flightSearch.ts     # Flight search orchestration logic
│   │   │   ├── alertService.ts     # Price alert management
│   │   │   ├── dealService.ts      # Trending deals aggregation
│   │   │   └── historyService.ts   # Search history management
│   │   ├── /middleware
│   │   │   ├── errorHandler.ts     # Global error handling middleware
│   │   │   ├── requestLogger.ts    # Request logging middleware
│   │   │   └── validation.ts       # Request validation middleware
│   │   ├── /utils
│   │   │   ├── mappers.ts          # Amadeus response → FlightOffer mapper
│   │   │   └── helpers.ts          # General utility functions
│   │   └── /db
│   │       ├── schema.ts           # Database schema initialization
│   │       ├── migrations.ts       # Schema migration runner
│   │       └── queries.ts          # Prepared SQL query helpers
│   └── /mocks
│       ├── index.ts                # Mock data exports
│       ├── flightOffers.json       # Sample Amadeus API responses
│       ├── airports.json           # Airport codes and names
│       └── trendingDeals.json      # Pre-seeded trending deals
│
├── /client                         # React frontend application
│   ├── package.json                # Client dependencies
│   ├── tsconfig.json               # Client TS configuration
│   ├── vite.config.ts              # Vite build configuration
│   ├── tailwind.config.js          # TailwindCSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── index.html                  # HTML entry point
│   └── /src
│       ├── main.tsx                # React app entry point
│       ├── App.tsx                 # Root component with routing
│       ├── index.css               # Global styles and Tailwind imports
│       ├── /pages
│       │   ├── Dashboard.tsx       # Homepage with deals and alerts summary
│       │   ├── Search.tsx          # Flight search form and results
│       │   ├── Alerts.tsx          # Price alerts management page
│       │   └── History.tsx         # Search history page
│       ├── /components
│       │   ├── /layout
│       │   │   ├── Header.tsx      # Navigation header
│       │   │   ├── Footer.tsx      # Page footer
│       │   │   └── Layout.tsx      # Page layout wrapper
│       │   ├── /search
│       │   │   ├── SearchForm.tsx  # Flight search input form
│       │   │   ├── AirportInput.tsx # Airport autocomplete input
│       │   │   ├── DatePicker.tsx  # Date selection component
│       │   │   └── PassengerSelect.tsx # Passenger count selector
│       │   ├── /flights
│       │   │   ├── FlightCard.tsx  # Individual flight result card
│       │   │   ├── FlightList.tsx  # List of flight results
│       │   │   ├── FlightDetails.tsx # Expanded flight details
│       │   │   └── FlightSkeleton.tsx # Loading skeleton for flights
│       │   ├── /deals
│       │   │   ├── DealCard.tsx    # Trending deal display card
│       │   │   ├── DealGrid.tsx    # Grid of trending deals
│       │   │   └── PopularRoutes.tsx # Popular routes section
│       │   ├── /alerts
│       │   │   ├── AlertCard.tsx   # Individual alert display
│       │   │   ├── AlertList.tsx   # List of user alerts
│       │   │   ├── AlertForm.tsx   # Create/edit alert form
│       │   │   └── PriceThreshold.tsx # Price threshold input
│       │   └── /common
│       │       ├── Button.tsx      # Reusable button component
│       │       ├── Input.tsx       # Styled input component
│       │       ├── Card.tsx        # Card container component
│       │       ├── Modal.tsx       # Modal dialog component
│       │       ├── Skeleton.tsx    # Generic skeleton loader
│       │       ├── Badge.tsx       # Status/info badge
│       │       └── Toast.tsx       # Notification toast
│       ├── /hooks
│       │   ├── useFlightSearch.ts  # Flight search API hook
│       │   ├── useDeals.ts         # Trending deals fetching hook
│       │   ├── useAlerts.ts        # Alerts CRUD hook
│       │   ├── useHistory.ts       # Search history hook
│       │   └── useDebounce.ts      # Debounce utility hook
│       ├── /services
│       │   └── api.ts              # API client configuration
│       ├── /utils
│       │   ├── formatters.ts       # Date, price, duration formatters
│       │   └── constants.ts        # App constants
│       └── /types
│           └── index.ts            # Re-export types from /types package
│
└── /data
    └── flydeal.db                  # SQLite database file (created at runtime)
```

---

## 2. Database Schema

### SQLite Tables

```sql
-- ============================================
-- Table: search_history
-- Stores user's recent flight searches
-- ============================================
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,              -- Anonymous session identifier
    origin TEXT NOT NULL,                   -- Origin airport IATA code (e.g., 'JFK')
    destination TEXT NOT NULL,              -- Destination airport IATA code
    departure_date TEXT NOT NULL,           -- ISO date string (YYYY-MM-DD)
    return_date TEXT,                       -- ISO date string, NULL for one-way
    passengers INTEGER NOT NULL DEFAULT 1,  -- Number of passengers
    trip_type TEXT NOT NULL DEFAULT 'one-way', -- 'one-way' or 'round-trip'
    lowest_price REAL,                      -- Lowest price found (for quick display)
    results_count INTEGER,                  -- Number of results returned
    created_at TEXT NOT NULL DEFAULT (datetime('now')), -- Timestamp
    UNIQUE(session_id, origin, destination, departure_date, return_date)
);

CREATE INDEX idx_search_history_session ON search_history(session_id);
CREATE INDEX idx_search_history_created ON search_history(created_at DESC);

-- ============================================
-- Table: saved_alerts
-- Price drop alerts saved by users
-- ============================================
CREATE TABLE IF NOT EXISTS saved_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,              -- Anonymous session identifier
    email TEXT,                             -- Optional email for notifications
    origin TEXT NOT NULL,                   -- Origin airport IATA code
    destination TEXT NOT NULL,              -- Destination airport IATA code
    departure_date TEXT NOT NULL,           -- Target departure date
    return_date TEXT,                       -- Return date for round-trips
    passengers INTEGER NOT NULL DEFAULT 1,
    max_price REAL NOT NULL,                -- Alert when price drops below this
    current_price REAL,                     -- Last checked price
    currency TEXT NOT NULL DEFAULT 'USD',
    is_active INTEGER NOT NULL DEFAULT 1,   -- 1 = active, 0 = paused
    last_checked_at TEXT,                   -- Last price check timestamp
    last_notified_at TEXT,                  -- Last notification sent timestamp
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_alerts_session ON saved_alerts(session_id);
CREATE INDEX idx_alerts_active ON saved_alerts(is_active);
CREATE INDEX idx_alerts_route ON saved_alerts(origin, destination);

-- ============================================
-- Table: price_snapshots
-- Historical price data for routes (for trending deals)
-- ============================================
CREATE TABLE IF NOT EXISTS price_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    airline TEXT,                           -- Airline IATA code
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    stops INTEGER NOT NULL DEFAULT 0,       -- Number of stops
    duration_minutes INTEGER,               -- Total flight duration
    captured_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_snapshots_route ON price_snapshots(origin, destination);
CREATE INDEX idx_snapshots_date ON price_snapshots(departure_date);
CREATE INDEX idx_snapshots_captured ON price_snapshots(captured_at DESC);

-- ============================================
-- Table: airports
-- Airport reference data for autocomplete
-- ============================================
CREATE TABLE IF NOT EXISTS airports (
    iata_code TEXT PRIMARY KEY,             -- 3-letter IATA code
    name TEXT NOT NULL,                     -- Airport name
    city TEXT NOT NULL,                     -- City name
    country TEXT NOT NULL,                  -- Country name
    country_code TEXT NOT NULL,             -- 2-letter country code
    latitude REAL,
    longitude REAL,
    timezone TEXT,
    popularity INTEGER DEFAULT 0            -- For sorting in autocomplete
);

CREATE INDEX idx_airports_city ON airports(city);
CREATE INDEX idx_airports_name ON airports(name);
CREATE INDEX idx_airports_popularity ON airports(popularity DESC);

-- ============================================
-- Table: trending_deals
-- Cached trending/cheap deals for homepage
-- ============================================
CREATE TABLE IF NOT EXISTS trending_deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    return_date TEXT,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    airline TEXT,
    airline_name TEXT,
    airline_logo TEXT,                      -- URL to airline logo
    stops INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER,
    discount_percentage REAL,               -- Optional: % off normal price
    deal_score INTEGER,                     -- Ranking score for deals
    expires_at TEXT,                        -- When this deal expires
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(origin, destination, departure_date, airline)
);

CREATE INDEX idx_trending_score ON trending_deals(deal_score DESC);
CREATE INDEX idx_trending_price ON trending_deals(price ASC);
```

---

## 3. API Design

### Base URL: `/api`

### 3.1 Flight Search

#### `GET /api/flights/search`
Search for available flights.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| origin | string | Yes | Origin airport IATA code (e.g., "JFK") |
| destination | string | Yes | Destination airport IATA code (e.g., "LAX") |
| departureDate | string | Yes | Departure date in YYYY-MM-DD format |
| returnDate | string | No | Return date for round-trip (YYYY-MM-DD) |
| passengers | number | No | Number of passengers (default: 1, max: 9) |
| cabinClass | string | No | ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST |
| maxStops | number | No | Maximum number of stops (0, 1, 2) |
| maxPrice | number | No | Maximum price filter |
| sortBy | string | No | price, duration, departure, arrival (default: price) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "searchId": "search_abc123",
    "query": {
      "origin": "JFK",
      "destination": "LAX",
      "departureDate": "2026-03-15",
      "returnDate": null,
      "passengers": 1,
      "tripType": "one-way"
    },
    "results": [
      {
        "id": "offer_xyz789",
        "price": {
          "amount": 199.99,
          "currency": "USD",
          "pricePerPerson": 199.99
        },
        "itineraries": [
          {
            "duration": "PT5H30M",
            "durationMinutes": 330,
            "segments": [
              {
                "departure": {
                  "airport": "JFK",
                  "airportName": "John F. Kennedy International",
                  "terminal": "4",
                  "dateTime": "2026-03-15T08:00:00"
                },
                "arrival": {
                  "airport": "LAX",
                  "airportName": "Los Angeles International",
                  "terminal": "B",
                  "dateTime": "2026-03-15T11:30:00"
                },
                "airline": {
                  "code": "AA",
                  "name": "American Airlines",
                  "logo": "https://logos.skyscnr.com/images/airlines/AA.png"
                },
                "flightNumber": "AA123",
                "aircraft": "Boeing 737-800",
                "cabinClass": "ECONOMY",
                "durationMinutes": 330
              }
            ]
          }
        ],
        "stops": 0,
        "bookingUrl": "https://example.com/book/offer_xyz789",
        "seatsAvailable": 5,
        "fareRules": {
          "refundable": false,
          "changeable": true,
          "changeFee": 75
        }
      }
    ],
    "metadata": {
      "totalResults": 45,
      "searchTimestamp": "2026-03-10T14:30:00Z",
      "dataSource": "amadeus",
      "cached": false
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Invalid departure date format",
    "details": {
      "field": "departureDate",
      "expected": "YYYY-MM-DD"
    }
  }
}
```

---

### 3.2 Deals

#### `GET /api/deals`
Get trending cheap flight deals for homepage.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| origin | string | No | Filter by origin airport |
| limit | number | No | Number of deals to return (default: 12, max: 50) |
| minDiscount | number | No | Minimum discount percentage |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "id": "deal_001",
        "origin": {
          "code": "NYC",
          "city": "New York",
          "country": "US"
        },
        "destination": {
          "code": "MIA",
          "city": "Miami",
          "country": "US"
        },
        "price": {
          "amount": 89,
          "currency": "USD",
          "originalPrice": 159,
          "discountPercentage": 44
        },
        "departureDate": "2026-03-20",
        "returnDate": "2026-03-25",
        "airline": {
          "code": "DL",
          "name": "Delta Air Lines"
        },
        "tripType": "round-trip",
        "dealScore": 95,
        "expiresAt": "2026-03-12T23:59:59Z"
      }
    ],
    "popularRoutes": [
      {
        "origin": "LAX",
        "destination": "HNL",
        "averagePrice": 299,
        "searchCount": 1250
      }
    ],
    "lastUpdated": "2026-03-10T12:00:00Z"
  }
}
```

---

### 3.3 Price Alerts

#### `POST /api/alerts`
Create a new price alert.

**Request Body:**
```json
{
  "origin": "JFK",
  "destination": "LHR",
  "departureDate": "2026-06-15",
  "returnDate": "2026-06-22",
  "passengers": 2,
  "maxPrice": 500,
  "currency": "USD",
  "email": "user@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "alert": {
      "id": "alert_12345",
      "origin": "JFK",
      "destination": "LHR",
      "departureDate": "2026-06-15",
      "returnDate": "2026-06-22",
      "passengers": 2,
      "maxPrice": 500,
      "currentPrice": 650,
      "currency": "USD",
      "email": "user@example.com",
      "isActive": true,
      "createdAt": "2026-03-10T14:30:00Z"
    },
    "message": "Price alert created. We'll notify you when the price drops below $500."
  }
}
```

#### `GET /api/alerts`
List all alerts for the current session.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter: active, paused, all (default: all) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert_12345",
        "origin": "JFK",
        "originCity": "New York",
        "destination": "LHR",
        "destinationCity": "London",
        "departureDate": "2026-06-15",
        "returnDate": "2026-06-22",
        "passengers": 2,
        "maxPrice": 500,
        "currentPrice": 650,
        "priceDifference": 150,
        "currency": "USD",
        "isActive": true,
        "lastCheckedAt": "2026-03-10T13:00:00Z",
        "createdAt": "2026-03-10T14:30:00Z"
      }
    ],
    "totalCount": 1,
    "activeCount": 1
  }
}
```

#### `GET /api/alerts/:id`
Get a specific alert by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "alert": {
      "id": "alert_12345",
      "origin": "JFK",
      "originCity": "New York",
      "destination": "LHR",
      "destinationCity": "London",
      "departureDate": "2026-06-15",
      "returnDate": "2026-06-22",
      "passengers": 2,
      "maxPrice": 500,
      "currentPrice": 650,
      "currency": "USD",
      "email": "user@example.com",
      "isActive": true,
      "priceHistory": [
        { "price": 700, "date": "2026-03-08T00:00:00Z" },
        { "price": 680, "date": "2026-03-09T00:00:00Z" },
        { "price": 650, "date": "2026-03-10T00:00:00Z" }
      ],
      "lastCheckedAt": "2026-03-10T13:00:00Z",
      "createdAt": "2026-03-10T14:30:00Z"
    }
  }
}
```

#### `PATCH /api/alerts/:id`
Update an existing alert.

**Request Body:**
```json
{
  "maxPrice": 450,
  "isActive": true,
  "email": "newemail@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "alert": {
      "id": "alert_12345",
      "maxPrice": 450,
      "isActive": true,
      "email": "newemail@example.com",
      "updatedAt": "2026-03-10T15:00:00Z"
    },
    "message": "Alert updated successfully"
  }
}
```

#### `DELETE /api/alerts/:id`
Delete a price alert.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Alert deleted successfully",
    "deletedId": "alert_12345"
  }
}
```

---

### 3.4 Search History

#### `GET /api/history`
Get recent search history for the current session.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of results (default: 10, max: 50) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "searches": [
      {
        "id": "history_001",
        "origin": "JFK",
        "originCity": "New York",
        "destination": "LAX",
        "destinationCity": "Los Angeles",
        "departureDate": "2026-03-15",
        "returnDate": null,
        "passengers": 1,
        "tripType": "one-way",
        "lowestPrice": 199.99,
        "resultsCount": 45,
        "searchedAt": "2026-03-10T14:30:00Z"
      }
    ],
    "totalCount": 5
  }
}
```

#### `DELETE /api/history/:id`
Delete a specific search from history.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Search history entry deleted",
    "deletedId": "history_001"
  }
}
```

#### `DELETE /api/history`
Clear all search history for the current session.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Search history cleared",
    "deletedCount": 5
  }
}
```

---

### 3.5 Airports (Autocomplete)

#### `GET /api/airports/search`
Search airports for autocomplete functionality.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (min 2 characters) |
| limit | number | No | Number of results (default: 10) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "airports": [
      {
        "code": "JFK",
        "name": "John F. Kennedy International Airport",
        "city": "New York",
        "country": "United States",
        "countryCode": "US"
      },
      {
        "code": "EWR",
        "name": "Newark Liberty International Airport",
        "city": "Newark",
        "country": "United States",
        "countryCode": "US"
      }
    ]
  }
}
```

---

## 4. Amadeus API Integration

### 4.1 Authentication (OAuth2 Client Credentials)

**Endpoint:** `https://api.amadeus.com/v1/security/oauth2/token` (production)  
**Test Endpoint:** `https://test.api.amadeus.com/v1/security/oauth2/token`

**Implementation in `/server/src/services/amadeus.ts`:**

```typescript
// Token request
const tokenRequest = {
  method: 'POST',
  url: 'https://api.amadeus.com/v1/security/oauth2/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.AMADEUS_API_KEY,
    client_secret: process.env.AMADEUS_API_SECRET
  })
};

// Token response structure
interface AmadeusToken {
  type: 'amadeusOAuth2Token';
  username: string;
  application_name: string;
  client_id: string;
  token_type: 'Bearer';
  access_token: string;
  expires_in: number; // seconds (usually 1799 = ~30 minutes)
  state: 'approved';
  scope: string;
}
```

**Token Management Strategy:**
1. Store token in memory with expiration timestamp
2. Refresh token 60 seconds before expiration
3. Retry failed requests once if 401 Unauthorized
4. Use singleton pattern for token management

### 4.2 Flight Offers Search API v2

**Endpoint:** `GET https://api.amadeus.com/v2/shopping/flight-offers`

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| originLocationCode | string | Yes | IATA code |
| destinationLocationCode | string | Yes | IATA code |
| departureDate | string | Yes | YYYY-MM-DD |
| returnDate | string | No | YYYY-MM-DD for round-trip |
| adults | number | Yes | Number of adult passengers |
| travelClass | string | No | ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST |
| nonStop | boolean | No | Filter to non-stop flights only |
| max | number | No | Max results (default: 250) |
| currencyCode | string | No | ISO 4217 currency code |

**Example Request:**
```
GET /v2/shopping/flight-offers
  ?originLocationCode=JFK
  &destinationLocationCode=LAX
  &departureDate=2026-03-15
  &adults=1
  &travelClass=ECONOMY
  &currencyCode=USD
  &max=50
```

### 4.3 Amadeus Response Format

```json
{
  "meta": {
    "count": 50,
    "links": {
      "self": "https://api.amadeus.com/v2/shopping/flight-offers?..."
    }
  },
  "data": [
    {
      "type": "flight-offer",
      "id": "1",
      "source": "GDS",
      "instantTicketingRequired": false,
      "nonHomogeneous": false,
      "oneWay": false,
      "lastTicketingDate": "2026-03-12",
      "numberOfBookableSeats": 9,
      "itineraries": [
        {
          "duration": "PT5H30M",
          "segments": [
            {
              "departure": {
                "iataCode": "JFK",
                "terminal": "4",
                "at": "2026-03-15T08:00:00"
              },
              "arrival": {
                "iataCode": "LAX",
                "terminal": "B",
                "at": "2026-03-15T11:30:00"
              },
              "carrierCode": "AA",
              "number": "123",
              "aircraft": {
                "code": "738"
              },
              "operating": {
                "carrierCode": "AA"
              },
              "duration": "PT5H30M",
              "id": "1",
              "numberOfStops": 0,
              "blacklistedInEU": false
            }
          ]
        }
      ],
      "price": {
        "currency": "USD",
        "total": "199.99",
        "base": "175.00",
        "fees": [
          {
            "amount": "0.00",
            "type": "SUPPLIER"
          },
          {
            "amount": "0.00",
            "type": "TICKETING"
          }
        ],
        "grandTotal": "199.99"
      },
      "pricingOptions": {
        "fareType": ["PUBLISHED"],
        "includedCheckedBagsOnly": true
      },
      "validatingAirlineCodes": ["AA"],
      "travelerPricings": [
        {
          "travelerId": "1",
          "fareOption": "STANDARD",
          "travelerType": "ADULT",
          "price": {
            "currency": "USD",
            "total": "199.99",
            "base": "175.00"
          },
          "fareDetailsBySegment": [
            {
              "segmentId": "1",
              "cabin": "ECONOMY",
              "fareBasis": "EOBAU",
              "class": "E",
              "includedCheckedBags": {
                "weight": 23,
                "weightUnit": "KG"
              }
            }
          ]
        }
      ]
    }
  ],
  "dictionaries": {
    "locations": {
      "JFK": {
        "cityCode": "NYC",
        "countryCode": "US"
      },
      "LAX": {
        "cityCode": "LAX",
        "countryCode": "US"
      }
    },
    "aircraft": {
      "738": "BOEING 737-800"
    },
    "currencies": {
      "USD": "US DOLLAR"
    },
    "carriers": {
      "AA": "AMERICAN AIRLINES"
    }
  }
}
```

### 4.4 Response Mapping: Amadeus → FlightOffer

**Mapper function in `/server/src/utils/mappers.ts`:**

```typescript
function mapAmadeusToFlightOffer(
  amadeusOffer: AmadeusFlightOffer,
  dictionaries: AmadeusDictionaries
): FlightOffer {
  return {
    id: `offer_${amadeusOffer.id}`,
    price: {
      amount: parseFloat(amadeusOffer.price.grandTotal),
      currency: amadeusOffer.price.currency,
      pricePerPerson: parseFloat(amadeusOffer.price.grandTotal) / amadeusOffer.travelerPricings.length
    },
    itineraries: amadeusOffer.itineraries.map(itinerary => ({
      duration: itinerary.duration,
      durationMinutes: parseDuration(itinerary.duration),
      segments: itinerary.segments.map(segment => ({
        departure: {
          airport: segment.departure.iataCode,
          airportName: getAirportName(segment.departure.iataCode),
          terminal: segment.departure.terminal,
          dateTime: segment.departure.at
        },
        arrival: {
          airport: segment.arrival.iataCode,
          airportName: getAirportName(segment.arrival.iataCode),
          terminal: segment.arrival.terminal,
          dateTime: segment.arrival.at
        },
        airline: {
          code: segment.carrierCode,
          name: dictionaries.carriers[segment.carrierCode],
          logo: `https://logos.skyscnr.com/images/airlines/${segment.carrierCode}.png`
        },
        flightNumber: `${segment.carrierCode}${segment.number}`,
        aircraft: dictionaries.aircraft[segment.aircraft.code],
        cabinClass: getCabinClass(amadeusOffer.travelerPricings, segment.id),
        durationMinutes: parseDuration(segment.duration)
      }))
    })),
    stops: calculateTotalStops(amadeusOffer.itineraries),
    seatsAvailable: amadeusOffer.numberOfBookableSeats,
    fareRules: {
      refundable: false, // Not directly available in basic response
      changeable: true,
      changeFee: null
    }
  };
}
```

### 4.5 Mock Data Strategy

**Location:** `/server/mocks/`

**Mock Files:**

1. **`flightOffers.json`** - Pre-generated Amadeus-format responses for common routes:
   - JFK → LAX (domestic)
   - JFK → LHR (transatlantic)
   - LAX → HNL (popular vacation)
   - SFO → NRT (transpacific)
   - ORD → MIA (domestic)

2. **`airports.json`** - Top 200 airports with full details for autocomplete

3. **`trendingDeals.json`** - 20 pre-seeded trending deals

**Mock Mode Detection:**
```typescript
// In /server/src/services/amadeus.ts
const useMockData = !process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET;

async function searchFlights(params: SearchParams): Promise<FlightOffer[]> {
  if (useMockData) {
    return getMockFlights(params);
  }
  return fetchFromAmadeus(params);
}
```

**Mock Data Generation Rules:**
- Realistic prices based on route distance
- Varied departure times (6AM - 10PM)
- Mix of direct and connecting flights
- Multiple airlines per route
- Realistic flight durations
- Prices vary ±15% from base to simulate real variance

---

## 5. Frontend Pages

### 5.1 Deal Dashboard (`/` - Dashboard.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Header: Logo | Search | Alerts | History]              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Hero: "Find Your Next Adventure"                │   │
│  │ [Quick Search Form - inline]                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🔥 Trending Deals                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ NYC→MIA │ │ LAX→HNL │ │ SFO→SEA │ │ BOS→SJU │      │
│  │ $89     │ │ $199    │ │ $79     │ │ $149    │      │
│  │ -44%    │ │ -35%    │ │ -28%    │ │ -40%    │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                         │
│  📊 Your Saved Alerts (3 active)                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ JFK → LHR | Target: $500 | Current: $650 ⬇️    │   │
│  │ LAX → TYO | Target: $800 | Current: $920 ⬇️    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🌍 Popular Routes                                      │
│  [Grid of popular route cards]                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Footer]                                                │
└─────────────────────────────────────────────────────────┘
```

**Components Used:**
- `DealGrid` - Trending deals display
- `AlertList` (compact mode) - Summary of saved alerts
- `PopularRoutes` - Popular destinations
- `SearchForm` (inline variant) - Quick search

**Data Fetching:**
- `GET /api/deals` on mount
- `GET /api/alerts` on mount
- Refresh deals every 5 minutes

---

### 5.2 Flight Search (`/search` - Search.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Header]                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Search Flights                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ○ One-way  ● Round-trip                         │   │
│  │                                                  │   │
│  │ From: [JFK - New York    ▼] ⇄                   │   │
│  │ To:   [_______________   ▼]                     │   │
│  │                                                  │   │
│  │ Depart: [Mar 15, 2026 📅] Return: [Mar 22 📅]  │   │
│  │                                                  │   │
│  │ Passengers: [1 ▼]  Class: [Economy ▼]          │   │
│  │                                                  │   │
│  │            [🔍 Search Flights]                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────┬──────────────────────────────────┐   │
│  │ Filters      │ 45 flights found                 │   │
│  │              │ Sort: [Price ▼]                  │   │
│  │ Stops        │                                  │   │
│  │ ☑ Non-stop  │ ┌────────────────────────────┐   │   │
│  │ ☑ 1 stop   │ │ ✈ American Airlines AA123  │   │   │
│  │ ☐ 2+ stops │ │ JFK 8:00am → LAX 11:30am   │   │   │
│  │              │ │ 5h 30m · Non-stop          │   │   │
│  │ Airlines     │ │ $199                [→]   │   │   │
│  │ ☑ All      │ └────────────────────────────┘   │   │
│  │              │                                  │   │
│  │ Price        │ ┌────────────────────────────┐   │   │
│  │ $0 ─●─ $500 │ │ ✈ Delta DL456             │   │   │
│  │              │ │ ...                        │   │   │
│  │ Times        │ └────────────────────────────┘   │   │
│  │ ────●──── │ │                                  │   │
│  └──────────────┴──────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Components Used:**
- `SearchForm` - Full search form
- `AirportInput` - Autocomplete airport selector
- `DatePicker` - Date selection
- `PassengerSelect` - Passenger count
- `FlightList` - Results display
- `FlightCard` - Individual result
- `FlightSkeleton` - Loading state
- Filter components (inline)

**Features:**
- URL state synchronization (shareable search URLs)
- Skeleton loaders during search
- Client-side filtering after initial load
- "Set Alert" button on each result
- Expandable flight details

---

### 5.3 Price Alerts (`/alerts` - Alerts.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Header]                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Price Alerts                           [+ New Alert]   │
│                                                         │
│  Track prices and get notified when they drop!         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🛫 New York (JFK) → London (LHR)               │   │
│  │                                                  │   │
│  │ Jun 15 - Jun 22, 2026 · 2 passengers           │   │
│  │                                                  │   │
│  │ Target Price: $500    Current: $650             │   │
│  │ ████████████░░░░░░░░  $150 above target        │   │
│  │                                                  │   │
│  │ 📧 user@example.com                             │   │
│  │ Last checked: 2 hours ago                       │   │
│  │                                                  │   │
│  │ [Edit] [Pause] [Delete]                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🛫 Los Angeles (LAX) → Tokyo (NRT)             │   │
│  │ ...                                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ────────────────────────────────────────────────────   │
│  💡 Tip: Set alerts for flexible dates to maximize     │
│     your chances of catching a great deal!             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Components Used:**
- `AlertList` - Full alert list
- `AlertCard` - Individual alert with details
- `AlertForm` - Create/edit modal
- `PriceThreshold` - Visual price progress
- `Modal` - For create/edit dialogs

**Features:**
- Create new alerts via modal
- Edit existing alerts inline
- Pause/resume alerts
- Delete with confirmation
- Visual progress toward target price
- Price history chart (if data available)

---

### 5.4 Search History (`/history` - History.tsx)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Header]                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Search History                        [Clear All]      │
│                                                         │
│  Your recent flight searches                            │
│                                                         │
│  Today                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ JFK → LAX                              2:30 PM  │   │
│  │ Mar 15, 2026 · 1 passenger · One-way           │   │
│  │ Lowest: $199 (45 results)                      │   │
│  │                        [Search Again] [Delete] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Yesterday                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ SFO → SEA                              9:15 AM  │   │
│  │ Mar 20, 2026 · 2 passengers · Round-trip       │   │
│  │ Lowest: $158 (32 results)                      │   │
│  │                        [Search Again] [Delete] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔍 No more searches. Start exploring!          │   │
│  │    [Search Flights →]                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Components Used:**
- History list component
- History item cards
- Empty state component
- Confirmation dialog for clear all

**Features:**
- Grouped by date (Today, Yesterday, Older)
- Quick re-run search
- Delete individual entries
- Clear all with confirmation
- Navigate to search page with pre-filled form

---

## 6. Shared Types

**Location:** `/types/`

### `/types/flight.ts`

```typescript
export interface Airport {
  code: string;           // IATA code (e.g., "JFK")
  name: string;           // Full airport name
  city: string;           // City name
  country: string;        // Country name
  countryCode: string;    // ISO 2-letter country code
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface Airline {
  code: string;           // IATA airline code (e.g., "AA")
  name: string;           // Full airline name
  logo?: string;          // URL to airline logo
}

export interface FlightEndpoint {
  airport: string;        // IATA code
  airportName: string;    // Full airport name
  terminal?: string;      // Terminal number/letter
  dateTime: string;       // ISO 8601 datetime
}

export interface FlightSegment {
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  airline: Airline;
  flightNumber: string;   // e.g., "AA123"
  aircraft?: string;      // Aircraft type name
  cabinClass: CabinClass;
  durationMinutes: number;
  operatingAirline?: Airline; // If different from marketing airline
}

export interface FlightItinerary {
  duration: string;       // ISO 8601 duration (e.g., "PT5H30M")
  durationMinutes: number;
  segments: FlightSegment[];
}

export interface FlightPrice {
  amount: number;
  currency: string;       // ISO 4217 currency code
  pricePerPerson: number;
  originalPrice?: number; // For showing discounts
  fees?: number;
}

export interface FareRules {
  refundable: boolean;
  changeable: boolean;
  changeFee?: number | null;
  baggageIncluded?: boolean;
  baggageWeight?: number;
  baggageUnit?: 'KG' | 'LB';
}

export interface FlightOffer {
  id: string;
  price: FlightPrice;
  itineraries: FlightItinerary[];
  stops: number;          // Total stops across all itineraries
  bookingUrl?: string;
  seatsAvailable?: number;
  fareRules?: FareRules;
  validatingAirline?: Airline;
  lastTicketingDate?: string;
}

export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export type TripType = 'one-way' | 'round-trip';

export type SortOption = 'price' | 'duration' | 'departure' | 'arrival' | 'stops';
```

### `/types/search.ts`

```typescript
import { CabinClass, TripType, SortOption, FlightOffer } from './flight';

export interface SearchQuery {
  origin: string;
  destination: string;
  departureDate: string;  // YYYY-MM-DD
  returnDate?: string;    // YYYY-MM-DD, null for one-way
  passengers: number;
  tripType: TripType;
  cabinClass?: CabinClass;
  maxStops?: number;
  maxPrice?: number;
  sortBy?: SortOption;
}

export interface SearchMetadata {
  searchId: string;
  totalResults: number;
  searchTimestamp: string;
  dataSource: 'amadeus' | 'mock';
  cached: boolean;
  cacheExpiry?: string;
}

export interface SearchResult {
  query: SearchQuery;
  results: FlightOffer[];
  metadata: SearchMetadata;
}

export interface SearchHistoryEntry {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: TripType;
  lowestPrice?: number;
  resultsCount?: number;
  searchedAt: string;
}
```

### `/types/alert.ts`

```typescript
import { TripType } from './flight';

export interface PriceAlert {
  id: string;
  origin: string;
  originCity?: string;
  destination: string;
  destinationCity?: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType?: TripType;
  maxPrice: number;
  currentPrice?: number;
  priceDifference?: number; // currentPrice - maxPrice
  currency: string;
  email?: string;
  isActive: boolean;
  lastCheckedAt?: string;
  lastNotifiedAt?: string;
  priceHistory?: PricePoint[];
  createdAt: string;
  updatedAt?: string;
}

export interface PricePoint {
  price: number;
  date: string;
}

export interface CreateAlertRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  maxPrice: number;
  currency?: string;
  email?: string;
}

export interface UpdateAlertRequest {
  maxPrice?: number;
  email?: string;
  isActive?: boolean;
}
```

### `/types/api.ts`

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Common error codes
export type ErrorCode =
  | 'INVALID_PARAMS'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'EXTERNAL_API_ERROR'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR';
```

### `/types/deal.ts`

```typescript
import { Airport, Airline, TripType } from './flight';

export interface TrendingDeal {
  id: string;
  origin: Pick<Airport, 'code' | 'city' | 'country'>;
  destination: Pick<Airport, 'code' | 'city' | 'country'>;
  price: {
    amount: number;
    currency: string;
    originalPrice?: number;
    discountPercentage?: number;
  };
  departureDate: string;
  returnDate?: string;
  airline?: Pick<Airline, 'code' | 'name'>;
  tripType: TripType;
  stops?: number;
  durationMinutes?: number;
  dealScore: number;      // 0-100 rating of how good the deal is
  expiresAt?: string;
}

export interface PopularRoute {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  averagePrice: number;
  searchCount: number;
}

export interface DealsResponse {
  deals: TrendingDeal[];
  popularRoutes: PopularRoute[];
  lastUpdated: string;
}
```

### `/types/index.ts`

```typescript
// Main export file - re-exports all types
export * from './flight';
export * from './search';
export * from './alert';
export * from './deal';
export * from './api';
```

---

## 7. Dependencies

### 7.1 Root `package.json`

```json
{
  "name": "flydeal",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "types",
    "server",
    "client"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "npm run dev --workspace=server",
    "dev:client": "npm run dev --workspace=client",
    "build": "npm run build --workspaces",
    "start": "npm run start --workspace=server",
    "lint": "npm run lint --workspaces",
    "clean": "rm -rf node_modules */node_modules */dist"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.4.2"
  }
}
```

### 7.2 Server Dependencies (`/server/package.json`)

```json
{
  "name": "@flydeal/server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "@flydeal/types": "workspace:*",
    "better-sqlite3": "^11.1.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.2.0",
    "helmet": "^7.1.0",
    "nanoid": "^5.0.7",
    "node-fetch": "^3.3.2",
    "zod": "^3.22.5"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.10",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.2",
    "@typescript-eslint/eslint-plugin": "^7.4.0",
    "@typescript-eslint/parser": "^7.4.0",
    "eslint": "^8.57.0",
    "nodemon": "^3.1.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.2"
  }
}
```

**Dependency Explanations:**
| Package | Version | Purpose |
|---------|---------|---------|
| better-sqlite3 | ^11.1.2 | SQLite database driver (synchronous, fast) |
| cors | ^2.8.5 | Enable CORS for frontend requests |
| dotenv | ^16.4.5 | Load environment variables from .env |
| express | ^4.19.2 | Web framework for API |
| express-rate-limit | ^7.2.0 | Rate limiting middleware |
| helmet | ^7.1.0 | Security headers middleware |
| nanoid | ^5.0.7 | Generate unique IDs for records |
| node-fetch | ^3.3.2 | HTTP client for Amadeus API |
| zod | ^3.22.5 | Runtime validation for request bodies |

### 7.3 Client Dependencies (`/client/package.json`)

```json
{
  "name": "@flydeal/client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "@flydeal/types": "workspace:*",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.67",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.4.0",
    "@typescript-eslint/parser": "^7.4.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.2.6"
  }
}
```

**Dependency Explanations:**
| Package | Version | Purpose |
|---------|---------|---------|
| clsx | ^2.1.0 | Conditional className utility |
| date-fns | ^3.6.0 | Date formatting and manipulation |
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React DOM renderer |
| react-hot-toast | ^2.4.1 | Toast notifications |
| react-router-dom | ^6.22.3 | Client-side routing |
| tailwindcss | ^3.4.1 | Utility-first CSS framework |
| vite | ^5.2.6 | Build tool and dev server |

### 7.4 Types Package (`/types/package.json`)

```json
{
  "name": "@flydeal/types",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.4.2"
  }
}
```

---

## 8. Environment Variables

### `.env.example`

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Amadeus API (leave empty to use mock data)
AMADEUS_API_KEY=
AMADEUS_API_SECRET=
AMADEUS_API_URL=https://test.api.amadeus.com

# Database
DATABASE_PATH=./data/flydeal.db

# Session Configuration (for anonymous session tracking)
SESSION_SECRET=your-session-secret-here

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 9. Design System

### Color Palette

```css
/* Primary - Sky Blue */
--color-primary-50: #f0f9ff;
--color-primary-100: #e0f2fe;
--color-primary-200: #bae6fd;
--color-primary-300: #7dd3fc;
--color-primary-400: #38bdf8;
--color-primary-500: #0ea5e9;  /* Main */
--color-primary-600: #0284c7;
--color-primary-700: #0369a1;
--color-primary-800: #075985;
--color-primary-900: #0c4a6e;

/* Neutral - Slate */
--color-gray-50: #f8fafc;
--color-gray-100: #f1f5f9;
--color-gray-200: #e2e8f0;
--color-gray-300: #cbd5e1;
--color-gray-400: #94a3b8;
--color-gray-500: #64748b;
--color-gray-600: #475569;
--color-gray-700: #334155;
--color-gray-800: #1e293b;
--color-gray-900: #0f172a;

/* Success - Green */
--color-success-500: #22c55e;

/* Warning - Amber */
--color-warning-500: #f59e0b;

/* Error - Red */
--color-error-500: #ef4444;
```

### TailwindCSS Configuration Highlights

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... full palette
          500: '#0ea5e9',
          // ...
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 10. Implementation Order

**Phase 1: Project Setup**
1. Initialize monorepo structure with workspaces
2. Configure TypeScript across packages
3. Set up shared types package
4. Create database schema and initialization

**Phase 2: Backend Foundation**
5. Express app setup with middleware
6. Database connection and queries
7. Mock data creation
8. Flight search endpoint (mock mode)

**Phase 3: Core Backend Features**
9. Amadeus API integration with auth
10. Response mapping
11. Search history endpoints
12. Deals endpoint

**Phase 4: Alerts System**
13. Alerts CRUD endpoints
14. Price checking logic

**Phase 5: Frontend Foundation**
15. Vite + React setup
16. TailwindCSS configuration
17. Layout components (Header, Footer)
18. Common components (Button, Input, Card)

**Phase 6: Frontend Pages**
19. Dashboard page with deals
20. Search page with form and results
21. Alerts management page
22. Search history page

**Phase 7: Polish**
23. Loading states and skeletons
24. Error handling and toasts
25. Responsive design
26. Accessibility audit

---

*End of Technical Plan*
