import React from 'react'
import {
	ExclamationTriangleIcon,
	InformationCircleIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/outline'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
const alertVariants = cva(
	'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
	{
		variants: {
			variant: {
				default: 'bg-background text-foreground',
				destructive:
					'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

interface AlertProps {
	variant?: 'default' | 'destructive' | 'success'
	children: React.ReactNode
}

function Alert({ variant = 'default', children }: AlertProps) {
	const baseClasses = 'p-4 rounded-md flex items-start'
	const variantClasses = {
		default: 'bg-blue-50 text-blue-700',
		destructive: 'bg-red-50 text-red-700',
		success: 'bg-green-50 text-green-700',
	}
	const iconClasses = 'w-5 h-5 mr-3 mt-0.5'

	const Icon = {
		default: InformationCircleIcon,
		destructive: ExclamationTriangleIcon,
		success: CheckCircleIcon,
	}[variant]

	return (
		<div className={`${baseClasses} ${variantClasses[variant]}`} role="alert">
			<Icon className={iconClasses} aria-hidden="true" />
			<div>{children}</div>
		</div>
	)
}

const AlertTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn('mb-1 font-medium leading-none tracking-tight', className)}
		{...props}
	/>
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('text-sm [&_p]:leading-relaxed', className)}
		{...props}
	/>
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
