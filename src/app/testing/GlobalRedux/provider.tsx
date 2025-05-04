'use client'

import type React from 'react'

import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { type RootState, store, persistor } from './store'
import ErrorMessage from '@/components/ui/error-message'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<OverlayProvider>{children}</OverlayProvider>
			</PersistGate>
		</Provider>
	)
}

const OverlayProvider = ({ children }: { children: React.ReactNode }) => {
	const { isVisible, type } = useSelector(
		(state: RootState) => state.overlaySlice,
	)
	const activeComponents: any = overlayComponents.find(
		({ name }: any) => name === type,
	)
	return <>{isVisible ? activeComponents?.component({}) : children}</>
}

const overlayComponents = [{ name: 'oops', component: ErrorMessage }]
