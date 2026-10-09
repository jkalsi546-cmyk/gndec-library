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
  // Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rollNumber TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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

  

module.exports = db;
