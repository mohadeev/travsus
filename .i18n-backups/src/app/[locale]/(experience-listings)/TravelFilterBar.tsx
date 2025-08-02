import React, { useState } from "react";

const sortOptions = [
  "Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Rating",
];
const locations = ["All Locations", "New York", "Paris", "Tokyo", "Dubai"];

export default function TravelFilterBar() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  return (
    <div className="w-full py-4 px-2 bg-white shadow-sm space-y-4">
      {/* Date Picker */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium">Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-black rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Sort and Location Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="border border-black rounded px-3 py-2 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border border-black rounded px-3 py-2 text-sm"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
