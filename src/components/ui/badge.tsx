interface BadgeProps {
    className?: string;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
  }
  
  export function Badge({ className, children, variant = "primary" }: BadgeProps) {
    const baseStyles = "px-2 py-1 rounded-full text-xs font-semibold";
    const variantStyles = variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800";
    
    return <span className={`${baseStyles} ${variantStyles} ${className}`}>{children}</span>;
  }
  