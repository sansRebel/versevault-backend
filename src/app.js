const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug the MongoDB URI (remove in production)
console.log('MongoDB URI:', process.env.MONGO_URI);

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to VerseVault Backend!');
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = app;
