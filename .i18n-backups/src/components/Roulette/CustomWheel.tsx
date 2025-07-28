import React, { useState, useEffect } from 'react'

interface WheelProps {
	mustStartSpinning: boolean
	prizeNumber: number
	data: Array<{ option: string }>
	onStopSpinning: () => void
	backgroundColors: string[]
	textColors: string[]
	fontSize: number
	fontWeight: number
	spinDuration: number
}

const CustomWheel: React.FC<WheelProps> = ({
	mustStartSpinning,
	prizeNumber,
	data,
	onStopSpinning,
	backgroundColors,
	textColors,
	fontSize,
	fontWeight,
	spinDuration,
}) => {
	const [rotation, setRotation] = useState(0)
	const [isSpinning, setIsSpinning] = useState(false)

	const size = 500 // SVG viewBox size
	const center = size / 2
	const radius = size / 2

	useEffect(() => {
		if (mustStartSpinning && !isSpinning) {
			setIsSpinning(true)
			const finalRotation =
				rotation + 360 * 10 + (360 - (prizeNumber / data.length) * 360)
			setRotation(finalRotation)

			setTimeout(() => {
				setIsSpinning(false)
				onStopSpinning()
			}, spinDuration * 1000)
		}
	}, [
		mustStartSpinning,
		prizeNumber,
		data.length,
		spinDuration,
		onStopSpinning,
		isSpinning,
		rotation,
	])

	const getCoordinatesForPercent = (percent: number) => {
		const x = center + radius * Math.cos(2 * Math.PI * percent)
		const y = center + radius * Math.sin(2 * Math.PI * percent)
		return [x, y]
	}

	return (
		<div className="relative h-full w-full">
			<svg
				viewBox={`0 0 ${size} ${size}`}
				className="h-full w-full"
				style={{
					transform: `rotate(${rotation}deg)`,
					transition: isSpinning
						? `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`
						: 'none',
				}}
			>
				{/* Center circle with "Spin" text */}
				<circle cx={center} cy={center} r={radius * 0.15} fill="black" />
				<text
					x={center}
					y={center}
					textAnchor="middle"
					dominantBaseline="middle"
					fill="white"
					fontSize={16}
					fontWeight="bold"
				>
					Spin
				</text>

				{data.map((segment, i) => {
					const startPercent = i / data.length
					const endPercent = (i + 1) / data.length
					const [startX, startY] = getCoordinatesForPercent(startPercent)
					const [endX, endY] = getCoordinatesForPercent(endPercent)
					const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0

					// Calculate text position and rotation
					const midPercent = (startPercent + endPercent) / 2
					const textRadius = radius * 0.65
					const textX = center + textRadius * Math.cos(2 * Math.PI * midPercent)
					const textY = center + textRadius * Math.sin(2 * Math.PI * midPercent)

					// Calculate the angle for the text to point outward from center
					const textAngle =
						(Math.atan2(textY - center, textX - center) * 180) / Math.PI

					const pathData = [
						`M ${center},${center}`,
						`L ${startX},${startY}`,
						`A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`,
						'Z',
					].join(' ')

					return (
						<g key={i}>
							<path
								d={pathData}
								fill={backgroundColors[i % backgroundColors.length]}
								stroke="#ccc"
								strokeWidth="1"
							/>
							<text
								x={textX}
								y={textY}
								fill={textColors[i % textColors.length]}
								fontSize={fontSize}
								fontWeight={fontWeight}
								textAnchor="middle"
								dominantBaseline="middle"
								style={{
									transform: `rotate(${textAngle}deg)`,
									transformOrigin: `${textX}px ${textY}px`,
								}}
							>
								{segment.option}
							</text>
						</g>
					)
				})}
			</svg>
			<div
				className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2"
				style={{
					borderLeft: '20px solid transparent',
					borderRight: '20px solid transparent',
					borderTop: '40px solid black',
				}}
			/>
		</div>
	)
}

export default CustomWheel
