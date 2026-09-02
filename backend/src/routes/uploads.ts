import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

// Ensure uploads folder exists
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err: any) {
    console.error('Failed to create uploads directory:', err.message);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for high-resolution mobile photos
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Format d\'image non supporté (JPG, PNG, WEBP uniquement).'));
  }
});

router.post('/', protect, adminOnly, (req: AuthRequest, res: Response) => {
  upload.single('photo')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'L\'image dépasse 10 Mo.' });
      }
      return res.status(400).json({ message: err.message || 'Erreur lors du téléversement.' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier uploadé.' });
      }

      // Dynamically resolve URL based on current server host (works on local, staging, or production)
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      res.json({
        message: 'Image uploadée avec succès.',
        url: fileUrl,
        filename: req.file.filename
      });
    } catch (routeErr: any) {
      console.error('[Upload Route Error]', routeErr);
      res.status(500).json({ message: 'Erreur lors du traitement du fichier.' });
    }
  });
});

export default router;
