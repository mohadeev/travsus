import React, { ButtonHTMLAttributes } from 'react'

export interface ButtonCircleProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	size?: string
}

const ButtonCircle: React.FC<ButtonCircleProps> = ({
	className = ' ',
	size = ' w-9 h-9 ',
	...args
}) => {
	return (
		<button
			className={`ttnc-ButtonCircle flex items-center justify-center rounded-full bg-primary !leading-none text-neutral-50 hover:bg-primary-700 disabled:bg-opacity-70 ${className} ${size} `}
			{...args}
		/>
	)
}

export default ButtonCircle
