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
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

// localStorage in the browser; no-op on the server (no window there)
const storage =
	typeof window === 'undefined'
		? {
				getItem: async () => null,
				setItem: async (_key: string, value: string) => value,
				removeItem: async () => {},
			}
		: createWebStorage('local')

import user from './slices/user'
import booking from './slices/booking'
import tourPage from './slices/tourPage'
import ui from './slices/ui'
import company from './slices/company'
import business from './slices/business'

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

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
