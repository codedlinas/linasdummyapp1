import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const TEST_DB_PATH = path.join(process.cwd(), 'test-flydeal.db');

describe('Database', () => {
  let db: Database.Database;

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

  afterAll(() => {
    if (db) db.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('Table creation', () => {
    it('should create alerts table with correct columns', () => {
      const columns = db.pragma('table_info(alerts)') as any[];
      const columnNames = columns.map((c: any) => c.name);
      
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('origin');
      expect(columnNames).toContain('destination');
      expect(columnNames).toContain('max_price');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('created_at');
    });

    it('should create search_history table with correct columns', () => {
      const columns = db.pragma('table_info(search_history)') as any[];
      const columnNames = columns.map((c: any) => c.name);
      
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('origin');
      expect(columnNames).toContain('destination');
      expect(columnNames).toContain('departure_date');
      expect(columnNames).toContain('return_date');
      expect(columnNames).toContain('adults');
      expect(columnNames).toContain('result_count');
      expect(columnNames).toContain('searched_at');
    });

    it('should create indexes', () => {
      const indexes = db.pragma('index_list(alerts)') as any[];
      const indexNames = indexes.map((i: any) => i.name);
      
      expect(indexNames).toContain('idx_alerts_email');
    });
  });

  describe('Alerts CRUD operations', () => {
    it('should insert an alert', () => {
      const stmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run('JFK', 'LHR', 500, 'test@example.com');
      
      expect(result.lastInsertRowid).toBe(1);
      expect(result.changes).toBe(1);
    });

    it('should retrieve an alert by id', () => {
      const insertStmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      const insertResult = insertStmt.run('JFK', 'LHR', 500, 'test@example.com');
      
      const selectStmt = db.prepare('SELECT * FROM alerts WHERE id = ?');
      const alert = selectStmt.get(insertResult.lastInsertRowid) as any;
      
      expect(alert).toBeDefined();
      expect(alert.origin).toBe('JFK');
      expect(alert.destination).toBe('LHR');
      expect(alert.max_price).toBe(500);
      expect(alert.email).toBe('test@example.com');
    });

    it('should retrieve alerts by email', () => {
      const insertStmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      insertStmt.run('JFK', 'LHR', 500, 'user1@example.com');
      insertStmt.run('LAX', 'NRT', 700, 'user1@example.com');
      insertStmt.run('ORD', 'CDG', 600, 'user2@example.com');
      
      const selectStmt = db.prepare('SELECT * FROM alerts WHERE email = ?');
      const alerts = selectStmt.all('user1@example.com') as any[];
      
      expect(alerts.length).toBe(2);
      expect(alerts[0].email).toBe('user1@example.com');
      expect(alerts[1].email).toBe('user1@example.com');
    });

    it('should delete an alert', () => {
      const insertStmt = db.prepare(`
        INSERT INTO alerts (origin, destination, max_price, email)
        VALUES (?, ?, ?, ?)
      `);
      const insertResult = insertStmt.run('JFK', 'LHR', 500, 'test@example.com');
      
      const deleteStmt = db.prepare('DELETE FROM alerts WHERE id = ?');
      const deleteResult = deleteStmt.run(insertResult.lastInsertRowid);
      
      expect(deleteResult.changes).toBe(1);
      
      const selectStmt = db.prepare('SELECT * FROM alerts WHERE id = ?');
      const alert = selectStmt.get(insertResult.lastInsertRowid);
      
      expect(alert).toBeUndefined();
    });
  });

  describe('Search History operations', () => {
    it('should insert search history', () => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run('JFK', 'LHR', '2025-06-15', '2025-06-22', 2, 10);
      
      expect(result.lastInsertRowid).toBe(1);
      expect(result.changes).toBe(1);
    });

    it('should retrieve recent search history', () => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run('JFK', 'LHR', '2025-06-15', '2025-06-22', 2, 10);
      stmt.run('LAX', 'NRT', '2025-07-01', null, 1, 8);
      stmt.run('ORD', 'CDG', '2025-08-10', '2025-08-20', 3, 15);
      
      const selectStmt = db.prepare('SELECT * FROM search_history ORDER BY searched_at DESC LIMIT ?');
      const history = selectStmt.all(10) as any[];
      
      expect(history.length).toBe(3);
    });

    it('should store null return_date for one-way searches', () => {
      const stmt = db.prepare(`
        INSERT INTO search_history (origin, destination, departure_date, return_date, adults, result_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run('JFK', 'LHR', '2025-06-15', null, 1, 5);
      
      const selectStmt = db.prepare('SELECT * FROM search_history WHERE id = 1');
      const search = selectStmt.get() as any;
      
      expect(search.return_date).toBeNull();
    });
  });
});
