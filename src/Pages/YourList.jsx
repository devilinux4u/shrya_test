"use client"

import { useState } from "react"
import { CheckCircle, Clock, Car, Calendar, DollarSign } from "lucide-react"
import WishlistForm from "../Components/WishlistForm"

// Sample data - In real app, this would come from an API
const wishlistItems = [
  {
    id: 1,
    vehicleName: "Toyota Camry",
    brand: "Toyota",
    model: "Camry",
    year: "2024",
    kmRun: "50,000",
    fuelType: "Petrol",
    color: "Black",
    budget: "45,000",
    purpose: "buy",
    status: "arrived",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-02-01",
  },
  {
    id: 2,
    vehicleName: "BMW X5",
    brand: "BMW",
    model: "X5",
    year: "2023",
    kmRun: "30,000",
    fuelType: "Diesel",
    color: "White",
    budget: "800",
    purpose: "rent",
    status: "pending",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-02-03",
  },
  // Add more items as needed
]

const YourList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBook = (id) => {
    console.log("Booking vehicle with id:", id)
    // Add booking logic here
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <h1 className="mt-12 text-4xl font-bold mb-4">
        <span className="text-orange-500">Your </span>
        <span className="font-mono"> List</span>
      </h1>

      {/* Wish Vehicle Button */}
      <div className="mb-8">
        <button
          onClick={toggleModal}
          className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          Wish Vehicle
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.vehicleName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  {item.status === "arrived" ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Arrived
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Pending
                    </span>
                  )}
                </div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.purpose === "buy" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {item.purpose === "buy" ? "Buy" : "Rent"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{item.vehicleName}</h3>
                  <p className="text-gray-600">
                    {item.brand} {item.model}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Car className="w-4 h-4 mr-2" />
                    <span>{item.kmRun} km</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{item.year}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span
                      className="w-3 h-3 rounded-full bg-gray-400 mr-2"
                      style={{ backgroundColor: item.color.toLowerCase() }}
                    />
                    <span>{item.color}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>${item.budget}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Requested on: {new Date(item.dateSubmitted).toLocaleDateString()}
                  </span>
                  {item.status === "arrived" && (
                    <button
                      onClick={() => handleBook(item.id)}
                      className="bg-[#4B3EAE] text-white px-6 py-2 rounded-lg hover:bg-[#3c318a] transition-colors"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {wishlistItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No vehicles in your wishlist yet.</p>
          </div>
        )}
      </div>

      {/* WishlistForm Modal */}
      <WishlistForm isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  )
}

export default YourList

