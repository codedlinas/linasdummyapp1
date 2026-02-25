import { beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(process.cwd(), 'test-flydeal.db');

export function getTestDb(): Database.Database {
  const db = new Database(TEST_DB_PATH);
  
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
  `);
  
  return db;
}

export function cleanupTestDb(): void {
  if (fs.existsSync(TEST_DB_PATH)) {
    try {
      fs.unlinkSync(TEST_DB_PATH);
    } catch (e) {
    }
  }
}

beforeEach(() => {
  cleanupTestDb();
});

afterEach(() => {
  vi.restoreAllMocks();
  cleanupTestDb();
});
