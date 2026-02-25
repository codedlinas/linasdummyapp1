import Database from 'better-sqlite3';
import { vi } from 'vitest';

let testDb: Database.Database | null = null;

export function createTestDatabase(): Database.Database {
  testDb = new Database(':memory:');
  
  testDb.exec(`
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
  
  return testDb;
}

export function getTestDatabase(): Database.Database {
  if (!testDb) {
    return createTestDatabase();
  }
  return testDb;
}

export function closeTestDatabase(): void {
  if (testDb) {
    testDb.close();
    testDb = null;
  }
}

export function clearTestDatabase(): void {
  if (testDb) {
    testDb.exec('DELETE FROM alerts');
    testDb.exec('DELETE FROM search_history');
  }
}

export function createTestDbFunctions(db: Database.Database) {
  return {
    createAlert: (origin: string, destination: string, maxPrice: number, email: string) => {
      const stmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(origin.toUpperCase(), destination.toUpperCase(), maxPrice, email);
      const row = db.prepare(`SELECT * FROM alerts WHERE id = ?`).get(result.lastInsertRowid) as any;
      return {
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      };
    },
    
    getAlertById: (id: number) => {
      const row = db.prepare(`SELECT * FROM alerts WHERE id = ?`).get(id) as any;
      if (!row) return undefined;
      return {
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      };
    },
    
    getAllAlerts: (email?: string) => {
      let rows: any[];
      if (email) {
        rows = db.prepare(`SELECT * FROM alerts WHERE email = ? ORDER BY created_at DESC`).all(email) as any[];
      } else {
        rows = db.prepare(`SELECT * FROM alerts ORDER BY created_at DESC`).all() as any[];
      }
      return rows.map(row => ({
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      }));
    },
    
    deleteAlert: (id: number): boolean => {
      const result = db.prepare(`DELETE FROM alerts WHERE id = ?`).run(id);
      return result.changes > 0;
    },
    
    addSearchHistory: (
      origin: string,
      destination: string,
      departureDate: string,
      returnDate: string | null,
      adults: number,
      resultCount: number
    ) => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(origin.toUpperCase(), destination.toUpperCase(), departureDate, returnDate, adults, resultCount);
      const row = db.prepare(`SELECT * FROM search_history WHERE id = ?`).get(result.lastInsertRowid) as any;
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
    },
    
    getRecentSearchHistory: (limit: number = 20) => {
      const rows = db.prepare(`SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?`).all(limit) as any[];
      return rows.map(row => ({
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        departureDate: row.departure_date,
        returnDate: row.return_date,
        adults: row.adults,
        resultCount: row.result_count,
        searchedAt: row.searched_at,
      }));
    },
  };
}
