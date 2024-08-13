'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserReducer {
	isUserLoggedIn: boolean
	userData: object
}

const initialState: UserReducer = {
	isUserLoggedIn: false,
	userData: {},
}

export const userReducer = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<any>) {
			state.isUserLoggedIn = true
			state.userData = action.payload
		},
		clearUser(state) {
			state.isUserLoggedIn = false
			state.userData = {}
		},
	},
})

export const { setUser, clearUser } = userReducer.actions

export default userReducer.reducer
