// Image handling constants
export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB input limit
export const TARGET_SIZE_BYTES = 500 * 1024; // 500KB after compression
export const MAX_DIMENSION = 1200; // Max width/height in pixels
export const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const STORAGE_QUOTA_BYTES = 4 * 1024 * 1024; // 4MB safe limit for localStorage

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an image file before processing
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type. Please use PNG, JPG, GIF, or WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large (${sizeMB}MB). Maximum size is 2MB.`,
    };
  }

  return { valid: true };
}

/**
 * Compress and resize an image to a base64 data URL
 */
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Start with high quality and reduce if needed
      let quality = 0.85;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Iteratively reduce quality until under target size
      while (dataUrl.length > TARGET_SIZE_BYTES * 1.37 && quality > 0.1) {
        // 1.37 accounts for base64 overhead
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the file and load it
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Estimate the storage size of a data URL in bytes
 */
export function estimateStorageSize(dataUrl: string): number {
  // Each character in a string takes 2 bytes in JS (UTF-16)
  // But localStorage uses UTF-8, so ASCII chars are ~1 byte
  // Base64 data URLs are mostly ASCII
  return dataUrl.length;
}

/**
 * Check if there's enough room in localStorage for a new image
 */
export function checkStorageQuota(newSizeBytes: number): { hasRoom: boolean; currentUsage: number } {
  let currentUsage = 0;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          currentUsage += value.length;
        }
      }
    }
  } catch {
    // If we can't calculate, assume we have room
    return { hasRoom: true, currentUsage: 0 };
  }

  const hasRoom = currentUsage + newSizeBytes < STORAGE_QUOTA_BYTES;
  return { hasRoom, currentUsage };
}

/**
 * Format bytes to a human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
