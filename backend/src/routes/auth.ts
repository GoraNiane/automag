import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';

const router = Router();

function findUserByEmail(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe requis.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify configurations
    if (!process.env.JWT_SECRET) {
      console.error('[AUTH] JWT_SECRET is not configured.');
      return res.status(500).json({ message: 'Erreur de configuration du serveur.' });
    }

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      console.log('[AUTH] Login failed');
      return res.status(401).json({
        message: 'Identifiants incorrects.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('[AUTH] Login failed');
      return res.status(401).json({
        message: 'Identifiants incorrects.'
      });
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      console.log('[AUTH] Login failed');
      return res.status(403).json({
        message: 'Accès réservé aux administrateurs.'
      });
    }

    // Sign the JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('[AUTH] Login successful');
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        location: user.location
      }
    });
  } catch (error) {
    console.log('[AUTH] Login failed');
    console.error('[AUTH] Error during admin login:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

export default router;
