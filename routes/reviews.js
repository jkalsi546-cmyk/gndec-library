const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('./auth');

// Optional auth middleware (only required for POST, GET is public)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
      next();
    });
  } else {
    next();
  }
}

// Get reviews for a specific book
router.get('/:bookId', (req, res) => {
  const { bookId } = req.params;
  const sql = `
    SELECT r.*, u.name as userName 
    FROM reviews r 
    JOIN users u ON r.userId = u.id 
    WHERE r.bookId = ? 
    ORDER BY r.createdAt DESC
  `;
  
  db.all(sql, [bookId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Post a new review
router.post('/:bookId', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Please login to post a review' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    
    const { rating, comment } = req.body;
    const { bookId } = req.params;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required' });
    }
    
    db.run(
      'INSERT INTO reviews (userId, bookId, rating, comment) VALUES (?, ?, ?, ?)',
      [user.userId, bookId, rating, comment],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Review added successfully', id: this.lastID });
      }
    );
  });
});

module.exports = router;
