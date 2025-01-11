import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import { auth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import hydrationRoutes from './routes/hydration.js';

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hydration-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout setelah 5 detik
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware global
app.use(cors({
  origin: '*', // Atau sesuaikan dengan origin React Native Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
// app.use(auth);

// Routes
app.use('/api/hydration', hydrationRoutes);

// Error handler
app.use(errorHandler);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/hydration-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Panggil connectDB sebelum app.listen
connectDB();



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Tambahkan error handling untuk express
app.listen(PORT, '0.0.0.0', () => { // Bind ke semua network interfaces
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
