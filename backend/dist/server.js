"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const db_1 = __importDefault(require("./config/db")); // Initializes DB with continuous background retry
// Global crash prevention shields
process.on('uncaughtException', (err) => {
    console.error('[CRITICAL] Uncaught Exception intercepted (server kept running):', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('[CRITICAL] Unhandled Rejection intercepted (server kept running):', reason);
});
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const uploads_1 = __importDefault(require("./routes/uploads"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Headers (configured to allow external image CDN URLs like Cloudinary and Unsplash)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
// Enable CORS for frontend calls
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// General API Rate Limiting (200 requests / minute)
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Trop de requêtes. Veuillez patienter un instant.' }
});
app.use('/api/', generalLimiter);
// Specific Auth Brute-force Protection (20 attempts / 15 minutes)
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
// Serve static images uploaded to backend
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Mount routes
app.use('/api/auth', auth_1.default);
app.use('/api/vehicles', vehicles_1.default);
app.use('/api/contacts', contacts_1.default);
app.use('/api/uploads', uploads_1.default);
// Detailed Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptimeSeconds: Math.floor(process.uptime()),
        databaseConnected: db_1.default.isConnected,
        timestamp: new Date().toISOString(),
        message: 'AutoElite API is fully functional and protected.'
    });
});
// Serve static frontend files in production
const frontendDist = path_1.default.join(process.cwd(), '../frontend/dist');
app.use(express_1.default.static(frontendDist));
// Wildcard route to serve React app for client-side routing
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path_1.default.join(frontendDist, 'index.html'), (err) => {
        if (err) {
            res.status(404).send('Frontend not built yet. Please compile the frontend first.');
        }
    });
});
// Global Express error handling middleware (Never let an error crash Express)
app.use((err, req, res, next) => {
    console.error('[Express Global Error]', err.message || err);
    if (err instanceof multer_1.default.MulterError) {
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
    server.on('error', (serverErr) => {
        if (serverErr.code === 'EADDRINUSE') {
            console.error(`[AutoElite Server] Port ${PORT} is already in use. Please check running processes.`);
        }
        else {
            console.error('[AutoElite Server Error]', serverErr.message || serverErr);
        }
    });
}
else {
    console.log('[AutoElite Server] Running in serverless Vercel environment.');
}
exports.default = app;
