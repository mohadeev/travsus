'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
	start?: number
	end: number
	duration?: number
	delay?: number
	decimals?: number
	prefix?: string
	suffix?: string
	enableScrollSpy?: boolean
	scrollSpyOnce?: boolean
}

export function CountUp({
	start = 0,
	end,
	duration = 2,
	delay = 0,
	decimals = 0,
	prefix = '',
	suffix = '',
	enableScrollSpy = false,
	scrollSpyOnce = false,
}: CountUpProps) {
	const [count, setCount] = useState(start)
	const [hasAnimated, setHasAnimated] = useState(false)
	const countRef = useRef(null)
	const isInView = useInView(countRef, { once: scrollSpyOnce, amount: 0.5 })

	useEffect(() => {
		let startTimestamp: number | null = null
		let animationFrameId: number

		const shouldAnimate = enableScrollSpy
			? isInView && (!scrollSpyOnce || !hasAnimated)
			: true

		if (shouldAnimate) {
			const step = (timestamp: number) => {
				if (!startTimestamp) startTimestamp = timestamp
				const progress = Math.min(
					(timestamp - startTimestamp) / (duration * 1000),
					1,
				)

				setCount(start + progress * (end - start))

				if (progress < 1) {
					animationFrameId = window.requestAnimationFrame(step)
				} else {
					setHasAnimated(true)
				}
			}

			const timeoutId = setTimeout(() => {
				animationFrameId = window.requestAnimationFrame(step)
			}, delay * 1000)

			return () => {
				clearTimeout(timeoutId)
				window.cancelAnimationFrame(animationFrameId)
			}
		}
	}, [
		start,
		end,
		duration,
		delay,
		enableScrollSpy,
		isInView,
		scrollSpyOnce,
		hasAnimated,
	])

	const formattedCount = prefix + count.toFixed(decimals) + suffix

	return <span ref={countRef}>{formattedCount}</span>
}
