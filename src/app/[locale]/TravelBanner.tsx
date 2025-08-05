import Image from 'next/image'

export default function TravelBanner() {
	return (
		<div className="p-4">
			{/* Travel Services Banner */}
			<div className="mx-auto w-full max-w-6xl">
				<div className="flex min-h-[400px] flex-col items-center gap-8 lg:flex-row-reverse lg:gap-12">
					{/* Image Section - 50% */}
					<div className="order-3 w-full p-4 lg:order-none lg:w-1/2">
						<Image
							src="/images/travel-illustration.png"
							alt="Travel and transportation services"
							width={400}
							height={400}
							className="aspect-square mx-auto w-full max-w-[400px] rounded-2xl object-cover"
						/>
					</div>
					{/* Content Section - 50% */}
					<div className="order-1 w-full p-4 text-center lg:order-none lg:w-1/2 lg:text-left">
						<h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-black md:text-4xl lg:text-5xl xl:text-6xl">
							Tu viaje perfecto te está esperando
						</h1>
						<p className="mb-8 text-lg font-light leading-relaxed text-gray-600 md:text-xl">
							Desde vuelos hasta traslados, organizamos cada detalle de tu
							experiencia de viaje para que solo te preocupes por disfrutar.
						</p>
						{/* Desktop Buttons */}
						<div className="hidden flex-col justify-center gap-4 sm:flex-row lg:flex lg:justify-start">
							<button className="rounded-full bg-black px-8 py-3 text-lg font-semibold text-white hover:bg-gray-800">
								Planificar Viaje
							</button>
							<button className="rounded-full border-2 border-black bg-white px-8 py-3 text-lg font-semibold text-black hover:bg-gray-50">
								Ver Destinos
							</button>
						</div>
					</div>
					{/* Mobile Buttons */}
					<div className="order-2 w-full p-4 lg:hidden">
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<button className="rounded-full bg-black px-8 py-3 text-lg font-semibold text-white hover:bg-gray-800">
								Planificar Viaje
							</button>
							<button className="rounded-full border-2 border-black bg-white px-8 py-3 text-lg font-semibold text-black hover:bg-gray-50">
								Ver Destinos
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
