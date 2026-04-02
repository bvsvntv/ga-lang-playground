type ConsoleProps = {
  output: string;
};

export function Console({ output }: ConsoleProps) {
  return (
    <pre className="mt-0.5 w-full resize-none rounded-b border border-zinc-400 bg-zinc-200 p-2 text-zinc-500">
      <span className="font-bold text-green-500">
        {'\u0917'}
        {'\u00B7'}λ{'>'}{' '}
      </span>
      {output}
    </pre>
  );
}
