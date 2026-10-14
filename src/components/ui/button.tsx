// Button in the site style: rounded pill, black by default. Variants and
// sizes work (before, every button rendered the same black pill).
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
	'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-white [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200',
				destructive: 'bg-red-600 text-white hover:bg-red-700',
				outline: 'border border-neutral-300 bg-transparent hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white',
				secondary: 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800',
				ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-900',
				link: 'h-auto px-0 underline underline-offset-4 hover:no-underline',
			},
			size: {
				default: 'h-11 px-5',
				sm: 'h-9 px-4 text-[13px]',
				lg: 'h-12 px-7 text-base',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: { variant: 'default', size: 'default' },
	},
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	loading?: boolean
	asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, loading, asChild, children, disabled, ...props }, ref) => {
	// asChild: style the single child (e.g. a link) as a button
	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<any>
		return React.cloneElement(child, { className: cn(buttonVariants({ variant, size }), className, child.props.className) })
	}
	return (
		<button ref={ref} className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} {...props}>
			{loading && <Loader2 className="animate-spin" />}
			{children}
		</button>
	)
})
Button.displayName = 'Button'
