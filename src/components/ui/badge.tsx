// Small status pill.
import * as React from 'react'
import { cn } from '@/lib/utils'

const VARIANTS: Record<string, string> = {
	default: 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950',
	primary: 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950',
	secondary: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300',
	outline: 'ring-1 ring-inset ring-neutral-300 text-neutral-700 dark:ring-neutral-700 dark:text-neutral-300',
	success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
	warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
	destructive: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: string }) {
	return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', VARIANTS[variant] ?? VARIANTS.default, className)} {...props} />
}
