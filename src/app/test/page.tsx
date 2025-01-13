'use client'

import { Plane, Calendar, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomeBanner() {
	const handlePageChange = () => {
		const experiencesContainer = document.getElementById(
			'experiences_container',
		)
		if (experiencesContainer) {
			experiencesContainer.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	return (
		<div className="flex min-h-[70vh] items-center justify-center bg-white py-12">
			<div className="px-4 text-center sm:px-6 lg:px-8">
				<h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
					Travel with Ultimate Flexibility
				</h1>
				<p className="mb-10 text-lg text-gray-700 sm:text-xl md:text-2xl">
					Book, Cancel, Refund - Anytime, Anywhere
				</p>
				<div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
					<FeatureItem
						icon={<Plane className="h-8 w-8" />}
						text="Book Easily"
					/>
					<FeatureItem
						icon={<Calendar className="h-8 w-8" />}
						text="Cancel Anytime"
					/>
					<FeatureItem
						icon={<RefreshCcw className="h-8 w-8" />}
						text="Full Refunds"
					/>
				</div>
				<div className="flex justify-center">
					<Button
						size="lg"
						className="rounded-[20px] bg-black text-white hover:bg-gray-800"
						onClick={handlePageChange}
					>
						Plan Your Flexible Trip
					</Button>
				</div>
			</div>
		</div>
	)
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
	return (
		<div className="flex flex-col items-center gap-2">
			<div className="text-black">{icon}</div>
			<span className="text-lg text-gray-800">{text}</span>
		</div>
	)
}

// 'use client'

// import Image from 'next/image'
// import { useEffect } from 'react'
// import styles from './page.module.css'

// export default function Home() {
// 	useEffect(() => {
// 		const images = document.querySelectorAll(`.${styles.sliderImage}`)
// 		let currentIndex = 0

// 		function changeImage() {
// 			currentIndex = (currentIndex + 1) % images.length
// 		}

// 		const interval = setInterval(changeImage, 5000)

// 		return () => clearInterval(interval)
// 	}, [])
// 	const handlePageChange = () => {
// 		const experiencesContainer = document.getElementById(
// 			'experiences_container',
// 		)

// 		if (experiencesContainer) {
// 			experiencesContainer.scrollIntoView({
// 				behavior: 'smooth',
// 				block: 'start',
// 			})
// 		}
// 	}

// 	return (
// 		<div className={styles.container}>
// 			<div className={styles.hero}>
// 				<div className={styles.heroContent}>
// 					<h1 className={styles.heroTitle}>
// 						Your Journey, You Deserve the Best
// 					</h1>
// 					<p className={styles.heroDescription}>
// 						Experience the journey of a lifetime with our expert travel
// 						planning. We curate unforgettable adventures tailored just for you,
// 						ensuring every moment is filled with luxury, excitement, and
// 						unparalleled comfort. Book with us and unlock exclusive perks,
// 						insider access, and stress-free travel that will exceed your wildest
// 						dreams.
// 					</p>
// 					<button onClick={handlePageChange} className={styles.ctaButton}>
// 						Read more
// 					</button>
// 					<div className={styles.stats}>
// 						<div className={styles.statItem}>
// 							<div className={styles.statNumber}>Best</div>
// 							<div className={styles.statLabel}>Prices Provided</div>
// 						</div>
// 						<div className={styles.statItem}>
// 							<div className={styles.statNumber}>Pro</div>
// 							<div className={styles.statLabel}>No Hidden Fees</div>
// 						</div>
// 						<div className={styles.statItem}>
// 							<div className={styles.statNumber}>5-Star</div>
// 							<div className={styles.statLabel}>Service Quality</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }
