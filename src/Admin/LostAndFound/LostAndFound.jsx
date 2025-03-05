"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, MapPin, Calendar, CheckCircle, XCircle, AlertTriangle, Eye, Clock, Edit3, Filter, Phone, MessageSquare, X, User } from 'lucide-react'
import LostAndFoundForm from "../../Components/LostAndFoundForm"
import Cookies from "js-cookie";
import { toast } from "react-toastify";
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

  const uid = Cookies.get("sauto")?.split("-")[0]
  const handleAddItemSubmit = async (e) => {
      e.preventDefault();
  
      // Validate the form before submitting
      if (!validateForm()) {
        Object.values(errors).forEach((error) => {
          toast.error(error);
        });
        return;
      }
  
      try {
        // Retrieve uid from cookies
        if (!uid) {
          toast.error("User ID is missing. Please log in again.");
          return;
        }
  
        // Convert formData to FormData for submission
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "images") {
            value.forEach((file) => {
              formDataToSubmit.append("images", file); // Append actual File objects
            });
          } else {
            formDataToSubmit.append(key, value);
          }
        });
  
        // Append uid to the form data
        formDataToSubmit.append("id", id);
  
        // Send the request to the backend
        const response = await fetch("http://localhost:3000/api/lost-and-found", {
          method: "POST",
          body: formDataToSubmit,
        });
  
        // Check if the response is OK, if not throw an error
        if (!response.ok) {
          const errorDetails = await response.text();
          console.error("HTTP error details:", errorDetails);
          throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
        }
  
        const data = await response.json();
        console.log("API Response Data:", data);
  
        // Handle the success response from the server
        if (data.success) {
          console.log("Report submitted successfully!");
          toast.success("Lost and Found report submitted successfully!");
  
          // Reset the form state including images
          setFormData({
            type: "lost",
            title: "",
            description: "",
            location: "",
            date: "",
            images: [],
          });
  
          window.location.reload();
  
          // Clear selected images and previews
          onClose(); // Close the form/modal
  
          // Redirect to the lost and found page after a delay
          setTimeout(() => {
            navigate("/LostAndFound");
            console.log("Redirecting to /lost-and-found...");
          }, 2000);
        } else {
          console.error("Failed to submit the report. Server response:", data);
          toast.error("Failed to submit the report. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting report:", error);
        toast.error(`Failed to submit report: ${error.message}`);
      }
    };

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

        {/* Search and Add Item */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
          <div className="flex items-center text-gray-700 font-medium mb-4">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-lg">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !statusFilter 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("lost")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    statusFilter === "lost" 
                      ? "bg-yellow-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock className={`w-4 h-4 mr-1 ${statusFilter === "lost" ? "text-white" : "text-yellow-500"}`} />
                  Lost
                </button>
                <button
                  onClick={() => setStatusFilter("found")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    statusFilter === "found" 
                      ? "bg-green-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 mr-1 ${statusFilter === "found" ? "text-white" : "text-green-500"}`} />
                  Found
                </button>
                <button
                  onClick={() => setStatusFilter("resolved")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    statusFilter === "resolved" 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <XCircle className={`w-4 h-4 mr-1 ${statusFilter === "resolved" ? "text-white" : "text-blue-500"}`} />
                  Resolved
                </button>
              </div>
            </div>
            
            {/* User Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Posted By</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setUserFilter("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !userFilter 
                      ? "bg-blue-600 text-white shadow-md" 
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
                  <User className={`w-4 h-4 mr-1 ${userFilter === "admin" ? "text-white" : "text-purple-500"}`} />
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
                  <User className={`w-4 h-4 mr-1 ${userFilter === "user" ? "text-white" : "text-indigo-500"}`} />
                  User
                </button>
              </div>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          {(statusFilter || userFilter) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setStatusFilter("");
                  setUserFilter("");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </button>
            </div>
          )}
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

      {/* No items found message */}
      {items.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter || userFilter
              ? "Try adjusting your filters or search terms"
              : "There are no lost and found items to display"}
          </p>
        </div>
      )}

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