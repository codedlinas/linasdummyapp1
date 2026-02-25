# FlyDeal API Server

Backend API server for the FlyDeal flight search application.

## Features

- **Flight Search**: Search for flights with origin, destination, dates, and passenger count
- **Price Deals**: Trending cheap flight deals from popular routes
- **Price Alerts**: Save alerts for routes and get notified when prices drop
- **Search History**: Track and re-run recent searches

## Tech Stack

- Node.js with Express
- TypeScript
- SQLite (better-sqlite3)
- Amadeus Flight Offers API (with mock fallback)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd server
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

To use the live Amadeus API, sign up at [developers.amadeus.com](https://developers.amadeus.com) and add your credentials:

```
AMADEUS_API_KEY=your_api_key
AMADEUS_API_SECRET=your_api_secret
```

Without API credentials, the server uses realistic mock data.

### Running the Server

Development mode with hot reload:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The server runs on `http://localhost:3001` by default.

## API Endpoints

### Health Check

```
GET /api/health
```

### Flight Search

```
GET /api/flights/search?origin=JFK&destination=LHR&departureDate=2026-04-15&passengers=1
```

Query Parameters:
- `origin` (required): 3-letter IATA airport code
- `destination` (required): 3-letter IATA airport code
- `departureDate` (required): Date in YYYY-MM-DD format
- `returnDate` (optional): Date in YYYY-MM-DD format (for round trips)
- `passengers` (optional): Number of passengers (1-9, default: 1)

### API Status

```
GET /api/flights/status
```

Returns whether the Amadeus API is configured or using mock data.

### Deals

```
GET /api/deals
```

Returns trending cheap flight deals. Results are cached for 15 minutes.

```
GET /api/deals/refresh
```

Force refresh the deals cache.

### Alerts

Create an alert:

```
POST /api/alerts
Content-Type: application/json

{
  "origin": "JFK",
  "destination": "LHR",
  "maxPrice": 500,
  "email": "user@example.com"
}
```

List all alerts:

```
GET /api/alerts
GET /api/alerts?email=user@example.com
```

Get a specific alert:

```
GET /api/alerts/:id
```

Delete an alert:

```
DELETE /api/alerts/:id
```

### Search History

Get recent searches (last 20 by default):

```
GET /api/history
GET /api/history?limit=10
```

Clear search history:

```
DELETE /api/history
```

## Response Format

All endpoints return responses in this format:

```json
{
  "success": true,
  "data": [...],
  "message": "Description of the result"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Project Structure

```
server/
├── src/
│   ├── index.ts          # Main Express server
│   ├── db.ts             # SQLite database operations
│   ├── routes/
│   │   ├── flights.ts    # Flight search endpoints
│   │   ├── deals.ts      # Deals endpoints with caching
│   │   ├── alerts.ts     # Price alert CRUD
│   │   └── history.ts    # Search history
│   ├── services/
│   │   └── amadeus.ts    # Amadeus API client with OAuth2
│   └── mocks/
│       └── flights.ts    # Mock flight data generator
├── package.json
├── tsconfig.json
└── .env.example
```

## License

MIT
