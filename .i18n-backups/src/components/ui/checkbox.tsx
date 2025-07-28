import React, { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StyledCheckboxProps {
	label: string
	id: string
	onChange?: (checked: boolean) => void
	checked: boolean
}

export default function StyledCheckbox({
	label,
	id,
	onChange,
	checked,
}: StyledCheckboxProps) {
	const [isChecked, setIsChecked] = useState(checked)

	const handleChange = () => {
		const newCheckedState = !isChecked
		setIsChecked(newCheckedState)
		if (onChange) {
			onChange(newCheckedState)
		}
	}

	return (
		<div className="flex items-center">
			<div className="relative flex items-center">
				<input
					type="checkbox"
					id={id}
					checked={isChecked}
					onChange={handleChange}
					className="peer sr-only"
				/>
				<div
					onClick={handleChange}
					className="h-6 w-6 cursor-pointer rounded-md border-2 border-gray-300 transition-all duration-200 ease-in-out peer-checked:border-blue-500 peer-checked:bg-blue-500"
				>
					<svg
						className={`absolute left-1 top-1 h-4 w-4 text-white transition-opacity duration-200 ease-in-out ${
							isChecked ? 'opacity-100' : 'opacity-0'
						}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M5 13l4 4L19 7"
						></path>
					</svg>
				</div>
				<label
					htmlFor={id}
					className="ml-2 cursor-pointer select-none text-sm font-medium text-gray-700"
				>
					{label}
				</label>
			</div>
		</div>
	)
}

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer h-6 w-6 shrink-0 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500',
			className,
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn('flex items-center justify-center text-white')}
		>
			<svg
				className="h-4 w-4 transition-opacity duration-200 ease-in-out"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M5 13l4 4L19 7"
				></path>
			</svg>
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
