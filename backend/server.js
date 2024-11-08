// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes Imports
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import otpRoutes from './routes/otpRoutes.js';

// ... other imports and configurations ...

// Middleware Imports

import errorHandler from './middleware/errorMiddleware.js';
import corsConfig from './middleware/corsConfig.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(express.json()); // Parses incoming JSON requests
app.use(cors(corsConfig)); // Applies CORS configuration

// Routes Setup
app.use('/api/users', userRoutes); // User-related routes (e.g., login, profile management, complaints)
app.use('/api/admins', adminRoutes); // Admin-related routes (e.g., login, profile management)
app.use('/api/complaints', complaintRoutes); // Routes for managing complaints
app.use('/api/feedbacks', feedbackRoutes); // Routes for sending feedback
app.use('/api/announcements', announcementRoutes); // Routes for managing announcements
app.use('/api', chatRoutes);
app.use('/api/otp', otpRoutes); // Add the OTP routes


// Global Error Handling Middleware
app.use(errorHandler);

// --- MongoDB Connection ---
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1); // Exit process with failure
  }
};

startServer();