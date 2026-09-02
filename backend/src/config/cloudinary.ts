import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads a file buffer directly to Cloudinary using streaming upload.
 * Stores the images inside the 'automag/vehicles/vehicle_<id>' directory.
 */
export function uploadToCloudinary(fileBuffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
      return reject(new Error('Buffer de fichier invalide ou vide.'));
    }

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload returned undefined result.'));
          }
          resolve(result);
        }
      );

      uploadStream.on('error', (err) => {
        console.error('[Cloudinary Stream Error]', err);
        reject(err);
      });

      uploadStream.end(fileBuffer);
    } catch (err) {
      console.error('[Cloudinary Exception]', err);
      reject(err);
    }
  });
}

/**
 * Deletes an image from Cloudinary using its public ID.
 */
export function deleteFromCloudinary(publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      return resolve({ result: 'not_found' });
    }

    try {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('[Cloudinary Delete Error]', error);
          return reject(error);
        }
        resolve(result);
      });
    } catch (err) {
      console.error('[Cloudinary Destroy Exception]', err);
      reject(err);
    }
  });
}

export default cloudinary;
