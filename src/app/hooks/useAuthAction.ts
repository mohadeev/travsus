import { useSession } from 'next-auth/react'
import { useRepeatedOverlay } from './useRepeatedOverlay'

type AuthActionFunction = () => void

export const useAuthAction = (action: AuthActionFunction) => {
	const { data: session } = useSession()
	const { toggleOverlay } = useRepeatedOverlay('authModal')

	const handleAuthAction = () => {
		if (session) {
			// User is logged in, perform the action
			action()
		} else {
			// User is not logged in, show login modal
			toggleOverlay({
				type: 'authModal',
				data: { mode: 'login' },
				isVisible: true,
			})
		}
	}

	return handleAuthAction
}
