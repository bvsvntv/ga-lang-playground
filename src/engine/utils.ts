export function getWordAtCursor(
  text: string,
  cursorPos: number,
): { word: string; start: number; end: number } | null {
  const regex = /[A-Za-z0-9]+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (cursorPos >= start && cursorPos <= end) {
      return { word: match[0], start, end };
    }
  }

  return null;
}
