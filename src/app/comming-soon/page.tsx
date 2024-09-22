'use client'

import { useState, useEffect } from 'react'

type TimeLeft = {
	days?: number
	hours?: number
	minutes?: number
	seconds?: number
}

export default function Home() {
	const calculateTimeLeft = (): TimeLeft => {
		const difference = +new Date('2025-01-01') - +new Date()
		let timeLeft: TimeLeft = {}

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			}
		}

		return timeLeft
	}

	const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft())
		}, 1000)

		return () => clearTimeout(timer)
	}, [timeLeft])

	const timerComponents = Object.keys(timeLeft).map((interval) => {
		const key = interval as keyof TimeLeft // Type assertion to avoid TypeScript errors

		if (!timeLeft[key]) {
			return null
		}

		return (
			<span key={interval} className="mx-2 text-4xl font-bold">
				{timeLeft[key]} {interval}{' '}
			</span>
		)
	})

	useEffect(() => {
		const audio = new Audio('/background.mp3')
		audio.play()
		audio.loop = true

		return () => audio.pause()
	}, [])

	return (
		<div className="flex min-h-screen items-center justify-center bg-black text-white">
			<div className="text-center">
				<h1 className="mb-6 animate-pulse text-7xl font-extrabold md:text-9xl">
					Coming Soon
				</h1>
				<div className="text-2xl md:text-4xl">
					{timerComponents.length ? (
						timerComponents
					) : (
						<span>Time&apos;s up!</span>
					)}
				</div>
			</div>
		</div>
	)
}
