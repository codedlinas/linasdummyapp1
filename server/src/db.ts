import Database from 'better-sqlite3';
import path from 'path';
import { Alert, SearchHistory } from '../../types/index.js';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'flydeal.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      max_price REAL NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      current_price REAL
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      return_date TEXT,
      passengers INTEGER NOT NULL DEFAULT 1,
      searched_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_alerts_email ON alerts(email);
    CREATE INDEX IF NOT EXISTS idx_history_searched_at ON search_history(searched_at DESC);
  `);

  console.log('Database initialized successfully');
}

export function insertAlert(
  origin: string,
  destination: string,
  maxPrice: number,
  email: string
): Alert {
  const stmt = db.prepare(`
    INSERT INTO alerts (origin, destination, max_price, email)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(origin.toUpperCase(), destination.toUpperCase(), maxPrice, email);
  
  return {
    id: result.lastInsertRowid as number,
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    maxPrice,
    email,
    createdAt: new Date().toISOString()
  };
}

export function getAlerts(email?: string): Alert[] {
  let stmt;
  let rows;
  
  if (email) {
    stmt = db.prepare(`
      SELECT id, origin, destination, max_price as maxPrice, email, created_at as createdAt, current_price as currentPrice
      FROM alerts
      WHERE email = ?
      ORDER BY created_at DESC
    `);
    rows = stmt.all(email);
  } else {
    stmt = db.prepare(`
      SELECT id, origin, destination, max_price as maxPrice, email, created_at as createdAt, current_price as currentPrice
      FROM alerts
      ORDER BY created_at DESC
    `);
    rows = stmt.all();
  }
  
  return rows as Alert[];
}

export function getAlertById(id: number): Alert | undefined {
  const stmt = db.prepare(`
    SELECT id, origin, destination, max_price as maxPrice, email, created_at as createdAt, current_price as currentPrice
    FROM alerts
    WHERE id = ?
  `);
  return stmt.get(id) as Alert | undefined;
}

export function updateAlertCurrentPrice(id: number, currentPrice: number): void {
  const stmt = db.prepare(`
    UPDATE alerts SET current_price = ? WHERE id = ?
  `);
  stmt.run(currentPrice, id);
}

export function deleteAlert(id: number): boolean {
  const stmt = db.prepare('DELETE FROM alerts WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function insertSearch(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string | undefined,
  passengers: number
): SearchHistory {
  const stmt = db.prepare(`
    INSERT INTO search_history (origin, destination, departure_date, return_date, passengers)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    origin.toUpperCase(),
    destination.toUpperCase(),
    departureDate,
    returnDate || null,
    passengers
  );
  
  return {
    id: result.lastInsertRowid as number,
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate,
    returnDate,
    passengers,
    searchedAt: new Date().toISOString()
  };
}

export function getHistory(limit: number = 20): SearchHistory[] {
  const stmt = db.prepare(`
    SELECT id, origin, destination, departure_date as departureDate, return_date as returnDate, passengers, searched_at as searchedAt
    FROM search_history
    ORDER BY searched_at DESC
    LIMIT ?
  `);
  return stmt.all(limit) as SearchHistory[];
}

export function clearHistory(): void {
  db.exec('DELETE FROM search_history');
}

export function closeDatabase(): void {
  db.close();
}

export default db;
