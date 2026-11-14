export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  /** Hue in degrees, 0-360. */
  h: number;
  /** Saturation percentage, 0-100. */
  s: number;
  /** Lightness percentage, 0-100. */
  l: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toHexPair(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
}

/** Parse `#rgb`, `#rrggbb` (alpha is dropped) or the same values without `#`. */
export function parseHexColor(input: string): RgbColor | null {
  const value = input.trim().replace(/^#/, '');

  if (!/^[0-9a-f]+$/i.test(value)) {
    return null;
  }

  const normalized =
    value.length === 3
      ? value
          .split('')
          .map(char => char + char)
          .join('')
      : value.length === 8
        ? value.slice(0, 6)
        : value;

  if (normalized.length !== 6) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const red = clamp(r, 0, 255) / 255;
  const green = clamp(g, 0, 255) / 255;
  const blue = clamp(b, 0, 255) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  return {
    h: Math.round(((hue * 60 + 360) % 360) * 10) / 10,
    s:
      Math.round(
        (delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))) * 1000
      ) / 10,
    l: Math.round(lightness * 1000) / 10,
  };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = hue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment < 1) {
    red = chroma;
    green = second;
  } else if (segment < 2) {
    red = second;
    green = chroma;
  } else if (segment < 3) {
    green = chroma;
    blue = second;
  } else if (segment < 4) {
    green = second;
    blue = chroma;
  } else if (segment < 5) {
    red = second;
    blue = chroma;
  } else {
    red = chroma;
    blue = second;
  }

  const match = lightness - chroma / 2;
  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  };
}

/** W3C relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance({ r, g, b }: RgbColor): number {
  const channel = (value: number) => {
    const normalized = clamp(value, 0, 255) / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio, between 1 and 21. */
export function contrastRatio(first: RgbColor, second: RgbColor): number {
  const brighter = Math.max(
    relativeLuminance(first),
    relativeLuminance(second)
  );
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return Math.round(((brighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

/** Mix two colors; weight 0 returns the first color, 1 the second. */
export function mixColors(
  first: RgbColor,
  second: RgbColor,
  weight = 0.5
): RgbColor {
  const ratio = clamp(weight, 0, 1);
  return {
    r: Math.round(first.r + (second.r - first.r) * ratio),
    g: Math.round(first.g + (second.g - first.g) * ratio),
    b: Math.round(first.b + (second.b - first.b) * ratio),
  };
}

export function lighten(color: RgbColor, amount: number): RgbColor {
  return mixColors(color, { r: 255, g: 255, b: 255 }, amount);
}

export function darken(color: RgbColor, amount: number): RgbColor {
  return mixColors(color, { r: 0, g: 0, b: 0 }, amount);
}

export function complementary({ r, g, b }: RgbColor): RgbColor {
  const hsl = rgbToHsl({ r, g, b });
  return hslToRgb({ ...hsl, h: hsl.h + 180 });
}
