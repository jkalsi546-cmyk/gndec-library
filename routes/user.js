const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('./auth');

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// Apply middleware to all routes in this file
router.use(authenticateToken);

/* ========================================
 * WISHLIST ROUTES
 * ======================================== */

// Get Wishlist
router.get('/wishlist', (req, res) => {
  db.all('SELECT * FROM wishlist WHERE userId = ?', [req.user.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse the JSON string back into objects
    const wishlist = rows.map(row => JSON.parse(row.bookData));
    res.json(wishlist);
  });
});

// Toggle Wishlist (Add/Remove)
router.post('/wishlist', (req, res) => {
  const { book } = req.body; // Expects full book object
  if (!book || !book.id) return res.status(400).json({ error: 'Book object with id is required' });

  // Check if it exists
  db.get('SELECT id FROM wishlist WHERE userId = ? AND bookId = ?', [req.user.userId, String(book.id)], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      // Remove it
      db.run('DELETE FROM wishlist WHERE id = ?', [row.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Removed from wishlist', action: 'removed' });
      });
    } else {
      // Add it
      const bookData = JSON.stringify(book);
      db.run('INSERT INTO wishlist (userId, bookId, bookData) VALUES (?, ?, ?)', [req.user.userId, String(book.id), bookData], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Added to wishlist', action: 'added' });
      });
    }
  });
});

module.exports = router;
