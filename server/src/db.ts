import Database from 'better-sqlite3';
import path from 'path';
import { PriceAlert, SearchHistory } from '../../types/index.js';

const dbPath = path.join(process.cwd(), 'flydeal.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    max_price REAL NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    return_date TEXT,
    adults INTEGER NOT NULL DEFAULT 1,
    result_count INTEGER NOT NULL DEFAULT 0,
    searched_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_alerts_email ON alerts(email);
  CREATE INDEX IF NOT EXISTS idx_history_searched ON search_history(searched_at DESC);
`);

export function createAlert(origin: string, destination: string, maxPrice: number, email: string): PriceAlert {
  const stmt = db.prepare(`
    INSERT INTO alerts (origin, destination, max_price, email)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(origin.toUpperCase(), destination.toUpperCase(), maxPrice, email);
  
  return getAlertById(result.lastInsertRowid as number)!;
}

export function getAlertById(id: number): PriceAlert | undefined {
  const stmt = db.prepare(`SELECT * FROM alerts WHERE id = ?`);
  const row = stmt.get(id) as any;
  if (!row) return undefined;
  
  return {
    id: row.id,
    origin: row.origin,
    destination: row.destination,
    maxPrice: row.max_price,
    email: row.email,
    createdAt: row.created_at,
  };
}

export function getAllAlerts(email?: string): PriceAlert[] {
  let stmt;
  if (email) {
    stmt = db.prepare(`SELECT * FROM alerts WHERE email = ? ORDER BY created_at DESC`);
    return (stmt.all(email) as any[]).map(row => ({
      id: row.id,
      origin: row.origin,
      destination: row.destination,
      maxPrice: row.max_price,
      email: row.email,
      createdAt: row.created_at,
    }));
  } else {
    stmt = db.prepare(`SELECT * FROM alerts ORDER BY created_at DESC`);
    return (stmt.all() as any[]).map(row => ({
      id: row.id,
      origin: row.origin,
      destination: row.destination,
      maxPrice: row.max_price,
      email: row.email,
      createdAt: row.created_at,
    }));
  }
}

export function deleteAlert(id: number): boolean {
  const stmt = db.prepare(`DELETE FROM alerts WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

export function addSearchHistory(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | null,
  adults: number,
  resultCount: number
): SearchHistory {
  const stmt = db.prepare(`
    INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    origin.toUpperCase(),
    destination.toUpperCase(),
    departureDate,
    returnDate,
    adults,
    resultCount
  );
  
  return getSearchHistoryById(result.lastInsertRowid as number)!;
}

export function getSearchHistoryById(id: number): SearchHistory | undefined {
  const stmt = db.prepare(`SELECT * FROM search_history WHERE id = ?`);
  const row = stmt.get(id) as any;
  if (!row) return undefined;
  
  return {
    id: row.id,
    origin: row.origin,
    destination: row.destination,
    departureDate: row.departure_date,
    returnDate: row.return_date,
    adults: row.adults,
    resultCount: row.result_count,
    searchedAt: row.searched_at,
  };
}

export function getRecentSearchHistory(limit: number = 20): SearchHistory[] {
  const stmt = db.prepare(`SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?`);
  return (stmt.all(limit) as any[]).map(row => ({
    id: row.id,
    origin: row.origin,
    destination: row.destination,
    departureDate: row.departure_date,
    returnDate: row.return_date,
    adults: row.adults,
    resultCount: row.result_count,
    searchedAt: row.searched_at,
  }));
}

export default db;
