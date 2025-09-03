import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function translateWithDeepL(text: string, targetLanguage: string, sourceLanguage = "auto") {
  const apiKey = "4b99c9d3-2244-4a01-a4ac-a03a3dee1a15:fx"
  const baseUrl = "https://api-free.deepl.com/v2"

  try {
    let targetLang = targetLanguage.split("-")[0].toUpperCase()

    // Special cases for DeepL language codes
    if (targetLanguage === "zh-CN") targetLang = "ZH"
    if (targetLanguage === "en-US") targetLang = "EN-US"
    if (targetLanguage === "pt-PT") targetLang = "PT-PT"

    const response = await fetch(`${baseUrl}/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
        ...(sourceLanguage !== "auto" && { source_lang: sourceLanguage.split("-")[0].toUpperCase() }),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] DeepL API error response:`, errorText)
      throw new Error(`DeepL API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.translations || data.translations.length === 0) {
      throw new Error("No translation returned from DeepL")
    }

    return {
      translatedText: data.translations[0].text,
      detectedSourceLanguage: data.translations[0].detected_source_language,
      confidence: 1.0,
      provider: "deepl",
    }
  } catch (error) {
    console.error("DeepL translation error:", error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const supportedLanguages = [
      "en-US",
      "es-ES",
      "de-DE",
      "ja-JP",
      "pt-PT",
      "it-IT",
      "fr-FR",
      "ru-RU",
      "zh-CN",
      "ko-KR",
    ]

    console.log(`[v0] Starting advanced translation for ALL reviews to all supported languages`)

    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        titleContent: {
          include: {
            translations: true,
          },
        },
        contentContent: {
          include: {
            translations: true,
          },
        },
      },
    })

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ error: "No reviews found" }, { status: 404 })
    }

    console.log(`[v0] Found ${reviews.length} reviews to translate`)

    const results = {
      totalReviews: reviews.length,
      supportedLanguages,
      reviewResults: [] as any[],
      summary: {
        totalTranslations: reviews.length * supportedLanguages.length,
        successful: 0,
        failed: 0,
      },
    }

    for (const review of reviews) {
      console.log(`[v0] Processing review ${review.id}: "${review.title}"`)

      const reviewResult = {
        reviewId: review.id,
        originalTexts: {
          title: review.title,
          content: review.content,
        },
        translations: {} as any,
      }

      for (const targetLanguage of supportedLanguages) {
        console.log(`[v0] Processing language: ${targetLanguage} for review ${review.id}`)

        reviewResult.translations[targetLanguage] = {
          title: null,
          content: null,
        }

        if (review.title) {
          try {
            console.log(`[v0] Translating title to ${targetLanguage}: "${review.title}"`)
            const titleTranslation = await translateWithDeepL(review.title, targetLanguage, "auto")

            reviewResult.translations[targetLanguage].title = titleTranslation
            console.log(`[v0] Title translated to ${targetLanguage}: "${titleTranslation.translatedText}"`)

            if (review.titleContent) {
              await prisma.translatedText.deleteMany({
                where: {
                  contentId: review.titleContent.id,
                  languageCode: targetLanguage,
                },
              })

              await prisma.translatedText.create({
                data: {
                  contentId: review.titleContent.id,
                  languageCode: targetLanguage,
                  text: titleTranslation.translatedText,
                },
              })
              console.log(`[v0] Title translation saved for ${targetLanguage}`)
            }
          } catch (error) {
            console.error(`[v0] Title translation failed for ${targetLanguage}:`, error)
            reviewResult.translations[targetLanguage].title = {
              error: error instanceof Error ? error.message : "Translation failed",
            }
            results.summary.failed++
          }
        }

        if (review.content) {
          try {
            console.log(`[v0] Translating content to ${targetLanguage}: "${review.content.substring(0, 100)}..."`)
            const contentTranslation = await translateWithDeepL(review.content, targetLanguage, "auto")

            reviewResult.translations[targetLanguage].content = contentTranslation
            console.log(
              `[v0] Content translated to ${targetLanguage}: "${contentTranslation.translatedText.substring(0, 100)}..."`,
            )

            if (review.contentContent) {
              await prisma.translatedText.deleteMany({
                where: {
                  contentId: review.contentContent.id,
                  languageCode: targetLanguage,
                },
              })

              await prisma.translatedText.create({
                data: {
                  contentId: review.contentContent.id,
                  languageCode: targetLanguage,
                  text: contentTranslation.translatedText,
                },
              })
              console.log(`[v0] Content translation saved for ${targetLanguage}`)
            }

            results.summary.successful++
          } catch (error) {
            console.error(`[v0] Content translation failed for ${targetLanguage}:`, error)
            reviewResult.translations[targetLanguage].content = {
              error: error instanceof Error ? error.message : "Translation failed",
            }
            results.summary.failed++
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      results.reviewResults.push(reviewResult)
    }

    return NextResponse.json({
      success: true,
      message: `Advanced translation completed for ${results.totalReviews} reviews in ${results.summary.successful} translations`,
      results,
    })
  } catch (error) {
    console.error("[v0] Advanced translation error:", error)
    return NextResponse.json(
      {
        error: "Translation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
