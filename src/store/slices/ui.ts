// Small UI switches shared between distant components.
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

type UiState = {
	chatOpen: boolean // Tawk.to live chat is loaded
	mobileReserveOpen: boolean // full-screen reserve sheet on mobile
}

const initialState: UiState = { chatOpen: false, mobileReserveOpen: false }

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		openChat(state) {
			state.chatOpen = true
		},
		setMobileReserveOpen(state, action: PayloadAction<boolean>) {
			state.mobileReserveOpen = action.payload
		},
	},
})

export const { openChat, setMobileReserveOpen } = uiSlice.actions
export default uiSlice.reducer

export const selectChatOpen = (state: RootState) => state.ui.chatOpen
export const selectMobileReserveOpen = (state: RootState) =>
	state.ui.mobileReserveOpen
