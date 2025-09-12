import axios from 'axios'

const externalServerOrigin = process.env.NEXT_PUBLIC_EXTERNAL_SERVER

export async function wakeUpServer() {
	try {
		await axios.get(`${externalServerOrigin}/api/wake-up`)
	} catch (error) {
		console.error('Error waking up external server:', error)
	}
}
