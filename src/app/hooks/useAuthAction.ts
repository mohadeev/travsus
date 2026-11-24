// Wraps an action that needs an account: runs it when signed in,
// otherwise opens the Clerk sign-in window (and returns to this page).
import { useAuth, useClerk } from '@clerk/nextjs'

type AuthActionFunction<T = any> = (args: T) => void | Promise<void>

/**
 * Sent just before the sign-in window opens, so full-screen sheets (the
 * phone booking sheet) close first: otherwise Clerk's window opens hidden
 * behind them and the page looks frozen.
 */
export const SIGN_IN_OPENING_EVENT = 'travsus:sign-in-opening'

/** Opens Clerk's sign-in window above everything, returning to this page after. */
export function openSignInOnTop(openSignIn: (options?: any) => void) {
	window.dispatchEvent(new Event(SIGN_IN_OPENING_EVENT))
	// Let the sheet close (and release its focus trap) before Clerk opens
	setTimeout(() => openSignIn({ forceRedirectUrl: window.location.href }), 50)
}

export const useAuthAction = <T = any>(action: AuthActionFunction<T>) => {
	const { isSignedIn } = useAuth()
	const { openSignIn } = useClerk()

	return (args: T) => {
		if (isSignedIn) return action(args)
		openSignInOnTop(openSignIn)
	}
}
