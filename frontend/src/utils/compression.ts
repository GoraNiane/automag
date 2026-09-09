/**
 * Compresses an image file client-side using HTML5 Canvas.
 * - Max width: 1600px
 * - Target format: image/jpeg
 * - Quality: 0.85
 */
export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    // If the file is not an image, resolve with original file blob
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1600;

        // Constraint: max width 1600px
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Canvas Context not supported, return original file
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with quality 0.85
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Only use compressed blob if it's actually smaller than the original
              if (blob.size < file.size) {
                resolve(blob);
              } else {
                resolve(file);
              }
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = (err) => {
        console.error('[Image Load Error]', err);
        resolve(file); // fallback to original file
      };
    };

    reader.onerror = (err) => {
      console.error('[File Read Error]', err);
      resolve(file); // fallback to original file
    };
  });
}
