import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma'; // Adjust based on your project structure

export async function POST(request: NextRequest) {
  try {
    // Update all tours and set creatorId to "631e5e41027691bd18f0cffa"
    const updatedTours = await prisma.tour.updateMany({
      data: {
        creatorId: "631e5e41027691bd18f0cffa", // New creator ID
      },
    });

    // Return the number of updated records
    return NextResponse.json({ message: `${updatedTours.count} tours updated` }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating tours:', error);
    return NextResponse.json(
      { message: 'Error updating tours' },
      { status: 500 }
    );
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}
