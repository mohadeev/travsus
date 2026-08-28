export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // Make sure to add this to your environment variables
})
export async function POST(request: Request) {
	try {
		const data = await request.json()
		const {
			country,
			cities,
			duration,
			adults,
			children,
			infants,
			accommodation,
			groupType,
			tripType,
			customRequests,
		} = data

		// Format the prompt for the AI
		const prompt = `
        Create a detailed travel itinerary with the following specifications:
        
        Country: ${country}
        Cities to visit in order: ${cities.join(' → ')}
        Duration: ${duration} days
        Travelers: ${adults} adults, ${children} children, ${infants} infants
        Accommodation Type: ${accommodation === 'luxury' ? 'Luxury (5-star hotels)' : 'Standard (3-4 star hotels)'}
        Tour Type: ${groupType === 'private' ? 'Private tour' : 'Small group tour'}
        Trip Focus: ${
					{
						cultural: 'Cultural and historical experiences',
						adventure: 'Adventure and outdoor activities',
						relaxation: 'Relaxation and wellness',
						food: 'Food and culinary experiences',
						mixed: 'Mix of cultural, adventure, and relaxation activities',
					}[tripType] || 'Mix of experiences'
				}
        ${customRequests ? `Special requests: ${customRequests}` : ''}
        
        Please provide:
        1. A day-by-day itinerary with activities for each day
        2. Accommodation details
        3. Transportation between cities
        4. A reasonable price estimate for this trip (in Euros)
        
        IMPORTANT: The itinerary MUST follow the exact order of cities provided. Distribute the ${duration} days among the cities based on their importance and activities available.
        
        Format the response as a JSON object with the following structure:
        {
          "title": "Title of the trip",
          "subtitle": "Brief description of the trip",
          "days": [
            {
              "day": 1,
              "city": "City name",
              "activities": ["Activity 1", "Activity 2", "Overnight in hotel"]
            }
          ],
          "price": {
            "basePrice": 1000,
            "perPerson": 500
          }
        }
      `

		// Call the OpenAI API
		try {
			const completion = await openai.chat.completions.create({
				model: 'gpt-4-turbo',
				messages: [{ role: 'user', content: prompt }],
			})

			// Extract the response text
			const responseText = completion.choices[0].message.content

			// Parse the response
			let itinerary
			try {
				// Extract JSON from the response (in case the AI includes extra text)
				const jsonMatch = responseText.match(/\{[\s\S]*\}/)
				if (jsonMatch) {
					itinerary = JSON.parse(jsonMatch[0])
				} else {
					throw new Error('No valid JSON found in response')
				}
			} catch (error) {
				console.error('Error parsing AI response:', error)
				return NextResponse.json(
					{ success: false, message: 'Failed to parse AI response' },
					{ status: 500 },
				)
			}

			// Add additional information to the itinerary
			const enhancedItinerary = {
				...itinerary,
				startCity: cities[0],
				endCity: cities[cities.length - 1],
				travelers: {
					adults: Number(adults),
					children: Number(children),
					infants: Number(infants),
					total: Number(adults) + Number(children) + Number(infants),
				},
				accommodation: accommodation,
				isPrivate: groupType === 'private',
				price: {
					...itinerary.price,
					deposit: 50,
				},
			}

			return NextResponse.json({
				success: true,
				itinerary: enhancedItinerary,
			})
		} catch (error) {
			console.error('Error with OpenAI API:', error)
			// Fall back to mock data
			return generateMockItinerary(data)
		}
	} catch (error) {
		console.error('Error generating itinerary:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to generate itinerary' },
			{ status: 500 },
		)
	}
}

// Fallback function to generate mock itinerary if the API call fails
async function generateMockItinerary(data) {
	try {
		const {
			country,
			cities,
			duration,
			adults,
			children,
			infants,
			accommodation,
			groupType,
			tripType,
		} = data

		// Generate mock itinerary based on user selections
		const countryName =
			{
				morocco: 'Morocco',
				spain: 'Spain',
				france: 'France',
				italy: 'Italy',
				portugal: 'Portugal',
				other: 'Your Selected Destination',
			}[country] || 'Your Destination'

		const durationDays = Number.parseInt(duration) || 7
		const citiesToVisit = cities || []

		// Accommodation type affects price and description
		const accommodationType = accommodation === 'luxury' ? 'luxury' : 'standard'

		// Group type affects price and description
		const isPrivate = groupType === 'private'
		const groupDesc = isPrivate
			? 'private tour exclusively for your group'
			: 'small group tour with like-minded travelers'

		// Number of travelers affects price
		const numAdults = Number.parseInt(adults) || 2
		const numChildren = Number.parseInt(children) || 0
		const numInfants = Number.parseInt(infants) || 0
		const totalTravelers = numAdults + numChildren + numInfants

		// Calculate base price based on all factors
		let basePrice = 800 + durationDays * 120 // Base price per person

		// Adjust for accommodation type
		if (accommodation === 'luxury') {
			basePrice += durationDays * 150 // Luxury premium
		}

		// Adjust for private vs group
		if (isPrivate) {
			basePrice += 300 // Private tour premium
		}

		// Total price for all travelers
		const totalPrice = basePrice * numAdults + basePrice * 0.7 * numChildren

		// Distribute days among cities
		const daysPerCity = Math.max(
			1,
			Math.floor(durationDays / citiesToVisit.length),
		)
		let remainingDays = durationDays - daysPerCity * citiesToVisit.length

		// Allocate more days to first and last cities if there are remaining days
		const cityDays = citiesToVisit.map((_, index) => {
			if (
				remainingDays > 0 &&
				(index === 0 || index === citiesToVisit.length - 1)
			) {
				remainingDays--
				return daysPerCity + 1
			}
			return daysPerCity
		})

		// Distribute any remaining days
		for (let i = 0; remainingDays > 0 && i < cityDays.length; i++) {
			cityDays[i]++
			remainingDays--
		}

		// Generate days
		const days = []
		let dayCount = 1

		for (let cityIndex = 0; cityIndex < citiesToVisit.length; cityIndex++) {
			const city = citiesToVisit[cityIndex]
			const daysInCity = cityDays[cityIndex]

			for (let dayInCity = 1; dayInCity <= daysInCity; dayInCity++) {
				// Different activities based on trip type
				let activities = []
				if (tripType === 'cultural') {
					activities = [
						`Visit the historical ${city} Museum`,
						`Guided tour of ${city}'s old town`,
						`Attend a cultural performance in ${city}`,
					]
				} else if (tripType === 'adventure') {
					activities = [
						`Hiking expedition near ${city}`,
						`Water sports activity in ${city}`,
						`Mountain biking adventure outside ${city}`,
					]
				} else if (tripType === 'relaxation') {
					activities = [
						`Spa treatment at a luxury resort in ${city}`,
						`Beach relaxation in ${city}`,
						`Yoga session with views of ${city}`,
					]
				} else if (tripType === 'food') {
					activities = [
						`Cooking class featuring ${countryName} cuisine in ${city}`,
						`Food market tour in ${city}`,
						`Wine tasting experience near ${city}`,
					]
				} else {
					// Mixed
					activities = [
						`City sightseeing tour of ${city}`,
						`Local cultural experience in ${city}`,
						`Free time to explore ${city} at your own pace`,
					]
				}

				// Add accommodation
				activities.push(
					`Overnight in ${accommodationType === 'luxury' ? 'luxury accommodation' : 'comfortable hotel'} in ${city}`,
				)

				// Add transportation between cities
				if (dayInCity === 1 && cityIndex > 0) {
					const prevCity = citiesToVisit[cityIndex - 1]
					const transportType = isPrivate
						? 'private vehicle'
						: 'group transport'
					activities.unshift(
						`Travel from ${prevCity} to ${city} by ${transportType}`,
					)
				}

				days.push({
					day: dayCount++,
					city: city,
					activities: activities,
				})
			}
		}

		// Create the itinerary object
		const itinerary = {
			title: `${durationDays}-Day ${countryName} Experience`,
			subtitle: `${accommodationType.charAt(0).toUpperCase() + accommodationType.slice(1)} ${groupDesc} focusing on ${
				tripType === 'cultural'
					? 'cultural experiences and historical sites'
					: tripType === 'adventure'
						? 'adventure activities and outdoor exploration'
						: tripType === 'relaxation'
							? 'relaxation and wellness experiences'
							: tripType === 'food'
								? 'culinary experiences and food tours'
								: 'diverse experiences including culture, adventure, and relaxation'
			}`,
			startCity: citiesToVisit[0],
			endCity: citiesToVisit[citiesToVisit.length - 1],
			travelers: {
				adults: numAdults,
				children: numChildren,
				infants: numInfants,
				total: totalTravelers,
			},
			accommodation: accommodationType,
			isPrivate: isPrivate,
			days: days,
			price: {
				basePrice: Math.round(totalPrice),
				perPerson: Math.round(basePrice),
				deposit: 50,
			},
		}

		return NextResponse.json({
			success: true,
			itinerary: itinerary,
		})
	} catch (error) {
		console.error('Error generating mock itinerary:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to generate itinerary' },
			{ status: 500 },
		)
	}
}
