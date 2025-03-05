"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, MapPin, Calendar, CheckCircle, XCircle, AlertTriangle, Eye, Clock, Edit3, Filter, Phone, MessageSquare, X, User } from 'lucide-react'
import LostAndFoundForm from "../../Components/LostAndFoundForm"

// Mock data remains the same
const initialItems = [
  {
    id: 1,
    name: "Laptop",
    location: "Library",
    dateFound: "2024-01-15",
    status: "lost",
    image: "/laptop.jpg",
    description: "Silver MacBook Pro with a dent on the lid.",
    postedBy: {
      name: "John Doe",
      role: "Admin",
      contact: "987-654-3210", // Added for testing
    },
  },
  {
    id: 2,
    name: "Wallet",
    location: "Cafeteria",
    dateFound: "2024-01-20",
    status: "found",
    image: "/wallet.jpg",
    description: "Brown leather wallet with ID and credit cards.",
    postedBy: {
      name: "Jane Smith",
      role: "User",
      contact: "123-456-7890",
    },
  },
]

export default function LostAndFound() {
  const [items, setItems] = useState(initialItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAddItem, setShowAddItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentUserRole, setCurrentUserRole] = useState("Admin") // Simulate current user role - change to "User" to test

  useEffect(() => {
    let filtered = [...initialItems]

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (userFilter) {
      filtered = filtered.filter((item) =>
        item.postedBy.role.toLowerCase() === userFilter.toLowerCase()
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setItems(filtered)
  }, [searchTerm, userFilter, statusFilter])

  const getStatusColor = (status) => {
    switch (status) {
      case "lost":
        return "bg-yellow-100 text-yellow-800"
      case "found":
        return "bg-green-100 text-green-800"
      case "resolved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "lost":
        return <Clock className="w-4 h-4 mr-1" />
      case "found":
        return <CheckCircle className="w-4 h-4 mr-1" />
      case "resolved":
        return <XCircle className="w-4 h-4 mr-1" />
      default:
        return <AlertTriangle className="w-4 h-4 mr-1" />
    }
  }

  const updateStatus = (id, newStatus) => {
    setItems(items.map(item => item.id === id ? { ...item, status: newStatus } : item))
  }

  const handleAddItemSubmit = (newItem) => {
    setItems([...items, { ...newItem, id: items.length + 1 }])
    setShowAddItem(false)
  }

  const nextImage = () => {
    if (!selectedItem || !selectedItem.image) return
    setCurrentImageIndex((prevIndex) => (prevIndex === selectedItem.image.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    if (!selectedItem || !selectedItem.image) return
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? selectedItem.image.length - 1 : prevIndex - 1))
  }

  const handleCallReporter = (item) => {
    if (item.postedBy.contact) {
      window.location.href = `tel:${item.postedBy.contact}`
    } else {
      alert("Contact information is not available for this reporter.")
    }
  }

  const handleSendSMS = (item) => {
    if (item.postedBy.contact) {
      window.location.href = `sms:${item.postedBy.contact}`
    } else {
      alert("Contact information is not available for this reporter.")
    }
  }

  // Check if current user can edit an item (only admins can edit)
  const canEdit = (item) => {
    return currentUserRole === "Admin"
  }

  // Check if current user can contact the reporter (only contact if reporter is a user, not an admin)
  const canContact = (item) => {
    return item.postedBy.role === "User" && item.postedBy.contact
  }

  return (
    <div className="min-h-screen bg-gray-100 ml-64 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Lost and Found</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Filter by User/Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Filter by Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Filter by Section */}
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
              }}
              className={`px-4 py-2 rounded-full transition-colors ${
                !userFilter && !statusFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setUserFilter("admin")}
              className={`px-4 py-2 rounded-full transition-colors ${
                userFilter === "admin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setUserFilter("user")}
              className={`px-4 py-2 rounded-full transition-colors ${
                userFilter === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              User
            </button>
            <button
              onClick={() => setStatusFilter("lost")}
              className={`px-4 py-2 rounded-full transition-colors ${
                statusFilter === "lost" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setStatusFilter("found")}
              className={`px-4 py-2 rounded-full transition-colors ${
                statusFilter === "found" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Found
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`px-4 py-2 rounded-full transition-colors ${
                statusFilter === "resolved" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover w-full h-48" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{item.status.toUpperCase()}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedItem(item)} 
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  {/* Only show edit button for admins */}
                  {canEdit(item) && (
                    <button 
                      onClick={() => setShowAddItem(true)} 
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Edit Item"
                    >
                      <Edit3 className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  
                  {item.status !== "resolved" && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, "resolved")}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </button>
                      
                      {/* Only show delete button for admins */}
                      {canEdit(item) && (
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          title="Delete Item"
                        >
                          <Trash2 className="w-5 h-5 text-gray-600" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{item.dateFound}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Posted by: {item.postedBy.name} ({item.postedBy.role})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <LostAndFoundForm
          isOpen={showAddItem}
          onClose={() => setShowAddItem(false)}
          onSubmit={handleAddItemSubmit}
        />
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side - Details */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">{selectedItem.name}</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-600 text-sm">Location</h3>
                    <p className="text-xl font-medium">{selectedItem.location}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600 text-sm">Date Found</h3>
                    <p className="text-xl font-medium">{selectedItem.dateFound}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600 text-sm">Description</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600 text-sm">Status</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedItem.status,
                      )}`}
                    >
                      {getStatusIcon(selectedItem.status)}
                      <span className="ml-1">{selectedItem.status.toUpperCase()}</span>
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-600 text-sm">Reporter</h3>
                    <p className="text-gray-700">
                      {selectedItem.postedBy.name} ({selectedItem.postedBy.role})
                      {selectedItem.postedBy.contact && canContact(selectedItem) && (
                        <span className="ml-2 text-sm text-blue-600">{selectedItem.postedBy.contact}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Image */}
              <div>
                <div className="relative bg-gray-100 rounded-lg">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="w-full h-[300px] md:h-[400px] object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-8 justify-end">
              {/* Only show contact buttons if reporter is a user (not an admin) */}
              {canContact(selectedItem) && (
                <>
                  <button
                    onClick={() => handleCallReporter(selectedItem)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Reporter
                  </button>
                  <button
                    onClick={() => handleSendSMS(selectedItem)}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    SMS Reporter
                  </button>
                </>
              )}
              
              {/* Only show edit button for admins */}
              {canEdit(selectedItem) && (
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    setShowAddItem(true)
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Item
                </button>
              )}
              
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setItems(items.filter((item) => item.id !== showDeleteConfirm))
                  setShowDeleteConfirm(null)
                }}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}