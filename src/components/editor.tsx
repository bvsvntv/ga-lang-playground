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
      className="text-zinc mt-0.5 w-full rounded-b border border-zinc-400 p-2 focus:outline-none"
    />
  );
}
