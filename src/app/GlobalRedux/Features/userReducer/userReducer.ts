// Features/userReducer/userReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface UserReducer {
	isUserLoggedIn: boolean
	userData: object
}

const initialState: UserReducer = {
	isUserLoggedIn: false,
	userData: {},
}

// Acción asíncrona para actualizar los datos del usuario
export const updateUser: any = createAsyncThunk(
	'user/updateUser',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await axios.put('/api/user', userData)
			return response.data
		} catch (error: any) {
			return rejectWithValue(error.response.data)
		}
	},
)

export const userReducer = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action) {
			state.isUserLoggedIn = true
			state.userData = action.payload
		},
		clearUser(state) {
			state.isUserLoggedIn = false
			state.userData = {}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateUser.fulfilled, (state, action) => {
				state.userData = action.payload
			})
			.addCase(updateUser.rejected, (state, action) => {
				console.error('Error updating user:', action.payload)
			})
	},
})

export const { setUser, clearUser } = userReducer.actions

export default userReducer.reducer
