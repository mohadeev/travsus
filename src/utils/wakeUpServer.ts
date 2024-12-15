import axios from 'axios'

const externalServerOrigin = process.env.NEXT_PUBLIC_EXTERNAL_SERVER

export async function wakeUpServer() {
	try {
		await axios.get(`${externalServerOrigin}/api/wake-up`)
		console.log('External server woken up successfully')
	} catch (error) {
		console.error('Error waking up external server:', error)
	}
}
