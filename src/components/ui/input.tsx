// Text input in the site style: soft grey, black focus ring.
import * as React from 'react'
import { cn } from '@/lib/utils'

export const inputClass =
	'w-full rounded-2xl border-0 bg-neutral-100 px-4 text-base ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-900 dark:focus:bg-neutral-950 dark:focus:ring-white'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type = 'text', ...props }, ref) => (
	<input ref={ref} type={type} className={cn(inputClass, 'h-12', className)} {...props} />
))
Input.displayName = 'Input'
