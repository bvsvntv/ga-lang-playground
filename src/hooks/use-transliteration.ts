import { useCallback, useRef, useState } from 'react';
import { getWordAtCursor } from '@/engine/utils';
import { transliterate } from '@engine/transliterator';

export function useTransliteration(setInput: (value: string) => void) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [wordRange, setWordRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [cursorRestorePosition, setCursorRestorePosition] = useState<
    number | null
  >(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCursorRestored = useCallback(() => {
    setCursorRestorePosition(null);
  }, []);

  function clearSuggestions() {
    setSuggestions([]);
    setActiveWord(null);
    setWordRange(null);
  }

  async function handleChange(value: string, cursorPos: number) {
    setInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const justTypedSpace = value[cursorPos - 1] === ' ';
    const probePos = justTypedSpace ? cursorPos - 1 : cursorPos;
    const atCursor = getWordAtCursor(value, probePos);

    if (justTypedSpace && atCursor) {
      try {
        const results = await transliterate(atCursor.word);
        if (results.length > 0) {
          const rebuilt =
            value.slice(0, atCursor.start) +
            results[0] +
            value.slice(atCursor.end);
          setInput(rebuilt);
          setCursorRestorePosition(atCursor.start + results[0].length);
        }
      } catch (err) {
        console.error('ERROR: ', err);
      }
      clearSuggestions();
      return;
    }

    if (atCursor && atCursor.word.length >= 1) {
      setActiveWord(atCursor.word);
      setWordRange({ start: atCursor.start, end: atCursor.end });
      const word = atCursor.word;
      debounceTimer.current = setTimeout(async () => {
        try {
          const results = await transliterate(word);
          setSuggestions(results);
        } catch {
          setSuggestions([]);
        }
      }, 300);
    } else {
      clearSuggestions();
    }
  }

  function handleSelectSuggestion(suggestion: string, input: string) {
    if (!wordRange) return;
    const { start, end } = wordRange;
    const rebuilt = input.slice(0, start) + suggestion + input.slice(end);
    setInput(rebuilt);
    setCursorRestorePosition(start + suggestion.length);

    clearSuggestions();
  }

  return {
    suggestions,
    activeWord,
    cursorRestorePosition,
    handleCursorRestored,
    handleChange,
    handleSelectSuggestion,
  };
}
