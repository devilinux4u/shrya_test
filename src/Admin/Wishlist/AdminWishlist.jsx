"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Check, X, Bell, Car, DollarSign, User, Clock, Mail, Phone, CalendarDays, AlertTriangle } from 'lucide-react'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function AdminWishlist() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPurpose, setFilterPurpose] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notifyLoading, setNotifyLoading] = useState(false)
  const [itemToNotify, setItemToNotify] = useState(null)

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/admin/wishlist')
        // const data = await response.json()

        // Mock data
        const mockData = [
          {
            id: 1,
            userId: 4,
            userName: "John Doe",
            userEmail: "john.doe@example.com",
            userPhone: "+977 9812345678",
            purpose: "buy",
            model: "Toyota",
            vehicleName: "Land Cruiser",
            year: "2023",
            color: "White",
            budget: "10000000",
            kmRun: "5000",
            ownership: "1st",
            fuelType: "diesel",
            description:
              "Looking for a Toyota Land Cruiser in excellent condition with low mileage. Prefer white color and diesel engine.",
            images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
            status: "pending",
            createdAt: "2025-03-15 14:30:22",
            updatedAt: "2025-03-15 14:30:22",
          },
          {
            id: 2,
            userId: 8,
            userName: "Jane Smith",
            userEmail: "jane.smith@example.com",
            userPhone: "+977 9876543210",
            purpose: "rent",
            model: "Honda",
            vehicleName: "Civic",
            year: "2022",
            color: "Black",
            budget: "5000",
            duration: "monthly",
            kmRun: "",
            ownership: "",
            fuelType: "petrol",
            description: "Need a Honda Civic for monthly rental. Prefer black color and recent model.",
            images: ["/placeholder.svg?height=200&width=300"],
            status: "available",
            createdAt: "2025-03-10 09:15:45",
            updatedAt: "2025-03-18 11:20:33",
          },
          {
            id: 3,
            userId: 12,
            userName: "Robert Johnson",
            userEmail: "robert.j@example.com",
            userPhone: "+977 9845123678",
            purpose: "buy",
            model: "Hyundai",
            vehicleName: "Tucson",
            year: "2021",
            color: "Blue",
            budget: "4500000",
            kmRun: "15000",
            ownership: "2nd",
            fuelType: "hybrid",
            description:
              "Looking for a used Hyundai Tucson in good condition. Blue color preferred but open to other options.",
            images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
            status: "pending",
            createdAt: "2025-03-17 16:45:10",
            updatedAt: "2025-03-17 16:45:10",
          },
        ]

        setWishlistItems(mockData)
        setFilteredItems(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching wishlist items:", error)
        toast.error("Failed to load wishlist items")
        setLoading(false)
      }
    }

    fetchWishlistItems()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...wishlistItems]

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((item) => item.status === filterStatus)
    }

    // Apply purpose filter
    if (filterPurpose !== "all") {
      result = result.filter((item) => item.purpose === filterPurpose)
    }

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.vehicleName.toLowerCase().includes(search) ||
          item.model.toLowerCase().includes(search) ||
          item.userName.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search),
      )
    }

    setFilteredItems(result)
  }, [wishlistItems, searchTerm, filterStatus, filterPurpose])

  const handleStatusChange = async (id, newStatus) => {
    try {
      // In a real app, you would call your API
      // const response = await fetch(`/api/admin/wishlist/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })
      // const data = await response.json()

      // Mock update
      const updatedItems = wishlistItems.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) }
          : item,
      )

      setWishlistItems(updatedItems)
      toast.success(`Status updated to ${newStatus}`)

      // If we were viewing the item details, update that too
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleNotifyUser = async (e) => {
    e.preventDefault()

    if (!notificationMessage.trim()) {
      toast.error("Please enter a notification message")
      return
    }

    try {
      setNotifyLoading(true)

      // In a real app, you would call your API
      // const response = await fetch(`/api/admin/wishlist/${itemToNotify.id}/notify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: notificationMessage })
      // })
      // const data = await response.json()

      // Mock notification
      setTimeout(() => {
        toast.success(`Notification sent to ${itemToNotify.userName}`)
        setShowNotifyModal(false)
        setNotificationMessage("")
        setNotifyLoading(false)
        setItemToNotify(null)
      }, 1000)
    } catch (error) {
      console.error("Error sending notification:", error)
      toast.error("Failed to send notification")
      setNotifyLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "available":
        return "bg-green-100 text-green-800"
      case "fulfilled":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />
      case "available":
        return <Check className="w-4 h-4 mr-1" />
      case "fulfilled":
        return <Check className="w-4 h-4 mr-1" />
      case "cancelled":
        return <X className="w-4 h-4 mr-1" />
      default:
        return <AlertTriangle className="w-4 h-4 mr-1" />
    }
  }

  const openNotifyModal = (item) => {
    setItemToNotify(item)
    setShowNotifyModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 ml-64 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading wishlist items...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 ml-64 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Wishlist Management</h1>
        <p className="text-gray-600">Manage customer wishlist requests and help them find their desired vehicles.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vehicle, model, or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
        <div className="flex items-center text-gray-700 font-medium mb-4">
          <Filter className="w-5 h-5 mr-2 text-[#ff6b00]" />
          <span className="text-lg">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  filterStatus === "all" 
                    ? "bg-[#ff6b00] text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                  filterStatus === "pending" 
                    ? "bg-yellow-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className={`w-4 h-4 mr-1 ${filterStatus === "pending" ? "text-white" : "text-yellow-500"}`} />
                Pending
              </button>
              <button
                onClick={() => setFilterStatus("available")}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                  filterStatus === "available" 
                    ? "bg-green-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Check className={`w-4 h-4 mr-1 ${filterStatus === "available" ? "text-white" : "text-green-500"}`} />
                Available
              </button>
              <button
                onClick={() => setFilterStatus("fulfilled")}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                  filterStatus === "fulfilled" 
                    ? "bg-blue-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Check className={`w-4 h-4 mr-1 ${filterStatus === "fulfilled" ? "text-white" : "text-blue-500"}`} />
                Fulfilled
              </button>
              <button
                onClick={() => setFilterStatus("cancelled")}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                  filterStatus === "cancelled" 
                    ? "bg-red-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <X className={`w-4 h-4 mr-1 ${filterStatus === "cancelled" ? "text-white" : "text-red-500"}`} />
                Cancelled
              </button>
            </div>
          </div>
          
          {/* Purpose Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Purpose</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterPurpose("all")}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  filterPurpose === "all" 
                    ? "bg-[#ff6b00] text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Purpose
              </button>
              <button
                onClick={() => setFilterPurpose("buy")}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                  filterPurpose === "buy" 
                    ? "bg-purple-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <DollarSign className={`w-4 h-4 mr-1 ${filterPurpose === "buy" ? "text-white" : "text-purple-500"}`} />
                Buy
              </button>
              <button
                onClick={() => setFilterPurpose("rent")}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                  filterPurpose === "rent" 
                    ? "bg-indigo-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Car className={`w-4 h-4 mr-1 ${filterPurpose === "rent" ? "text-white" : "text-indigo-500"}`} />
                Rent
              </button>
            </div>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {(filterStatus !== "all" || filterPurpose !== "all") && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterPurpose("all");
              }}
              className="text-sm text-[#ff6b00] hover:text-[#ff8533] flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items - Card Layout */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No wishlist items found</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== "all" || filterPurpose !== "all"
              ? "Try adjusting your filters or search terms"
              : "There are no wishlist items to display"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="relative h-48 bg-blue-50">
                <div className="absolute top-3 left-3 bg-purple-100 text-purple-800 px-4 py-1 rounded-full font-medium capitalize">
                  {item.purpose}
                </div>
                <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.vehicleName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Car className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{item.vehicleName}</h3>
                <p className="text-gray-600 mb-4">{item.model}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{item.kmRun ? `${item.kmRun} km` : "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{item.year || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-700">{item.color || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">Rs. {Number.parseInt(item.budget).toLocaleString()}</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mb-5">Requested by: {item.userName}</p>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <div className="flex gap-2">
                    {item.status === "pending" && (
                      <button
                        onClick={() => handleStatusChange(item.id, "available")}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm"
                      >
                        <Check className="w-3 h-3" />
                        Available
                      </button>
                    )}

                    <button
                      onClick={() => openNotifyModal(item)}
                      className="flex items-center gap-1 bg-[#ff6b00] text-white px-3 py-1.5 rounded-md hover:bg-[#ff8533] text-sm"
                    >
                      <Bell className="w-3 h-3" />
                      Notify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wishlist Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(selectedItem.status)}`}
                  >
                    {getStatusIcon(selectedItem.status)}
                    <span className="ml-1">{selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}</span>
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800">Wishlist #{selectedItem.id}</h2>
                </div>
                <p className="text-gray-500 mt-1">Created on {formatDate(selectedItem.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedItem.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedItem.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedItem.userPhone}</p>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <a
                      href={`mailto:${selectedItem.userEmail}`}
                      className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                    >
                      <Mail className="w-3 h-3" />
                      Email
                    </a>
                    <a
                      href={`tel:${selectedItem.userPhone}`}
                      className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </a>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="md:col-span-2 bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Details
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="font-medium capitalize">{selectedItem.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Name</p>
                    <p className="font-medium">{selectedItem.vehicleName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{selectedItem.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{selectedItem.year || "Any"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{selectedItem.color || "Any"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium capitalize">{selectedItem.fuelType || "Any"}</p>
                  </div>
                  {selectedItem.purpose === "buy" ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-medium">Rs. {Number.parseInt(selectedItem.budget).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ownership</p>
                        <p className="font-medium">{selectedItem.ownership || "Any"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Km Run</p>
                        <p className="font-medium">{selectedItem.kmRun ? `${selectedItem.kmRun} km` : "Any"}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Budget (per day)</p>
                        <p className="font-medium">Rs. {Number.parseInt(selectedItem.budget).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium capitalize">{selectedItem.duration || "Any"}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedItem.description}</p>
                </div>

                {selectedItem.images && selectedItem.images.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Reference Images</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedItem.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Reference ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-4 flex flex-wrap gap-3 justify-end">
              {selectedItem.status === "pending" && (
                <button
                  onClick={() => handleStatusChange(selectedItem.id, "available")}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Mark as Available
                </button>
              )}

              <button
                onClick={() => openNotifyModal(selectedItem)}
                className="flex items-center gap-2 bg-[#ff6b00] text-white px-4 py-2 rounded-lg hover:bg-[#ff8533]"
              >
                <Bell className="w-4 h-4" />
                Notify Customer
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notify Customer Modal (replacing Drawer) */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Notify Customer</h2>
                <button 
                  onClick={() => setShowNotifyModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {itemToNotify && (
                <p className="text-gray-600 mt-2">
                  Send a notification to <span className="font-medium">{itemToNotify.userName}</span> about their
                  wishlist request.
                </p>
              )}
            </div>
            
            <form onSubmit={handleNotifyUser} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="We found a vehicle matching your requirements..."
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2 mt-6">
                <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-[#ff6b00] text-white rounded-md hover:bg-[#ff8533] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={notifyLoading}
                >
                  {notifyLoading ? "Sending..." : "Send Notification"}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowNotifyModal(false)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  )
}