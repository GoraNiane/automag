"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 1. POST /api/contacts - Send a contact request (Public)
router.post('/', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs requis.' });
    }
    const id = `contact-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const status = 'NOUVELLE';
    db_1.default.run(`INSERT INTO contact_requests (id, name, email, phone, subject, message, status, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, name, email, phone || '', subject, message, status, createdAt], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de votre message.' });
        }
        res.status(201).json({ message: 'Votre message a bien été envoyé.', id });
    });
});
// 2. GET /api/contacts - Get all contact requests (Admin only)
router.get('/', auth_1.protect, auth_1.adminOnly, (req, res) => {
    db_1.default.all('SELECT * FROM contact_requests ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
        }
        res.json(rows);
    });
});
exports.default = router;
