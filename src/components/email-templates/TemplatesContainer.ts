export const travelItinerary = ({ data, title }: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Travel Itinerary</title>
  </head> 
  *{
  }
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif;">
  </body>
</html>`
}

// Example usage with default data
const defaultData = {
	name: 'Emma Thompson',
	destination: 'Tokyo, Japan',
	startDate: 'July 15, 2023',
	endDate: 'July 22, 2023',
	bookingReference: 'TRVS98765',
	itineraryItems: [
		{
			date: 'July 15, 2023',
			description: 'Arrival at Narita International Airport',
			location: 'Narita International Airport',
			time: '14:30',
		},
		{
			date: 'July 16, 2023',
			description: "Guided tour of Tokyo's historic sites",
			location: 'Meeting point: Hotel Lobby',
			time: '09:00',
		},
		{
			date: 'July 17, 2023',
			description: 'Free day to explore Tokyo',
		},
		// Add more itinerary items as needed
	],
	emergencyContact: '+1 (555) 123-4567',
	localEmbassy: '+81 3-3224-5000',
	supportNumber: '+1 (800) 987-6543',
	manageBookingLink: 'https://www.travsus.com/manage-booking/TRVS98765',
}

// To use the template with default data:
// const emailContent = travelItinerary(defaultData);
