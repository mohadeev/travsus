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
			<h2 className="text-3xl font-bold">{heading}</h2>
			{subHeading && <p className="mt-2 text-black">{subHeading}</p>}
		</div>
	)
}

export default Heading2
