// The signed-in user. Filled by AuthWatcher when the NextAuth session loads.
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

type UserState = {
	isLoggedIn: boolean
	data: any // the /api/user/userData payload
	saving: boolean
	error: string | null
}

const initialState: UserState = {
	isLoggedIn: false,
	data: {},
	saving: false,
	error: null,
}

/** Saves profile changes and stores the updated user. */
export const updateUser = createAsyncThunk(
	'user/update',
	async (changes: Record<string, any>, { rejectWithValue }) => {
		const response = await fetch('/api/user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(changes),
		})
		const data = await response.json().catch(() => null)
		if (!response.ok) return rejectWithValue(data?.message ?? 'Could not save')
		return data
	},
)

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<any>) {
			state.isLoggedIn = true
			state.data = action.payload
		},
		clearUser: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateUser.pending, (state) => {
				state.saving = true
				state.error = null
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.saving = false
				state.data = action.payload
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.saving = false
				state.error = String(action.payload ?? action.error.message)
			})
	},
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user.data
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn
export const selectUserSaving = (state: RootState) => state.user.saving
export const selectUserError = (state: RootState) => state.user.error
