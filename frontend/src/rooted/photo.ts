/**
 * Profile photos are processed on the device: cropped to a square and redrawn
 * small. Redrawing drops hidden data such as location in the photo's metadata.
 * The result is kept on this device only.
 */

export const PHOTO_PX = 256;
export const MAX_INPUT_BYTES = 15 * 1024 * 1024;

/** The centered square to cut from an image of this size. */
export function squareCrop(w: number, h: number): { sx: number; sy: number; size: number } {
  const size = Math.min(w, h);
  return { sx: Math.round((w - size) / 2), sy: Math.round((h - size) / 2), size };
}

export function isAcceptableImage(file: { type: string; size: number }): string | null {
  if (!/^image\/(jpeg|png|webp|heic|heif|gif)$/i.test(file.type)) return "Please choose a photo (JPG, PNG or WebP).";
  if (file.size > MAX_INPUT_BYTES) return "That photo is too large. Choose one under 15 MB.";
  return null;
}

/** Turn a chosen file into a small square JPEG data URL. */
export async function processPhoto(file: File): Promise<string> {
  const problem = isAcceptableImage(file);
  if (problem) throw new Error(problem);
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
  if (!bitmap) throw new Error("We couldn't read that photo. Try a JPG or PNG.");
  const { sx, sy, size } = squareCrop(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = PHOTO_PX;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0b0d0a";
  ctx.fillRect(0, 0, PHOTO_PX, PHOTO_PX);
  ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, PHOTO_PX, PHOTO_PX);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.82);
}
