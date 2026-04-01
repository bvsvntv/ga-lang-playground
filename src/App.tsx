import { useState } from 'react';
import { message } from './examples/message';
import { interpret } from './engine/interpreter';
import { transliterate } from './engine/transliterator';
import { getAlphanumericChars } from './engine/utils';
import { Editor } from './components/editor';
import { Console } from './components/console';

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="min-h-screen w-full max-w-7xl px-4 py-16">
        <section className="flex justify-between gap-4">
          <Editor content={input} onChange={handleChange} />
          <Console output={output} />
        </section>

        <section className="mt-4 flex gap-2">
          <button
            className="rounded bg-green-500 px-4 py-2 text-xl font-semibold text-white"
            onClick={handleRun}
          >
            Run
          </button>

          <button
            className="rounded border border-zinc-400 bg-zinc-50 px-4 py-2 text-xl font-semibold text-zinc-700"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            className="rounded border border-zinc-400 bg-red-100 px-4 py-2 text-xl font-semibold text-zinc-700"
            onClick={handleClear}
          >
            Clear
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;
