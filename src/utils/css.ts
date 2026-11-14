export type GradientType = 'linear' | 'radial' | 'conic';

export interface GradientStop {
  color: string;
  /** Position as a percentage, 0-100. */
  position: number;
}

export interface ShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export interface CornerRadius {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface FilterValues {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  saturate: number;
  sepia: number;
  hueRotate: number;
  invert: number;
  opacity: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function buildGradient(
  type: GradientType,
  angle: number,
  stops: GradientStop[]
): string {
  if (stops.length === 0) {
    return 'none';
  }

  const list = [...stops]
    .sort((first, second) => first.position - second.position)
    .map(stop => `${stop.color} ${clamp(stop.position, 0, 100)}%`)
    .join(', ');

  if (type === 'radial') {
    return `radial-gradient(circle at 50% 50%, ${list})`;
  }
  if (type === 'conic') {
    return `conic-gradient(from ${angle}deg, ${list})`;
  }
  return `linear-gradient(${angle}deg, ${list})`;
}

export function buildBoxShadow(layers: ShadowLayer[]): string {
  if (layers.length === 0) {
    return 'none';
  }

  return layers
    .map(
      layer =>
        `${layer.inset ? 'inset ' : ''}${layer.x}px ${layer.y}px ${
          layer.blur
        }px ${layer.spread}px ${layer.color}`
    )
    .join(', ');
}

export function buildBorderRadius(radius: CornerRadius): string {
  return `${radius.topLeft}px ${radius.topRight}px ${radius.bottomRight}px ${radius.bottomLeft}px`;
}

export function buildFilter(values: FilterValues): string {
  const parts: string[] = [];

  if (values.blur > 0) {
    parts.push(`blur(${values.blur}px)`);
  }
  if (values.brightness !== 100) {
    parts.push(`brightness(${values.brightness}%)`);
  }
  if (values.contrast !== 100) {
    parts.push(`contrast(${values.contrast}%)`);
  }
  if (values.grayscale > 0) {
    parts.push(`grayscale(${values.grayscale}%)`);
  }
  if (values.saturate !== 100) {
    parts.push(`saturate(${values.saturate}%)`);
  }
  if (values.sepia > 0) {
    parts.push(`sepia(${values.sepia}%)`);
  }
  if (values.hueRotate !== 0) {
    parts.push(`hue-rotate(${values.hueRotate}deg)`);
  }
  if (values.invert > 0) {
    parts.push(`invert(${values.invert}%)`);
  }
  if (values.opacity !== 100) {
    parts.push(`opacity(${values.opacity}%)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}
