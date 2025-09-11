import { useEffect, useState } from 'react'
import { store } from '@/app/[locale]/GlobalRedux/store'
import { RootState } from '@/app/[locale]/GlobalRedux/store'

export const useOverlayStore = () => {
	const [overlayState, setOverlayState] = useState(
		store.getState().overlaySlice,
	)

	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			setOverlayState(store.getState().overlaySlice)
		})

		return () => unsubscribe()
	}, [])

	return overlayState
}
