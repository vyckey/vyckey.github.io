/**
 * Copy text to the clipboard, with a fallback for non-secure contexts.
 *
 * The Clipboard API is only available in secure contexts. When it is missing
 * or rejects, fall back to the legacy `document.execCommand('copy')`.
 */
export async function copyText(text: string): Promise<void> {
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the legacy implementation.
    }
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard is not available');
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);

  let copied = false;
  try {
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    copied =
      typeof document.execCommand === 'function' &&
      document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }

  if (!copied) {
    throw new Error('Copy command failed');
  }
}
