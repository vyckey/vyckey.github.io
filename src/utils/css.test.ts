import { describe, expect, it } from 'vitest';
import {
  buildBorderRadius,
  buildBoxShadow,
  buildFilter,
  buildGradient,
} from './css';

describe('css', () => {
  it('builds linear, radial and conic gradients', () => {
    const stops = [
      { color: '#fff', position: 100 },
      { color: '#000', position: 0 },
    ];

    expect(buildGradient('linear', 45, stops)).toBe(
      'linear-gradient(45deg, #000 0%, #fff 100%)'
    );
    expect(buildGradient('radial', 0, stops)).toBe(
      'radial-gradient(circle at 50% 50%, #000 0%, #fff 100%)'
    );
    expect(buildGradient('conic', 90, stops)).toBe(
      'conic-gradient(from 90deg, #000 0%, #fff 100%)'
    );
    expect(buildGradient('linear', 45, [])).toBe('none');
  });

  it('clamps stop positions', () => {
    expect(
      buildGradient('linear', 0, [
        { color: 'red', position: -20 },
        { color: 'blue', position: 140 },
      ])
    ).toBe('linear-gradient(0deg, red 0%, blue 100%)');
  });

  it('builds multi-layer box shadows', () => {
    expect(
      buildBoxShadow([
        {
          x: 0,
          y: 10,
          blur: 30,
          spread: 0,
          color: '#000',
          inset: false,
        },
        {
          x: 0,
          y: 2,
          blur: 4,
          spread: 1,
          color: '#fff',
          inset: true,
        },
      ])
    ).toBe('0px 10px 30px 0px #000, inset 0px 2px 4px 1px #fff');
    expect(buildBoxShadow([])).toBe('none');
  });

  it('builds corner radii', () => {
    expect(
      buildBorderRadius({
        topLeft: 1,
        topRight: 2,
        bottomRight: 3,
        bottomLeft: 4,
      })
    ).toBe('1px 2px 3px 4px');
  });

  it('omits neutral filter values', () => {
    expect(
      buildFilter({
        blur: 0,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        saturate: 100,
        sepia: 0,
        hueRotate: 0,
        invert: 0,
        opacity: 100,
      })
    ).toBe('none');

    expect(
      buildFilter({
        blur: 2,
        brightness: 120,
        contrast: 90,
        grayscale: 50,
        saturate: 150,
        sepia: 10,
        hueRotate: 45,
        invert: 20,
        opacity: 80,
      })
    ).toBe(
      'blur(2px) brightness(120%) contrast(90%) grayscale(50%) saturate(150%) sepia(10%) hue-rotate(45deg) invert(20%) opacity(80%)'
    );
  });
});
