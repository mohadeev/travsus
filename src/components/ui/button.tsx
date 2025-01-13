// import { cn } from "@/lib/utils"; // Optional if you're using a utility function for conditional classes

import Spinner from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string
	loading?: boolean
}

export function Button({
	className,
	loading,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={`flex items-center justify-center rounded-[40px] bg-black px-4 py-3 font-semibold text-white shadow-lg transition duration-200 hover:bg-gray-800 focus:outline-none ${className}`}
			{...props}
		>
			{loading ? <Spinner color="#fff" /> : children}
		</button>
	)
}
