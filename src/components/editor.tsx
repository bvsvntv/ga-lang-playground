import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type EditorProps = {
  content: string;
  suggestions: string[];
  activeWord: string | null;
  onChange: (content: string) => void;
  onSelectSuggestion: (suggestion: string) => void;
};

type CursorCoords = {
  top: number;
  left: number;
};

function getCursorCoords(textarea: HTMLTextAreaElement): CursorCoords {
  const div = document.createElement('div');
  const cs = window.getComputedStyle(textarea);

  div.style.cssText = [
    'position: fixed',
    `top: ${textarea.getBoundingClientRect().top + parseFloat(cs.paddingTop)}px`,
    `left: ${textarea.getBoundingClientRect().left + parseFloat(cs.paddingLeft)}px`,
    `width: ${textarea.clientWidth}px`,
    'visibility: hidden',
    'white-space: pre-wrap',
    'overflow-wrap: break-word',
    `font-size: ${cs.fontSize}`,
    `font-family: ${cs.fontFamily}`,
    `line-height: ${cs.lineHeight}`,
    'box-sizing: border-box',
  ].join(';');

  const textBefore = textarea.value.substring(0, textarea.selectionStart);
  div.textContent = textBefore;
  const marker = document.createElement('span');
  marker.textContent = '|';
  div.appendChild(marker);

  document.body.appendChild(div);
  const markerRect = marker.getBoundingClientRect();
  document.body.removeChild(div);

  return {
    top: markerRect.bottom - textarea.scrollTop,
    left: markerRect.left,
  };
}

export function Editor({
  content,
  suggestions,
  activeWord,
  onChange,
  onSelectSuggestion,
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [coords, setCoords] = useState<CursorCoords>({ top: 0, left: 0 });

  useEffect(() => {
    if (suggestions.length > 0 && activeWord && textareaRef.current) {
      const c = getCursorCoords(textareaRef.current);
      setCoords(c);
    }
  }, [suggestions, activeWord, content]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
  }

  return (
    <>
      <textarea
        ref={textareaRef}
        rows={28}
        value={content}
        onChange={handleInput}
        className="mt-0.5 w-full rounded-b border border-zinc-400 p-2 text-zinc-900 focus:outline-none"
      />
      {suggestions.length > 0 &&
        activeWord &&
        createPortal(
          <ul
            className="fixed z-50 min-w-[140px] rounded-md border border-zinc-300 bg-white py-1 shadow-lg"
            style={{ top: coords.top, left: coords.left }}
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="cursor-pointer px-3 py-1.5 text-sm hover:bg-zinc-200"
                onClick={() => onSelectSuggestion(s)}
              >
                {s}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </>
  );
}
