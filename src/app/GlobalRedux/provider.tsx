'use client'

import { Provider, useSelector } from 'react-redux'
import { RootState, store } from './store'
import { Component } from 'lucide-react'
import ErrorMessage from '@/components/ui/error-message'

export function Providers({ children }: any) {
	return (
		<Provider store={store}>
			<OverlayPovider children={children} />
		</Provider>
	)
}

const OverlayPovider = ({ children }: any) => {
	const { isVisible, type } = useSelector(
		(state: RootState) => state.overlaySlice,
	)
	const activeComponenets: any = overlayComponenets.find(
		({ name }: any) => name === type,
	)
	return <>{isVisible ? activeComponenets.component({}) : children}</>
}
const overlayComponenets = [{ name: 'oops', component: ErrorMessage }]
