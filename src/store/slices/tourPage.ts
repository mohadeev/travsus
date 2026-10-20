// Tour page helpers that live outside the server data:
// - preview: what the clicked card knew, drawn by <TourPreviewShell /> while the full page loads
// - opening: a tour was just clicked and its page isn't there yet (<TourPreviewOverlay /> shows the shell)
// - liked: wishlist toggles made on this visit (by tour id)
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

/** What a tour card knows: enough to draw the top of the tour page instantly. */
export type TourPreview = {
	id: string
	name: string
	image: string | null
	days?: number
	city?: string | null
	price?: number | null
	rating?: number | null
	reviewsCount?: number
}

type TourPageState = {
	preview: TourPreview | null
	opening: boolean
	liked: Record<string, boolean>
}

const initialState: TourPageState = { preview: null, opening: false, liked: {} }

const tourPageSlice = createSlice({
	name: 'tourPage',
	initialState,
	reducers: {
		setTourPreview(state, action: PayloadAction<TourPreview | null>) {
			state.preview = action.payload
		},
		/** A card was clicked: show the preview right away, until the new route is on screen */
		openTourPreview(state, action: PayloadAction<TourPreview>) {
			state.preview = action.payload
			state.opening = true
		},
		closeTourPreview(state) {
			state.opening = false
		},
		setTourLiked(state, action: PayloadAction<{ id: string; liked: boolean }>) {
			state.liked[action.payload.id] = action.payload.liked
		},
	},
})

export const { setTourPreview, openTourPreview, closeTourPreview, setTourLiked } = tourPageSlice.actions
export default tourPageSlice.reducer

export const selectTourPreview = (state: RootState) => state.tourPage.preview
export const selectTourOpening = (state: RootState) => state.tourPage.opening
export const selectTourLiked = (id: string) => (state: RootState) =>
	state.tourPage.liked[id] as boolean | undefined
