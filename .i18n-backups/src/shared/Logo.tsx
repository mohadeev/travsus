import React from 'react'
import logoImg from '@/images/logo.png'
import logoLightImg from '@/images/logo-light.png'
import LogoSvgLight from './LogoSvgLight'
import LogoSvg from './LogoSvg'
import Link from 'next/link'
import { StaticImageData } from 'next/image'

export interface LogoProps {
	img?: StaticImageData
	imgLight?: StaticImageData
	className?: string
}

const Logo: React.FC<LogoProps> = ({
	img = logoImg,
	imgLight = logoLightImg,
	className = 'w-24',
}) => {
	return (
		<Link
			href="/"
			className={`ttnc-logo text-primary-6000 inline-block focus:outline-none focus:ring-0 ${className}`}
		>
			{/* <LogoSvgLight />
      <LogoSvg /> */}
			{img ? (
				<img
					className={`block max-h-12 ${imgLight ? 'dark:hidden' : ''}`}
					src={img.src}
					alt="Logo"
				/>
			) : (
				'Logo Here'
			)}
			{imgLight && (
				<img
					className="hidden max-h-12 dark:block"
					src={imgLight.src}
					alt="Logo-Light"
				/>
			)}
		</Link>
	)
}

export default Logo
