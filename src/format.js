// Cuts text to at most `max` user-visible characters without splitting an emoji.
export function truncate(text, max) {
  const chars = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)].map((s) => s.segment);
  if (chars.length <= max) return text;
  if (max <= 1) return chars.slice(0, max).join('');
  return chars.slice(0, max - 1).join('') + '…';
}

// Collapses runs of whitespace and trims the ends.
export function squash(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// The first letter of each word, upper-cased: "Nguyễn Văn Tuấn" gives "NVT".
export function initials(name) {
  return squash(name)
    .split(' ')
    .filter(Boolean)
    .map((word) => [...word][0].toUpperCase())
    .join('');
}
