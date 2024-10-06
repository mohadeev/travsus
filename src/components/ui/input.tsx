interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
  }
  
  export function Input({ className, ...props }: InputProps) {
    return (
      <input
        className={`border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-primary ${className}`}
        {...props}
      />
    );
  }
  