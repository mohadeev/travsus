import { Button } from '@/components/ui/button'

export default function TravelBanner() {
	return (
		<section className="relative w-full overflow-hidden border-b border-t border-red-400 bg-gradient-to-br from-pink-500 via-red-500 to-red-600">
			<div className="absolute inset-0">
				<div className="absolute right-0 top-0 h-96 w-96 -translate-y-32 translate-x-32 transform rounded-full bg-red-400/30"></div>
				<div className="absolute bottom-0 right-1/4 h-64 w-64 translate-y-16 transform rounded-full bg-green-500"></div>
				<div className="absolute right-0 top-1/2 h-32 w-32 translate-x-8 transform rounded-full bg-white/20"></div>
				<svg
					className="absolute inset-0 h-full w-full"
					viewBox="0 0 800 400"
					fill="none"
				>
					<path
						d="M600 0C650 50 700 100 750 200C700 300 650 350 600 400H800V0H600Z"
						fill="url(#gradient1)"
					/>
					<path
						d="M400 400C450 350 500 300 550 200C500 100 450 50 400 0H0V400H400Z"
						fill="url(#gradient2)"
					/>
					<defs>
						<linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
							<stop offset="100%" stopColor="rgba(220, 38, 127, 0.2)" />
						</linearGradient>
						<linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="rgba(236, 72, 153, 0.2)" />
							<stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
						</linearGradient>
					</defs>
				</svg>
			</div>

			<div className="relative z-10 px-8 py-16 pt-8 md:py-20">
				<div className="max-w-2xl">
					<div className="mb-6 inline-block rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
						<span className="text-sm font-medium text-white">2024 Travel</span>
					</div>

					<h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
						Don't Wait. Book Now, Pay Later.
					</h1>

					<p className="mb-8 text-xl leading-relaxed text-white/90 md:text-2xl">
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
