// import { cn } from "@/lib/utils"; // Optional if you're using a utility function for conditional classes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
