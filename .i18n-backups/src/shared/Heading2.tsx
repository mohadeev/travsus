import type React from 'react'
import type { ReactNode } from 'react'

export interface Heading2Props {
	heading?: ReactNode
	subHeading?: ReactNode
	className?: string
}

const Heading2: React.FC<Heading2Props> = ({
	className = '',
	heading = '',
	subHeading,
}) => {
	return (
		<div className={`mb-5 ${className}`}>
			<h2 className="text-xl font-bold md:text-2xl lg:text-3xl">{heading}</h2>
			{subHeading && (
				<p className="mt-2 text-sm text-black md:text-base">{subHeading}</p>
			)}
		</div>
	)
}

export default Heading2
