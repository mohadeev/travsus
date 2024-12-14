'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
	useEffect(() => {
		const images = document.querySelectorAll(`.${styles.sliderImage}`)
		let currentIndex = 0

		function changeImage() {
			currentIndex = (currentIndex + 1) % images.length
		}

		const interval = setInterval(changeImage, 5000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className={styles.container}>
			<div className={styles.hero}>
				<div className={styles.heroContent}>
					<h1 className={styles.heroTitle}>
						Your Journey, You Deserve the Best
					</h1>
					<p className={styles.heroDescription}>
						Experience the journey of a lifetime with our expert travel
						planning. We curate unforgettable adventures tailored just for you,
						ensuring every moment is filled with luxury, excitement, and
						unparalleled comfort. Book with us and unlock exclusive perks,
						insider access, and stress-free travel that will exceed your wildest
						dreams.
					</p>
					<a href="#" className={styles.ctaButton}>
						Read more
					</a>
					<div className={styles.stats}>
						<div className={styles.statItem}>
							<div className={styles.statNumber}>Best</div>
							<div className={styles.statLabel}>Prices Provided</div>
						</div>
						<div className={styles.statItem}>
							<div className={styles.statNumber}>Pro</div>
							<div className={styles.statLabel}>No Hidden Fees</div>
						</div>
						<div className={styles.statItem}>
							<div className={styles.statNumber}>5-Star</div>
							<div className={styles.statLabel}>Service Quality</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
