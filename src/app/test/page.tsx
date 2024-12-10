'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
	useEffect(() => {
		const images = document.querySelectorAll('.slider-image')
		let currentIndex = 0

		function changeImage() {
			currentIndex = (currentIndex + 1) % images.length
		}

		const interval = setInterval(changeImage, 5000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div
			className={`flex min-h-screen items-center justify-center bg-gray-100 p-4 ${styles.container}`}
		>
			<div
				className={`${styles.hero} relative z-10 mx-auto my-8 flex w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-gradient-to-r from-red-100/20 via-blue-100/20 to-green-100/20 backdrop-blur-md lg:flex-row`}
			>
				<div
					className={`${styles.heroContent} relative z-20 flex flex-1 flex-col justify-center p-12`}
				>
					<h1
						className={`${styles.heroTitle} mb-4 text-5xl font-bold leading-tight text-black lg:text-6xl`}
					>
						Your Journey, You Deserve the Best
					</h1>
					<p className="mb-8 text-lg font-light leading-relaxed text-gray-700">
						Experience the journey of a lifetime with our expert travel
						planning. We curate unforgettable adventures tailored just for you,
						ensuring every moment is filled with luxury, excitement, and
						unparalleled comfort. Book with us and unlock exclusive perks,
						insider access, and stress-free travel that will exceed your wildest
						dreams.
					</p>
					<a
						href="#"
						className="self-start rounded-full bg-black/80 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:transform hover:bg-black"
					>
						Read more
					</a>
					<div
						className={`${styles.stats} mt-12 flex justify-between space-x-4`}
					>
						<div className="rounded-2xl bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:transform">
							<div className="text-3xl font-bold text-black">Best</div>
							<div className="mt-2 text-sm text-gray-700">Prices Provided</div>
						</div>
						<div className="rounded-2xl bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:transform">
							<div className="text-3xl font-bold text-black">Pro</div>
							<div className="mt-2 text-sm text-gray-700">No Hidden Fees</div>
						</div>
						<div className="rounded-2xl bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:transform">
							<div className="text-3xl font-bold text-black">5-Star</div>
							<div className="mt-2 text-sm text-gray-700">Service Quality</div>
						</div>
					</div>
				</div>
				<div
					className={`${styles.imageGrid} relative z-20 grid flex-1 grid-cols-2 gap-4 p-4`}
				>
					<div className="aspect-square relative overflow-hidden rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:transform">
						<Image
							src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800"
							alt="Airplane flying over clouds"
							layout="fill"
							objectFit="cover"
							className="slider-image"
						/>
					</div>
					<div className="aspect-square relative overflow-hidden rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:transform">
						<Image
							src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800"
							alt="Person with luggage in airport"
							layout="fill"
							objectFit="cover"
							className="slider-image"
						/>
					</div>
					<div className="aspect-square relative overflow-hidden rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:transform">
						<Image
							src="https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=800"
							alt="Scenic mountain landscape"
							layout="fill"
							objectFit="cover"
							className="slider-image"
						/>
					</div>
					<div className="aspect-square relative overflow-hidden rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:transform">
						<Image
							src="https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=800"
							alt="Beach resort"
							layout="fill"
							objectFit="cover"
							className="slider-image"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
