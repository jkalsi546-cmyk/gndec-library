const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database file (or open if exists)
const dbPath = path.resolve(__dirname, 'library.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize database tables
db.serialize(() => {
  // Users Table (Simple Email Authentication)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Auto-migration: if existing database has rollNumber, drop rollNumber constraint
  db.all('PRAGMA table_info(users)', (err, columns) => {
    if (columns && columns.some(c => c.name === 'rollNumber' && c.notnull === 1)) {
      db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS users_clean (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)');
        db.run('INSERT OR IGNORE INTO users_clean (id, name, email, password, createdAt) SELECT id, name, email, password, createdAt FROM users');
        db.run('DROP TABLE users');
        db.run('ALTER TABLE users_clean RENAME TO users');
        console.log('Migrated users table to simple email authentication.');
      });
    }
  });

  // Wishlist Table
  db.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      bookId TEXT NOT NULL,
      bookData TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE(userId, bookId)
    )
  `);

  // Reviews Table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      bookId TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

module.exports = db;
