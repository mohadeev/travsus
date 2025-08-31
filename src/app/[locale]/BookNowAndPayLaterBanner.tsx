import { Button } from '@/components/ui/button'

export default function TravelBanner() {
	return (
		<section className="relative w-full overflow-hidden border-b border-t border-red-400 bg-gradient-to-br from-pink-500 via-red-500 to-red-600">
			<div className="absolute inset-0">
				<div
					className="absolute right-0 top-0 -translate-y-20 translate-x-20 transform rounded-full"
					style={{
						backgroundColor: '#016450',
						width: '3200px',
						height: '3200px',
					}}
				></div>
				<div
					className="absolute right-1/4 top-0 h-96 w-96 -translate-y-48 translate-x-16 transform rounded-full"
					style={{ backgroundColor: '#f573a1' }}
				></div>
			</div>

			<div className="relative z-10 px-8 py-16 pt-8 md:py-20">
				<div className="max-w-2xl">
					<div className="mb-6 inline-block rounded-lg bg-white px-6 py-3">
						<span className="text-lg font-bold italic text-black">
							2024 Travel
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
							className="rounded-full bg-black px-12 py-6 text-lg font-bold text-white"
						>
							RESERVE NOW
						</Button>
					</div>

					<p className="text-sm text-white/70">
						Offer subject to terms. no deposit required.
					</p>
				</div>
			</div>
		</section>
	)
}
