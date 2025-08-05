import React from 'react'
import logoImg from '@/images/logo.png'
import logoLightImg from '@/images/logo-light.png'
import LogoSvgLight from './LogoSvgLight'
import LogoSvg from './LogoSvg'
import Link from 'next/link'
import { StaticImageData } from 'next/image'
import { useTranslations } from '@/lib/i18n'

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
	const t = useTranslations("shared_Logo");
	
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
					alt={t('shared_Logo_Alt_Text')}
				/>
			) : (
				t('shared_Logo_Fallback_Text')
			)}
			{imgLight && (
				<img
					className="hidden max-h-12 dark:block"
					src={imgLight.src}
					alt={t('shared_Logo_Light_Alt_Text')}
				/>
			)}
		</Link>
	)
}

export default Logo