// Five black stars, filled to the rounded rating, as on the tour cards.
export default function Stars({ rating, size = 'h-4 w-4' }: { rating: number; size?: string }) {
	return (
		<span className="flex gap-0.5" aria-hidden>
			{[0, 1, 2, 3, 4].map((i) => (
				<svg key={i} viewBox="0 0 24 24" className={`${size} ${i < Math.round(rating) ? 'fill-black dark:fill-white' : 'fill-neutral-300 dark:fill-neutral-600'}`}>
					<path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" />
				</svg>
			))}
		</span>
	)
}
