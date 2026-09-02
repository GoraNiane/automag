"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
/**
 * Uploads a file buffer directly to Cloudinary using streaming upload.
 * Stores the images inside the 'automag/vehicles/vehicle_<id>' directory.
 */
function uploadToCloudinary(fileBuffer, options) {
    return new Promise((resolve, reject) => {
        if (!fileBuffer || !Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
            return reject(new Error('Buffer de fichier invalide ou vide.'));
        }
        try {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
                if (error) {
                    console.error('[Cloudinary Upload Error]', error);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary upload returned undefined result.'));
                }
                resolve(result);
            });
            uploadStream.on('error', (err) => {
                console.error('[Cloudinary Stream Error]', err);
                reject(err);
            });
            uploadStream.end(fileBuffer);
        }
        catch (err) {
            console.error('[Cloudinary Exception]', err);
            reject(err);
        }
    });
}
/**
 * Deletes an image from Cloudinary using its public ID.
 */
function deleteFromCloudinary(publicId) {
    return new Promise((resolve, reject) => {
        if (!publicId) {
            return resolve({ result: 'not_found' });
        }
        try {
            cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    console.error('[Cloudinary Delete Error]', error);
                    return reject(error);
                }
                resolve(result);
            });
        }
        catch (err) {
            console.error('[Cloudinary Destroy Exception]', err);
            reject(err);
        }
    });
}
exports.default = cloudinary_1.v2;
