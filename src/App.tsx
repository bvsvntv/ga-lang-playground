import React, { useState } from 'react';

function App() {
  const [downKey, setDownKey] = useState<number>(0);
  const [downKeyCode, setDownKeyCode] = useState<string>("Key{X}");

  const [altKey, setAltKey] = useState<boolean>(false);
  const [ctrlKey, setCtrlKey] = useState<boolean>(false);
  const [shiftKey, setShiftKey] = useState<boolean>(false);

  function handleOnKeyUp(e: React.KeyboardEvent) {
      if(e.altKey) setAltKey(true);
      else if(e.shiftKey) setShiftKey(true);
      else if(e.ctrlKey) setCtrlKey(true);
      else {
          setDownKey(+e.keyCode)
          setDownKeyCode(e.code)
      };
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="min-h-screen w-full max-w-3xl px-4 py-16">
        <h3 className="text-md font-semibold text-zinc-700">
          PRESSED: {downKey}/{downKeyCode} | ALT_KEY: {altKey ? "YES" : "NO"} | CTRL_KEY: {ctrlKey ? "YES" : "NO"} | SHIFT_KEY: {shiftKey ? "YES" : "NO"}
        </h3>

        <textarea
          onKeyDown={(e) => handleOnKeyUp(e)}
          rows={8}
          className="focus:border-1 text-zinc mt-2 w-full rounded border border-zinc-400 p-2 focus:border-zinc-500 focus:outline-none"
        />
      </main>
    </div>
  );
}

export default App;
