type ConsoleProps = {
  output: string;
};

export function Console({ output }: ConsoleProps) {
  return (
    <pre className="w-full resize-none rounded border border-none border-zinc-400 bg-zinc-200 p-2 text-zinc-500">
      <span className="text-lg font-bold text-green-500">
        {'\u0917'}
        {'\u00B7'}λ{'>'}{' '}
      </span>
      {output}
    </pre>
  );
}
