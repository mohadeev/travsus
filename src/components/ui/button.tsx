// import { cn } from "@/lib/utils"; // Optional if you're using a utility function for conditional classes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={`bg-black text-white font-semibold py-3 px-4 rounded-[40px] w-full flex items-center justify-center shadow-lg transition duration-200 hover:bg-gray-800 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
