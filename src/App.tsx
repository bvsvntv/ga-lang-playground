function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-4 py-16">
        <textarea
          rows={8}
          className="focus:border-1 w-full rounded border border-gray-400 p-2 text-black focus:border-gray-500 focus:outline-none"
        />
      </main>
    </div>
  );
}

export default App;
