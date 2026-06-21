import { useEffect, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import reactGfm from 'remark-gfm';

type CommandPaletteProps = {
  show: boolean;
  onClose: () => void;
};

export function CommandPalette({ show = false, onClose }: CommandPaletteProps) {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show || markdown) return;

    async function fetchMarkdown() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          'https://raw.githubusercontent.com/bvsvntv/ga-lang/refs/heads/main/docs/language-specification.md',
        );
        const text = await response.text();
        setMarkdown(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchMarkdown();
  }, [show, markdown]);

  const customComponents: Components = {
    h2: (props) => (
      <h2 className="text-xl font-bold text-zinc-800" {...props} />
    ),
    table: (props) => (
      <div>
        <table
          className="mt-2 w-full border-collapse overflow-x-auto border"
          {...props}
        />
      </div>
    ),
    th: (props) => <th className="border bg-zinc-100 p-2" {...props} />,
    td: (props) => <td className="border p-2" {...props} />,
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 overflow-y-auto p-4 pt-[25vh]">
          <div
            className="fixed inset-0 bg-transparent backdrop-blur"
            onClick={() => onClose()}
          ></div>
          <div className="relative mx-auto max-w-xl rounded bg-zinc-50 p-2 shadow">
            {loading ? (
              <div className="text-center text-zinc-500">
                Loading documentation...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[reactGfm]}
                components={customComponents}
              >
                {markdown}
              </ReactMarkdown>
            )}
          </div>
        </div>
      )}
    </>
  );
}
