# FlyDeal - Cheap Flight Finder

A modern web application to find cheap flight tickets, compare prices, and set price alerts.

## Features

- **Flight Search** - Search flights by origin, destination, dates, and passengers
- **Price Comparison** - Compare prices from multiple airlines in a unified list
- **Price Alerts** - Set alerts to get notified when prices drop below your target
- **Deal Dashboard** - View trending deals and popular routes
- **Search History** - Re-run previous searches with one click

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, SQLite (better-sqlite3)
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Flight Data**: Amadeus Flight Offers Search API (with mock data fallback)

## Project Structure

```
flydeal/
├── server/          # Express API server
│   └── src/
│       ├── routes/     # API route handlers
│       ├── services/   # Amadeus API client
│       └── mocks/      # Mock flight data
├── client/          # React frontend
│   └── src/
│       ├── pages/      # Page components
│       ├── components/ # Reusable components
│       └── api.ts      # API client
└── types/           # Shared TypeScript types
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

```bash
# Install all dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install
```

### Development

Start both server and client in development mode:

```bash
# From root directory
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start server (port 3001)
cd server && npm run dev

# Terminal 2 - Start client (port 5173)
cd client && npm run dev
```

The client is configured to proxy `/api` requests to the server.

### Using Live Amadeus API

By default, the app uses mock flight data. To use the live Amadeus API:

1. Sign up at [developers.amadeus.com](https://developers.amadeus.com)
2. Create an app to get API credentials
3. Set environment variables:

```bash
export AMADEUS_API_KEY=your_api_key
export AMADEUS_API_SECRET=your_api_secret
```

Then restart the server.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flights/search` | Search for flights |
| GET | `/api/flights/status` | Check API mode (live/mock) |
| GET | `/api/deals` | Get trending deals |
| POST | `/api/alerts` | Create a price alert |
| GET | `/api/alerts` | List price alerts |
| DELETE | `/api/alerts/:id` | Delete a price alert |
| GET | `/api/history` | Get search history |

## Screenshots

The application features:
- A modern, clean UI with sky blue accents
- Mobile-responsive design
- Skeleton loaders during data fetching
- Accessible components with proper focus states

## License

MIT
