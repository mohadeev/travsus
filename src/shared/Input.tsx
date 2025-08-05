"use client"

import React, { InputHTMLAttributes, useState } from 'react'
import ReactPhoneInput from './ReactPhoneInput'
import Label from '@/components/Label'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

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
		const t = useTranslations("shared_Input");
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
									className={t('shared_Input_Toggle_Button_Classes')}
								>
									{showPassword ? (
										<EyeOff className={t('shared_Input_Icon_Classes')} />
									) : (
										<Eye className={t('shared_Input_Icon_Classes')} />
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