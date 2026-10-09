// Tour page helpers that live outside the server data:
// - preview: the card the user clicked, shown while the full page loads
// - liked: wishlist toggles made on this visit (by tour id)
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

type TourPageState = {
	preview: any | null
	liked: Record<string, boolean>
}

const initialState: TourPageState = { preview: null, liked: {} }

const tourPageSlice = createSlice({
	name: 'tourPage',
	initialState,
	reducers: {
		setTourPreview(state, action: PayloadAction<any | null>) {
			state.preview = action.payload
		},
		setTourLiked(state, action: PayloadAction<{ id: string; liked: boolean }>) {
			state.liked[action.payload.id] = action.payload.liked
		},
	},
})

export const { setTourPreview, setTourLiked } = tourPageSlice.actions
export default tourPageSlice.reducer

export const selectTourPreview = (state: RootState) => state.tourPage.preview
export const selectTourLiked = (id: string) => (state: RootState) =>
	state.tourPage.liked[id] as boolean | undefined
