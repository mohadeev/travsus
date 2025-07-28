'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Camera, RefreshCw } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function Home() {
	const [url, setUrl] = useState<string>('')
	const [currentUrl, setCurrentUrl] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [showScrollbar, setShowScrollbar] = useState<boolean>(true)
	const [isTakingScreenshot, setIsTakingScreenshot] = useState<boolean>(false)
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const phoneFrameRef = useRef<HTMLDivElement>(null)

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		// Add https:// if not present
		let formattedUrl = url
		if (!/^https?:\/\//i.test(url)) {
			formattedUrl = `https://${url}`
		}

		setIsLoading(true)
		setCurrentUrl(formattedUrl)
	}

	const handleIframeLoad = () => {
		setIsLoading(false)
		// Apply scrollbar settings when iframe loads
		applyScrollbarSettings()
	}

	// Function to apply scrollbar settings to the iframe content
	const applyScrollbarSettings = () => {
		if (!iframeRef.current) return

		try {
			// Try to access iframe content (may fail due to cross-origin restrictions)
			const iframeDoc =
				iframeRef.current.contentDocument ||
				(iframeRef.current.contentWindow &&
					iframeRef.current.contentWindow.document)

			if (iframeDoc) {
				// Create or update style element
				let styleEl = iframeDoc.getElementById('custom-scrollbar-style')
				if (!styleEl) {
					styleEl = iframeDoc.createElement('style')
					styleEl.id = 'custom-scrollbar-style'
					iframeDoc.head.appendChild(styleEl)
				}

				// Set the style based on showScrollbar state
				if (!showScrollbar) {
					styleEl.textContent = `
            ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
            * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
            html, body { overflow: auto !important; }
          `
				} else {
					styleEl.textContent = ''
				}
			}
		} catch (e) {
			console.log(
				'Could not modify iframe content due to cross-origin restrictions',
			)
		}
	}

	// Apply scrollbar settings whenever the showScrollbar state changes
	useEffect(() => {
		applyScrollbarSettings()
	}, [showScrollbar])

	const toggleScrollbar = () => {
		setShowScrollbar(!showScrollbar)
	}

	const reloadIframe = () => {
		if (iframeRef.current && currentUrl) {
			setIsLoading(true)
			iframeRef.current.src = currentUrl
		}
	}

	const takeScreenshot = async () => {
		if (!phoneFrameRef.current) return

		setIsTakingScreenshot(true)

		try {
			// Add a class to prepare for screenshot
			phoneFrameRef.current.classList.add('taking-screenshot')

			// For better screenshots, temporarily modify the iframe
			if (iframeRef.current) {
				// Try to hide scrollbars in iframe content before screenshot
				applyScrollbarSettings()
			}

			const canvas = await html2canvas(phoneFrameRef.current, {
				allowTaint: true,
				useCORS: true,
				logging: false,
				scale: 2, // Higher quality
				onclone: (clonedDoc) => {
					// Find the iframe in the cloned document
					const clonedFrame = clonedDoc.querySelector(
						'.phone-frame-content iframe',
					)
					if (clonedFrame) {
						// Try to ensure iframe content is captured
						clonedFrame.style.width = '100%'
						clonedFrame.style.height = '100%'
						clonedFrame.style.display = 'block'
					}
				},
			})

			// Convert to image and download
			const image = canvas.toDataURL('image/png')
			const link = document.createElement('a')
			link.href = image
			link.download = `iphone-screenshot-${new Date().getTime()}.png`
			link.click()

			// Remove the screenshot class
			phoneFrameRef.current.classList.remove('taking-screenshot')
		} catch (error) {
			console.error('Error taking screenshot:', error)
			alert(
				'There was an error capturing the screenshot. Some websites restrict content capture due to security policies.',
			)
		} finally {
			setIsTakingScreenshot(false)
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center gap-6 bg-white p-4">
			{/* URL Input Form */}
			<form onSubmit={handleSubmit} className="flex w-full max-w-[600px] gap-2">
				<Input
					type="text"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Enter website URL (e.g., google.com)"
					className="flex-1"
				/>
				<Button type="submit">Load Website</Button>
			</form>

			{/* Control Buttons */}
			<div className="flex w-full max-w-[600px] flex-wrap gap-2">
				<Button
					variant="outline"
					onClick={toggleScrollbar}
					className="flex items-center gap-2"
				>
					{showScrollbar ? <EyeOff size={16} /> : <Eye size={16} />}
					{showScrollbar
						? 'Hide Website Scrollbars'
						: 'Show Website Scrollbars'}
				</Button>

				<Button
					variant="outline"
					onClick={reloadIframe}
					className="flex items-center gap-2"
					disabled={!currentUrl || isLoading}
				>
					<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
					Reload
				</Button>

				<Button
					variant="default"
					onClick={takeScreenshot}
					className="flex items-center gap-2"
					disabled={isTakingScreenshot || !currentUrl}
				>
					{isTakingScreenshot ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
							Capturing...
						</>
					) : (
						<>
							<Camera size={16} />
							Take Screenshot
						</>
					)}
				</Button>
			</div>

			{/* Add this right below the control buttons */}
			<div className="mt-1 w-full max-w-[600px] text-xs text-gray-500">
				Tip: For best screenshots, hide the website scrollbars first. Some
				websites may block screenshots due to security restrictions.
			</div>

			{/* iPhone 16 Frame */}
			<div
				ref={phoneFrameRef}
				className="relative h-[844px] w-full max-w-[390px] overflow-hidden rounded-[55px] border-12 border-black bg-white shadow-2xl"
				style={{ borderWidth: '12px' }} // 50% bolder border (from 8px to 12px)
			>
				{/* Notch */}
				<div className="absolute left-1/2 top-0 z-50 h-[30px] w-[120px] -translate-x-1/2 transform rounded-b-2xl bg-black"></div>

				{/* Status Bar */}
				<div className="h-10 w-full bg-white pt-7"></div>

				{/* Website Content */}
				<div className="phone-frame-content relative h-[calc(90%-80px)] w-full">
					{!currentUrl && (
						<div className="flex h-full flex-col items-center justify-center p-6 text-center">
							<div className="mb-4 text-4xl">📱</div>
							<h2 className="mb-2 text-xl font-bold">
								iPhone 16 Website Viewer
							</h2>
							<p className="text-gray-500">
								Enter a URL above to view any website in this iPhone frame
							</p>
						</div>
					)}

					{isLoading && currentUrl && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
							<div className="flex flex-col items-center">
								<div className="mb-2 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
								<p className="text-sm text-gray-600">Loading website...</p>
							</div>
						</div>
					)}

					{currentUrl && (
						<iframe
							ref={iframeRef}
							src={currentUrl}
							className="phone-frame-content h-full w-full border-none"
							onLoad={handleIframeLoad}
							sandbox="allow-same-origin allow-scripts allow-forms"
							loading="eager"
							importance="high"
							crossOrigin="anonymous"
						/>
					)}
				</div>

				{/* Home Indicator */}
				<div className="absolute bottom-8 left-1/2 mx-auto h-[5px] w-[120px] -translate-x-1/2 transform rounded-full bg-black"></div>
			</div>

			{currentUrl && (
				<div className="mt-2 text-sm text-gray-500">
					Currently displaying: {currentUrl}
				</div>
			)}
		</div>
	)
}
