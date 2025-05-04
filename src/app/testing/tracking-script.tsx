'use client'

import { useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'

interface TrackingScriptProps {
	interval?: number // Screenshot capture interval in ms
}

export default function TrackingScript({
	interval = 10000,
}: TrackingScriptProps) {
	const visitorIdRef = useRef<string>('')

	useEffect(() => {
		// Generate a unique visitor ID if not already set
		if (!visitorIdRef.current) {
			visitorIdRef.current = `visitor_${Math.random().toString(36).substring(2, 15)}`
		}

		// Function to capture and send screenshot
		const captureAndSendScreenshot = async () => {
			try {
				// Capture the current viewport
				const canvas = await html2canvas(document.documentElement)

				// Convert canvas to blob
				const blob = await new Promise<Blob>((resolve) => {
					canvas.toBlob((blob) => {
						if (blob) resolve(blob)
					}, 'image/png')
				})

				// Create form data to send
				const formData = new FormData()
				formData.append('screenshot', blob, 'screenshot.png')
				formData.append('visitorId', visitorIdRef.current)

				// Add browser and OS info
				const browserInfo = detectBrowser()
				formData.append('browser', browserInfo.browser)
				formData.append('os', browserInfo.os)

				// Get country info (in a real app, this would be determined server-side)
				// For demo purposes, we'll use a placeholder
				formData.append('country', 'Unknown')

				// Send to our API
				await fetch('/api/track', {
					method: 'POST',
					body: formData,
				})

				console.log('Screenshot captured and sent')
			} catch (error) {
				console.error('Error capturing screenshot:', error)
			}
		}

		// Capture initial screenshot
		captureAndSendScreenshot()

		// Set up interval for periodic captures
		const intervalId = setInterval(captureAndSendScreenshot, interval)

		// Clean up on unmount
		return () => {
			clearInterval(intervalId)
		}
	}, [interval])

	// Simple browser and OS detection
	const detectBrowser = () => {
		const userAgent = navigator.userAgent
		let browser = 'Unknown'
		let os = 'Unknown'

		// Detect browser
		if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome'
		else if (userAgent.indexOf('Safari') > -1) browser = 'Safari'
		else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox'
		else if (
			userAgent.indexOf('MSIE') > -1 ||
			userAgent.indexOf('Trident') > -1
		)
			browser = 'Internet Explorer'
		else if (userAgent.indexOf('Edge') > -1) browser = 'Edge'

		// Detect OS
		if (userAgent.indexOf('Windows') > -1) os = 'Windows'
		else if (userAgent.indexOf('Mac') > -1) os = 'macOS'
		else if (userAgent.indexOf('Linux') > -1) os = 'Linux'
		else if (userAgent.indexOf('Android') > -1) os = 'Android'
		else if (
			userAgent.indexOf('iOS') > -1 ||
			userAgent.indexOf('iPhone') > -1 ||
			userAgent.indexOf('iPad') > -1
		)
			os = 'iOS'

		return { browser, os }
	}

	// This component doesn't render anything visible
	return null
}
