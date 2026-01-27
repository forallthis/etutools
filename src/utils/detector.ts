export type DetectedType = 'json' | 'url' | 'timestamp' | 'email' | 'text';

export function detectContentType(text: string): DetectedType {
  // JSON detection
  if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
    try {
      JSON.parse(text);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }

  // URL detection
  if (/^https?:\/\//i.test(text.trim())) {
    return 'url';
  }

  // Email detection
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) {
    return 'email';
  }

  // Timestamp detection (10-13 digits)
  if (/^\d{10,13}$/.test(text.trim())) {
    const num = parseInt(text.trim());
    if (num > 1000000000 && num < 9999999999999) {
      return 'timestamp';
    }
  }

  return 'text';
}
