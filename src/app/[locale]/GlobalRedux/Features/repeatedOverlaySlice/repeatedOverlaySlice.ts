import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface OverlayState {
	type: string | null
	data: any
	isVisible: boolean
}

interface RepeatedOverlayState {
	[key: string]: OverlayState
}

const initialState: RepeatedOverlayState = {}

const repeatedOverlaySlice = createSlice({
	name: 'repeatedOverlay',
	initialState,
	reducers: {
		setOverlay: (
			state,
			action: PayloadAction<{
				key: string
				type?: string | null
				data?: any
				isVisible?: boolean
			}>,
		) => {
			const { key, type, data, isVisible } = action.payload

			if (!state[key]) {
				state[key] = {
					type: null,
					data: null,
					isVisible: false,
				}
			}

			if (type !== undefined) state[key].type = type
			if (data !== undefined) state[key].data = data
			if (isVisible !== undefined) state[key].isVisible = isVisible

			// If isVisible is not provided, determine based on data existence
			if (isVisible === undefined && data !== undefined) {
				state[key].isVisible = Boolean(data)
			}
		},
		removeOverlay: (state, action: PayloadAction<string>) => {
			delete state[action.payload]
		},
	},
})

export const { setOverlay, removeOverlay } = repeatedOverlaySlice.actions

export default repeatedOverlaySlice.reducer
