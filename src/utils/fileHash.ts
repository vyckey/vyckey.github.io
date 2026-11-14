import CryptoJS from 'crypto-js';
import { I18nError } from './errors';

export type FileHashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512';

export const FILE_HASH_ALGORITHMS: FileHashAlgorithm[] = [
  'MD5',
  'SHA1',
  'SHA256',
  'SHA512',
];

type Hasher = ReturnType<typeof CryptoJS.algo.MD5.create>;

const CHUNK_SIZE = 4 * 1024 * 1024;

function createHasher(algorithm: FileHashAlgorithm): Hasher {
  switch (algorithm) {
    case 'MD5':
      return CryptoJS.algo.MD5.create();
    case 'SHA1':
      return CryptoJS.algo.SHA1.create();
    case 'SHA256':
      return CryptoJS.algo.SHA256.create();
    case 'SHA512':
      return CryptoJS.algo.SHA512.create();
  }
}

function readAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new I18nError('fileHash.readFailed'));
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Hash a file in chunks so large uploads do not block the main thread.
 * Yields to the event loop between chunks.
 */
export async function hashFile(
  file: Blob,
  algorithms: FileHashAlgorithm[] = FILE_HASH_ALGORITHMS,
  onProgress?: (percent: number) => void
): Promise<Partial<Record<FileHashAlgorithm, string>>> {
  const hashers = new Map<FileHashAlgorithm, Hasher>();
  for (const algorithm of algorithms) {
    hashers.set(algorithm, createHasher(algorithm));
  }

  const size = file.size;
  onProgress?.(0);

  if (size === 0) {
    onProgress?.(100);
  } else {
    for (let offset = 0; offset < size; offset += CHUNK_SIZE) {
      const end = Math.min(offset + CHUNK_SIZE, size);
      const buffer = await readAsArrayBuffer(file.slice(offset, end));
      const words = CryptoJS.lib.WordArray.create(buffer);

      hashers.forEach(hasher => hasher.update(words));
      onProgress?.(Math.round((end / size) * 100));

      // Let React paint the progress bar between chunks.
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const result: Partial<Record<FileHashAlgorithm, string>> = {};
  hashers.forEach((hasher, algorithm) => {
    result[algorithm] = hasher.finalize().toString();
  });
  return result;
}
