import { Router, Response } from 'express';
import multer from 'multer';
import db from '../config/db';
import { protect, AuthRequest } from '../middleware/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

const router = Router();

// Configure multer memory storage for streaming files directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/i;
    const extname = filetypes.test(file.originalname.split('.').pop() || '');
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Format d\'image non supporté (JPG, PNG, WEBP uniquement).'));
  }
});

interface VehicleImage {
  id: string;
  url: string;
  publicId: string;
  order: number;
}

/**
 * Parsed stored images JSON list (or converts old comma-separated string)
 */
function parseImages(imagesStr: string | null): VehicleImage[] {
  if (!imagesStr) return [];
  try {
    if (imagesStr.startsWith('[')) {
      return JSON.parse(imagesStr);
    }
  } catch (e) {
    // Ignore and fallback
  }
  // Fallback to comma-separated URLs
  return imagesStr.split(',').filter(Boolean).map((url, idx) => ({
    id: `img-legacy-${idx}-${Math.round(Math.random() * 1e6)}`,
    url,
    publicId: '',
    order: idx
  }));
}

/**
 * Normalizes incoming images (array of URLs or image objects) and matches existing image publicIds
 */
function normalizeAndSaveImages(incomingImages: any[], existingImages: VehicleImage[]): VehicleImage[] {
  return incomingImages.map((img, idx) => {
    if (typeof img === 'string') {
      const found = existingImages.find(e => e.url === img);
      return {
        id: found?.id || `img-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        url: img,
        publicId: found?.publicId || '',
        order: idx
      };
    } else {
      return {
        id: img.id || `img-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        url: img.url,
        publicId: img.publicId || '',
        order: img.order !== undefined ? img.order : idx
      };
    }
  });
}

/**
 * Security helper to verify if the connected user owns the vehicle listing
 */
function checkAuthorization(req: AuthRequest, vehicleId: string, callback: (authorized: boolean, statusCode: number, message: string) => void) {
  if (!req.user) {
    return callback(false, 401, 'Accès refusé. Aucun token fourni.');
  }

  // Admin and Super Admin can edit any vehicle
  if (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN') {
    return callback(true, 200, '');
  }

  const userId = req.user.id;

  db.get('SELECT sellerId FROM listings WHERE vehicleId = ?', [vehicleId], (err, row: any) => {
    if (err) {
      return callback(false, 500, 'Erreur de base de données : ' + err.message);
    }
    if (!row) {
      return callback(false, 404, 'Véhicule ou annonce introuvable.');
    }

    if (row.sellerId === userId) {
      return callback(true, 200, '');
    } else {
      return callback(false, 403, 'Accès interdit. Vous n\'êtes pas le propriétaire de cette annonce.');
    }
  });
}

// 1. GET /api/vehicles - Get all vehicles
router.get('/', (req, res) => {
  db.all('SELECT * FROM vehicles', [], (err, rows: any[]) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de base de données : ' + err.message });
    }
    
    const formatted = rows.map(r => {
      const parsedImages = parseImages(r.images);
      return {
        ...r,
        isFeatured: !!r.isFeatured,
        isPromo: !!r.isPromo,
        equipments: r.equipments ? r.equipments.split(',').filter(Boolean) : [],
        // Compatibility: return list of image URL strings to the client
        images: parsedImages.map(img => img.url),
        imageObjects: parsedImages,
      };
    });
    
    res.json(formatted);
  });
});

// 2. GET /api/vehicles/listings/all - Get all listings (public/admin)
router.get('/listings/all', (req, res) => {
  db.all('SELECT * FROM listings', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de base de données : ' + err.message });
    }
    res.json(rows);
  });
});

// 3. POST /api/vehicles - Create or publish a vehicle listing (Admin or logged-in seller)
router.post('/', protect, (req: AuthRequest, res: Response) => {
  const {
    id, brand, model, year, price, mileage, fuel, transmission,
    bodyType, color, location, power, description, equipments,
    images, primaryImage, condition, availability
  } = req.body;

  if (!brand || !model || !year || !price || !mileage) {
    return res.status(400).json({ message: 'Veuillez renseigner les informations obligatoires.' });
  }

  const vehId = id || `veh-${Date.now()}`;
  const equipmentsStr = Array.isArray(equipments) ? equipments.join(',') : (equipments || '');

  db.get('SELECT * FROM vehicles WHERE id = ?', [vehId], (err, existingVeh: any) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de base de données : ' + err.message });
    }

    const existingImages = existingVeh ? parseImages(existingVeh.images) : [];
    const incomingImages = Array.isArray(images) ? images : (images ? images.split(',').filter(Boolean) : []);
    const normalizedImages = normalizeAndSaveImages(incomingImages, existingImages);
    const imagesStr = JSON.stringify(normalizedImages);

    if (existingVeh) {
      // Check authorization
      checkAuthorization(req, vehId, (authorized, statusCode, authMsg) => {
        if (!authorized) {
          return res.status(statusCode).json({ message: authMsg });
        }

        // Update the draft vehicle details
        const sqlUpdate = `
          UPDATE vehicles
          SET brand = ?, model = ?, year = ?, price = ?, mileage = ?, fuel = ?, transmission = ?,
              bodyType = ?, color = ?, location = ?, power = ?, description = ?, equipments = ?,
              images = ?, primaryImage = ?, \`condition\` = ?, availability = ?
          WHERE id = ?
        `;
        const paramsUpdate = [
          brand, model, parseInt(year), parseInt(price), parseInt(mileage),
          fuel || 'Essence', transmission || 'Automatique', bodyType || 'SUV',
          color || '', location || 'Dakar', power || '', description || '',
          equipmentsStr, imagesStr, primaryImage || '', condition || 'Occasion Europe',
          availability || 'Disponible', vehId
        ];

        db.run(sqlUpdate, paramsUpdate, function(errUpdate) {
          if (errUpdate) {
            return res.status(500).json({ message: 'Erreur lors de la mise à jour : ' + errUpdate.message });
          }

          // Publish listing
          db.run(`UPDATE listings SET status = 'Publiée' WHERE vehicleId = ?`, [vehId], (errList) => {
            if (errList) {
              return res.status(500).json({ message: 'Erreur lors de la publication de l\'annonce.' });
            }
            res.json({ message: 'Véhicule créé et publié avec succès.', id: vehId });
          });
        });
      });
    } else {
      // Insert new vehicle completely
      const sqlInsert = `
        INSERT INTO vehicles (
          id, brand, model, year, price, mileage, fuel, transmission, 
          bodyType, color, location, power, description, equipments, 
          images, primaryImage, \`condition\`, isFeatured, isPromo, availability
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
      `;
      const paramsInsert = [
        vehId, brand, model, parseInt(year), parseInt(price), parseInt(mileage),
        fuel || 'Essence', transmission || 'Automatique', bodyType || 'SUV',
        color || '', location || 'Dakar', power || '', description || '',
        equipmentsStr, imagesStr, primaryImage || '', condition || 'Occasion Europe',
        availability || 'Disponible'
      ];

      db.run(sqlInsert, paramsInsert, function(errInsert) {
        if (errInsert) {
          return res.status(500).json({ message: 'Erreur lors de la création : ' + errInsert.message });
        }

        const listId = `lst-${Date.now()}`;
        const sqlList = `
          INSERT INTO listings (id, vehicleId, sellerId, status, createdAt, views, isPromoted)
          VALUES (?, ?, ?, ?, ?, 0, 0)
        `;

        db.run(
          sqlList,
          [listId, vehId, req.user?.id || 'usr-admin', 'Publiée', new Date().toISOString()],
          (errList) => {
            if (errList) {
              return res.status(500).json({ message: 'Erreur lors de la création de l\'annonce.' });
            }
            res.status(201).json({ message: 'Véhicule ajouté avec succès.', id: vehId });
          }
        );
      });
    }
  });
});

// 4. PUT /api/vehicles/:id - Update a vehicle
router.put('/:id', protect, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    brand, model, year, price, mileage, fuel, transmission,
    bodyType, color, location, power, description, equipments,
    images, primaryImage, condition, availability
  } = req.body;

  if (!brand || !model || !year || !price || !mileage) {
    return res.status(400).json({ message: 'Veuillez renseigner les informations obligatoires.' });
  }

  checkAuthorization(req, id, (authorized, statusCode, authMsg) => {
    if (!authorized) {
      return res.status(statusCode).json({ message: authMsg });
    }

    db.get('SELECT * FROM vehicles WHERE id = ?', [id], (errVeh, vehicle: any) => {
      if (errVeh) {
        return res.status(500).json({ message: 'Erreur de base de données.' });
      }

      const equipmentsStr = Array.isArray(equipments) ? equipments.join(',') : (equipments || '');
      const existingImages = vehicle ? parseImages(vehicle.images) : [];
      const incomingImages = Array.isArray(images) ? images : (images ? images.split(',').filter(Boolean) : []);
      const normalizedImages = normalizeAndSaveImages(incomingImages, existingImages);
      const imagesStr = JSON.stringify(normalizedImages);

      const sql = `
        UPDATE vehicles 
        SET brand = ?, model = ?, year = ?, price = ?, mileage = ?, fuel = ?, 
            transmission = ?, bodyType = ?, color = ?, location = ?, power = ?, 
            description = ?, equipments = ?, images = ?, primaryImage = ?, 
            \`condition\` = ?, availability = ?
        WHERE id = ?
      `;

      const params = [
        brand, model, parseInt(year), parseInt(price), parseInt(mileage),
        fuel, transmission, bodyType, color, location, power, description,
        equipmentsStr, imagesStr, primaryImage, condition, availability, id
      ];

      db.run(sql, params, function(this: any, errRun: any) {
        if (errRun) {
          return res.status(500).json({ message: 'Erreur de base de données : ' + errRun.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Véhicule non trouvé.' });
        }
        res.json({ message: 'Véhicule mis à jour avec succès.' });
      });
    });
  });
});

// 5. DELETE /api/vehicles/:id - Delete a vehicle (Cleans up Cloudinary photos first)
router.delete('/:id', protect, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  checkAuthorization(req, id, (authorized, statusCode, authMsg) => {
    if (!authorized) {
      return res.status(statusCode).json({ message: authMsg });
    }

    db.get('SELECT * FROM vehicles WHERE id = ?', [id], async (err, vehicle: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la récupération du véhicule : ' + err.message });
      }
      if (!vehicle) {
        return res.status(404).json({ message: 'Véhicule non trouvé.' });
      }

      // Cleanup images in Cloudinary
      const imagesList = parseImages(vehicle.images);
      for (const img of imagesList) {
        if (img.publicId) {
          try {
            await deleteFromCloudinary(img.publicId);
          } catch (cloudinaryErr) {
            console.error(`[Cleanup] Failed to delete image ${img.publicId} from Cloudinary:`, cloudinaryErr);
          }
        }
      }

      // Delete listing and vehicle from database
      db.run('DELETE FROM listings WHERE vehicleId = ?', [id], (errList) => {
        if (errList) {
          return res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce.' });
        }

        db.run('DELETE FROM vehicles WHERE id = ?', [id], function(errVeh) {
          if (errVeh) {
            return res.status(500).json({ message: 'Erreur lors de la suppression du véhicule.' });
          }
          res.json({ message: 'Véhicule et ses photos supprimés avec succès.' });
        });
      });
    });
  });
});

// 6. POST /api/vehicles/:id/images - Upload listing images (to memory + Cloudinary)
router.post('/:id/images', protect, upload.array('photos', 10), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Aucun fichier reçu.' });
  }

  db.get('SELECT * FROM vehicles WHERE id = ?', [id], async (err, vehicle: any) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de base de données : ' + err.message });
    }

    const proceedWithUpload = async (isNewDraft: boolean, existingImages: VehicleImage[]) => {
      if (existingImages.length + files.length > 10) {
        return res.status(400).json({ message: 'Nombre maximum de photos (10) dépassé.' });
      }

      const uploadedImages: VehicleImage[] = [];

      try {
        for (const file of files) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          // Stream upload to Cloudinary under the automag/vehicles/vehicle_<id> folder
          const result = await uploadToCloudinary(file.buffer, {
            folder: `automag/vehicles/vehicle_${id}`,
            public_id: `photo-${uniqueSuffix}`
          });

          uploadedImages.push({
            id: `img-${uniqueSuffix}`,
            url: result.secure_url,
            publicId: result.public_id,
            order: existingImages.length + uploadedImages.length
          });
        }
      } catch (uploadErr: any) {
        return res.status(500).json({ message: 'Erreur d\'upload vers Cloudinary : ' + uploadErr.message });
      }

      const newImagesList = [...existingImages, ...uploadedImages];
      
      let primaryImage = vehicle?.primaryImage || '';
      if (!primaryImage && newImagesList.length > 0) {
        primaryImage = newImagesList[0].url;
      }

      const imagesStr = JSON.stringify(newImagesList);

      if (isNewDraft) {
        // Insert a draft vehicle in SQLite
        db.run(
          `INSERT INTO vehicles (id, brand, model, year, price, mileage, fuel, transmission, bodyType, location, primaryImage, images, \`condition\`, availability)
           VALUES (?, '', '', 0, 0, 0, 'Essence', 'Automatique', 'SUV', 'Dakar', ?, ?, 'Neuf', 'Disponible')`,
          [id, primaryImage, imagesStr],
          (errInsert) => {
            if (errInsert) {
              return res.status(500).json({ message: 'Erreur de création de brouillon : ' + errInsert.message });
            }

            const listId = `lst-${Date.now()}`;
            db.run(
              `INSERT INTO listings (id, vehicleId, sellerId, status, createdAt, views, isPromoted)
               VALUES (?, ?, ?, 'Brouillon', ?, 0, 0)`,
              [listId, id, req.user?.id || 'usr-admin', new Date().toISOString()],
              (errList) => {
                if (errList) {
                  return res.status(500).json({ message: 'Erreur de création d\'annonce : ' + errList.message });
                }
                res.json({
                  message: 'Photos téléversées avec succès.',
                  images: newImagesList.map(img => img.url),
                  imageObjects: newImagesList,
                  primaryImage
                });
              }
            );
          }
        );
      } else {
        // Update existing vehicle in SQLite
        db.run(
          `UPDATE vehicles SET images = ?, primaryImage = ? WHERE id = ?`,
          [imagesStr, primaryImage, id],
          (errUpdate) => {
            if (errUpdate) {
              return res.status(500).json({ message: 'Erreur de mise à jour des photos : ' + errUpdate.message });
            }
            res.json({
              message: 'Photos téléversées avec succès.',
              images: newImagesList.map(img => img.url),
              imageObjects: newImagesList,
              primaryImage
            });
          }
        );
      }
    };

    if (!vehicle) {
      // New vehicle upload process starts. Create draft listing.
      return proceedWithUpload(true, []);
    } else {
      // Verify ownership
      checkAuthorization(req, id, (authorized, statusCode, authMsg) => {
        if (!authorized) {
          return res.status(statusCode).json({ message: authMsg });
        }
        const existingImages = parseImages(vehicle.images);
        proceedWithUpload(false, existingImages);
      });
    }
  });
});

// 7. DELETE /api/vehicles/:id/images/:imageId - Delete image from listing & Cloudinary
router.delete('/:id/images/:imageId', protect, (req: AuthRequest, res: Response) => {
  const { id, imageId } = req.params;

  checkAuthorization(req, id, (authorized, statusCode, authMsg) => {
    if (!authorized) {
      return res.status(statusCode).json({ message: authMsg });
    }

    db.get('SELECT * FROM vehicles WHERE id = ?', [id], async (err, vehicle: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur de base de données : ' + err.message });
      }
      if (!vehicle) {
        return res.status(404).json({ message: 'Véhicule non trouvé.' });
      }

      const imagesList = parseImages(vehicle.images);
      const targetIndex = imagesList.findIndex(img => img.id === imageId);

      if (targetIndex === -1) {
        return res.status(404).json({ message: 'Image non trouvée pour ce véhicule.' });
      }

      const [targetImage] = imagesList.splice(targetIndex, 1);

      // Clean Cloudinary asset
      if (targetImage.publicId) {
        try {
          await deleteFromCloudinary(targetImage.publicId);
        } catch (cloudinaryErr) {
          console.error(`[Delete Route] Failed to delete publicId ${targetImage.publicId} from Cloudinary:`, cloudinaryErr);
        }
      }

      // Re-normalize orders
      imagesList.forEach((img, idx) => {
        img.order = idx;
      });

      let primaryImage = vehicle.primaryImage;
      if (primaryImage === targetImage.url) {
        primaryImage = imagesList.length > 0 ? imagesList[0].url : '';
      }

      const imagesStr = JSON.stringify(imagesList);

      db.run(
        'UPDATE vehicles SET images = ?, primaryImage = ? WHERE id = ?',
        [imagesStr, primaryImage, id],
        (errUpdate) => {
          if (errUpdate) {
            return res.status(500).json({ message: 'Erreur lors de la mise à jour : ' + errUpdate.message });
          }
          res.json({
            message: 'Image supprimée avec succès.',
            images: imagesList.map(img => img.url),
            imageObjects: imagesList,
            primaryImage
          });
        }
      );
    });
  });
});

// 8. PUT /api/vehicles/:id/images/reorder - Reorder listing photos
router.put('/:id/images/reorder', protect, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { imageIds } = req.body;

  if (!Array.isArray(imageIds)) {
    return res.status(400).json({ message: 'Veuillez fournir un tableau d\'identifiants d\'images.' });
  }

  checkAuthorization(req, id, (authorized, statusCode, authMsg) => {
    if (!authorized) {
      return res.status(statusCode).json({ message: authMsg });
    }

    db.get('SELECT * FROM vehicles WHERE id = ?', [id], (err, vehicle: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur de base de données.' });
      }
      if (!vehicle) {
        return res.status(404).json({ message: 'Véhicule non trouvé.' });
      }

      const imagesList = parseImages(vehicle.images);
      const sortedImages: VehicleImage[] = [];

      imageIds.forEach((imgId) => {
        const found = imagesList.find(img => img.id === imgId);
        if (found) {
          sortedImages.push(found);
        }
      });

      imagesList.forEach((img) => {
        if (!sortedImages.some(s => s.id === img.id)) {
          sortedImages.push(img);
        }
      });

      sortedImages.forEach((img, idx) => {
        img.order = idx;
      });

      const primaryImage = sortedImages.length > 0 ? sortedImages[0].url : '';
      const imagesStr = JSON.stringify(sortedImages);

      db.run(
        'UPDATE vehicles SET images = ?, primaryImage = ? WHERE id = ?',
        [imagesStr, primaryImage, id],
        (errUpdate) => {
          if (errUpdate) {
            return res.status(500).json({ message: 'Erreur lors du réordonnancement.' });
          }
          res.json({
            message: 'Photos réorganisées avec succès.',
            images: sortedImages.map(img => img.url),
            imageObjects: sortedImages,
            primaryImage
          });
        }
      );
    });
  });
});

// 9. PUT /api/vehicles/:id/images/:imageId/primary - Select primary image
router.put('/:id/images/:imageId/primary', protect, (req: AuthRequest, res: Response) => {
  const { id, imageId } = req.params;

  checkAuthorization(req, id, (authorized, statusCode, authMsg) => {
    if (!authorized) {
      return res.status(statusCode).json({ message: authMsg });
    }

    db.get('SELECT * FROM vehicles WHERE id = ?', [id], (err, vehicle: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur de base de données.' });
      }
      if (!vehicle) {
        return res.status(404).json({ message: 'Véhicule non trouvé.' });
      }

      const imagesList = parseImages(vehicle.images);
      const targetImage = imagesList.find(img => img.id === imageId);

      if (!targetImage) {
        return res.status(404).json({ message: 'Image introuvable.' });
      }

      db.run(
        'UPDATE vehicles SET primaryImage = ? WHERE id = ?',
        [targetImage.url, id],
        (errUpdate) => {
          if (errUpdate) {
            return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'image principale.' });
          }
          res.json({
            message: 'Image principale mise à jour.',
            primaryImage: targetImage.url
          });
        }
      );
    });
  });
});

// 10. PUT /api/vehicles/listings/:listingId/status - Update listing status
router.put('/listings/:listingId/status', protect, (req: AuthRequest, res: Response) => {
  const { listingId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Le statut est obligatoire.' });
  }

  // Find vehicle first to check ownership
  db.get('SELECT vehicleId FROM listings WHERE id = ?', [listingId], (errList, listing: any) => {
    if (errList || !listing) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    checkAuthorization(req, listing.vehicleId, (authorized, statusCode, authMsg) => {
      if (!authorized) {
        return res.status(statusCode).json({ message: authMsg });
      }

      db.run('UPDATE listings SET status = ? WHERE id = ?', [status, listingId], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erreur de base de données : ' + err.message });
        }
        res.json({ message: 'Statut de l\'annonce mis à jour.' });
      });
    });
  });
});

export default router;