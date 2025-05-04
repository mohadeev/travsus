"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";
import { Button, ControlledSwitches, Input, Badge } from "@/components/ui"; // Import from index.ts
import offers from "./offersData.json";

export default function AdvancedPricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const filteredOffers = offers.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.features.some((feature) =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="bg-gradient-light px-0 py-[100px]">
      {/* Gradient background for the top section */}
      <div className="flex justify-center items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose your perfect plan
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-700">
            From free listings to premium partnerships, we have a plan for every
            business size and ambition.
          </p>

          <div className="mt-16 flex flex-col items-center justify-center gap-y-8">
            <div className="flex items-center gap-x-3">
              <span className="text-base font-semibold leading-6 text-gray-900">
                Monthly
              </span>
              <ControlledSwitches
                checked={isAnnual}
                onCheckedChange={() => { setIsAnnual(!isAnnual) }}
                className="data-[state=checked]:bg-primary"
              />
              <span className="text-base font-semibold leading-6 text-gray-900">
                Annually
              </span>
              <Badge variant="secondary" className="rounded-full">
                Save up to 20%
              </Badge>
            </div>

            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search plans or features"
                  className="pl-8 text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards section without gradient */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.name}
              className="rounded-3xl p-8 ring-1 ring-gray-700 bg-gray-100 relative"
              initial={{ scale: 1 }}
              animate={{ scale: hoveredPlan === offer.name ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onMouseEnter={() => setHoveredPlan(offer.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Recommended Badge */}
              {offer.recommended && (
                <div className="absolute top-4 right-4">
                  <Badge variant="primary">Recommended</Badge>
                </div>
              )}

              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                {offer.name}
              </h3>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {isAnnual
                    ? `$${(
                        parseFloat(offer.price.replace(/[^0-9.-]+/g, "")) *
                        12 *
                        0.8
                      ).toFixed(2)}/year`
                    : `${offer.price}`}
                </span>
              </p>
              <Button className="mt-6 w-full">Get started</Button>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Large Tour Operator Badge at the bottom center for the last three offers */}
              {offer.largeTourOperator && (
                <div className="mt-6 text-center">
                  <Badge variant={"green"} className="bg-green-500 text-white">
                    Large Tour Operator
                  </Badge>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
