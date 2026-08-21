import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function protect(req: AuthRequest, res: Response, next: NextFunction) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'autoelite_super_secret_jwt_key_98765') as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expirée ou invalide.' });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    next();
  } else {
    return res.status(403).json({ message: 'Accès interdit. Réservé aux administrateurs.' });
  }
}
