import { I18nError } from './errors';

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export const IMAGE_FORMATS: ImageFormat[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export function imageExtension(format: ImageFormat): string {
  return format === 'image/jpeg' ? 'jpg' : format.split('/')[1];
}

export interface Size {
  width: number;
  height: number;
}

export interface Crop {
  x: number;
  y: number;
  size: number;
}

/** Keep an aspect ratio while scaling to a target width or height. */
export function scaleSize(original: Size, scale: number): Size {
  return {
    width: Math.max(1, Math.round(original.width * scale)),
    height: Math.max(1, Math.round(original.height * scale)),
  };
}

/** Fit a rectangle inside a bounding box without upscaling. */
export function fitWithin(original: Size, box: Size): Size {
  const ratio = Math.min(
    box.width / original.width,
    box.height / original.height,
    1
  );
  return scaleSize(original, ratio);
}

/** Center-crop rectangle for square icons. */
export function centerSquare(original: Size): Crop {
  const size = Math.min(original.width, original.height);
  return {
    x: Math.round((original.width - size) / 2),
    y: Math.round((original.height - size) / 2),
    size,
  };
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new I18nError('image.errors.canvasUnavailable');
  }
  return context;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new I18nError('image.errors.encodeFailed'));
        }
      },
      format,
      quality
    );
  });
}

export interface RenderOptions {
  width: number;
  height: number;
  format: ImageFormat;
  quality?: number;
  background?: string | null;
}

export async function renderImage(
  image: HTMLImageElement,
  options: RenderOptions
): Promise<Blob> {
  const { width, height, format, quality = 0.9, background } = options;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const context = getContext(canvas);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  if (background) {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, format, quality);
}

/** Render a centered square icon, cropping the long edge. */
export async function renderFavicon(
  image: HTMLImageElement,
  size: number,
  format: ImageFormat = 'image/png'
): Promise<Blob> {
  const crop = centerSquare({
    width: image.naturalWidth,
    height: image.naturalHeight,
  });
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = getContext(canvas);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.size,
    crop.size,
    0,
    0,
    size,
    size
  );

  return canvasToBlob(canvas, format, 1);
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new I18nError('image.errors.readFailed'));
    reader.readAsDataURL(blob);
  });
}

export interface IcoSource {
  size: number;
  data: ArrayBuffer;
}

/**
 * Build a PNG-backed ICO container. Windows and every modern browser accept
 * PNG payloads for all sizes, including 256px entries.
 */
export function createIcoBlob(sources: IcoSource[]): Blob {
  if (sources.length === 0 || sources.length > 255) {
    throw new I18nError('image.errors.icoSize');
  }

  const headerSize = 6 + sources.length * 16;
  const totalSize =
    headerSize +
    sources.reduce((sum, source) => sum + source.data.byteLength, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // icon type
  view.setUint16(4, sources.length, true);

  let offset = headerSize;

  sources.forEach((source, index) => {
    const entry = 6 + index * 16;
    const size = Math.max(1, Math.min(256, Math.round(source.size)));

    view.setUint8(entry, size === 256 ? 0 : size);
    view.setUint8(entry + 1, size === 256 ? 0 : size);
    view.setUint8(entry + 2, 0); // palette size
    view.setUint8(entry + 3, 0); // reserved
    view.setUint16(entry + 4, 1, true); // color planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, source.data.byteLength, true);
    view.setUint32(entry + 12, offset, true);

    bytes.set(new Uint8Array(source.data), offset);
    offset += source.data.byteLength;
  });

  return new Blob([buffer], { type: 'image/x-icon' });
}
