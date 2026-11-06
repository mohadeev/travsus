'use client'
// Shown when a tour page fails to load (e.g. the database can't be reached).
// The response is a 500, so neither the page cache nor the edge cache keeps
// this in place of the tour (see [listingExperiencesDetail]/page.tsx).

export default function TourError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div className="ListingDetailPage">
			<div className="ListingDetailPage__content mx-auto max-w-7xl px-6 py-24 text-center">
				<h2 className="text-2xl font-bold">Something went wrong</h2>
				<p className="mt-2 text-neutral-500">Please try again later.</p>
				<button
					type="button"
					onClick={reset}
					className="mt-6 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
				>
					Try again
				</button>
			</div>
		</div>
	)
}
