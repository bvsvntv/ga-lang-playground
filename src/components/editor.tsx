type EditorProps = {
  content: string;
  onChange: (content: string) => void;
};

export function Editor({ content, onChange }: EditorProps) {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      rows={28}
      value={content}
      defaultValue={content}
      onChange={handleInput}
      className="focus:border-1 text-zinc w-full rounded border border-zinc-400 p-2 focus:border-zinc-500 focus:outline-none"
    />
  );
}
