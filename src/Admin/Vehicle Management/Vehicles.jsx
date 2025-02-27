"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Vehicles() {
  const [vehicles] = useState([
    {
      id: 1,
      brand: "TOYOTA",
      model: "LAND CRUISER PRADO",
      year: "2023",
      price: "10,000,000",
      status: "Available",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yYEfMtCEIUbS41feUOsWLakxRbQ3Xd.png",
    },
    {
      id: 2,
      brand: "TOYOTA",
      model: "FORTUNER",
      year: "2023",
      price: "8,500,000",
      status: "Sold",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yYEfMtCEIUbS41feUOsWLakxRbQ3Xd.png",
    },
    // Add more vehicles as needed
  ])

  const navigate = useNavigate()

  const handleAddVehicle = () => {
    navigate("/admin/addnewvehicles")
  }

  return (
    // Add ml-64 to offset the fixed sidebar and remove the original p-8 padding
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      {/* Add padding inside this container instead */}
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-semibold">Vehicles</h1>
          <button
            onClick={handleAddVehicle}
            className="flex items-center gap-2 bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent appearance-none bg-white">
              <option value="">Filter by Brand</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
            </select>
          </div>
          <div className="relative">
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent appearance-none bg-white">
              <option value="">Filter by Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="relative">
            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent appearance-none bg-white">
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-[#DC2626] text-lg font-bold">{vehicle.brand}</h3>
                  <p className="text-2xl font-bold tracking-wider">{vehicle.model}</p>
                  <p className="text-gray-600">Year: {vehicle.year}</p>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-2xl font-bold">
                    Rs. <span className="text-[#DC2626]">{vehicle.price}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors">
                    View Details
                  </button>
                  <button className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

