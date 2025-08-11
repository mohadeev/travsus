'use client'

import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'

export default function TravelBanner() {
	const t = useTranslations('Jan03_TravelBanner_q5w7')
	return (
		<div className="p-4">
			{/* Travel Services Banner */}
			<div className="mx-auto w-full max-w-6xl">
				<div className="flex min-h-[400px] flex-col items-center gap-8 lg:flex-row-reverse lg:gap-12">
					{/* Content Section - 50% */}
					<div className="order-1 w-full p-4 text-center lg:order-none lg:w-1/2 lg:text-left">
						<h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-black md:text-6xl lg:text-7xl xl:text-[100px]">
							{t('Ready_To_Go')}
						</h1>
						<p className="mb-8 text-lg font-light leading-relaxed text-gray-600 md:text-xl">
							{t('Banner_Description')}
						</p>

						{/* Desktop Buttons */}
						<div className="hidden flex-col justify-center gap-4 sm:flex-row lg:flex lg:justify-start">
							<button className="rounded-full bg-black px-8 py-3 text-lg font-semibold text-white hover:bg-gray-800">
								{t('Plan_Trip')}
							</button>
							<button className="rounded-full border-2 border-black bg-white px-8 py-3 text-lg font-semibold text-black hover:bg-gray-50">
								{t('View_Destinations')}
							</button>
						</div>
					</div>

					{/* Image Section - 50% */}
					<div className="order-2 w-full p-4 lg:order-none lg:w-1/2">
						<Image
							src="/images/travel-illustration.png"
							alt={t('Travel_Services_Alt')}
							width={400}
							height={400}
							className="aspect-square mx-auto w-full rounded-2xl object-cover lg:max-w-[450px]"
						/>
					</div>

					{/* Mobile Buttons */}
					<div className="order-3 w-full p-4 lg:hidden">
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<button className="rounded-full bg-black px-8 py-3 text-lg font-semibold text-white hover:bg-gray-800">
								{t('Plan_Trip')}
							</button>
							<button className="rounded-full border-2 border-black bg-white px-8 py-3 text-lg font-semibold text-black hover:bg-gray-50">
								{t('View_Destinations')}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
