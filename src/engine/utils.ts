type AlphaNumCharsReturnType = {
  prefix: string | null;
  word: string | null;
  suffix: string | null;
};

export function getAlphanumericChars(text: string): AlphaNumCharsReturnType {
  // Match basic alphanumeric characters
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
