'use client'
import HeaderBar from './HeaderBar'
import { useThemeMode } from '@/utils/useThemeMode'

// The header is rendered straight away (also on the server), so its links
// are in the page HTML and nothing jumps while the page loads.
export default function SiteHeader() {
	useThemeMode()
	return <HeaderBar />
}
