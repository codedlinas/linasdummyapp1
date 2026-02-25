import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';

describe('Database', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(':memory:');
  });

  afterEach(() => {
    db.close();
  });

  describe('Table Initialization', () => {
    it('should create alerts table with correct schema', () => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          max_price REAL NOT NULL,
          email TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const tableInfo = db.prepare("PRAGMA table_info(alerts)").all() as any[];
      const columnNames = tableInfo.map(col => col.name);

      expect(columnNames).toContain('id');
      expect(columnNames).toContain('origin');
      expect(columnNames).toContain('destination');
      expect(columnNames).toContain('max_price');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('created_at');
    });

    it('should create search_history table with correct schema', () => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS search_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          departure_date TEXT NOT NULL,
          return_date TEXT,
          adults INTEGER NOT NULL DEFAULT 1,
          result_count INTEGER NOT NULL DEFAULT 0,
          searched_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const tableInfo = db.prepare("PRAGMA table_info(search_history)").all() as any[];
      const columnNames = tableInfo.map(col => col.name);

      expect(columnNames).toContain('id');
      expect(columnNames).toContain('origin');
      expect(columnNames).toContain('destination');
      expect(columnNames).toContain('departure_date');
      expect(columnNames).toContain('return_date');
      expect(columnNames).toContain('adults');
      expect(columnNames).toContain('result_count');
      expect(columnNames).toContain('searched_at');
    });

    it('should create indexes on alerts table', () => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          max_price REAL NOT NULL,
          email TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_alerts_email ON alerts(email);
      `);

      const indexes = db.prepare("PRAGMA index_list(alerts)").all() as any[];
      const indexNames = indexes.map(idx => idx.name);

      expect(indexNames).toContain('idx_alerts_email');
    });

    it('should create indexes on search_history table', () => {
      db.exec(`
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
        CREATE INDEX IF NOT EXISTS idx_history_searched ON search_history(searched_at DESC);
      `);

      const indexes = db.prepare("PRAGMA index_list(search_history)").all() as any[];
      const indexNames = indexes.map(idx => idx.name);

      expect(indexNames).toContain('idx_history_searched');
    });
  });

  describe('Alert Operations', () => {
    beforeEach(() => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          max_price REAL NOT NULL,
          email TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });

    it('should insert an alert and return auto-generated ID', () => {
      const stmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run('JFK', 'LHR', 500, 'test@example.com');

      expect(result.lastInsertRowid).toBe(1);
      expect(result.changes).toBe(1);
    });

    it('should retrieve alert by ID', () => {
      db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `).run('JFK', 'LHR', 500, 'test@example.com');

      const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(1) as any;

      expect(alert).toBeDefined();
      expect(alert.origin).toBe('JFK');
      expect(alert.destination).toBe('LHR');
      expect(alert.max_price).toBe(500);
      expect(alert.email).toBe('test@example.com');
    });

    it('should delete alert by ID', () => {
      db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `).run('JFK', 'LHR', 500, 'test@example.com');

      const result = db.prepare('DELETE FROM alerts WHERE id = ?').run(1);

      expect(result.changes).toBe(1);

      const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(1);
      expect(alert).toBeUndefined();
    });

    it('should filter alerts by email', () => {
      const stmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run('JFK', 'LHR', 500, 'user1@example.com');
      stmt.run('LAX', 'CDG', 600, 'user2@example.com');
      stmt.run('SFO', 'NRT', 700, 'user1@example.com');

      const alerts = db.prepare('SELECT * FROM alerts WHERE email = ?').all('user1@example.com') as any[];

      expect(alerts.length).toBe(2);
      expect(alerts.every(a => a.email === 'user1@example.com')).toBe(true);
    });
  });

  describe('Search History Operations', () => {
    beforeEach(() => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS search_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          departure_date TEXT NOT NULL,
          return_date TEXT,
          adults INTEGER NOT NULL DEFAULT 1,
          result_count INTEGER NOT NULL DEFAULT 0,
          searched_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });

    it('should insert search history record', () => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run('JFK', 'LHR', '2026-06-15', '2026-06-22', 2, 10);

      expect(result.lastInsertRowid).toBe(1);
      expect(result.changes).toBe(1);
    });

    it('should retrieve recent search history with limit', () => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (let i = 0; i < 5; i++) {
        stmt.run('JFK', 'LHR', `2026-06-${15 + i}`, 1, 10);
      }

      const history = db.prepare('SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?').all(3) as any[];

      expect(history.length).toBe(3);
    });

    it('should handle null return_date for one-way searches', () => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run('JFK', 'LHR', '2026-06-15', null, 1, 10);

      const history = db.prepare('SELECT * FROM search_history WHERE id = ?').get(1) as any;

      expect(history.return_date).toBeNull();
    });

    it('should record timestamp automatically', () => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run('JFK', 'LHR', '2026-06-15', 1, 10);

      const history = db.prepare('SELECT * FROM search_history WHERE id = ?').get(1) as any;

      expect(history.searched_at).toBeDefined();
      expect(history.searched_at).not.toBeNull();
    });
  });
});
