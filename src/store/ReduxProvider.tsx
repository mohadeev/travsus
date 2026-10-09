'use client'

import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './index'

export function ReduxProvider({ children }: { children: ReactNode }) {
	return (
		<Provider store={store}>
			{/* Function child: always render (incl. on the server, so pages have
			    real HTML for search engines); saved state restores right after. */}
			<PersistGate persistor={persistor}>{() => children}</PersistGate>
		</Provider>
	)
}
