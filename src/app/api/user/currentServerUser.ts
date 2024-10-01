import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'

const currentServerUser = async () => {
	const session: any = await getServerSession(authOptions) 
	
	return session
}

export default currentServerUser
