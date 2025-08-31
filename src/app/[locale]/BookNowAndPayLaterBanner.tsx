import { Button } from '@/components/ui/button'

export default function TravelBanner() {
	const currentYear = new Date().getFullYear()

	return (
		<section
			className="relative w-full overflow-hidden border-b border-t border-gray-300 bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: 'url("/images/freepik_assistant_1753873160366.png")',
			}}
		>
			<div className="relative z-10 px-8 py-0 pt-0 md:py-8">
				<div className="max-w-2xl">
					<div className="mb-6 inline-block rounded-lg bg-white px-6 py-3">
						<span className="text-lg font-bold italic text-black">
							{currentYear} Travel
						</span>
					</div>

					<h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
						Don't Wait. Book Now, Pay Later.
					</h1>

					<p className="mb-8 text-xl font-bold leading-relaxed text-white/90 md:text-2xl">
						Limited availability on top destinations. Secure your spot today.
					</p>

					<div className="mb-6">
						<Button
							size="lg"
							className="rounded-full bg-black px-12 py-2 text-lg font-bold text-white"
						>
							RESERVE NOW
						</Button>
					</div>

					<p className="text-sm text-white/70">
						Offer subject to terms and conditions. No deposit required. Limited
						time availability. Book now to secure your preferred travel dates
						and destinations.
					</p>
				</div>
			</div>
		</section>
	)
}
