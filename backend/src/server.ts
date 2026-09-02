import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import db from './config/db'; // Initializes DB with continuous background retry

// Global crash prevention shields
process.on('uncaughtException', (err: Error) => {
  console.error('[CRITICAL] Uncaught Exception intercepted (server kept running):', err);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('[CRITICAL] Unhandled Rejection intercepted (server kept running):', reason);
});

// Routes
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import contactRoutes from './routes/contacts';
import uploadRoutes from './routes/uploads';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers (configured to allow external image CDN URLs like Cloudinary and Unsplash)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Enable CORS for frontend calls
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// General API Rate Limiting (200 requests / minute)
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes. Veuillez patienter un instant.' }
});
app.use('/api/', generalLimiter);

// Specific Auth Brute-force Protection (20 attempts / 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);

// Serve static images uploaded to backend
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/uploads', uploadRoutes);

// Detailed Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    databaseConnected: db.isConnected,
    timestamp: new Date().toISOString(),
    message: 'AutoElite API is fully functional and protected.'
  });
});

// Serve static frontend files in production
const frontendDist = path.join(process.cwd(), '../frontend/dist');
app.use(express.static(frontendDist));

// Wildcard route to serve React app for client-side routing
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend not built yet. Please compile the frontend first.');
    }
  });
});

// Global Express error handling middleware (Never let an error crash Express)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Express Global Error]', err.message || err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Le fichier dépasse la taille maximale autorisée (10 Mo).' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Trop de photos sélectionnées ou champ inattendu (7 photos max).' });
    }
    return res.status(400).json({ message: `Erreur de téléversement : ${err.message}` });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Format de requête JSON invalide.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Une erreur interne est survenue sur le serveur.'
  });
});

// Start listening immediately
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`[AutoElite Server] Running securely on http://localhost:${PORT}`);
  });

  server.on('error', (serverErr: any) => {
    if (serverErr.code === 'EADDRINUSE') {
      console.error(`[AutoElite Server] Port ${PORT} is already in use. Please check running processes.`);
    } else {
      console.error('[AutoElite Server Error]', serverErr.message || serverErr);
    }
  });
} else {
  console.log('[AutoElite Server] Running in serverless Vercel environment.');
}

export default app;
