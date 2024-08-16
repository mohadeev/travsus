import React, { InputHTMLAttributes } from 'react'
import ReactPhoneInput from './ReactPhoneInput'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	sizeClass?: string
	fontClass?: string
	rounded?: string
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className = '',
			sizeClass = 'h-11 px-4 py-3',
			fontClass = 'text-sm font-normal',
			rounded = 'rounded-2xl',
			children,
			type,
			...args
		},
		ref,
	) => {
		const inputType = typeof type === 'undefined' ? 'text' : type

		return (
			<>
				{inputType === 'phone' ? (
					<>
						<ReactPhoneInput
							ref={ref}
							className={`block w-full border-neutral-200 bg-white focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 ${rounded} ${fontClass} ${sizeClass} ${className}`}
							{...args}
						/>
					</>
				) : (
					<input
						ref={ref}
						type={inputType}
						className={`block w-full border-neutral-200 bg-white focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 ${rounded} ${fontClass} ${sizeClass} ${className}`}
						{...args}
					/>
				)}
			</>
		)
	},
)

export default Input
