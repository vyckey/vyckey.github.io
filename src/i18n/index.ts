import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';

/** localStorage key used to remember the visitor's language. */
export const LANGUAGE_STORAGE_KEY = 'vyckey.language';

export const languages = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
] as const;

export type Language = (typeof languages)[number]['value'];

export const DEFAULT_LANGUAGE: Language = 'en-US';

function isLanguage(value: unknown): value is Language {
  return languages.some(item => item.value === value);
}

/** Map a browser tag such as `en`, `en-GB` or `zh-Hans-CN` to a supported language. */
export function resolveLanguage(value?: string | null): Language {
  if (!value) {
    return DEFAULT_LANGUAGE;
  }

  if (isLanguage(value)) {
    return value;
  }

  const tag = value.toLowerCase();
  if (tag.startsWith('zh')) {
    return 'zh-CN';
  }
  if (tag.startsWith('en')) {
    return 'en-US';
  }

  return DEFAULT_LANGUAGE;
}

function readStoredLanguage(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable in private mode or sandboxed iframes.
    return null;
  }
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  return resolveLanguage(readStoredLanguage() ?? window.navigator.language);
}

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: languages.map(item => item.value),
  // Resources are bundled, so initialize synchronously to avoid a first
  // render without translations (and unnecessary Suspense boundaries).
  initAsync: false,
  interpolation: {
    // React already escapes interpolated values.
    escapeValue: false,
  },
});

i18n.on('languageChanged', language => {
  const resolved = resolveLanguage(language);

  if (typeof document !== 'undefined') {
    document.documentElement.lang = resolved;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolved);
  } catch {
    // Ignore storage failures; the language still applies for this session.
  }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = resolveLanguage(i18n.language);
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof zhCN;
  }
}

export default i18n;
