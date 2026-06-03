/**
 * Image optimization utility for Paşa Motor
 * Converts images to WebP format client-side before upload
 */

/**
 * Converts a File or Blob to WebP format
 * @param file The original image file
 * @param quality Quality from 0 to 1 (default 0.8)
 * @returns A promise that resolves to a newly created WebP Blob
 */
export async function convertToWebP(file: File | Blob, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reader failed'));
    reader.readAsDataURL(file);
  });
}

/**
 * Processes a file name to ensure it has the .webp extension and is URL/storage safe without spaces or special characters
 */
export function getWebPFileName(originalName: string): string {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex === -1 ? originalName : originalName.substring(0, dotIndex);
  
  // Sanitize baseName (replace Turkish chars, spaces and special characters)
  const cleanName = baseName
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9_-]/g, '-') // Replace spaces and other special chars with hyphens
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/(^-|-$)/g, ''); // trim starting/trailing hyphens

  return `${cleanName}.webp`;
}
