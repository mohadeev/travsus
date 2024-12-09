'use client'

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './Features/counter/counterSlice'
import userReducer from './Features/userReducer/userReducer'
import creatingServiceSlice from './Features/creatingServiceSlice/creatingServiceSlice'
import businessSlice from './Features/businessSlice/businessSlice'
import bookingSlice from './Features/bookingSlice/bookingSlice'
import overlaySlice from './Features/overlaySlice/overlaySlice'
import repeatedOverlayReducer from './Features/repeatedOverlaySlice/repeatedOverlaySlice'

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		userReducer,
		creatingServiceSlice,
		businessSlice,
		bookingSlice,
		overlaySlice,
		repeatedOverlay: repeatedOverlayReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
