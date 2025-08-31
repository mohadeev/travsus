import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface OverlayState {
	type: string | null // Type of the overlay component (e.g., 'errorModal', 'loginForm', etc.)
	data: any // Data to pass to the overlay component, can be any type
	isVisible: boolean // Boolean to track visibility
	mobileFooterStickyToggle: boolean
}

const initialState: OverlayState = {
	type: null,
	data: null,
	isVisible: false,
	mobileFooterStickyToggle: false,
}

const overlaySlice = createSlice({
	name: 'overlay',
	initialState,
	reducers: {
		toggleOverlay: (
			state,
			action: PayloadAction<{
				type?: string | null
				data?: any
				isVisible?: boolean
			}>,
		) => {
			const { type, data, isVisible } = action.payload

			state.type = type || ''
			state.data = data || null

			// Determine visibility based on payload
			state.isVisible = isVisible ?? Boolean(data) // Use provided isVisible or fallback to data existence
		},
		mobileFooterStickyToggleHanlder: (
			state,
			action: PayloadAction<{
				value: boolean
			}>,
		) => {
			const { value } = action.payload
			state.mobileFooterStickyToggle = value
		},
	},
})

export const { toggleOverlay, mobileFooterStickyToggleHanlder } =
	overlaySlice.actions

export default overlaySlice.reducer
