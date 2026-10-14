// Multi-line text in the site style (same look as Input).
import * as React from 'react'
import { cn } from '@/lib/utils'
import { inputClass } from './input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, rows = 4, ...props }, ref) => (
	<textarea ref={ref} rows={rows} className={cn(inputClass, 'min-h-[96px] resize-y py-3 leading-relaxed', className)} {...props} />
))
Textarea.displayName = 'Textarea'
export default Textarea
