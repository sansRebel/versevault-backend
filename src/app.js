const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

dotenv.config(); // Load environment variables

const app = express();

// Global logger middleware (optional, for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json()); // This parses incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the app if the connection fails
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to VerseVault Backend!');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = app;
