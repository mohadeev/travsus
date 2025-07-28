'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AutoColorCardProps {
	className?: string
	showHeart?: boolean
	colorMode?:
		| 'random'
		| 'analogous'
		| 'complementary'
		| 'triadic'
		| 'monochromatic'
}

export default function AutoColorCard({
	className,
	showHeart = true,
	colorMode = 'random',
}: AutoColorCardProps) {
	const [liked, setLiked] = useState(false)
	const [colors, setColors] = useState({
		primary: '#000000',
		secondary: '#000000',
		tertiary: '#000000',
	})

	// Generate a random HSL color
	const randomHSLColor = () => {
		const h = Math.floor(Math.random() * 360)
		const s = Math.floor(Math.random() * 30) + 70 // 70-100% saturation for vibrant colors
		const l = Math.floor(Math.random() * 30) + 35 // 35-65% lightness for good contrast
		return { h, s, l }
	}

	// Convert HSL to hex
	const hslToHex = (h: number, s: number, l: number) => {
		l /= 100
		const a = (s * Math.min(l, 1 - l)) / 100
		const f = (n: number) => {
			const k = (n + h / 30) % 12
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0')
		}
		return `#${f(0)}${f(8)}${f(4)}`
	}

	// Generate color schemes
	const generateColors = () => {
		switch (colorMode) {
			case 'analogous': {
				// Analogous colors - colors that are adjacent to each other on the color wheel
				const baseColor = randomHSLColor()
				const primary = hslToHex(baseColor.h, baseColor.s, baseColor.l)
				const secondary = hslToHex(
					(baseColor.h + 30) % 360,
					baseColor.s,
					baseColor.l,
				)
				const tertiary = hslToHex(
					(baseColor.h + 60) % 360,
					baseColor.s,
					baseColor.l,
				)
				return { primary, secondary, tertiary }
			}
			case 'complementary': {
				// Complementary colors - colors that are opposite each other on the color wheel
				const baseColor = randomHSLColor()
				const primary = hslToHex(baseColor.h, baseColor.s, baseColor.l)
				const secondary = hslToHex(
					(baseColor.h + 180) % 360,
					baseColor.s,
					baseColor.l,
				)
				const tertiary = hslToHex(
					(baseColor.h + 90) % 360,
					baseColor.s,
					baseColor.l,
				)
				return { primary, secondary, tertiary }
			}
			case 'triadic': {
				// Triadic colors - three colors equally spaced on the color wheel
				const baseColor = randomHSLColor()
				const primary = hslToHex(baseColor.h, baseColor.s, baseColor.l)
				const secondary = hslToHex(
					(baseColor.h + 120) % 360,
					baseColor.s,
					baseColor.l,
				)
				const tertiary = hslToHex(
					(baseColor.h + 240) % 360,
					baseColor.s,
					baseColor.l,
				)
				return { primary, secondary, tertiary }
			}
			case 'monochromatic': {
				// Monochromatic colors - variations of a single color
				const baseColor = randomHSLColor()
				const primary = hslToHex(baseColor.h, baseColor.s, baseColor.l)
				const secondary = hslToHex(baseColor.h, baseColor.s, baseColor.l - 20)
				const tertiary = hslToHex(
					baseColor.h,
					baseColor.s - 20,
					baseColor.l + 20,
				)
				return { primary, secondary, tertiary }
			}
			case 'random':
			default: {
				// Completely random colors
				const primary = hslToHex(
					Math.floor(Math.random() * 360),
					Math.floor(Math.random() * 30) + 70,
					Math.floor(Math.random() * 30) + 35,
				)
				const secondary = hslToHex(
					Math.floor(Math.random() * 360),
					Math.floor(Math.random() * 30) + 70,
					Math.floor(Math.random() * 30) + 35,
				)
				const tertiary = hslToHex(
					Math.floor(Math.random() * 360),
					Math.floor(Math.random() * 30) + 70,
					Math.floor(Math.random() * 30) + 35,
				)
				return { primary, secondary, tertiary }
			}
		}
	}

	// Generate colors on mount
	useEffect(() => {
		setColors(generateColors())
	}, [colorMode])

	return (
		<Card
			className={cn(
				'relative h-full w-full overflow-hidden rounded-xl',
				className,
			)}
		>
			{/* Background */}
			<div className="absolute inset-0 bg-gray-50"></div>

			{/* Top left wave */}
			<div className="absolute left-0 top-0 h-1/3 w-1/3">
				<svg
					className="absolute h-full w-full"
					preserveAspectRatio="none"
					viewBox="0 0 100 100"
					fill={colors.tertiary}
				>
					<path d="M0,0 L100,0 C80,20 60,10 40,30 C20,50 0,30 0,50 Z" />
				</svg>
			</div>

			{/* Right wavy shape */}
			<div className="absolute bottom-0 right-0 top-0 w-1/3">
				<svg
					className="absolute h-full w-full"
					preserveAspectRatio="none"
					viewBox="0 0 100 100"
					fill={colors.primary}
				>
					<path d="M30,0 C10,20 35,40 15,60 C-5,80 20,100 20,100 L100,100 L100,0 Z" />
				</svg>
			</div>

			{/* Left circular shape */}
			<div
				className="absolute -bottom-1/4 -left-1/4 h-1/2 w-1/2 rounded-full"
				style={{ backgroundColor: colors.secondary }}
			></div>

			{/* Heart button */}
			{showHeart && (
				<div className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
					<Heart
						className={cn(
							'h-5 w-5 cursor-pointer transition-colors',
							liked ? 'fill-red-500 text-red-500' : 'text-gray-400',
						)}
						onClick={() => setLiked(!liked)}
					/>
				</div>
			)}

			{/* Refresh button */}
			{/* <button
				className="absolute bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50"
				onClick={() => setColors(generateColors())}
				aria-label="Generate new colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
					<path d="M21 3v5h-5" />
					<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
					<path d="M3 21v-5h5" />
				</svg>
			</button> */}
		</Card>
	)
}
