import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'flydeal.db');
const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      origin_location_code TEXT NOT NULL,
      destination_location_code TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      return_date TEXT,
      adults INTEGER DEFAULT 1,
      children INTEGER DEFAULT 0,
      infants INTEGER DEFAULT 0,
      travel_class TEXT DEFAULT 'ECONOMY',
      non_stop INTEGER DEFAULT 0,
      results_count INTEGER DEFAULT 0,
      lowest_price REAL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS price_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      origin_location_code TEXT NOT NULL,
      destination_location_code TEXT NOT NULL,
      departure_date TEXT NOT NULL,
      return_date TEXT,
      adults INTEGER DEFAULT 1,
      target_price REAL NOT NULL,
      current_price REAL,
      is_active INTEGER DEFAULT 1,
      notification_email TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      last_checked_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origin_location_code TEXT NOT NULL,
      destination_location_code TEXT NOT NULL,
      origin_city TEXT NOT NULL,
      destination_city TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      departure_date TEXT NOT NULL,
      return_date TEXT,
      airline TEXT NOT NULL,
      discount REAL,
      is_hot INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      alert_id INTEGER,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (alert_id) REFERENCES price_alerts(id)
    );

    CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_search_history_created ON search_history(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);
    CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active);
    CREATE INDEX IF NOT EXISTS idx_deals_hot ON deals(is_hot);
    CREATE INDEX IF NOT EXISTS idx_deals_price ON deals(price);
  `);

  console.log('Database initialized successfully');
}

export function getDb(): DatabaseType {
  return db;
}

export default db;
