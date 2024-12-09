import { useEffect, useState } from 'react'
import { store } from '@/app/GlobalRedux/store'
import { RootState } from '@/app/GlobalRedux/store'

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
