// Wraps an action that needs an account: runs it when signed in,
// otherwise opens the Clerk sign-in window (and returns to this page).
import { useAuth, useClerk } from '@clerk/nextjs'

type AuthActionFunction<T = any> = (args: T) => void | Promise<void>

export const useAuthAction = <T = any>(action: AuthActionFunction<T>) => {
	const { isSignedIn } = useAuth()
	const { openSignIn } = useClerk()

	return (args: T) => {
		if (isSignedIn) return action(args)
		openSignIn({ forceRedirectUrl: window.location.href })
	}
}
