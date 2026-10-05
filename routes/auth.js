const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = 'super-secret-college-library-key'; // In production, use env variables

// Register a new student
router.post('/register', (req, res) => {
  const { name, rollNumber, email, password } = req.body;

  if (!name || !rollNumber || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ? OR rollNumber = ?', [email, rollNumber], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(409).json({ error: 'User with this email or roll number already exists' });

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Error hashing password' });

      // Insert new user
      const stmt = db.prepare('INSERT INTO users (name, rollNumber, email, password) VALUES (?, ?, ?, ?)');
      stmt.run([name, rollNumber, email, hash], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
      });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error verifying password' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, name: user.name, rollNumber: user.rollNumber },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { name: user.name, email: user.email, rollNumber: user.rollNumber }
      });
    });
  });
});

module.exports = { router, JWT_SECRET };
