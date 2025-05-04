"use server"
import { prisma } from "@/lib/prisma"

export async function getPayoutMethods(userId: string) {
  try {
    const payoutMethods = await prisma.payoutMethod.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, data: payoutMethods }
  } catch (error) {
    console.error("Error fetching payout methods:", error)
    return { success: false, error: "Failed to fetch payout methods" }
  }
}

export async function addPayoutMethod(userId: string, data: any) {
  try {
    // Validate required fields based on type
    if (data.type === "paypal" && !data.email) {
      return { success: false, error: "Email is required for PayPal" }
    }

    if (data.type === "bank_account" && (!data.accountHolderName || !data.accountNumber || !data.bankName)) {
      return { success: false, error: "Account holder name, account number, and bank name are required" }
    }

    // Check if this is the first payout method (should be default)
    const existingMethods = await prisma.payoutMethod.count({
      where: { userId },
    })

    const isDefault = existingMethods === 0

    // Create the payout method
    const payoutMethod = await prisma.payoutMethod.create({
      data: {
        userId,
        type: data.type,
        email: data.email,
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        swiftCode: data.swiftCode,
        iban: data.iban,
        routingNumber: data.routingNumber,
        country: data.country,
        currency: data.currency,
        isDefault,
      },
    })

    return { success: true, data: payoutMethod }
  } catch (error) {
    console.error("Error adding payout method:", error)
    return { success: false, error: "Failed to add payout method" }
  }
}

export async function deletePayoutMethod(id: string, userId: string) {
  try {
    // Find the payout method to check if it belongs to the user
    const payoutMethod = await prisma.payoutMethod.findUnique({
      where: { id },
    })

    if (!payoutMethod) {
      return { success: false, error: "Payout method not found" }
    }

    if (payoutMethod.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    // If this is the default method, we shouldn't allow deletion unless it's the only one
    if (payoutMethod.isDefault) {
      const count = await prisma.payoutMethod.count({
        where: { userId },
      })

      if (count > 1) {
        return { success: false, error: "Cannot delete default payout method. Set another method as default first." }
      }
    }

    await prisma.payoutMethod.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting payout method:", error)
    return { success: false, error: "Failed to delete payout method" }
  }
}

export async function setDefaultPayoutMethod(id: string, userId: string) {
  try {
    // Find the payout method to check if it belongs to the user
    const payoutMethod = await prisma.payoutMethod.findUnique({
      where: { id },
    })

    if (!payoutMethod) {
      return { success: false, error: "Payout method not found" }
    }

    if (payoutMethod.userId !== userId) {
      return { success: false, error: "Unauthorized" }
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

    return { success: true }
  } catch (error) {
    console.error("Error setting default payout method:", error)
    return { success: false, error: "Failed to set default payout method" }
  }
}
