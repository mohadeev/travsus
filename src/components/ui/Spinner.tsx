import React from 'react'

interface SpinnerProps {
	size?: number
	color?: string
}

export default function Spinner({ size = 25, color = '#fff' }: SpinnerProps) {
	return (
		<div className="inline-block" style={{ width: size, height: size }}>
			<svg
				className="animate-spin"
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
			>
				{[...Array(12)].map((_, i) => (
					<rect
						key={i}
						x="47"
						y="10"
						width="6"
						height="20"
						rx="3"
						ry="3"
						fill={color}
						transform={`rotate(${i * 30} 50 50)`}
					>
						<animate
							attributeName="opacity"
							values="1;0"
							keyTimes="0;1"
							dur="1s"
							begin={`${i * 0.0833}s`}
							repeatCount="indefinite"
						/>
					</rect>
				))}
			</svg>
		</div>
	)
}
