'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import { useState } from 'react'

interface ResponsiveCardProps {
	colorScheme?:
		| 'instagram-gradient'
		| 'sunset-vibes'
		| 'ocean-breeze'
		| 'mint-berry'
		| 'coral-dreams'
		| 'random'
	className?: string
	showHeart?: boolean
}

export default function ResponsiveCard({
	colorScheme = 'instagram-gradient',
	className,
	showHeart = true,
}: ResponsiveCardProps) {
	const [liked, setLiked] = useState(false)

	// Define Instagram-inspired color schemes
	const colorSchemes = {
		'instagram-gradient': {
			primary: '#E1306C', // Instagram pink/magenta
			secondary: '#FCAF45', // Instagram yellow/gold
			tertiary: '#833AB4', // Instagram purple
		},
		'sunset-vibes': {
			primary: '#FF5F6D', // Vibrant coral
			secondary: '#FFC371', // Soft peach
			tertiary: '#FFD8CB', // Light peach
		},
		'ocean-breeze': {
			primary: '#2193b0', // Teal blue
			secondary: '#6dd5ed', // Light cyan
			tertiary: '#A6E4E7', // Pale cyan
		},
		'mint-berry': {
			primary: '#00B09B', // Mint green
			secondary: '#E975A8', // Berry pink
			tertiary: '#B5EAD7', // Light mint
		},
		'coral-dreams': {
			primary: '#FF9A8B', // Coral pink
			secondary: '#FF6A88', // Deeper pink
			tertiary: '#FFBBB1', // Light coral
		},
	}

	// If random is selected, pick a random color scheme
	const selectedScheme =
		colorScheme === 'random'
			? colorSchemes[
					Object.keys(colorSchemes)[
						Math.floor(Math.random() * Object.keys(colorSchemes).length)
					] as keyof typeof colorSchemes
				]
			: colorSchemes[colorScheme as keyof typeof colorSchemes]

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
					fill={selectedScheme.tertiary}
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
					fill={selectedScheme.primary}
				>
					<path d="M30,0 C10,20 35,40 15,60 C-5,80 20,100 20,100 L100,100 L100,0 Z" />
				</svg>
			</div>

			{/* Left circular shape */}
			<div
				className="absolute -bottom-1/4 -left-1/4 h-1/2 w-1/2 rounded-full"
				style={{ backgroundColor: selectedScheme.secondary }}
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
		</Card>
	)
}
