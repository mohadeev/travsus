import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import getUserData from "../../user/getUserData"

export async function POST(request: NextRequest) {
  console.log("POST /api/user/deactivate - Deactivating account")

  try {
    const userData = await getUserData({})
    if (!userData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: userId } = userData
    if (!userId) {
      console.error("POST /api/user/deactivate - Missing userId")
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    // Get the reason from the request body
    const { reason } = await request.json()

    // In a real application, you would want to:
    // 1. Log the deactivation reason for analytics
    // 2. Backup or archive user data if needed
    // 3. Handle any pending transactions, bookings, etc.
    // 4. Maybe send a confirmation email

    // Update the user status to deactivated
    await prisma.user.update({
      where: { id: userId },
      data: {
        active: false,
        deactivatedAt: new Date(),
        deactivationReason: reason,
      },
    })

    console.log(`POST /api/user/deactivate - Successfully deactivated account for user ${userId}`)
    return NextResponse.json({
      success: true,
      message: "Account successfully deactivated",
    })
  } catch (error) {
    console.error("POST /api/user/deactivate - Error deactivating account:", error)
    return NextResponse.json({ message: "Failed to deactivate account" }, { status: 500 })
  }
}
