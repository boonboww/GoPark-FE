'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function HeroSection() {
  const [location, setLocation] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const [arriving, setArriving] = useState<Date | null>(new Date())
  const [leaving, setLeaving] = useState<Date | null>(new Date(new Date().getTime() + 60 * 60 * 1000))

  const allLocations = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Biên Hòa", "Nha Trang"]

  const handleLocationChange = (value: string) => {
    setLocation(value)
    if (value.length > 0) {
      const filtered = allLocations.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc)
    setLocation(loc)
    setSuggestions([])
  }

  return (
    <section
      className="relative flex-1 bg-cover bg-center flex flex-col items-center justify-center px-4 py-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1563720227543-d8f5a4f5fbb4?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      {/* Search Box */}
      <div className="bg-white/90 p-6 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Find Parking Near Your Destination
        </h1>
        <div className="relative">
          <Input
            placeholder="Enter city or location"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow">
              {suggestions.map((sug, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectLocation(sug)}
                >
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Time Selection */}
      {selectedLocation && (
        <div className="mt-6 bg-white/90 p-6 rounded-xl shadow-md w-full max-w-xl">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Selected: <span className="text-blue-600">{selectedLocation}</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Arriving */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Arriving - Date</label>
              <DatePicker
                selected={arriving}
                onChange={(date) => {
                  if (!date || !arriving) return
                  const newDate = new Date(date)
                  newDate.setHours(arriving.getHours())
                  newDate.setMinutes(arriving.getMinutes())
                  setArriving(newDate)
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full border px-3 py-2 rounded"
              />

              <label className="text-sm font-medium text-gray-600 block mt-4 mb-1">Arriving - Time</label>
              <DatePicker
                selected={arriving}
                onChange={(time) => {
                  if (!time || !arriving) return
                  const newTime = new Date(arriving)
                  newTime.setHours(time.getHours())
                  newTime.setMinutes(time.getMinutes())
                  setArriving(newTime)
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Leaving */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Leaving - Date</label>
              <DatePicker
                selected={leaving}
                onChange={(date) => {
                  if (!date || !leaving) return
                  const newDate = new Date(date)
                  newDate.setHours(leaving.getHours())
                  newDate.setMinutes(leaving.getMinutes())
                  setLeaving(newDate)
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full border px-3 py-2 rounded"
              />

              <label className="text-sm font-medium text-gray-600 block mt-4 mb-1">Leaving - Time</label>
              <DatePicker
                selected={leaving}
                onChange={(time) => {
                  if (!time || !leaving) return
                  const newTime = new Date(leaving)
                  newTime.setHours(time.getHours())
                  newTime.setMinutes(time.getMinutes())
                  setLeaving(newTime)
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <Button className="mt-6 w-full bg-sky-400 hover:bg-sky-500">
            Find Parking
          </Button>
        </div>
      )}
    </section>
  )
}
