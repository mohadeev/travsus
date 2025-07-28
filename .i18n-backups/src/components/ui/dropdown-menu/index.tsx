'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<{
	open: boolean
	onOpenChange: (open: boolean) => void
}>({
	open: false,
	onOpenChange: () => {},
})

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
	(
		{ className, children, open: controlledOpen, onOpenChange, ...props },
		ref,
	) => {
		const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
		const isControlled = controlledOpen !== undefined
		const menuRef = useRef<HTMLDivElement>(null)

		const open = isControlled ? controlledOpen : uncontrolledOpen
		const setOpen = React.useCallback(
			(newOpen: boolean) => {
				if (isControlled) {
					onOpenChange?.(newOpen)
				} else {
					setUncontrolledOpen(newOpen)
				}
			},
			[isControlled, onOpenChange],
		)

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					menuRef.current &&
					!menuRef.current.contains(event.target as Node)
				) {
					setOpen(false)
				}
			}

			document.addEventListener('mousedown', handleClickOutside)
			return () => {
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}, [setOpen])

		return (
			<DropdownMenuContext.Provider value={{ open, onOpenChange: setOpen }}>
				<div
					ref={menuRef}
					className={cn('relative inline-block', className)}
					{...props}
				>
					{children}
				</div>
			</DropdownMenuContext.Provider>
		)
	},
)
DropdownMenu.displayName = 'DropdownMenu'

const DropdownMenuTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
	const { open, onOpenChange } = React.useContext(DropdownMenuContext)

	return (
		<button
			ref={ref}
			className={cn(
				'focus:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				'cursor-pointer', // Add this line
				className,
			)}
			onClick={() => onOpenChange(!open)}
			aria-expanded={open}
			{...props}
		/>
	)
})
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

const DropdownMenuContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { open } = React.useContext(DropdownMenuContext)

	if (!open) return null

	return (
		<div
			ref={ref}
			className={cn(
				'bg-popover text-popover-foreground animate-in fade-in-80 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md',
				'absolute right-0 top-full mt-2',
				className,
			)}
			{...props}
		/>
	)
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			inset && 'pl-8',
			className,
		)}
		{...props}
	/>
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuSeparator = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('bg-muted -mx-1 my-1 h-px', className)}
		{...props}
	/>
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
}
