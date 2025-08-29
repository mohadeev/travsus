"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useTranslations } from '@/lib/i18n'

interface ReviewImageGalleryProps {
  images: string[]
}

const ReviewImageGallery: React.FC<ReviewImageGalleryProps> = ({ images }) => {
  const t = useTranslations("app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_ReviewImageGallery");
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="cursor-pointer relative overflow-hidden rounded-md h-24 w-24"
            onClick={() => setSelectedImage(img)}
          >
            <Image
              src={img || "/placeholder.svg"}
              alt={t('Review_Photo_Alt')}
              width={120}
              height={120}
              className="object-cover h-full w-full transition-transform hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
            >
              <X size={24} />
            </button>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={t('Review_Photo_Alt')}
              width={1200}
              height={800}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ReviewImageGallery