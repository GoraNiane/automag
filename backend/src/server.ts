import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import db, { dbInitPromise } from './config/db'; // Connects and triggers database table migrations/seeding

// Routes
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import contactRoutes from './routes/contacts';
import uploadRoutes from './routes/uploads';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend calls
app.use(cors());
app.use(express.json());

// Serve static images uploaded to backend
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'AutoElite API is fully functional.' });
});

// Serve static frontend files in production
const frontendDist = path.join(process.cwd(), '../frontend/dist');
app.use(express.static(frontendDist));

// Wildcard route to serve React app for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend not built yet. Please compile the frontend first.');
    }
  });
});

dbInitPromise.then(() => {
  app.listen(PORT, () => {
    console.log(`[AutoElite Server] Running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('[DB] Database initialization failed. Server shutting down:', err);
  process.exit(1);
});

export default app;
