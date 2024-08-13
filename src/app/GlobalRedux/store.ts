'use client'

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './Features/counter/counterSlice'
import userReducer from './Features/userReducer/userReducer'

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		userReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
