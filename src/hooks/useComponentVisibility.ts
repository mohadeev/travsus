import { useState, useEffect } from 'react'

export function useComponentVisibility() {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const isDevelopment = process.env.NODE_ENV === 'development'

		if (!isDevelopment) {
			setIsVisible(true)
			return
		}

		function checkVisibility() {
			const now = new Date()
			const day = now.getDay()
			const hour = now.getHours()
			const minute = now.getMinutes()
			const currentTime = hour * 60 + minute

			const isWeekday = day >= 1 && day <= 5
			const isWorkHours = currentTime >= 8 * 60 && currentTime < 17 * 60

			setIsVisible(!(isWeekday && isWorkHours))
		}

		checkVisibility()
		const intervalId = setInterval(checkVisibility, 60000)

		return () => clearInterval(intervalId)
	}, [])

	return isVisible
}
