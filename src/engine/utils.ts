type AlphaNumCharsReturnType = {
  prefix: string | null;
  word: string | null;
  suffix: string | null;
};

export function getAlphanumericChars(text: string): AlphaNumCharsReturnType {
  const match = text.match(/[A-Za-z0-9]+(?=\s*$)/);

  if (!match)
    return {
      prefix: null,
      word: null,
      suffix: null,
    };

  const word = match[0];
  const [prefix, suffix] = text.split(word);

  return {
    prefix,
    word,
    suffix,
  };
}

export function getLastWord(text: string): { prefix: string; word: string } | null {
  const match = text.match(/[A-Za-z0-9]+$/);
  if (!match) return null;

  const word = match[0];
  const prefix = text.slice(0, text.length - word.length);

  return { prefix, word };
}
