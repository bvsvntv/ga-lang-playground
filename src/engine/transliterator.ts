export async function transliterate(text: string): Promise<string[]> {
  // Constants for API
  const PREFERRED_LANGUAGE_CODE = 'ne-t-i0-und'; // Nepali language
  const PREFERRED_MAX_RESULT = 3;

  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=${PREFERRED_LANGUAGE_CODE}&num=${PREFERRED_MAX_RESULT}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.log('Google input error. ERROR: ', response.status);
    return [];
  }

  const serialized = await response.json();
  if (
    typeof serialized[1] === 'undefined' ||
    typeof serialized[1][0] === 'undefined'
  ) {
    return [];
  }

  const suggestions: string[] = serialized[1][0][1];
  return suggestions ?? text;
}
