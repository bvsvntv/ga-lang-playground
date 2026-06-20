import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import reactGfm from 'remark-gfm';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>('');
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    async function fetchMarkdown() {
      const response = await fetch(
        'https://raw.githubusercontent.com/bvsvntv/ga-lang/refs/heads/main/docs/language-specification.md',
      );
      const text = await response.text();
      setMarkdown(text);
    }

    fetchMarkdown();
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 overflow-y-auto p-4 pt-[25vh]">
          <div className="fixed inset-0 bg-transparent backdrop-blur"></div>
          <div className="relative mx-auto max-w-xl rounded bg-zinc-50 p-2 shadow">
            <ReactMarkdown remarkPlugins={[reactGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
}
