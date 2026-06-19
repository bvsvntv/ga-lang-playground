import { useState } from 'react';
import { initFileName, message } from '@/examples/message';
import { interpret } from '@engine/interpreter';
import { transliterate } from '@engine/transliterator';
import { getAlphanumericChars } from '@/engine/utils';
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

  function getOutput(): string {
    return interpret(input);
  }

  async function handleChange(value: string) {
    if (value.endsWith(' ')) {
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
        } else {
          setInput(results[0]);
        }
      } catch (err) {
        console.error('ERROR: ', err);
        setInput(value);
      }

      return;
    }

    setInput(value);
  }

  function handleRun() {
    if (!input.trim()) {
      setOutput('No code to run.');
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

  function showHelpMenu(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    alert(event.type);
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

            <Button onClick={showHelpMenu}>
              <CircleQuestionMarkIcon size={16} />
            </Button>
          </div>
        </section>

        <section className="flex justify-between gap-0.5">
          <Editor content={input} onChange={handleChange} />
          <Console output={output} />
        </section>

        <CommandPalette />
      </main>
    </div>
  );
}

export default App;
