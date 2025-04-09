"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TourReviewProps {
  tourData: {
    name?: string
    subtitle?: string
    overview?: string
    highlights?: { name: string }[]
    days?: { name: string; description: string }[]
    pricingTiers?: {
      minSeats: number
      maxSeats: number
      pricing: {
        pricePerDay: number
        totalPrice: number
        currency: string
      }
    }[]
    images?: { public_id: string; url: string; alt?: string; isFeatured?: boolean }[]
    region?: { region?: string; country?: string }
    start?: { name?: string }
    end?: { name?: string }
    lang?: string
    tags?: string[]
  }
}

export default function TourReview({ tourData }: TourReviewProps) {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean
  }>({
    "basic-info": true,
    overview: true,
    highlights: true,
    itinerary: true,
    pricing: true,
    images: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Tour Review</h2>
      <p className="text-sm text-muted-foreground">Review all the information for your tour before publishing.</p>

      <Card className="mb-4">
        <CardHeader
          className="flex flex-row items-center justify-between py-3 cursor-pointer"
          onClick={() => toggleSection("basic-info")}
        >
          <CardTitle className="text-lg">Basic Information</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {expandedSections["basic-info"] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedSections["basic-info"] && (
          <CardContent className="pt-0">
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <dt className="font-medium text-sm">Name:</dt>
                <dd>{tourData.name || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-sm">Subtitle:</dt>
                <dd>{tourData.subtitle || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-sm">Region:</dt>
                <dd>{tourData.region?.region || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-sm">Country:</dt>
                <dd>{tourData.region?.country || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-sm">Start Location:</dt>
                <dd>{tourData.start?.name || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-sm">End Location:</dt>
                <dd>{tourData.end?.name || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-sm">Language:</dt>
                <dd>{tourData.lang || "Not specified"}</dd>
              </div>
              <div>
                <dt className="font-medium text-sm">Tags:</dt>
                <dd>{tourData.tags?.join(", ") || "None"}</dd>
              </div>
            </dl>
          </CardContent>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader
          className="flex flex-row items-center justify-between py-3 cursor-pointer"
          onClick={() => toggleSection("overview")}
        >
          <CardTitle className="text-lg">Overview</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {expandedSections["overview"] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedSections["overview"] && (
          <CardContent className="pt-0">
            <p className="whitespace-pre-line">{tourData.overview || "No overview provided."}</p>
          </CardContent>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader
          className="flex flex-row items-center justify-between py-3 cursor-pointer"
          onClick={() => toggleSection("highlights")}
        >
          <CardTitle className="text-lg">Highlights</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {expandedSections["highlights"] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedSections["highlights"] && (
          <CardContent className="pt-0">
            {tourData.highlights && tourData.highlights.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {tourData.highlights.map((highlight, index) => (
                  <li key={index}>{highlight.name}</li>
                ))}
              </ul>
            ) : (
              <p>No highlights added.</p>
            )}
          </CardContent>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader
          className="flex flex-row items-center justify-between py-3 cursor-pointer"
          onClick={() => toggleSection("itinerary")}
        >
          <CardTitle className="text-lg">Itinerary</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {expandedSections["itinerary"] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedSections["itinerary"] && (
          <CardContent className="pt-0">
            {tourData.days && tourData.days.length > 0 ? (
              <div className="space-y-4">
                {tourData.days.map((day, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">{day.name}</h4>
                    <p className="whitespace-pre-line">{day.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No itinerary days added.</p>
            )}
          </CardContent>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader
          className="flex flex-row items-center justify-between py-3 cursor-pointer"
          onClick={() => toggleSection("pricing")}
        >
          <CardTitle className="text-lg">Pricing</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {expandedSections["pricing"] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedSections["pricing"] && (
          <CardContent className="pt-0">
            {tourData.pricingTiers && tourData.pricingTiers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seats
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price Per Day
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Currency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tourData.pricingTiers.map((tier, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          {tier.minSeats} - {tier.maxSeats}
                        </td>
                        <td className="px-4 py-2">{tier.pricing.pricePerDay}</td>
                        <td className="px-4 py-2">{tier.pricing.totalPrice}</td>
                        <td className="px-4 py-2">{tier.pricing.currency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No pricing tiers added.</p>
            )}
          </CardContent>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader
          className="flex flex-row items-center justify-between py-3 cursor-pointer"
          onClick={() => toggleSection("images")}
        >
          <CardTitle className="text-lg">Images</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {expandedSections["images"] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {expandedSections["images"] && (
          <CardContent className="pt-0">
            {tourData.images && tourData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tourData.images.map((image) => (
                  <div key={image.public_id} className="relative">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || "Tour image"}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    {image.isFeatured && (
                      <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No images added.</p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}

