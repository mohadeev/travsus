// app/api/regenerate-tour-slugs/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import slugify from "@/utils/slugify"

const prisma = new PrismaClient()

export async function GET() {
  console.log("🔄 Regenerating tour slugs...")

  try {
    const tours = await prisma.tour.findMany({
      include: {
        nameContent: {
          include: {
            translations: true,
          },
        },
        places: true,
      },
    })

    console.log(`📊 Processing ${tours.length} tours...`)

    const results: { id: string; slugs: string[] }[] = []

    for (const tour of tours) {
      const slugs: string[] = []

      if (tour.nameContent && tour.nameContent.translations.length > 0) {
        for (const translation of tour.nameContent.translations) {
          const languageCode = translation.languageCode
          const translatedName = translation.text

          const nameSlug = slugify(translatedName)

          let locationPath = "tours"
          if (tour.places && tour.places.length > 0) {
            const firstPlace = tour.places[0] as any
            if (firstPlace.country) {
              const countrySlug = slugify(firstPlace.country)
              locationPath = countrySlug

              if (firstPlace.city) {
                const citySlug = slugify(firstPlace.city)
                locationPath += `/${citySlug}`
              }

              locationPath += "/tours"
            }
          }

          const fullSlug = `/${languageCode}/${locationPath}/${nameSlug}/${tour.id}`

          slugs.push(fullSlug)
          console.log(`  ✅ ${languageCode}: ${fullSlug}`)
        }
      } else {
        const fallbackName = tour.name || `tour-${tour.id}`
        const baseSlug = slugify(fallbackName)
        const fallbackSlug = `/en-US/tours/${baseSlug}/${tour.id}`
        slugs.push(fallbackSlug)
        console.log(`  ⚠️  Fallback: ${fallbackSlug}`)
      }

      results.push({ id: tour.id, slugs })

      // Uncomment if you want to persist into DB:
      // await prisma.tour.update({
      //   where: { id: tour.id },
      //   data: { slugs },
      // })
    }

    console.log("🎉 Tour slugs regeneration completed!")
    return NextResponse.json({ success: true, count: results.length, results })
  } catch (error) {
    console.error("❌ Error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
