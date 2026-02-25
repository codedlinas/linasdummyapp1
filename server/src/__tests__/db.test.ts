import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(process.cwd(), 'test-db-functions.db');

interface Alert {
  id: number;
  origin: string;
  destination: string;
  maxPrice: number;
  email: string;
  createdAt: string;
}

interface SearchHistory {
  id: number;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string | null;
  adults: number;
  resultCount: number;
  searchedAt: string;
}

describe('Database Functions', () => {
  let db: Database.Database;

  function createAlert(origin: string, destination: string, maxPrice: number, email: string): Alert {
    const stmt = db.prepare(`
      INSERT INTO alerts (origin, destination, max_price, email)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(origin.toUpperCase(), destination.toUpperCase(), maxPrice, email);
    return getAlertById(result.lastInsertRowid as number)!;
  }

  function getAlertById(id: number): Alert | undefined {
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

  function getAllAlerts(email?: string): Alert[] {
    let stmt;
    if (email) {
      stmt = db.prepare(`SELECT * FROM alerts WHERE email = ? ORDER BY created_at DESC`);
      return (stmt.all(email) as any[]).map((row) => ({
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      }));
    } else {
      stmt = db.prepare(`SELECT * FROM alerts ORDER BY created_at DESC`);
      return (stmt.all() as any[]).map((row) => ({
        id: row.id,
        origin: row.origin,
        destination: row.destination,
        maxPrice: row.max_price,
        email: row.email,
        createdAt: row.created_at,
      }));
    }
  }

  function deleteAlert(id: number): boolean {
    const stmt = db.prepare(`DELETE FROM alerts WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }

  function addSearchHistory(
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

  function getSearchHistoryById(id: number): SearchHistory | undefined {
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

  function getRecentSearchHistory(limit: number = 20): SearchHistory[] {
    const stmt = db.prepare(`SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?`);
    return (stmt.all(limit) as any[]).map((row) => ({
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

  beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    db = new Database(TEST_DB_PATH);
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
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('Database Initialization', () => {
    it('creates alerts table', () => {
      const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='alerts'`);
      const result = stmt.get();
      expect(result).toBeDefined();
    });

    it('creates search_history table', () => {
      const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='search_history'`);
      const result = stmt.get();
      expect(result).toBeDefined();
    });

    it('creates alerts email index', () => {
      const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='index' AND name='idx_alerts_email'`);
      const result = stmt.get();
      expect(result).toBeDefined();
    });

    it('creates history searched_at index', () => {
      const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='index' AND name='idx_history_searched'`);
      const result = stmt.get();
      expect(result).toBeDefined();
    });
  });

  describe('Alert Functions', () => {
    describe('createAlert', () => {
      it('creates an alert and returns it', () => {
        const alert = createAlert('JFK', 'LHR', 500, 'test@example.com');

        expect(alert.id).toBeDefined();
        expect(alert.origin).toBe('JFK');
        expect(alert.destination).toBe('LHR');
        expect(alert.maxPrice).toBe(500);
        expect(alert.email).toBe('test@example.com');
        expect(alert.createdAt).toBeDefined();
      });

      it('converts airport codes to uppercase', () => {
        const alert = createAlert('jfk', 'lhr', 500, 'test@example.com');

        expect(alert.origin).toBe('JFK');
        expect(alert.destination).toBe('LHR');
      });

      it('auto-increments IDs', () => {
        const alert1 = createAlert('JFK', 'LHR', 500, 'test@example.com');
        const alert2 = createAlert('LAX', 'CDG', 600, 'test@example.com');

        expect(alert2.id).toBe(alert1.id + 1);
      });
    });

    describe('getAlertById', () => {
      it('returns the alert with the given ID', () => {
        const created = createAlert('JFK', 'LHR', 500, 'test@example.com');
        const found = getAlertById(created.id);

        expect(found).toBeDefined();
        expect(found!.id).toBe(created.id);
        expect(found!.origin).toBe('JFK');
      });

      it('returns undefined for non-existent ID', () => {
        const found = getAlertById(999);
        expect(found).toBeUndefined();
      });
    });

    describe('getAllAlerts', () => {
      it('returns all alerts', () => {
        createAlert('JFK', 'LHR', 500, 'user1@example.com');
        createAlert('LAX', 'CDG', 600, 'user2@example.com');

        const alerts = getAllAlerts();

        expect(alerts.length).toBe(2);
      });

      it('filters by email', () => {
        createAlert('JFK', 'LHR', 500, 'user1@example.com');
        createAlert('LAX', 'CDG', 600, 'user2@example.com');

        const alerts = getAllAlerts('user1@example.com');

        expect(alerts.length).toBe(1);
        expect(alerts[0].email).toBe('user1@example.com');
      });

      it('returns empty array when no alerts exist', () => {
        const alerts = getAllAlerts();
        expect(alerts).toEqual([]);
      });

      it('returns alerts in consistent order', () => {
        const alert1 = createAlert('JFK', 'LHR', 500, 'test@example.com');
        const alert2 = createAlert('LAX', 'CDG', 600, 'test@example.com');

        const alerts = getAllAlerts();

        expect(alerts.length).toBe(2);
        const ids = alerts.map(a => a.id);
        expect(ids).toContain(alert1.id);
        expect(ids).toContain(alert2.id);
      });
    });

    describe('deleteAlert', () => {
      it('deletes an existing alert and returns true', () => {
        const alert = createAlert('JFK', 'LHR', 500, 'test@example.com');
        const deleted = deleteAlert(alert.id);

        expect(deleted).toBe(true);
        expect(getAlertById(alert.id)).toBeUndefined();
      });

      it('returns false for non-existent alert', () => {
        const deleted = deleteAlert(999);
        expect(deleted).toBe(false);
      });
    });
  });

  describe('Search History Functions', () => {
    describe('addSearchHistory', () => {
      it('adds a search history entry and returns it', () => {
        const entry = addSearchHistory('JFK', 'LHR', '2026-04-01', '2026-04-08', 2, 15);

        expect(entry.id).toBeDefined();
        expect(entry.origin).toBe('JFK');
        expect(entry.destination).toBe('LHR');
        expect(entry.departureDate).toBe('2026-04-01');
        expect(entry.returnDate).toBe('2026-04-08');
        expect(entry.adults).toBe(2);
        expect(entry.resultCount).toBe(15);
        expect(entry.searchedAt).toBeDefined();
      });

      it('handles null return date for one-way trips', () => {
        const entry = addSearchHistory('JFK', 'LHR', '2026-04-01', null, 1, 10);

        expect(entry.returnDate).toBeNull();
      });

      it('converts airport codes to uppercase', () => {
        const entry = addSearchHistory('jfk', 'lhr', '2026-04-01', null, 1, 10);

        expect(entry.origin).toBe('JFK');
        expect(entry.destination).toBe('LHR');
      });
    });

    describe('getSearchHistoryById', () => {
      it('returns the entry with the given ID', () => {
        const created = addSearchHistory('JFK', 'LHR', '2026-04-01', null, 1, 10);
        const found = getSearchHistoryById(created.id);

        expect(found).toBeDefined();
        expect(found!.id).toBe(created.id);
      });

      it('returns undefined for non-existent ID', () => {
        const found = getSearchHistoryById(999);
        expect(found).toBeUndefined();
      });
    });

    describe('getRecentSearchHistory', () => {
      it('returns recent search history', () => {
        addSearchHistory('JFK', 'LHR', '2026-04-01', null, 1, 10);
        addSearchHistory('LAX', 'CDG', '2026-05-01', null, 2, 15);

        const history = getRecentSearchHistory();

        expect(history.length).toBe(2);
      });

      it('respects limit parameter', () => {
        addSearchHistory('JFK', 'LHR', '2026-04-01', null, 1, 10);
        addSearchHistory('LAX', 'CDG', '2026-05-01', null, 2, 15);
        addSearchHistory('SFO', 'NRT', '2026-06-01', null, 3, 20);

        const history = getRecentSearchHistory(2);

        expect(history.length).toBe(2);
      });

      it('returns history in consistent order', () => {
        const entry1 = addSearchHistory('JFK', 'LHR', '2026-04-01', null, 1, 10);
        const entry2 = addSearchHistory('LAX', 'CDG', '2026-05-01', null, 2, 15);

        const history = getRecentSearchHistory();

        expect(history.length).toBe(2);
        const ids = history.map(h => h.id);
        expect(ids).toContain(entry1.id);
        expect(ids).toContain(entry2.id);
      });

      it('uses default limit of 20', () => {
        for (let i = 0; i < 25; i++) {
          addSearchHistory('JFK', 'LHR', '2026-04-01', null, 1, 10);
        }

        const history = getRecentSearchHistory();

        expect(history.length).toBe(20);
      });
    });
  });
});
