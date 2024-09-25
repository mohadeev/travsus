import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the initial state types
interface Address {
	city: string
	zip: string
}

interface User {
	name: string
	address: Address
}

interface Preferences {
	theme: string
}

interface State {
	service: User
	preferences: Preferences
}

const initialState: State = {
	service: {
		name: 'John Doe',
		address: {
			city: 'New York',
			zip: '10001',
		},
	},
	preferences: {
		theme: 'light',
	},
}

// Define the type for the action payload
interface UpdateServiceStatePayload {
	path: string
	value: any
}

// Helper function to update nested state using Map without using loops
function updateNestedStateWithMap(state: any, path: string, value: any) {
	// Split path into keys (e.g., "service.address.city" => ['service', 'address', 'city'])
	const keys = path.split('.')

	// Initialize a Map and set the nested value based on the path length
	const map = new Map<string, any>()

	// Traversing step-by-step without loops
	let key0 = keys[0] // First key (e.g., 'service')
	let key1 = keys[1] // Second key (e.g., 'address')
	let key2 = keys[2] // Third key (e.g., 'city')

	// Update based on the number of keys (max is 3 in this case)
	if (key0 && key1 && key2) {
		if (!state[key0]) state[key0] = {}
		if (!state[key0][key1]) state[key0][key1] = {}
		map.set(key2, value)
		state[key0][key1][key2] = map.get(key2)
	} else if (key0 && key1) {
		if (!state[key0]) state[key0] = {}
		map.set(key1, value)
		state[key0][key1] = map.get(key1)
	} else if (key0) {
		map.set(key0, value)
		state[key0] = map.get(key0)
	}
}

// Create the slice
const creatingServiceSlice = createSlice({
	name: 'state',
	initialState,
	reducers: {
		// Update state based on dynamic path using Map and no loops
		updateServiceState: (
			state,
			action: PayloadAction<UpdateServiceStatePayload>,
		) => {
			const { path, value } = action.payload
			updateNestedStateWithMap(state, path, value)
		},
	},
})

// Export the action
export const { updateServiceState } = creatingServiceSlice.actions

// Export the reducer to be included in the store
export default creatingServiceSlice.reducer
