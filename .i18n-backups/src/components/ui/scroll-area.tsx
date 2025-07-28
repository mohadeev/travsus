interface ScrollAreaProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export function ScrollArea({ children, className }: ScrollAreaProps) {
    return (
      <div className={`overflow-y-auto scrollbar-thin scrollbar-thumb-primary ${className}`}>
        {children}
      </div>
    );
  }
  