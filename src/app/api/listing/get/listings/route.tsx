import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma'; // Adjust based on your project structure

export async function GET(request: NextRequest) {
  try {
    // Query all tours where creatorId is "631e5e41027691bd18f0cffa"
    const tours = await prisma.tour.findMany({
      where: {
        creatorId: "631e5e41027691bd18f0cffa", // The specific creatorId
      },
    });

    // Check if any tours were found
    if (tours.length === 0) {
      return NextResponse.json({ message: 'No tours found for this creator' }, { status: 404 });
    }

    // Return the tours
    return NextResponse.json(tours, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { message: 'Error fetching tours' },
      { status: 500 }
    );
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}
