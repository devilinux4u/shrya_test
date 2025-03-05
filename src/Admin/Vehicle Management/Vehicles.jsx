import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Filter, Check, X, Clock, DollarSign, Calendar } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [displayedVehicles, setDisplayedVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("")
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
    if (userFilter) {
      if (userFilter.toLowerCase() === 'admin') {
        filtered = filtered.filter(vehicle =>
          vehicle.user.uname.toLowerCase() === 'admin'
        );
      } else if (userFilter.toLowerCase() === 'user') {
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

  const handleEditVehicle = (vehicle) => {
    // Add your edit logic here
    console.log("Edit vehicle:", vehicle.id)
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

  const clearAllFilters = () => {
    setUserFilter("")
    setStatusFilter("")
    setSortBy("")
    setSearchTerm("")
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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by make, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
          <div className="flex items-center text-gray-700 font-medium mb-4">
            <Filter className="w-5 h-5 mr-2 text-[#4F46E5]" />
            <span className="text-lg">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* User Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Posted By</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setUserFilter("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !userFilter 
                      ? "bg-[#4F46E5] text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setUserFilter("admin")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    userFilter === "admin" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => setUserFilter("user")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    userFilter === "user" 
                      ? "bg-indigo-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  User
                </button>
              </div>
            </div>
            
            {/* Status Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !statusFilter 
                      ? "bg-[#4F46E5] text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter("available")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    statusFilter === "available" 
                      ? "bg-green-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Check className={`w-4 h-4 mr-1 ${statusFilter === "available" ? "text-white" : "text-green-500"}`} />
                  Available
                </button>
                <button
                  onClick={() => setStatusFilter("sold")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    statusFilter === "sold" 
                      ? "bg-red-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <X className={`w-4 h-4 mr-1 ${statusFilter === "sold" ? "text-white" : "text-red-500"}`} />
                  Sold
                </button>
              </div>
            </div>
            
            {/* Sort Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !sortBy 
                      ? "bg-[#4F46E5] text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setSortBy("price-asc")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "price-asc" 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <DollarSign className={`w-4 h-4 mr-1 ${sortBy === "price-asc" ? "text-white" : "text-blue-500"}`} />
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortBy("price-desc")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "price-desc" 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <DollarSign className={`w-4 h-4 mr-1 ${sortBy === "price-desc" ? "text-white" : "text-blue-500"}`} />
                  Price: High to Low
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "newest" 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Calendar className={`w-4 h-4 mr-1 ${sortBy === "newest" ? "text-white" : "text-blue-500"}`} />
                  Date: Latest
                </button>
                <button
                  onClick={() => setSortBy("oldest")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "oldest" 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock className={`w-4 h-4 mr-1 ${sortBy === "oldest" ? "text-white" : "text-blue-500"}`} />
                  Date: Oldest
                </button>
              </div>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          {(userFilter || statusFilter || sortBy || searchTerm) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#4F46E5] hover:text-[#4338CA] flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </button>
            </div>
          )}
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
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No vehicles found</h3>
              <p className="text-gray-500">
                {searchTerm || userFilter || statusFilter || sortBy
                  ? "Try adjusting your filters or search terms"
                  : "There are no vehicles to display"}
              </p>
              {(searchTerm || userFilter || statusFilter || sortBy) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}