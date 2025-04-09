import type React from 'react'

const ExperiencesDescriptionSkeleton: React.FC = (props: any) => {
	const { className } = props
	return (
		<div className={className}>
			<div className="space-y-8">
				<div className="h-8 w-64 animate-pulse rounded-md bg-gray-200" />
				<div className="space-y-4">
					{[...Array(4)].map((_, index) => (
						<div key={index} className="space-y-2">
							<div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
							<div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-200" />
							<div className="h-4 w-4/6 animate-pulse rounded-md bg-gray-200" />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ExperiencesDescriptionSkeleton
