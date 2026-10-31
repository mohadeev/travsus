// lib/fonts.js
import localFont from 'next/font/local'

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

// Travsus Sans: the TRAVSUS typeface (Figtree, SIL OFL 1.1, renamed and tuned:
// tighter spacing, tailed l and serifed I). Built by scripts/fonts/build-travsus-sans.py.
// No Cyrillic: Russian falls back to Helvetica / Arial.
export const travsusSans = localFont({
	src: '../fonts/travsus-sans/TravsusSans.woff2',
	weight: '300 900',
	variable: '--font-travsus',
	display: 'swap',
	// No Arial stand-in: it would catch the Russian letters before Helvetica
	adjustFontFallback: false,
})

export const fontVariables = `${metropolis.variable} ${travsusSans.variable}`
