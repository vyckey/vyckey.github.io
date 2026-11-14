import { describe, expect, it, vi } from 'vitest';
import { hashFile } from './fileHash';

describe('fileHash', () => {
  it('hashes a blob with the requested algorithms', async () => {
    const result = await hashFile(new Blob(['abc']), ['MD5', 'SHA256']);

    expect(result.MD5).toBe('900150983cd24fb0d6963f7d28e17f72');
    expect(result.SHA256).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    expect(result.SHA1).toBeUndefined();
  });

  it('reports progress from 0 to 100', async () => {
    const onProgress = vi.fn();
    await hashFile(new Blob(['hello']), ['SHA1'], onProgress);

    expect(onProgress).toHaveBeenCalledWith(0);
    expect(onProgress).toHaveBeenLastCalledWith(100);
  });

  it('hashes an empty file', async () => {
    const result = await hashFile(new Blob([]), ['MD5']);
    expect(result.MD5).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });
});
