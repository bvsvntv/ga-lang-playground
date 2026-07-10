import { useEffect, useRef, useState } from 'react';
import { initFileName, message, noCodeToRun } from '@/examples/message';
import { interpret } from '@engine/interpreter';
import { transliterate } from '@engine/transliterator';
import { getAlphanumericChars, getLastWord } from '@/engine/utils';
import { Editor } from '@components/editor';
import { Console } from '@components/console';
import {
  BrushCleaningIcon,
  CircleQuestionMarkIcon,
  ListRestartIcon,
  PlayIcon,
  TerminalIcon,
  WorkflowIcon,
} from 'lucide-react';
import { Button } from '@ui/button';
import { CommandPalette } from './components/command-palette';

function App() {
  const [input, setInput] = useState<string>(message);
  const [output, setOutput] = useState<string>('');
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowPalette(true);
      }

      if (e.key.toLowerCase() === 'escape') {
        setShowPalette(false);
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  function clearSuggestions() {
    setSuggestions([]);
    setActiveWord(null);
  }

  function getOutput(): string {
    return interpret(input);
  }

  async function handleChange(value: string) {
    if (value.endsWith(' ')) {
      clearSuggestions();
      const parsed = getAlphanumericChars(value);
      if (!parsed.word) {
        setInput(value);
        return;
      }

      const { prefix, word, suffix } = parsed;
      try {
        const results = await transliterate(word as string);
        if (results.length > 0) {
          const rebuilt = prefix + results[0] + suffix;
          setInput(rebuilt);
        }
      } catch (err) {
        console.error('ERROR: ', err);
        setInput(value);
      }

      return;
    }

    setInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const lastWord = getLastWord(value);
    if (lastWord && lastWord.word.length >= 1) {
      setActiveWord(lastWord.word);
      const word = lastWord.word;
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

  function handleSelectSuggestion(suggestion: string) {
    const lastWord = getLastWord(input);
    if (lastWord) {
      setInput(lastWord.prefix + suggestion);
      clearSuggestions();
    }
  }

  function handleRun() {
    if (!input.trim()) {
      setOutput(noCodeToRun);
      return;
    }

    try {
      const results = getOutput();
      setOutput(results);
    } catch (error: any) {
      setOutput(error.message);
    }
  }

  function handleReset() {
    setInput(message);
    setOutput('');
  }

  function handleClear() {
    setInput('');
    setOutput('');
  }

  return (
    <div className="bg-zinc-50 font-sans">
      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-16">
        <section className="flex justify-between gap-0.5">
          <div className="flex flex-1 items-center justify-between border border-zinc-400">
            <p className="border-r border-dashed border-zinc-400 px-2 text-base font-bold text-zinc-800">
              {initFileName}
            </p>

            <div className="flex items-center gap-1">
              <Button onClick={handleRun}>
                <PlayIcon size={16} />
              </Button>

              <Button onClick={handleClear}>
                <BrushCleaningIcon size={16} />
              </Button>

              <Button onClick={handleReset}>
                <ListRestartIcon size={16} />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 items-center border border-zinc-400">
            <Button>
              <TerminalIcon size={16} />
            </Button>

            <Button>
              <WorkflowIcon size={16} />
            </Button>

            <Button onClick={() => setShowPalette(true)}>
              <CircleQuestionMarkIcon size={16} />
            </Button>
          </div>
        </section>

        <section className="flex justify-between gap-0.5">
          <Editor
            content={input}
            suggestions={suggestions}
            activeWord={activeWord}
            onChange={handleChange}
            onSelectSuggestion={handleSelectSuggestion}
          />
          <Console output={output} />
        </section>

        <CommandPalette
          show={showPalette}
          onClose={() => setShowPalette(false)}
        />
      </main>
    </div>
  );
}

export default App;
