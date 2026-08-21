"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const uploads_1 = __importDefault(require("./routes/uploads"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS for frontend calls
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static images uploaded to backend
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Mount routes
app.use('/api/auth', auth_1.default);
app.use('/api/vehicles', vehicles_1.default);
app.use('/api/contacts', contacts_1.default);
app.use('/api/uploads', uploads_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', message: 'AutoElite API is fully functional.' });
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
app.listen(PORT, () => {
    console.log(`[AutoElite Server] Running on http://localhost:${PORT}`);
});
