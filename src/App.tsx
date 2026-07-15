import { useEffect, useState } from 'react';
import { initFileName, message, noCodeToRun } from '@/examples/message';
import { interpret } from '@engine/interpreter';
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
import { useTransliteration } from './hooks/use-transliteration';

function App() {
  const [input, setInput] = useState<string>(message);
  const [output, setOutput] = useState<string>('');
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const {
    suggestions,
    activeWord,
    cursorRestorePosition,
    handleCursorRestored,
    handleChange,
    handleSelectSuggestion,
  } = useTransliteration(setInput);

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

  function getOutput(): string {
    return interpret(input);
  }

  function handleRun() {
    if (!input.trim()) {
      setOutput(noCodeToRun);
      return;
    }

    try {
      const results = getOutput();
      setOutput(results);
    } catch (error: unknown) {
      setOutput(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
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
            onSelectSuggestion={(suggestion) =>
              handleSelectSuggestion(suggestion, input)
            }
            cursorRestorePosition={cursorRestorePosition}
            onCursorRestored={handleCursorRestored}
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
