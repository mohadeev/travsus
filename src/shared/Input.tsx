"use client"

import React, { InputHTMLAttributes, useState } from 'react'
import ReactPhoneInput from './ReactPhoneInput'
import Label from '@/components/Label'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	sizeClass?: string
	fontClass?: string
	rounded?: string
	label?: string
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className = '',
			sizeClass = 'h-11 px-4 py-3',
			fontClass = 'text-sm font-normal',
			rounded = 'rounded-md',
			children,
			type,
			label,
			...args
		},
		ref,
	) => {
		const [showPassword, setShowPassword] = useState(false)
		const inputType = typeof type === 'undefined' ? 'text' : type

		const togglePasswordVisibility = () => {
			setShowPassword(!showPassword)
		}

		return (
			<>
				{inputType === 'phone' ? (
					<div>
						<Label>{label}</Label>
						<ReactPhoneInput
							ref={ref}
							className={`dark:focus:ring-primary-6000 block w-full border-neutral-200 bg-white focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-opacity-25 ${rounded} ${fontClass} ${sizeClass} ${className}`}
							{...args}
						/>
					</div>
				) : (
					<div>
						<Label>{label}</Label>
						<div className="relative">
							<input
								ref={ref}
								type={
									inputType === 'password' && showPassword ? 'text' : inputType
								}
								className={`dark:focus:ring-primary-6000 block w-full border-neutral-200 bg-white focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-opacity-25 ${rounded} ${fontClass} ${sizeClass} ${className}`}
								{...args}
							/>
							{inputType === 'password' && (
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							)}
						</div>
					</div>
				)}
			</>
		)
	},
)

export default Input
