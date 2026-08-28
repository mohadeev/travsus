export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// DELETE /api/tours/[id] - Delete tour
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete all translatable content (translations will cascade)
      await tx.translatableContent.deleteMany({
        where: {
          entity: "tour",
          entityId: params.id,
        },
      })

      // Delete the tour
      await tx.tour.delete({
        where: { id: params.id },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tour:", error)
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 })
  }
}
