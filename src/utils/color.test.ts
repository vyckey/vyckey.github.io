import { describe, expect, it } from 'vitest';
import {
  complementary,
  contrastRatio,
  lighten,
  mixColors,
  parseHexColor,
  relativeLuminance,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
} from './color';

describe('color', () => {
  it('parses short, long and alpha hex values', () => {
    expect(parseHexColor('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseHexColor('aabbcc')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseHexColor('#aabbccdd')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseHexColor('nope')).toBeNull();
    expect(parseHexColor('#abcd')).toBeNull();
  });

  it('formats RGB as hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 16 })).toBe('#ff0010');
    expect(rgbToHex({ r: 300, g: -5, b: 0 })).toBe('#ff0000');
  });

  it('converts between RGB and HSL', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 });
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({
      r: 0,
      g: 255,
      b: 0,
    });
  });

  it('computes relative luminance and WCAG contrast', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBe(1);
    expect(
      contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
    ).toBe(21);
  });

  it('mixes and complements colors', () => {
    expect(
      mixColors({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 0.5)
    ).toEqual({ r: 128, g: 128, b: 128 });
    expect(lighten({ r: 0, g: 0, b: 0 }, 0.5)).toEqual({
      r: 128,
      g: 128,
      b: 128,
    });
    expect(complementary({ r: 255, g: 0, b: 0 })).toEqual({
      r: 0,
      g: 255,
      b: 255,
    });
  });
});
