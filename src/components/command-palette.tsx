import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import reactGfm from 'remark-gfm';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    async function fetchMarkdown() {
      const response = await fetch(
        'https://raw.githubusercontent.com/bvsvntv/ga-lang/refs/heads/main/docs/language-specification.md',
      );
      const text = await response.text();
      setMarkdown(text);
    }

    fetchMarkdown();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <ReactMarkdown remarkPlugins={[reactGfm]}>{markdown}</ReactMarkdown>
      )}
    </>
  );
}
