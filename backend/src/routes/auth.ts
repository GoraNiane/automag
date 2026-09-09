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
    const jwtSecret = process.env.JWT_SECRET || 'autoelite_super_secret_jwt_key_98765';
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    // Check if database has user
    let user = null;
    try {
      if (db.isConnected) {
        user = await findUserByEmail(normalizedEmail);
      }
    } catch (dbErr) {
      console.warn('[AUTH] Database lookup warning:', dbErr);
    }

    // Direct Env Auth for admin@autoelite.sn (when DB is remote/disconnected or configured via ADMIN_PASSWORD)
    if (normalizedEmail === 'admin@autoelite.sn') {
      const isEnvPasswordValid = envAdminPassword && password === envAdminPassword;
      const isDefaultFallbackValid = (!envAdminPassword && password === 'admin2026') || (password === envAdminPassword);

      if (isEnvPasswordValid || (!user && isDefaultFallbackValid)) {
        const token = jwt.sign(
          { id: 'usr-admin', email: 'admin@autoelite.sn', role: 'ADMIN' },
          jwtSecret,
          { expiresIn: '30d' }
        );

        console.log('[AUTH] Admin login successful (Env / Direct Auth)');
        return res.json({
          token,
          user: {
            id: 'usr-admin',
            email: 'admin@autoelite.sn',
            firstName: 'Ibrahima',
            lastName: 'Diallo',
            role: 'ADMIN',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            location: 'Dakar'
          }
        });
      }
    }

    if (!user) {
      console.log('[AUTH] Login failed: User not found');
      return res.status(401).json({
        message: 'Identifiants incorrects.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('[AUTH] Login failed: Password mismatch');
      return res.status(401).json({
        message: 'Identifiants incorrects.'
      });
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      console.log('[AUTH] Login failed: Not admin role');
      return res.status(403).json({
        message: 'Accès réservé aux administrateurs.'
      });
    }

    // Sign the JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
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
    console.error('[AUTH] Error during admin login:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

export default router;
