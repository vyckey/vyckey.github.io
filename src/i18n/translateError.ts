import type { TFunction } from 'i18next';
import { I18nError } from '../utils/errors';

/**
 * Translate an error thrown by a pure utility. Utilities throw `I18nError`
 * with a translation key; any other error falls back to its message.
 */
export function translateError(t: TFunction, error: unknown): string {
  if (error instanceof I18nError) {
    const translate = t as unknown as (
      key: string,
      params?: Record<string, string | number>
    ) => string;
    return translate(error.key, error.params);
  }

  return error instanceof Error ? error.message : String(error);
}
