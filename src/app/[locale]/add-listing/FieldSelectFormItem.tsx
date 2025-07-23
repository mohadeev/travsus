import Label from '@/components/Label'
import Select from '@/shared/Select'
import React, { FC } from 'react'
import { Field, FieldRenderProps } from 'react-final-form'

export interface FormItemProps {
	className?: string
	label?: string
	desc?: string
	children?: React.ReactNode
	name?: string
	placeholder?: string
	id?: string
	options?: { label: string; value: string }[] // Array of options for select dropdown
	[key: string]: any // Additional props like event handlers
}

const FieldSelectFormItem: FC<FormItemProps> = ({
	children,
	className = '',
	label,
	desc,
	name = '',
	id,
	placeholder,
	options = [], // Default options array
	...props
}) => {
	return (
		<div className={className}>
			{label && <Label>{label}</Label>}
			<div className="mt-0">
				<Field name={name}>
					{({ input, meta }: FieldRenderProps<string>) => (
						<>
							<Select
								{...input}
								{...props} // Pass all additional props to select
								id={id || name} // Use passed id or fallback to name
								placeholder={placeholder} // Allow placeholder to be overridden
								className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
							>
								<option value="" disabled>
									{placeholder || 'Select an option'}
								</option>
								{options.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</Select>
							{meta.touched && meta.error && (
								<span className="text-red-500">{meta.error}</span>
							)}
						</>
					)}
				</Field>
			</div>
			{desc && (
				<span className="mt-3 block text-xs text-neutral-500 dark:text-neutral-400">
					{desc}
				</span>
			)}
		</div>
	)
}

export default FieldSelectFormItem
