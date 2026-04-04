import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'cursor-pointer rounded p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700',
        className,
      )}
    >
      {children}
    </button>
  );
}
