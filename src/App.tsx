import React, { useState } from 'react';

type LastKeyDetail = {
  key: string;
  keyCode: number;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
};

function App() {
  const [lastKeyDetail, setLastKeyDetail] = useState<LastKeyDetail>({
    key: '',
    keyCode: 0,
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
  });

  function handleKeyDown(e: React.KeyboardEvent) {
    setLastKeyDetail({
      key: e.key,
      keyCode: e.keyCode,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="min-h-screen w-full max-w-3xl px-4 py-16">
        <h3 className="text-md font-semibold text-zinc-700">
          PRESSED: {lastKeyDetail.keyCode}/{lastKeyDetail.key} | ALT_KEY:{' '}
          {lastKeyDetail.altKey ? 'YES' : 'NO'} | CTRL_KEY:{' '}
          {lastKeyDetail.ctrlKey ? 'YES' : 'NO'} | SHIFT_KEY:{' '}
          {lastKeyDetail.shiftKey ? 'YES' : 'NO'}
        </h3>

        <textarea
          onKeyDown={handleKeyDown}
          rows={8}
          className="focus:border-1 text-zinc mt-2 w-full rounded border border-zinc-400 p-2 focus:border-zinc-500 focus:outline-none"
        />
      </main>
    </div>
  );
}

export default App;
