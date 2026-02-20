import { useState } from 'react';

function App() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  function handleRun() {
    setOutput(input);
  }

  function handleReset() {
    setInput('');
    setOutput('');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="min-h-screen w-full max-w-3xl px-4 py-16">
        <section className="flex justify-between gap-4">
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="focus:border-1 text-zinc w-full rounded border border-zinc-400 p-2 focus:border-zinc-500 focus:outline-none"
          />
          <textarea
            rows={8}
            disabled
            value={output}
            className="text-zinc w-full resize-none rounded border border-none border-zinc-400 bg-zinc-200 p-2 focus:border-zinc-500 focus:outline-none"
          />
        </section>

        <div className="mt-2 flex gap-2">
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
        </div>
      </main>
    </div>
  );
}

export default App;
