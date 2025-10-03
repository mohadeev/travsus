'use client'

import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'

type Travelers = {
	guestAdults: number
	guestChildren: number
}

const COOKIE_KEY = 'travelers'
const DEFAULT_TRAVELERS: Travelers = {
	guestAdults: 0,
	guestChildren: 0,
}

function readTravelers(): Travelers {
	const cookie = Cookies.get(COOKIE_KEY)

	if (!cookie) return DEFAULT_TRAVELERS

	try {
		return JSON.parse(cookie) as Travelers
	} catch {
		return DEFAULT_TRAVELERS
	}
}

export function useTravelers() {
	const [travelers, setTravelers] = useState<Travelers>(DEFAULT_TRAVELERS)

	// Load from cookie on mount
	useEffect(() => {
		setTravelers(readTravelers())
	}, [])

	// Update a traveler and persist to cookie
	const updateTraveler = useCallback(
		(key: keyof Travelers, value: number) => {
			const updated = { ...travelers, [key]: value }
			setTravelers(updated)
			Cookies.set(COOKIE_KEY, JSON.stringify(updated), { expires: 7 })
		},
		[travelers],
	)

	return { travelers, updateTraveler }
}
