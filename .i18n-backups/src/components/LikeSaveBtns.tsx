'use client'

import { updateServiceState } from '@/app/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import addAndRemoveToWishList from '@/utils/api-utils/addAndRemoveToWishList'
import { Heart } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useState, useRef, useEffect } from 'react'
import { Motion, spring } from 'react-motion'
import { useDispatch } from 'react-redux'

const LikeSaveBtns = ({ liked }: any) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [copySuccess, setCopySuccess] = useState('')
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const searchParams = useSearchParams()
	const serviceId = searchParams.get('serviceId')
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href)
			setCopySuccess('🎉 Tour link copied!')
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			timeoutRef.current = setTimeout(() => setCopySuccess(''), 2000)
		} catch (err) {
			setCopySuccess('😕 Oops! Copy failed')
		}
		setIsDropdownOpen(false)
	}

	const handleEmail = () => {
		const subject = encodeURIComponent(
			'🌍 Check out this amazing tour from Travsus!',
		)
		const body = encodeURIComponent(
			`Hey there! 👋 I found this incredible tour and thought you'd love it! 🏞️✈️\n\nTake a look: ${window.location.href}\n\nLet's plan our next adventure! 🗺️🧳`,
		)
		window.location.href = `mailto:?subject=${subject}&body=${body}`
		setIsDropdownOpen(false)
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	const dispatch = useDispatch()
	const handleAddToWishList = useAuthAction(async () => {
		dispatch(updateServiceState({ path: 'service.liked', value: !liked }))
		await addAndRemoveToWishList({ serviceId })
			.then((res: any) => {
				if (res?.added === false || res?.added === true) {
					dispatch(
						updateServiceState({ path: 'service.liked', value: res?.added }),
					)
					
				}
			})
			.catch(() => {
				dispatch(updateServiceState({ path: 'service.liked', value: !liked }))
			})
	})

	return (
		<div className="flow-root">
			<div className="-mx-3 -my-1.5 flex text-sm text-neutral-700 dark:text-neutral-300">
				<div className="relative" ref={dropdownRef}>
					<span
						className="flex cursor-pointer rounded-lg px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
						onClick={toggleDropdown}
						role="button"
						aria-haspopup="true"
						aria-expanded={isDropdownOpen}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
							/>
						</svg>
						<span className="ml-2.5 hidden sm:block">Share Tour</span>
					</span>
					<Motion
						style={{
							opacity: spring(isDropdownOpen ? 1 : 0),
							scale: spring(isDropdownOpen ? 1 : 0.95),
						}}
					>
						{(interpolatedStyle) =>
							isDropdownOpen && (
								<div
									className="absolute left-0 z-10 mt-2 w-48 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800"
									style={{
										opacity: interpolatedStyle.opacity,
										transform: `scale(${interpolatedStyle.scale})`,
										transformOrigin: 'top left',
									}}
								>
									<div
										className="py-1"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="options-menu"
									>
										<button
											onClick={handleCopyLink}
											className="block w-full rounded-md px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
											role="menuitem"
										>
											🔗 Copy Tour Link
										</button>
										<button
											onClick={handleEmail}
											className="block w-full rounded-md px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
											role="menuitem"
										>
											✉️ Email Tour
										</button>
									</div>
								</div>
							)
						}
					</Motion>
					{copySuccess && (
						<div className="absolute left-0 mt-2 rounded-md bg-green-500 px-2 py-1 text-sm text-white">
							{copySuccess}
						</div>
					)}
				</div>
				<span
					onClick={handleAddToWishList}
					className="flex cursor-pointer rounded-lg px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
				>
					{liked ? (
						<Heart className="h-5 w-5 fill-current" />
					) : (
						<Heart className="h-5 w-5" strokeWidth={1.5} />
					)}
					<span
						className="ml-2.5 hidden sm:block"
						// onClick={handleAddToWishList}
					>
						Save Tour
					</span>
				</span>
			</div>
		</div>
	)
}

export default LikeSaveBtns
