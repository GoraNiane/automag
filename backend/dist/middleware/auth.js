"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
exports.adminOnly = adminOnly;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'autoelite_super_secret_jwt_key_98765');
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Session expirée ou invalide.' });
    }
}
function adminOnly(req, res, next) {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
        next();
    }
    else {
        return res.status(403).json({ message: 'Accès interdit. Réservé aux administrateurs.' });
    }
}
