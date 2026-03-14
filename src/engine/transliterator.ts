export async function transliterate(text: string): Promise<string[]> {
  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=ne-t-i0-und&num=3`;

  const response = await fetch(url);
  if (!response.ok) {
    console.log('Google input error. ERROR: ', response.status);
  }

  const parsed = await response.json();
  const suggestions: string[] = parsed[1][0][1];
  return suggestions ?? text;
}
