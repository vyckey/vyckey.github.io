import { describe, expect, it } from 'vitest';
import { centerSquare, createIcoBlob, fitWithin, scaleSize } from './image';
import { I18nError } from './errors';

describe('image helpers', () => {
  it('scales while keeping at least one pixel', () => {
    expect(scaleSize({ width: 400, height: 200 }, 0.5)).toEqual({
      width: 200,
      height: 100,
    });
    expect(scaleSize({ width: 1, height: 1 }, 0)).toEqual({
      width: 1,
      height: 1,
    });
  });

  it('fits inside a box without upscaling', () => {
    expect(
      fitWithin({ width: 400, height: 200 }, { width: 200, height: 200 })
    ).toEqual({ width: 200, height: 100 });
    expect(
      fitWithin({ width: 100, height: 50 }, { width: 200, height: 200 })
    ).toEqual({ width: 100, height: 50 });
  });

  it('computes a centered square crop', () => {
    expect(centerSquare({ width: 400, height: 200 })).toEqual({
      x: 100,
      y: 0,
      size: 200,
    });
    expect(centerSquare({ width: 300, height: 500 })).toEqual({
      x: 0,
      y: 100,
      size: 300,
    });
  });

  it('builds a PNG-backed ICO container', async () => {
    const ico = createIcoBlob([
      { size: 16, data: new Uint8Array([1, 2, 3]).buffer },
      { size: 256, data: new Uint8Array([4, 5]).buffer },
    ]);

    expect(ico.type).toBe('image/x-icon');
    expect(ico.size).toBe(6 + 16 * 2 + 3 + 2);

    const view = new DataView(await ico.arrayBuffer());
    expect(view.getUint16(2, true)).toBe(1);
    expect(view.getUint16(4, true)).toBe(2);
    expect(view.getUint8(6)).toBe(16);
    expect(view.getUint8(22)).toBe(0); // 256 is encoded as 0
    expect(view.getUint32(6 + 8, true)).toBe(3);
    expect(view.getUint32(6 + 12, true)).toBe(6 + 16 * 2);
    expect(view.getUint32(22 + 8, true)).toBe(2);
    expect(view.getUint32(22 + 12, true)).toBe(6 + 16 * 2 + 3);
    expect(view.getUint8(6 + 16 * 2)).toBe(1);
    expect(view.getUint8(6 + 16 * 2 + 3)).toBe(4);
  });

  it('rejects an empty ICO', () => {
    expect(() => createIcoBlob([])).toThrow(I18nError);
  });
});
