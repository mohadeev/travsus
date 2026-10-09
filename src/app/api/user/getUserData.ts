// The signed-in user's full `users` row, or null (see lib/session.ts).
import { getSessionUser } from '@/lib/session'

const getUserData = async (_options?: any) => getSessionUser()

export default getUserData
export { getUserData }
