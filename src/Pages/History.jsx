"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Car,
  Package,
  Heart,
  ShoppingCart,
  Tag,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
} from "lucide-react"

const History = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const activitiesPerPage = 10

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockActivities = [
        {
          id: "ACT-1001",
          type: "rental",
          title: "Toyota Camry Booked",
          description: "5-day rental of Toyota Camry",
          date: "2024-03-15",
          status: "active",
          details: {
            bookingId: "BK-1001",
            vehicleName: "Toyota Camry",
            vehicleImage: "/placeholder.svg?height=200&width=300",
            startDate: "2024-03-15",
            endDate: "2024-03-20",
            price: 25000,
            location: "Pragati Marga, Kathmandu",
          },
        },
        {
          id: "ACT-1002",
          type: "lost",
          title: "Reported Lost Item",
          description: "MacBook Pro Laptop reported as lost",
          date: "2024-03-10",
          status: "active",
          details: {
            reportId: "LF-1001",
            itemName: "MacBook Pro Laptop",
            itemImage: "/placeholder.svg?height=200&width=300",
            location: "Library, Pragati Marga",
            category: "Electronics",
          },
        },
        {
          id: "ACT-1003",
          type: "wishlist",
          title: "Added to Wishlist",
          description: "Honda CR-V added to wishlist",
          date: "2024-03-08",
          status: "active",
          details: {
            itemId: "WL-1001",
            itemName: "Honda CR-V",
            itemImage: "/placeholder.svg?height=200&width=300",
            category: "SUV",
            price: 4500000,
          },
        },
        {
          id: "ACT-1004",
          type: "buy",
          title: "Vehicle Purchase",
          description: "Purchased Hyundai i20",
          date: "2024-03-05",
          status: "completed",
          details: {
            transactionId: "TR-1001",
            vehicleName: "Hyundai i20",
            vehicleImage: "/placeholder.svg?height=200&width=300",
            price: 2500000,
            paymentMethod: "Bank Transfer",
          },
        },
        {
          id: "ACT-1005",
          type: "found",
          title: "Reported Found Item",
          description: "Car Keys with Remote reported as found",
          date: "2024-03-05",
          status: "resolved",
          details: {
            reportId: "LF-1002",
            itemName: "Car Keys with Remote",
            itemImage: "/placeholder.svg?height=200&width=300",
            location: "Parking Lot, Pragati Marga",
            category: "Personal Items",
          },
        },
        {
          id: "ACT-1006",
          type: "sell",
          title: "Vehicle Listed for Sale",
          description: "Listed Maruti Swift for sale",
          date: "2024-02-28",
          status: "active",
          details: {
            listingId: "SL-1001",
            vehicleName: "Maruti Swift",
            vehicleImage: "/placeholder.svg?height=200&width=300",
            price: 1800000,
            year: 2019,
            mileage: "45,000 km",
          },
        },
        {
          id: "ACT-1007",
          type: "rental",
          title: "Honda CR-V Rental Completed",
          description: "5-day rental of Honda CR-V",
          date: "2024-02-25",
          status: "completed",
          details: {
            bookingId: "BK-1002",
            vehicleName: "Honda CR-V",
            vehicleImage: "/placeholder.svg?height=200&width=300",
            startDate: "2024-03-01",
            endDate: "2024-03-05",
            price: 30000,
            location: "Pragati Marga, Kathmandu",
          },
        },
        {
          id: "ACT-1008",
          type: "wishlist",
          title: "Removed from Wishlist",
          description: "Mahindra Scorpio removed from wishlist",
          date: "2024-02-20",
          status: "removed",
          details: {
            itemId: "WL-1002",
            itemName: "Mahindra Scorpio",
            itemImage: "/placeholder.svg?height=200&width=300",
            category: "SUV",
            price: 3800000,
          },
        },
        {
          id: "ACT-1009",
          type: "found",
          title: "Reported Found Item",
          description: "Wristwatch reported as found",
          date: "2024-02-20",
          status: "resolved",
          details: {
            reportId: "LF-1006",
            itemName: "Wristwatch",
            itemImage: "/placeholder.svg?height=200&width=300",
            location: "Washroom, Pragati Marga",
            category: "Accessories",
          },
        },
        {
          id: "ACT-1010",
          type: "sell",
          title: "Vehicle Sold",
          description: "Sold Toyota Corolla",
          date: "2024-02-15",
          status: "completed",
          details: {
            transactionId: "TR-1002",
            vehicleName: "Toyota Corolla",
            vehicleImage: "/placeholder.svg?height=200&width=300",
            price: 2200000,
            buyer: "John Doe",
            paymentMethod: "Bank Transfer",
          },
        },
        {
          id: "ACT-1011",
          type: "rental",
          title: "Maruti Swift Rental Cancelled",
          description: "Cancelled booking for Maruti Swift",
          date: "2024-02-10",
          status: "cancelled",
          details: {
            bookingId: "BK-1005",
            vehicleName: "Maruti Swift",
            vehicleImage: "/placeholder.svg?height=200&width=300",
            startDate: "2024-02-15",
            endDate: "2024-02-20",
            price: 15000,
            location: "Pragati Marga, Kathmandu",
          },
        },
        {
          id: "ACT-1012",
          type: "buy",
          title: "Purchase Inquiry",
          description: "Inquired about Tata Nexon",
          date: "2024-02-05",
          status: "pending",
          details: {
            inquiryId: "INQ-1001",
            vehicleName: "Tata Nexon",
            vehicleImage: "/placeholder.svg?height=200&width=300",
            price: 2800000,
            dealerResponse: "Pending",
          },
        },
      ]

      // Sort by date (newest first)
      mockActivities.sort((a, b) => new Date(b.date) - new Date(a.date))

      setActivities(mockActivities)
      setFilteredActivities(mockActivities)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter activities based on type and search query
  useEffect(() => {
    let result = activities

    // Filter by type
    if (activeFilter !== "all") {
      result = result.filter((activity) => activity.type === activeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.id.toLowerCase().includes(query) ||
          (activity.details &&
            activity.details.vehicleName &&
            activity.details.vehicleName.toLowerCase().includes(query)) ||
          (activity.details && activity.details.itemName && activity.details.itemName.toLowerCase().includes(query)),
      )
    }

    setFilteredActivities(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [activeFilter, searchQuery, activities])

  // Get current activities for pagination
  const indexOfLastActivity = currentPage * activitiesPerPage
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage
  const currentActivities = filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity)
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage)

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case "rental":
        return <Car className="w-5 h-5" />
      case "lost":
        return <AlertTriangle className="w-5 h-5" />
      case "found":
        return <Package className="w-5 h-5" />
      case "wishlist":
        return <Heart className="w-5 h-5" />
      case "buy":
        return <ShoppingCart className="w-5 h-5" />
      case "sell":
        return <Tag className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  // Get activity color based on type
  const getActivityColor = (type) => {
    switch (type) {
      case "rental":
        return "bg-blue-100 text-blue-800"
      case "lost":
        return "bg-red-100 text-red-800"
      case "found":
        return "bg-green-100 text-green-800"
      case "wishlist":
        return "bg-purple-100 text-purple-800"
      case "buy":
        return "bg-amber-100 text-amber-800"
      case "sell":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        }
      case "completed":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        }
      case "pending":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          icon: <Clock className="w-4 h-4 mr-1" />,
        }
      case "cancelled":
      case "removed":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <X className="w-4 h-4 mr-1" />,
        }
      case "resolved":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        }
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: <Clock className="w-4 h-4 mr-1" />,
        }
    }
  }

  // Get activity type label
  const getActivityTypeLabel = (type) => {
    switch (type) {
      case "rental":
        return "Vehicle Rental"
      case "lost":
        return "Lost Item Report"
      case "found":
        return "Found Item Report"
      case "wishlist":
        return "Wishlist"
      case "buy":
        return "Vehicle Purchase"
      case "sell":
        return "Vehicle Sale"
      default:
        return "Activity"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
          <p className="mt-2 text-gray-600">View all your activities and transactions</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
            <div className={`sm:flex gap-2 ${showFilters ? "flex" : "hidden"} flex-wrap`}>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("rental")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "rental"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Rentals
              </button>
              <button
                onClick={() => setActiveFilter("lost")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "lost"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setActiveFilter("found")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "found"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Found
              </button>
              <button
                onClick={() => setActiveFilter("wishlist")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "wishlist"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setActiveFilter("buy")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "buy"
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Purchases
              </button>
              <button
                onClick={() => setActiveFilter("sell")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "sell"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Sales
              </button>
            </div>
          </div>
        </div>

        {/* Activities Timeline */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "No activities match your search criteria."
                : activeFilter !== "all"
                  ? `You don't have any ${activeFilter} activities.`
                  : "You haven't performed any activities yet."}
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Explore Services
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {currentActivities.map((activity, index) => {
                const activityColor = getActivityColor(activity.type)
                const statusBadge = getStatusBadge(activity.status)

                return (
                  <div
                    key={activity.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${index === 0 ? "rounded-t-xl" : ""} ${
                      index === currentActivities.length - 1 ? "rounded-b-xl" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Activity Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activityColor.split(" ")[0]}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                          <div className="flex items-center mt-1 sm:mt-0">
                            <span className="text-sm text-gray-500 mr-3">{formatDate(activity.date)}</span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}
                            >
                              {statusBadge.icon}
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{activity.description}</p>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activityColor}`}
                          >
                            {getActivityTypeLabel(activity.type)}
                          </span>

                          <span className="text-sm text-gray-500">#{activity.id}</span>

                          <div className="flex-grow"></div>

                          <button
                            onClick={() => setSelectedActivity(activity)}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4 border-t border-gray-200">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedActivity.title}</h2>
              <button onClick={() => setSelectedActivity(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center mb-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getActivityColor(selectedActivity.type).split(" ")[0]}`}
              >
                {getActivityIcon(selectedActivity.type)}
              </div>
              <span className="text-sm font-medium">{getActivityTypeLabel(selectedActivity.type)}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedActivity.status).bgColor} ${getStatusBadge(selectedActivity.status).textColor}`}
              >
                {getStatusBadge(selectedActivity.status).icon}
                {selectedActivity.status.charAt(0).toUpperCase() + selectedActivity.status.slice(1)}
              </span>
            </div>

            {selectedActivity.details.vehicleImage || selectedActivity.details.itemImage ? (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={
                    selectedActivity.details.vehicleImage || selectedActivity.details.itemImage || "/placeholder.svg"
                  }
                  alt={selectedActivity.details.vehicleName || selectedActivity.details.itemName}
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : null}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Activity ID</span>
                <span className="text-sm font-medium">{selectedActivity.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-medium">{formatDate(selectedActivity.date)}</span>
              </div>

              {/* Rental specific details */}
              {selectedActivity.type === "rental" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Booking ID</span>
                    <span className="text-sm font-medium">{selectedActivity.details.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Vehicle</span>
                    <span className="text-sm font-medium">{selectedActivity.details.vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="text-sm font-medium">
                      {formatDate(selectedActivity.details.startDate)} - {formatDate(selectedActivity.details.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="text-sm font-medium">Rs. {selectedActivity.details.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-medium">{selectedActivity.details.location}</span>
                  </div>
                </>
              )}

              {/* Lost/Found specific details */}
              {(selectedActivity.type === "lost" || selectedActivity.type === "found") && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Report ID</span>
                    <span className="text-sm font-medium">{selectedActivity.details.reportId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Item</span>
                    <span className="text-sm font-medium">{selectedActivity.details.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-sm font-medium">{selectedActivity.details.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-medium">{selectedActivity.details.location}</span>
                  </div>
                </>
              )}

              {/* Wishlist specific details */}
              {selectedActivity.type === "wishlist" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Item ID</span>
                    <span className="text-sm font-medium">{selectedActivity.details.itemId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Item</span>
                    <span className="text-sm font-medium">{selectedActivity.details.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-sm font-medium">{selectedActivity.details.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="text-sm font-medium">Rs. {selectedActivity.details.price.toLocaleString()}</span>
                  </div>
                </>
              )}

              {/* Buy specific details */}
              {selectedActivity.type === "buy" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transaction ID</span>
                    <span className="text-sm font-medium">
                      {selectedActivity.details.transactionId || selectedActivity.details.inquiryId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Vehicle</span>
                    <span className="text-sm font-medium">{selectedActivity.details.vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="text-sm font-medium">Rs. {selectedActivity.details.price.toLocaleString()}</span>
                  </div>
                  {selectedActivity.details.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Method</span>
                      <span className="text-sm font-medium">{selectedActivity.details.paymentMethod}</span>
                    </div>
                  )}
                  {selectedActivity.details.dealerResponse && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Dealer Response</span>
                      <span className="text-sm font-medium">{selectedActivity.details.dealerResponse}</span>
                    </div>
                  )}
                </>
              )}

              {/* Sell specific details */}
              {selectedActivity.type === "sell" && (
                <>
                  {selectedActivity.details.listingId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Listing ID</span>
                      <span className="text-sm font-medium">{selectedActivity.details.listingId}</span>
                    </div>
                  )}
                  {selectedActivity.details.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Transaction ID</span>
                      <span className="text-sm font-medium">{selectedActivity.details.transactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Vehicle</span>
                    <span className="text-sm font-medium">{selectedActivity.details.vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="text-sm font-medium">Rs. {selectedActivity.details.price.toLocaleString()}</span>
                  </div>
                  {selectedActivity.details.year && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Year</span>
                      <span className="text-sm font-medium">{selectedActivity.details.year}</span>
                    </div>
                  )}
                  {selectedActivity.details.mileage && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Mileage</span>
                      <span className="text-sm font-medium">{selectedActivity.details.mileage}</span>
                    </div>
                  )}
                  {selectedActivity.details.buyer && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Buyer</span>
                      <span className="text-sm font-medium">{selectedActivity.details.buyer}</span>
                    </div>
                  )}
                </>
              )}

              <div>
                <span className="text-sm text-gray-500 block mb-1">Description</span>
                <p className="text-sm">{selectedActivity.description}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History

