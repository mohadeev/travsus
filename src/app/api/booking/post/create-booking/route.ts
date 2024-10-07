import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma'; // Make sure to adjust the import based on your project structure
import currentServerUser from '@/app/api/user/currentServerUser';
import getUserData from '@/app/api/user/getUserData';

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const userData = await getUserData();
    if (!userData) {
      console.log("User not found");
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    // Parse the request body
    const body = await request.json();
    const { tourId, numberOfSeats, startDate } =  {
		//body
		tourId: "659041400f478ba631808d60",                  // A unique identifier for the tour
		numberOfSeats: 4,                  // Number of seats to reserve
		startDate: "2024-10-15T09:00:00Z"  // Start date and time of the tour in ISO 8601 format
	};;

    // Validate the request body
    if (!tourId || !numberOfSeats || !startDate) {
	 console.log("Tour ID, number of seats, and start date are required");
      return NextResponse.json(
        { message: 'Tour ID, number of seats, and start date are required' },
        { status: 400 }
      );
    }
console.log("userData" , userData)
    // Fetch the tour to ensure it exists
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json({ message: 'Tour not found' }, { status: 404 });
    }

    // Create a new booking
    const newBooking = await prisma.booking.create({
      data: {
        userId: userData.id, // Assign the booking to the current user
        tourId: tour.id, // Reference the tour in the booking
        numberOfSeats: numberOfSeats, // Number of seats booked
        startDate: new Date(startDate), // Convert the start date to a Date object
      },
    });

    // Return the newly created booking data
    return NextResponse.json(newBooking, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Error creating booking' },
      { status: 500 }
    );
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}
