export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import gradientNoisePurpleAzure from '@/images/6580a563d237ee85c9237ccb_gradient-noise-purple-azure.png'
import noiseLight from '@/images/65809a10c85f59a63201a8a5_noise-light.png'
import { useTranslations } from '@/lib/i18n'

export default function Page() {
	const t = useTranslations('rights_zz_page')
	const handlePageChange = () => {
		// Add your page change logic here
		console.log('Plan My Trip button clicked')
	}

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
			<div className="relative flex h-[400px] w-[600px] items-center justify-center">
				<div className="absolute inset-0 -left-1/4 -top-1/3 h-[150%] w-[150%] blur-xl">
					<Image
						src={gradientNoisePurpleAzure}
						alt="Gradient background"
						layout="fill"
						objectFit="cover"
						quality={100}
						priority
					/>
				</div>
				<div className="absolute inset-0 left-1/4 top-1/4 h-1/2 w-1/2 opacity-50">
					<Image
						src={noiseLight}
						alt="Noise overlay"
						layout="fill"
						objectFit="cover"
						quality={100}
					/>
				</div>

				<div className="relative z-10 flex max-w-[600px] flex-col items-center justify-center p-4 text-center">
					<h2 className="mx-auto max-w-4xl text-2xl font-extrabold leading-tight text-[#0D0D0D] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
						{t('rights_zz_page_Your_Journey')}, <br />
						<span className="text-4xl font-extrabold tracking-tight text-[#0D0D0D] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
							{t('rights_zz_page_You')}
						</span>{' '}
						<br />
						{t('rights_zz_page_Deserve_The_Best')}
					</h2>
					<Button
						onClick={handlePageChange}
						className="mt-6 max-w-[180px] rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-black/90 sm:px-6 sm:py-2 sm:text-base"
					>
						{t('rights_zz_page_Plan_My_Trip')}
					</Button>
				</div>
			</div>
		</div>
	)
}
