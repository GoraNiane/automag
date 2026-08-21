"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'Veuillez saisir le mot de passe.' });
    }
    const fixedPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    if (password !== fixedPassword) {
        return res.status(401).json({ message: 'Code d\'accès incorrect.' });
    }
    // Sign JWT token for the admin session
    const token = jsonwebtoken_1.default.sign({ id: 'usr-admin', email: 'admin@autoelite.sn', role: 'ADMIN' }, process.env.JWT_SECRET || 'autoelite_super_secret_jwt_key_98765', { expiresIn: '30d' });
    res.json({
        token,
        user: {
            id: 'usr-admin',
            email: 'admin@autoelite.sn',
            firstName: 'Administrateur',
            lastName: 'AutoElite',
            role: 'ADMIN',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            location: 'Dakar'
        }
    });
});
exports.default = router;
