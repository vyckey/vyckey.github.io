/**
 * A lightweight strength score for generated passwords.
 *
 * This is only a UI indicator; it is intentionally independent of the
 * deterministic password generation algorithm in `src/util/password.tsx`.
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) {
    return 0;
  }

  let score = 0;

  if (password.length >= 8) score += 25;
  else score += password.length * 2;

  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;

  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  return Math.min(100, score);
}
