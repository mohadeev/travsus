"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

const CATEGORIES = [
  { value: "attraction", label: "Attraction" },
  { value: "museum", label: "Museum" },
  { value: "historical", label: "Historical Site" },
  { value: "nature", label: "Nature" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "religious", label: "Religious Site" },
  { value: "park", label: "Park" },
  { value: "monument", label: "Monument" },
  { value: "viewpoint", label: "Viewpoint" },
]

// Function to validate image URL
const isValidImageUrl = (url: string) => {
  if (!url) return true // Empty is valid (optional)

  // Basic URL validation - allow URLs with query parameters
  const urlPattern = /^(https?:\/\/)([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*(\?[^#]*)?(#.*)?$/i
  if (!urlPattern.test(url)) return false

  // Check if URL contains common image indicators
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
  const imageKeywords = ["photo", "image", "picture", "img", "pexels"]

  return (
    imageExtensions.some((ext) => url.toLowerCase().includes(ext)) ||
    imageKeywords.some((keyword) => url.toLowerCase().includes(keyword))
  )
}

export default function AddPlacePage({ params }: { params: { countryId: string } }) {
  const { countryId } = params
  const router = useRouter()
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [countryName, setCountryName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    cityId: "",
    imageUrl: "",
    address: "",
    latitude: "",
    longitude: "",
  })

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Fetch country and cities data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch country, cities, and places data in one request
        const response = await fetch(`/api/countries/placesByCountry/${countryId}`)
        const data = await response.json()

        if (data.country && data.country.name) {
          setCountryName(data.country.name)
        }

        if (data.cities && Array.isArray(data.cities)) {
          setCities(data.cities)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load country and cities data")
      } finally {
        setLoading(false)
      }
    }

    if (countryId) {
      fetchData()
    }
  }, [countryId])

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear validation error if it exists
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    } else if (formData.description.length < 20) {
      errors.description = "Description should be at least 20 characters"
    }

    if (!formData.category) {
      errors.category = "Category is required"
    }

    if (formData.imageUrl && !isValidImageUrl(formData.imageUrl)) {
      errors.imageUrl = "Please enter a valid image URL"
    }

    // Validate coordinates if provided
    if (
      formData.latitude &&
      (isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90)
    ) {
      errors.latitude = "Latitude must be a number between -90 and 90"
    }

    if (
      formData.longitude &&
      (isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180)
    ) {
      errors.longitude = "Longitude must be a number between -180 and 180"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare geo data
      const geo =
        formData.latitude && formData.longitude
          ? { lat: Number(formData.latitude), log: Number(formData.longitude) }
          : { lat: 0, log: 0 }

      // Send data to API
      const response = await fetch("/api/add-place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          cityId: formData.cityId || null,
          countryId,
          imageUrl: formData.imageUrl || null,
          address: formData.address || "",
          geo,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to add place")
      }

      // Show success message
      setSuccess("Place added successfully!")

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        cityId: "",
        imageUrl: "",
        address: "",
        latitude: "",
        longitude: "",
      })

      // Redirect after a short delay
      setTimeout(() => {
        // router.push(`/cmd-admin/${countryId}/places`)
      }, 2000)
    } catch (error) {
      console.error("Error adding place:", error)
      setError(`Failed to add place: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href={`/cmd-admin/${countryId}/places`} className="hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Add New Place in {countryName || countryId}</h1>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-green-700">
          <p>{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading data...</span>
        </div>
      ) : (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Place Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter place name"
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && <p className="text-xs text-red-500">{validationErrors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter place description"
                  className={validationErrors.description ? "border-red-500" : ""}
                  rows={4}
                />
                {validationErrors.description && <p className="text-xs text-red-500">{validationErrors.description}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger
                    id="category"
                    className={`bg-white ${validationErrors.category ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && <p className="text-xs text-red-500">{validationErrors.category}</p>}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City (Optional)</Label>
                <Select value={formData.cityId} onValueChange={(value) => handleInputChange("cityId", value)}>
                  <SelectTrigger id="city" className="bg-white">
                    <SelectValue placeholder="Select a city (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="no-city">No City</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  placeholder="Enter image URL"
                  className={validationErrors.imageUrl ? "border-red-500" : ""}
                />
                {validationErrors.imageUrl && <p className="text-xs text-red-500">{validationErrors.imageUrl}</p>}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude (Optional)</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    placeholder="e.g. 40.7128"
                    className={validationErrors.latitude ? "border-red-500" : ""}
                  />
                  {validationErrors.latitude && <p className="text-xs text-red-500">{validationErrors.latitude}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude (Optional)</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    placeholder="e.g. -74.0060"
                    className={validationErrors.longitude ? "border-red-500" : ""}
                  />
                  {validationErrors.longitude && <p className="text-xs text-red-500">{validationErrors.longitude}</p>}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/cmd-admin/${countryId}/places`)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Place
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
