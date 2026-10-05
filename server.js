const express = require('express');
const cors = require('cors');
const path = require('path');

// Route imports
const { router: authRoutes } = require('./routes/auth');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Fallback is not needed because express.static handles serving .html files automatically

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`📚 Open Books Backend Running on Port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`=========================================`);
});
