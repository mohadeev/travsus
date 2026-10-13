// TripAdvisor-style rating: 5 bubbles, partly filled for half points.
export default function RatingBubbles({
	rating,
	size = 12,
	tone = 'mono',
}: {
	rating: number
	size?: number
	/** 'green' = TripAdvisor colour (tour page) */
	tone?: 'mono' | 'green'
}) {
	const border = tone === 'green' ? 'border-[#00AA6C]' : 'border-neutral-900 dark:border-white'
	const fillColor = tone === 'green' ? 'bg-[#00AA6C]' : 'bg-neutral-900 dark:bg-white'
	return (
		<span
			className="inline-flex items-center gap-0.5"
			role="img"
			aria-label={`${rating} / 5`}
		>
			{[0, 1, 2, 3, 4].map((i) => {
				const fill = Math.max(0, Math.min(1, rating - i)) // 0 → 1
				return (
					<span
						key={i}
						className={`relative inline-block overflow-hidden rounded-full border-[1.5px] ${border}`}
						style={{ width: size, height: size }}
					>
						<span
							className={`absolute inset-y-0 left-0 ${fillColor}`}
							style={{ width: `${fill * 100}%` }}
						/>
					</span>
				)
			})}
		</span>
	)
}
