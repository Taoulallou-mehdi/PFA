require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const UserRoutes = require('./src/routes/UserRoutes');
const PoubelleRoutes = require('./src/routes/PoubelleRoutes');
const CollecteRoutes = require('./src/routes/CollecteRoutes');
const TrajetRoutes = require('./src/routes/TrajetRoutes');
const RewardRoutes = require('./src/routes/RewardRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Rate limiting for all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Middleware setup
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // Configure CORS for production
app.use(helmet()); // Adds various security headers
app.use(morgan('dev')); // Logs requests for debugging

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Routes setup
app.get('/', (req, res) => {
  res.send('API Gestion Déchets en cours de développement');
});

// Defining routes
app.use('/api/users', UserRoutes);
app.use('/api/poubelles', PoubelleRoutes);
app.use('/api/collectes', CollecteRoutes);
app.use('/api/trajets', TrajetRoutes);
app.use('/api/rewards', RewardRoutes);
app.use(notFoundHandler);


// Error handling middleware
app.use(notFoundHandler); // Handles 404 errors
app.use(errorHandler); // Handles all other errors

// Graceful shutdown setup
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0); // Exits cleanly when interrupted
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Gracefully shutting down...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0); // Ensure MongoDB connection is closed properly
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
