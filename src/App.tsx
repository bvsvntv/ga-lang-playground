import { useState } from 'react';
import { Interpreter, Lexer, Parser } from 'ga-lang';
import { message } from './examples/message';

async function googleInputTools(text: string): Promise<string> {
  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=ne-t-i0-und&num=3`;

  const response = await fetch(url);
  if (!response.ok) {
    console.log('Google input error. ERROR: ', response.status);
  }

  const parsed = await response.json();
  const suggestions: string[] = parsed[1][0][1];
  return suggestions[0] ?? text;
}

function App() {
  const [input, setInput] = useState<string>(message);
  const [output, setOutput] = useState<string>('');

  function getOutput(): string {
    const lexer = new Lexer(input);
    const tokens = lexer.readTokens();

    const parser = new Parser(tokens);
    const stmts = parser.parse();

    const interpreter = new Interpreter();
    return interpreter.interpretForBrowser(stmts);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value.endsWith(' ')) {
      try {
        const result = await googleInputTools(value);
        setInput(result);
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
      const result = getOutput();
      setOutput(result);
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
          <textarea
            rows={28}
            value={input}
            onChange={(e) => handleChange(e)}
            className="focus:border-1 text-zinc w-full rounded border border-zinc-400 p-2 focus:border-zinc-500 focus:outline-none"
          />
          <textarea
            rows={28}
            disabled
            value={output}
            className="text-zinc w-full resize-none rounded border border-none border-zinc-400 bg-zinc-200 p-2 focus:border-zinc-500 focus:outline-none"
          />
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
