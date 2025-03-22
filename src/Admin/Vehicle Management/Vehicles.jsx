"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [displayedVehicles, setDisplayedVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("") // Replace brandFilter with userFilter
  const [statusFilter, setStatusFilter] = useState("")
  const [sortBy, setSortBy] = useState("")

  const navigate = useNavigate()

  // Fetch vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        // Replace this with your actual API call
        // const response = await fetch('/api/vehicles')
        // const data = await response.json()

        // Simulating API response with sample data

        const response = await fetch("http://localhost:3000/vehicles/all"); // replace with your backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setVehicles(data.msg); // Assuming the response contains vehicles in `msg` field
          setDisplayedVehicles(data.msg)
          setLoading(false)
        } else {
          console.error("Failed to fetch vehicles.");
        }


      } catch (err) {
        console.error("Error fetching vehicles:", err)
        setError("Failed to load vehicles. Please try again later.")
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // Filter and sort vehicles
  useEffect(() => {
    let filtered = [...vehicles]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply user/admin filter
    // if (userFilter) {
    //   filtered = filtered.filter(vehicle =>
    //     vehicle.user.uname.toLowerCase() === userFilter.toLowerCase()
    //   )
    // }

    if (userFilter) {
      if (userFilter.toLowerCase() === 'admin') {
        filtered = filtered.filter(vehicle =>
          vehicle.user.uname.toLowerCase() === 'admin'
        );
      } else if (userFilter.toLowerCase() !== 'others') {
        filtered = filtered.filter(vehicle =>
          vehicle.user.uname.toLowerCase() !== 'admin'
        );
      }
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(vehicle =>
        vehicle.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case "oldest":
          filtered.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt))
          break
        default:
          break
      }
    }

    setDisplayedVehicles(filtered)
  }, [vehicles, searchTerm, userFilter, statusFilter, sortBy])

  const handleAddVehicle = () => {
    navigate("/admin/addnewvehicles")
  }


  const handleViewDetails = (vehicle) => {
    const vehicleParams = new URLSearchParams({ id: vehicle.id });
    navigate(`/admin/viewdetails?${vehicleParams.toString()}`);
}


  const handleDeleteVehicle = (vehicleId) => {
    // Add confirmation dialog
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      // Replace with your actual delete API call
      // const deleteVehicle = async () => {
      //   try {
      //     await fetch(`/api/vehicles/${vehicleId}`, {
      //       method: 'DELETE'
      //     })
      //     setVehicles(vehicles.filter(v => v.id !== vehicleId))
      //   } catch (err) {
      //     console.error("Error deleting vehicle:", err)
      //     alert("Failed to delete vehicle. Please try again.")
      //   }
      // }
      // deleteVehicle()

      // For now, just filter out the vehicle from the state
      setVehicles(vehicles.filter(v => v.id !== vehicleId))
    }
  }

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent appearance-none bg-white"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="">Filter by User/Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="relative">
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="relative">
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent appearance-none bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Date: Latest</option>
              <option value="oldest">Date: Oldest</option>
            </select>
          </div>
        </div>

        {/* Filter Options */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center text-gray-700 font-medium">
              <Filter className="w-5 h-5 mr-2" />
              Filter by:
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setUserFilter("")
                  setStatusFilter("")
                  setSortBy("")
                }}
                className={`px-4 py-2 rounded-full transition-colors ${!userFilter && !statusFilter && !sortBy ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setUserFilter("admin")}
                className={`px-4 py-2 rounded-full transition-colors ${userFilter === "admin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Admin
              </button>
              <button
                onClick={() => setUserFilter("user")}
                className={`px-4 py-2 rounded-full transition-colors ${userFilter === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                User
              </button>
              <button
                onClick={() => setStatusFilter("available")}
                className={`px-4 py-2 rounded-full transition-colors ${statusFilter === "available" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Available
              </button>
              <button
                onClick={() => setStatusFilter("sold")}
                className={`px-4 py-2 rounded-full transition-colors ${statusFilter === "sold" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Sold
              </button>
              <button
                onClick={() => setSortBy("newest")}
                className={`px-4 py-2 rounded-full transition-colors ${sortBy === "newest" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Date: Latest
              </button>
              <button
                onClick={() => setSortBy("oldest")}
                className={`px-4 py-2 rounded-full transition-colors ${sortBy === "oldest" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Date: Oldest
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="flex-1">
          {error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : loading ? (
            <p className="text-center text-gray-600">Loading vehicles...</p>
          ) : displayedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <img
                      src={(vehicle.images && vehicle.images.length > 0 && `../../server/controllers${vehicle.images[0].image}`) || "/placeholder.svg"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${vehicle.status === "Available" ? "bg-green-100 text-green-800" :
                            vehicle.status === "Sold" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-red-600 font-medium">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-gray-600">Year: {vehicle.year}</p>
                    <p className="text-gray-600">Total Km Run: {vehicle.mile.toLocaleString()} km</p>
                    <p className="mt-2 font-semibold">Rs. {vehicle.price.toLocaleString()}</p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleViewDetails(vehicle)}
                        className="flex-1 bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No vehicles found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
    </div>
  )
}