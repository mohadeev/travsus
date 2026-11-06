// Global client state (Redux Toolkit).
//
//   slices/user.ts      signed-in user
//   slices/booking.ts   booking being built on a tour page / at checkout
//   slices/tourPage.ts  clicked-card preview + wishlist toggles
//   slices/ui.ts        live chat, mobile reserve sheet
//   slices/company.ts   dashboard companies (saved in localStorage)
//   slices/business.ts  legacy admin template company
//
// In components use the typed hooks from './hooks' and the select* helpers.
'use client'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Persistor, Storage } from 'redux-persist'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from 'redux-persist'

import user from './slices/user'
import booking from './slices/booking'
import tourPage from './slices/tourPage'
import ui from './slices/ui'
import company from './slices/company'
import business from './slices/business'

// localStorage in the browser; no-op on the server (no window there).
// Inline on purpose: redux-persist's createWebStorage is CJS, and the vinext
// client bundle treats its default export as a function when it is not.
const storage: Storage = {
	getItem: (key) =>
		Promise.resolve(
			typeof window === 'undefined' ? null : window.localStorage.getItem(key),
		),
	setItem: (key, value) => {
		if (typeof window !== 'undefined') window.localStorage.setItem(key, value)
		return Promise.resolve(value)
	},
	removeItem: (key) => {
		if (typeof window !== 'undefined') window.localStorage.removeItem(key)
		return Promise.resolve()
	},
}

const rootReducer = combineReducers({
	user,
	booking,
	tourPage,
	ui,
	company,
	business,
})

const persistedReducer = persistReducer(
	{ key: 'root', version: 1, storage, whitelist: ['company'] },
	rootReducer,
)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

// Saving/restoring only happens in the browser. On the server there's nothing to
// restore (storage is a no-op above), and persistStore() starts a timer when the
// module loads, which Cloudflare Workers don't allow; <PersistGate> only reads the
// persistor after mounting, which never happens in a server render.
const serverPersistor: Persistor = {
	pause: () => {},
	persist: () => {},
	purge: async () => {},
	flush: async () => {},
	dispatch: (action: any) => action,
	getState: () => ({ registry: [], bootstrapped: false }),
	subscribe: () => () => {},
}
export const persistor: Persistor =
	typeof window === 'undefined' ? serverPersistor : persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
