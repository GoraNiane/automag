import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Veuillez saisir le mot de passe.' });
  }

  const userEmail = email || 'admin@autoelite.sn';

  // Tenter d'abord l'authentification avec la base de données
  db.get('SELECT * FROM users WHERE email = ?', [userEmail], async (err, user) => {
    let isAuthenticated = false;
    let loggedInUser = null;

    if (!err && user) {
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          isAuthenticated = true;
          loggedInUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar,
            location: user.location
          };
        }
      } catch (bcryptErr) {
        console.error('Bcrypt comparison error:', bcryptErr);
      }
    }

    // Repli (fallback) sur la variable d'environnement ou le mot de passe par défaut
    if (!isAuthenticated) {
      const fixedPassword = process.env.ADMIN_PASSWORD || 'Goraniane2004';
      if (password === fixedPassword && userEmail.toLowerCase() === 'admin@autoelite.sn') {
        isAuthenticated = true;
        loggedInUser = {
          id: 'usr-admin',
          email: 'admin@autoelite.sn',
          firstName: 'Administrateur',
          lastName: 'AutoElite',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          location: 'Dakar'
        };
      }
    }

    if (!isAuthenticated || !loggedInUser) {
      return res.status(401).json({ message: 'Code d\'accès incorrect.' });
    }

    // Signer le token JWT
    const token = jwt.sign(
      { id: loggedInUser.id, email: loggedInUser.email, role: loggedInUser.role },
      process.env.JWT_SECRET || 'autoelite_super_secret_jwt_key_98765',
      { expiresIn: '30d' }
    );

    return res.json({
      token,
      user: loggedInUser
    });
  });
});

export default router;
