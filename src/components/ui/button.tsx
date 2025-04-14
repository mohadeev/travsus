// import { cn } from "@/lib/utils"; // Optional if you're using a utility function for conditional classes

import { cva } from 'class-variance-authority'
import Spinner from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string
	loading?: boolean
}

export function Button({
	className,
	loading,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={`flex items-center justify-center rounded-[40px] bg-black px-4 py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-gray-800 focus:outline-none ${className}`}
			{...props}
		>
			{loading ? <Spinner color="#fff" /> : children}
		</button>
	)
}

export const buttonVariants = cva(
	'inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)
