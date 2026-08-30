export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import getUserData from "../user/getUserData"

export async function GET(request: NextRequest) {
  console.log("GET /api/payout-methods - Fetching payout methods")
  const userData = await getUserData({})
  if (!userData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: userId } = userData
  if (!userId) {
    console.error("GET /api/payout-methods - Missing userId")
    return NextResponse.json({ message: "User ID is required" }, { status: 400 })
  }

  try {
    const payoutMethods = await prisma.payoutMethod.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        email: true,
        accountHolderName: true,
        accountNumber: true,
        bankName: true,
        country: true,
        currency: true,
        isDefault: true,
        createdAt: true,
      },
    })

    console.log(
      `GET /api/payout-methods - Successfully fetched ${payoutMethods.length} payout methods for user ${userId}`,
    )
    return NextResponse.json({ payoutMethods })
  } catch (error) {
    console.error("GET /api/payout-methods - Error fetching payout methods:", error)
    return NextResponse.json({ message: "Failed to fetch payout methods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("POST /api/payout-methods - Saving new payout method")
  const payoutData = await request.json()
  const userData = await getUserData({})

  if (!userData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: userId } = userData

  if (!userId) {
    console.error("POST /api/payout-methods - Missing userId")
    return NextResponse.json({ message: "User ID is required" }, { status: 400 })
  }

  // Validate required fields based on type
  if (payoutData.type === "paypal" && !payoutData.email) {
    return NextResponse.json({ message: "Email is required for PayPal payout method" }, { status: 400 })
  }

  if (
    payoutData.type === "bank_account" &&
    (!payoutData.accountHolderName || !payoutData.accountNumber || !payoutData.bankName)
  ) {
    return NextResponse.json(
      { message: "Account holder name, account number, and bank name are required for bank account payout method" },
      { status: 400 },
    )
  }

  try {
    // Check if this is the first payout method (should be default)
    const existingMethodsCount = await prisma.payoutMethod.count({
      where: { userId },
    })

    const isDefault = existingMethodsCount === 0 || payoutData.isDefault === true

    // If setting as default, unset any existing default
    if (isDefault && existingMethodsCount > 0) {
      await prisma.payoutMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    // Create the payout method
    const payoutMethod = await prisma.payoutMethod.create({
      data: {
        userId,
        type: payoutData.type,
        email: payoutData.email,
        accountHolderName: payoutData.accountHolderName,
        accountNumber: payoutData.accountNumber,
        bankName: payoutData.bankName,
        swiftCode: payoutData.swiftCode,
        iban: payoutData.iban,
        routingNumber: payoutData.routingNumber,
        country: payoutData.country,
        currency: payoutData.currency,
        isDefault,
      },
    })

    console.log(`POST /api/payout-methods - Successfully saved new payout method for user ${userId}`)
    return NextResponse.json({
      success: true,
      message: "Payout method saved successfully",
      payoutMethod,
    })
  } catch (error) {
    console.error("POST /api/payout-methods - Error saving payout method:", error)
    return NextResponse.json({ message: "Failed to save payout method" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  console.log("DELETE /api/payout-methods - Deleting payout method")
  const { id } = await request.json()
  const userData = await getUserData({})

  if (!userData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: userId } = userData

  if (!userId || !id) {
    console.error("DELETE /api/payout-methods - Missing required fields")
    return NextResponse.json({ message: "User ID and payout method ID are required" }, { status: 400 })
  }

  try {
    // Find the payout method to check if it belongs to the user
    const payoutMethod = await prisma.payoutMethod.findUnique({
      where: { id },
    })

    if (!payoutMethod) {
      return NextResponse.json({ message: "Payout method not found" }, { status: 404 })
    }

    if (payoutMethod.userId !== userId) {
      return NextResponse.json({ message: "Unauthorized to delete this payout method" }, { status: 403 })
    }

    // If this is the default method, we need to check if there are other methods
    if (payoutMethod.isDefault) {
      const count = await prisma.payoutMethod.count({
        where: { userId },
      })

      if (count > 1) {
        // Find another method to set as default
        const anotherMethod = await prisma.payoutMethod.findFirst({
          where: {
            userId,
            id: { not: id },
          },
        })

        if (anotherMethod) {
          await prisma.payoutMethod.update({
            where: { id: anotherMethod.id },
            data: { isDefault: true },
          })
        }
      }
    }

    // Delete the payout method
    await prisma.payoutMethod.delete({
      where: { id },
    })

    console.log(`DELETE /api/payout-methods - Successfully deleted payout method ${id} for user ${userId}`)
    return NextResponse.json({
      success: true,
      message: "Payout method deleted successfully",
    })
  } catch (error) {
    console.error("DELETE /api/payout-methods - Error deleting payout method:", error)
    return NextResponse.json({ message: "Failed to delete payout method" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  console.log("PATCH /api/payout-methods - Updating payout method")
  const { id, action } = await request.json()
  const userData = await getUserData({})

  if (!userData) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: userId } = userData

  if (!userId || !id || !action) {
    console.error("PATCH /api/payout-methods - Missing required fields")
    return NextResponse.json({ message: "User ID, payout method ID, and action are required" }, { status: 400 })
  }

  try {
    if (action === "setDefault") {
      // Find the payout method to check if it belongs to the user
      const payoutMethod = await prisma.payoutMethod.findUnique({
        where: { id },
      })

      if (!payoutMethod) {
        return NextResponse.json({ message: "Payout method not found" }, { status: 404 })
      }

      if (payoutMethod.userId !== userId) {
        return NextResponse.json({ message: "Unauthorized to update this payout method" }, { status: 403 })
      }

      // Update all user's payout methods to not be default
      await prisma.payoutMethod.updateMany({
        where: { userId },
        data: { isDefault: false },
      })

      // Set the selected method as default
      await prisma.payoutMethod.update({
        where: { id },
        data: { isDefault: true },
      })

      console.log(`PATCH /api/payout-methods - Successfully set payout method ${id} as default for user ${userId}`)
      return NextResponse.json({
        success: true,
        message: "Default payout method updated successfully",
      })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("PATCH /api/payout-methods - Error updating payout method:", error)
    return NextResponse.json({ message: "Failed to update payout method" }, { status: 500 })
  }
}
