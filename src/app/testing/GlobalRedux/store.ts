'use client'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import {
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'

// Import reducers
import counterReducer from './Features/counter/counterSlice'
import userReducer from './Features/userReducer/userReducer'
import creatingServiceSlice from './Features/creatingServiceSlice/creatingServiceSlice'
import businessSlice from './Features/businessSlice/businessSlice'
import bookingSlice from './Features/bookingSlice/bookingSlice'
import overlaySlice from './Features/overlaySlice/overlaySlice'
import repeatedOverlayReducer from './Features/repeatedOverlaySlice/repeatedOverlaySlice'
import companyReducer from './Features/companySlice/companySlice'

// Configure persistence
const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['company'], // Only persist the company slice
	version: 1,
}

// Combine reducers
const rootReducer = combineReducers({
	company: companyReducer,
	counter: counterReducer,
	userReducer,
	creatingServiceSlice,
	businessSlice,
	bookingSlice,
	overlaySlice,
	repeatedOverlay: repeatedOverlayReducer,
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create store
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

// Create persistor
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
