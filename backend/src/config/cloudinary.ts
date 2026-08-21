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
    uploadStream.end(fileBuffer);
  });
}

/**
 * Deletes an image from Cloudinary using its public ID.
 */
export function deleteFromCloudinary(publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('[Cloudinary Delete Error]', error);
        return reject(error);
      }
      resolve(result);
    });
  });
}

export default cloudinary;
