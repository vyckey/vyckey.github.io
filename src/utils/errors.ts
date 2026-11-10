export class I18nError extends Error {
  /** Full i18n key, e.g. `encoder.errors.base64InvalidChar`. */
  readonly key: string;
  readonly params?: Record<string, string | number>;

  constructor(key: string, params?: Record<string, string | number>) {
    super(key);
    this.name = 'I18nError';
    this.key = key;
    this.params = params;
  }
}
