import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, ComponentType } from 'react'

function withAuth<T>(WrappedComponent: ComponentType<any>) {
	const AuthenticatedComponent = (props: T) => {
		const { data: session, status } = useSession()
		const router = useRouter()

		useEffect(() => {
			if (status === 'unauthenticated') {
				router.push('/login')
			}
		}, [status, router])

		if (status === 'loading') {
			return <div>Loading...</div>
		}

		return <WrappedComponent {...props} />
	}

	return AuthenticatedComponent
}

export default withAuth
