"use client"

import { useState } from "react"
import { Search, Car, User, Calendar, Clock, MapPin, AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react"

// Mock data for active rentals
const initialRentals = [
  {
    id: "RNT-2024-001",
    customer: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
    },
    vehicle: {
      name: "Tesla Model 3",
      plate: "ABC 123",
      color: "Red",
      gps: { lat: 40.7128, lng: -74.006 },
    },
    startDate: "2024-02-15",
    endDate: "2024-02-25",
    status: "on_time",
    totalAmount: 750,
    deposit: 500,
  },
  {
    id: "RNT-2024-002",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
    },
    vehicle: {
      name: "BMW X5",
      plate: "XYZ 789",
      color: "Black",
      gps: { lat: 40.7589, lng: -73.9851 },
    },
    startDate: "2024-02-18",
    endDate: "2024-02-28",
    status: "extended",
    totalAmount: 900,
    deposit: 600,
  },
  {
    id: "RNT-2024-003",
    customer: {
      name: "Mike Wilson",
      email: "mike.w@email.com",
      phone: "+1 (555) 345-6789",
    },
    vehicle: {
      name: "Mercedes C-Class",
      plate: "DEF 456",
      color: "Silver",
      gps: { lat: 40.7549, lng: -73.984 },
    },
    startDate: "2024-02-20",
    endDate: "2024-02-23",
    status: "overdue",
    totalAmount: 450,
    deposit: 400,
  },
]

export default function ActiveRentals() {
  const [rentals, setRentals] = useState(initialRentals)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRental, setSelectedRental] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case "on_time":
        return "bg-green-100 text-green-800"
      case "extended":
        return "bg-[#4F46E5]/10 text-[#4F46E5]"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "on_time":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "extended":
        return <Clock className="w-5 h-5 text-[#4F46E5]" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getDaysRemaining = (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || rental.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    // Add ml-64 to offset the fixed sidebar
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      {/* Add padding inside this container */}
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Active Rentals</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500">Total Active</h3>
                <div className="p-3 bg-[#4F46E5]/10 rounded-full">
                  <Car className="w-6 h-6 text-[#4F46E5]" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{rentals.length}</p>
              <div className="mt-2 text-sm text-gray-600">Currently rented vehicles</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500">On Time</h3>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{rentals.filter((r) => r.status === "on_time").length}</p>
              <div className="mt-2 text-sm text-green-600">Regular returns expected</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500">Attention Needed</h3>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{rentals.filter((r) => r.status === "overdue").length}</p>
              <div className="mt-2 text-sm text-red-600">Overdue returns</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rentals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="on_time">On Time</option>
                <option value="extended">Extended</option>
                <option value="overdue">Overdue</option>
              </select>
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showMap
                    ? "bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5]"
                    : "border-gray-300 text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5]"
                }`}
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Rentals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Rental Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rental.id}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}
                    >
                      {getStatusIcon(rental.status)}
                      <span className="ml-1">{rental.status.replace("_", " ").toUpperCase()}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedRental(rental)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Vehicle Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="w-4 h-4" />
                    <span className="font-medium">{rental.vehicle.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Plate: {rental.vehicle.plate} • {rental.vehicle.color}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{rental.customer.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{rental.customer.phone}</div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {rental.startDate} - {rental.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{getDaysRemaining(rental.endDate)} days remaining</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <button className="px-3 py-1 text-sm bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors">
                    Extend
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Process Return
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rental Detail Modal */}
        {selectedRental && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRental(null)}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Rental Details</h2>
                  <p className="text-sm text-gray-500 mt-1">View rental information and manage status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedRental.status)}`}
                  >
                    {getStatusIcon(selectedRental.status)}
                    <span className="ml-1">{selectedRental.status.replace("_", " ").toUpperCase()}</span>
                  </span>
                </div>
                <button onClick={() => setSelectedRental(null)} className="p-2 text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle</p>
                    <p className="text-gray-900">{selectedRental.vehicle.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Plate</p>
                    <p className="text-gray-900">{selectedRental.vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p className="text-gray-900">{selectedRental.vehicle.color}</p>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-gray-900">{selectedRental.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedRental.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{selectedRental.customer.phone}</p>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Rental Details</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="text-gray-900">{selectedRental.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="text-gray-900">{selectedRental.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Days Remaining</p>
                    <p className="text-gray-900">{getDaysRemaining(selectedRental.endDate)} days</p>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-gray-900">Rs. {selectedRental.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Security Deposit</p>
                    <p className="text-gray-900">Rs. {selectedRental.deposit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                <button
                  onClick={() => setSelectedRental(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] font-medium transition-colors">
                  Extend Rental
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
                  Process Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

