"use client"

import { useState } from "react"
import { Star, Heart, Users, DoorOpen, Fuel, Gauge, ArrowLeft, ArrowRight } from "lucide-react"

const RentalVehicleDesc = () => {
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("description")

  const vehicle = {
    name: "Land Rover Defender",
    model: "2023",
    rating: 4.5,
    totalReviews: 128,
    price: "3000",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    specs: {
      seats: "5",
      doors: "4",
      transmission: "Automatic",
      fuel: "Diesel",
      mileage: "15 km/l",
      engine: "2.0L 4-cylinder",
      power: "296 hp",
      features: ["AC", "Sunroof", "Cruise Control", "Airbags", "Parking Sensors", "360° Camera"],
    },
    description:
      "The Land Rover Defender is the epitome of luxury and capability. This SUV combines sophisticated design with legendary Land Rover all-terrain expertise. The vehicle features a robust architecture and advanced technology to ensure exceptional performance both on and off-road.",
    reviews: [
      {
        id: 1,
        user: "John Doe",
        rating: 5,
        date: "2024-02-15",
        comment: "Excellent vehicle, perfect for both city driving and off-road adventures.",
      },
      {
        id: 2,
        user: "Jane Smith",
        rating: 4,
        date: "2024-02-10",
        comment: "Great performance and comfort, though fuel efficiency could be better.",
      },
    ],
  }

  const handleImageNavigation = (direction) => {
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1))
    } else {
      setCurrentImageIndex((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">About this vehicle</h3>
            <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-sm text-gray-600">Engine</p>
                <p className="font-semibold">{vehicle.specs.engine}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Power</p>
                <p className="font-semibold">{vehicle.specs.power}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mileage</p>
                <p className="font-semibold">{vehicle.specs.mileage}</p>
              </div>
            </div>
          </div>
        )
      case "features":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicle.specs.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-[#ff6b00] rounded-full" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )
      case "reviews":
        return (
          <div className="space-y-6">
            {vehicle.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.user}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Header Section */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
          <p className="text-gray-500">{vehicle.model} Model</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.floor(vehicle.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({vehicle.totalReviews} reviews)</span>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full ${isLiked ? "bg-red-50" : "bg-gray-50"} transition-colors`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-8 bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={vehicle.images[currentImageIndex] || "/placeholder.svg"}
          alt={`${vehicle.name} view ${currentImageIndex + 1}`}
          className="w-full h-[400px] object-cover"
        />
        <button
          onClick={() => handleImageNavigation("prev")}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleImageNavigation("next")}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {vehicle.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${currentImageIndex === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {vehicle.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative rounded-lg overflow-hidden ${
              currentImageIndex === index ? "ring-2 ring-[#ff6b00]" : ""
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${vehicle.name} thumbnail ${index + 1}`}
              className="w-full h-24 object-cover"
            />
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="mb-8">
        <p className="text-3xl font-bold text-[#ff6b00]">
          Rs. {vehicle.price}
          <span className="text-base font-normal text-gray-600">/day</span>
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <Users className="w-6 h-6 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Passengers</p>
            <p className="font-semibold">{vehicle.specs.seats} Seats</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <DoorOpen className="w-6 h-6 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Doors</p>
            <p className="font-semibold">{vehicle.specs.doors} Doors</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <Gauge className="w-6 h-6 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Transmission</p>
            <p className="font-semibold">{vehicle.specs.transmission}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <Fuel className="w-6 h-6 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Fuel Type</p>
            <p className="font-semibold">{vehicle.specs.fuel}</p>
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="w-full">
        <div className="flex border-b mb-8">
          {["description", "features", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize ${
                activeTab === tab ? "border-b-2 border-[#ff6b00] text-[#ff6b00]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-16">{renderTabContent()}</div>
      </div>

      {/* Book Now Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
        <button className="w-full md:w-auto px-8 py-3 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors">
          Book Now
        </button>
      </div>
    </div>
  )
}

export default RentalVehicleDesc

