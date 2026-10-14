// Field label in the site style.
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
	<label ref={ref} className={cn('mb-1.5 block text-sm font-medium text-neutral-950 dark:text-white', className)} {...props} />
))
Label.displayName = 'Label'
