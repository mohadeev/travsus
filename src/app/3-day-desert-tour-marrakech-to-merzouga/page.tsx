import TourHeader from "./components/tour-header"
import HeroSection from "./components/hero-section"
import TourOverview from "./components/tour-overview"
import TourHighlights from "./components/tour-highlights"
import TourItinerary from "./components/tour-itinerary"
import PricingCalculator from "./components/pricing-calculator"
import TourGallery from "./components/tour-gallery"
import TourFAQ from "./components/tour-faq"
import BookingCTA from "./components/booking-cta"
import { LanguageProvider } from "./components/language-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "3-Day Marrakech to Merzouga Desert Tour | TravsUS",
  description:
    "Experience the magic of the Sahara desert on our 3-day tour from Marrakech to Merzouga. Visit Ait Ben Haddou, Dades Valley, and enjoy a camel trek through golden dunes.",
  keywords: [
    "Morocco desert tour",
    "Marrakech to Merzouga",
    "3 day desert tour",
    "Sahara desert trip",
    "Camel trekking Morocco",
    "Ait Ben Haddou tour",
    "Dades valley tour",
    "Merzouga desert camp",
    "Morocco travel",
  ],
  openGraph: {
    title: "3-Day Marrakech to Merzouga Desert Tour | TravsUS",
    description:
      "Experience the magic of the Sahara desert on our 3-day tour from Marrakech to Merzouga via Boumalne Dades",
    url: "https://morocco-desert-tours.com/3-day-desert-tour-marrakech-to-merzouga",
    siteName: "TravsUS",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://morocco-desert-tours.com/3-day-desert-tour-marrakech-to-merzouga",
    languages: {
      en: "https://morocco-desert-tours.com/en/3-day-desert-tour-marrakech-to-merzouga",
      es: "https://morocco-desert-tours.com/es/3-day-desert-tour-marrakech-to-merzouga",
      it: "https://morocco-desert-tours.com/it/3-day-desert-tour-marrakech-to-merzouga",
      pt: "https://morocco-desert-tours.com/pt/3-day-desert-tour-marrakech-to-merzouga",
      zh: "https://morocco-desert-tours.com/zh/3-day-desert-tour-marrakech-to-merzouga",
      eu: "https://morocco-desert-tours.com/eu/3-day-desert-tour-marrakech-to-merzouga",
    },
  },
}

export default function DesertTourPage() {
  return (
    <LanguageProvider>
      <main className="flex min-h-screen flex-col bg-white">
        <TourHeader />
        <HeroSection />
        <TourOverview />
        <TourHighlights />
        <TourItinerary />
        <TourGallery />
        <PricingCalculator />
        <TourFAQ />
        <BookingCTA />
      </main>
    </LanguageProvider>
  )
}
