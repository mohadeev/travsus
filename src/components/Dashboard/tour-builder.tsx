"use client"

import { useState } from "react"
import { Plus, Trash, Upload, MapPin, Calendar, DollarSign, Users, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

const tourSchema = z.object({
  name: z.string().min(2, { message: "Tour name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.string().min(1, { message: "Price is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  maxGuests: z.string().min(1, { message: "Maximum guests is required" }),
  minGuests: z.string().optional(),
  included: z.string().optional(),
  notIncluded: z.string().optional(),
})

type TourFormValues = z.infer<typeof tourSchema>

type ItineraryDay = {
  id: string
  title: string
  description: string
  activities: string[]
  accommodation: string
  meals: string[]
}

type TourImage = {
  id: string
  url: string
  alt: string
  isFeatured: boolean
}

export function TourBuilder({ tour }: { tour?: any }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    tour?.itinerary || [
      {
        id: "1",
        title: "Day 1: Arrival",
        description: "Welcome to your tour! Arrive at the destination and get settled in.",
        activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"],
        accommodation: "Hotel",
        meals: ["Dinner"],
      },
    ],
  )
  const [images, setImages] = useState<TourImage[]>(tour?.images || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: tour?.name || "",
      description: tour?.description || "",
      price: tour?.price?.toString() || "",
      duration: tour?.duration?.toString() || "",
      location: tour?.location || "",
      maxGuests: tour?.maxGuests?.toString() || "",
      minGuests: tour?.minGuests?.toString() || "",
      included: tour?.included || "",
      notIncluded: tour?.notIncluded || "",
    },
  })

  function addItineraryDay() {
    const newDay = {
      id: Date.now().toString(),
      title: `Day ${itinerary.length + 1}`,
      description: "",
      activities: [],
      accommodation: "",
      meals: [],
    }
    setItinerary([...itinerary, newDay])
  }

  function removeItineraryDay(id: string) {
    setItinerary(itinerary.filter((day) => day.id !== id))
  }

  function updateItineraryDay(id: string, field: keyof ItineraryDay, value: any) {
    setItinerary(
      itinerary.map((day) => {
        if (day.id === id) {
          return { ...day, [field]: value }
        }
        return day
      }),
    )
  }

  function addActivity(dayId: string) {
    setItinerary(
      itinerary.map((day) => {
        if (day.id === dayId) {
          return { ...day, activities: [...day.activities, ""] }
        }
        return day
      }),
    )
  }

  function updateActivity(dayId: string, index: number, value: string) {
    setItinerary(
      itinerary.map((day) => {
        if (day.id === dayId) {
          const newActivities = [...day.activities]
          newActivities[index] = value
          return { ...day, activities: newActivities }
        }
        return day
      }),
    )
  }

  function removeActivity(dayId: string, index: number) {
    setItinerary(
      itinerary.map((day) => {
        if (day.id === dayId) {
          const newActivities = [...day.activities]
          newActivities.splice(index, 1)
          return { ...day, activities: newActivities }
        }
        return day
      }),
    )
  }

  function addMeal(dayId: string) {
    setItinerary(
      itinerary.map((day) => {
        if (day.id === dayId) {
          return { ...day, meals: [...day.meals, ""] }
        }
        return day
      }),
    )
  }

  function updateMeal(dayId: string, index: number, value: string) {
    setItinerary(
      itinerary.map((day) => {
        if (day.id === dayId) {
          const newMeals = [...day.meals]
          newMeals[index] = value
          return { ...day, meals: newMeals }
        }
        return day
      }),
    )
  }

  function removeMeal(dayId: string, index: number) {
    setItinerary(
      itinerary.map((day) => {
        if (day.id === dayId) {
          const newMeals = [...day.meals]
          newMeals.splice(index, 1)
          return { ...day, meals: newMeals }
        }
        return day
      }),
    )
  }

  function addImage() {
    const newImage = {
      id: Date.now().toString(),
      url: "/placeholder.svg?height=300&width=500",
      alt: "",
      isFeatured: images.length === 0, // First image is featured by default
    }
    setImages([...images, newImage])
  }

  function removeImage(id: string) {
    setImages(images.filter((image) => image.id !== id))
  }

  function updateImage(id: string, field: keyof TourImage, value: any) {
    setImages(
      images.map((image) => {
        if (image.id === id) {
          return { ...image, [field]: value }
        }
        return image
      }),
    )
  }

  function setFeaturedImage(id: string) {
    setImages(
      images.map((image) => ({
        ...image,
        isFeatured: image.id === id,
      })),
    )
  }

  async function onSubmit(data: TourFormValues) {
    setIsSubmitting(true)
    try {
      // Combine form data with itinerary and images
      const tourData = {
        ...data,
        itinerary,
        images,
      }

      // Here you would typically send this data to your API
      console.log("Submitting tour data:", tourData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Tour saved successfully",
        description: "Your tour has been saved and is ready to publish.",
      })

      // Redirect to tours page
      router.push("/dashboard/tours")
    } catch (error) {
      console.error("Error saving tour:", error)
      toast({
        title: "Error saving tour",
        description: "There was a problem saving your tour. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Basic Details</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tour Details</CardTitle>
                  <CardDescription>Enter the basic information about your tour.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tour Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris Explorer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="Paris, France" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Experience the magic of Paris with our guided tour package..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="1299" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (days)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="7" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Guests</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-8" placeholder="20" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tour Itinerary</CardTitle>
                    <CardDescription>Create a day-by-day itinerary for your tour.</CardDescription>
                  </div>
                  <Button type="button" onClick={addItineraryDay}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Day
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {itinerary.map((day, index) => (
                    <Card key={day.id} className="border border-muted">
                      <CardHeader className="flex flex-row items-center justify-between py-3">
                        <Input
                          value={day.title}
                          onChange={(e) => updateItineraryDay(day.id, "title", e.target.value)}
                          className="font-medium text-lg border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder={`Day ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItineraryDay(day.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            value={day.description}
                            onChange={(e) => updateItineraryDay(day.id, "description", e.target.value)}
                            placeholder="Describe the day's activities"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <FormLabel>Activities</FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addActivity(day.id)}
                              className="h-7"
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Add
                            </Button>
                          </div>
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex items-center gap-2 mb-2">
                              <Input
                                value={activity}
                                onChange={(e) => updateActivity(day.id, actIndex, e.target.value)}
                                placeholder="Activity description"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeActivity(day.id, actIndex)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormLabel>Accommodation</FormLabel>
                            <Input
                              value={day.accommodation}
                              onChange={(e) => updateItineraryDay(day.id, "accommodation", e.target.value)}
                              placeholder="Hotel name or type"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>Meals</FormLabel>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addMeal(day.id)}
                                className="h-7"
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {day.meals.map((meal, mealIndex) => (
                                <div key={mealIndex} className="flex items-center gap-2">
                                  <Input
                                    value={meal}
                                    onChange={(e) => updateMeal(day.id, mealIndex, e.target.value)}
                                    placeholder="Breakfast, Lunch, Dinner"
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMeal(day.id, mealIndex)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {itinerary.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No itinerary days added yet. Click "Add Day" to create your tour schedule.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tour Images</CardTitle>
                    <CardDescription>Add images to showcase your tour.</CardDescription>
                  </div>
                  <Button type="button" onClick={addImage}>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="relative aspect-video">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.alt}
                            className="object-cover w-full h-full"
                          />
                          {image.isFeatured && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                              Featured
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3 space-y-2">
                          <Input
                            value={image.alt}
                            onChange={(e) => updateImage(image.id, "alt", e.target.value)}
                            placeholder="Image description"
                            className="text-sm"
                          />
                          <div className="flex items-center justify-between">
                            {!image.isFeatured && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFeaturedImage(image.id)}
                                className="text-xs h-8"
                              >
                                Set as Featured
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(image.id)}
                              className="text-xs h-8 ml-auto"
                            >
                              <Trash className="h-3.5 w-3.5 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {images.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No images added yet. Click "Add Image" to upload tour photos.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inclusions Tab */}
            <TabsContent value="inclusions" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tour Inclusions & Exclusions</CardTitle>
                  <CardDescription>Specify what is included and not included in the tour price.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="included"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's Included</FormLabel>
                        <FormDescription>
                          List items that are included in the tour price (one per line).
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="- Accommodation in 4-star hotels
- Daily breakfast
- Airport transfers
- Professional tour guide
- Entrance fees to attractions"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notIncluded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's Not Included</FormLabel>
                        <FormDescription>
                          List items that are not included in the tour price (one per line).
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="- International flights
- Travel insurance
- Personal expenses
- Optional activities
- Meals not mentioned"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/tours")}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save & Publish Tour"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

