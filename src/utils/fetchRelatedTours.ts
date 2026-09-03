
const fetchRelatedTours = async (id) => {
	try {
		const res = await fetch(`/api/listing/get/related-tours?id=${id}`)
		const data = await res.json()
		return data
	} catch (err) {
		console.error('Error fetching tours:', err)
		return null
	}
}

export default fetchRelatedTours
