"use client"

import { MapPin, Calendar, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom" // Import useNavigate

export default function SellVehicle() {
  const navigate = useNavigate(); // Initialize navigate

  const handleYourList = () => {
    navigate('/UserSalesList'); // Use navigate for routing
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={handleYourList} className="bg-[#6366f1] text-white px-6 py-2 rounded-full hover:bg-[#5558e6] transition-colors">
            Your List
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-[#ff6b00]">Sell a</span> Vehicle?
          </h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            The purpose of Elite Drives is to be the best choice in automobiles for its customers and to be part of the
            special moments of their lives.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 max-w-6xl mx-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Ownership */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ownership</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Km Run */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Km Run</label>
              <input
                type="number"
                placeholder="100000"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              />
            </div>

            {/* Fuel */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fuel</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose in map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose in map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500000">₹0 - ₹5L</SelectItem>
                  <SelectItem value="500000-1000000">₹5L - ₹10L</SelectItem>
                  <SelectItem value="1000000-2000000">₹10L - ₹20L</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose in map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="certified">Certified Pre-owned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose in map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mileage */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mileage</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Transmission</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Images Upload */}
            <div className="space-y-2 col-span-full">
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drag and drop your images here</p>
              </div>
            </div>
          </form>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-[#6366f1] text-white px-12 py-3 rounded-full text-lg hover:bg-[#5558e6] transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
