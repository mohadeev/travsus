import { getSession } from '@/lib/session'

/** { user: { email, name, image } } for the signed-in person, or null. */
const currentServerUser = () => getSession()

export default currentServerUser
