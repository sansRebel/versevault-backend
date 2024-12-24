import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());

// Debug the MongoDB URI (remove in production)
console.log('MongoDB URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the app if the connection fails
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

export default app;
