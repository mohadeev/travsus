// import basedGetUrlRequest from '@/app/utils/basedGetUrlRequest'

// const allToursFetch = async () => {
// 	return await basedGetUrlRequest('/api/location/get/all-tours')
// }



const allToursFetch = async (page = 1, limit = 8) => {
    try {
        const res = await fetch(`/api/location/get/all-tours?page=${page}&limit=${limit}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching tours:", err);
        return null;
    }
};

export default allToursFetch
