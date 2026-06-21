import { useEffect, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import reactGfm from 'remark-gfm';

type CommandPaletteProps = {
  show: boolean;
  onClose: () => void;
};

export function CommandPalette({ show = false, onClose }: CommandPaletteProps) {
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/bvsvntv/ga-lang/refs/heads/main/docs/language-specification.md',
        );
        const text = await response.text();
        setMarkdown(text);
      } catch (err) {
        console.log(err);
      }
    }

    fetchMarkdown();
  }, []);

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
            <ReactMarkdown
              remarkPlugins={[reactGfm]}
              components={customComponents}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
}
