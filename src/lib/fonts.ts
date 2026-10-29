// lib/fonts.js
import localFont from 'next/font/local'
import { Anton, Inter_Tight, Oswald } from 'next/font/google'

// Define your Metropolis font with all weights and styles
export const metropolis = localFont({
	src: [
		{
			path: '../fonts/metropolis/Metropolis-Thin.otf',
			weight: '100',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-ThinItalic.otf',
			weight: '100',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-ExtraLight.otf',
			weight: '200',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-ExtraLightItalic.otf',
			weight: '200',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-Light.otf',
			weight: '300',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-LightItalic.otf',
			weight: '300',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-Regular.otf',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-RegularItalic.otf',
			weight: '400',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-Medium.otf',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-MediumItalic.otf',
			weight: '500',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-SemiBold.otf',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-SemiBoldItalic.otf',
			weight: '600',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-Bold.otf',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-BoldItalic.otf',
			weight: '700',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-ExtraBold.otf',
			weight: '800',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-ExtraBoldItalic.otf',
			weight: '800',
			style: 'italic',
		},
		{
			path: '../fonts/metropolis/Metropolis-Black.otf',
			weight: '900',
			style: 'normal',
		},
		{
			path: '../fonts/metropolis/Metropolis-BlackItalic.otf',
			weight: '900',
			style: 'italic',
		},
	],
	variable: '--font-metropolis',
	display: 'swap',
})

// Nike-style type: Inter Tight (close to Helvetica Now) for the text, and Anton
// (close to Futura Condensed Extra Bold) for the big all-caps headlines.
// Anton has no Cyrillic, so Russian headlines fall back to Oswald.
export const interTight = Inter_Tight({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-inter-tight', display: 'swap' })
export const anton = Anton({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-anton', display: 'swap' })
export const oswald = Oswald({ weight: ['500', '700'], subsets: ['cyrillic'], variable: '--font-oswald', display: 'swap' })

export const fontVariables = `${metropolis.variable} ${interTight.variable} ${anton.variable} ${oswald.variable}`
