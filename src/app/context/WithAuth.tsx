import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const WithAuth = (WrappedComponent: any) => {
	const { data: session, status } = useSession()
	const router = useRouter()
	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
		}
	}, [status])
	return (props: any) => {
		if (status === 'loading') {
			return <div>Loading...</div>
		}
		return <WrappedComponent {...props} />
	}
}

export default WithAuth
