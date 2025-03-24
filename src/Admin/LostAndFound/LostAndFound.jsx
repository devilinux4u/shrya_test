"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, MapPin, Calendar, CheckCircle, XCircle, AlertTriangle, Eye, Clock, Edit3, Filter, Phone, MessageSquare, X, User } from 'lucide-react'
import LostAndFoundForm from "../../Components/LostAndFoundForm"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

export default function LostAndFound() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAddItem, setShowAddItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState("Admin")
  const [filteredItems, setFilteredItems] = useState([])

  // Fetch data from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://localhost:3000/api/lost-and-found/all")

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        const processedItems = data.data.map(item => ({
          ...item,
          userType: item.user.fname === "Admin" ? "Admin" : "User"
        }))
        
        setItems(processedItems || [])
        setFilteredItems(processedItems || [])
        toast.success("Items loaded successfully!")
      } catch (err) {
        console.error("Error fetching lost and found items:", err)
        setError(err.message)
        toast.error(`Failed to load items: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...items]

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (userFilter) {
      filtered = filtered.filter((item) => 
        item.userType.toLowerCase() === userFilter.toLowerCase()
      )
    }

    if (statusFilter) {
      if (statusFilter === "lost") {
        filtered = filtered.filter((item) => item.type === "lost")
      } else if (statusFilter === "found") {
        filtered = filtered.filter((item) => item.type === "found")
      } else if (statusFilter === "resolved") {
        filtered = filtered.filter((item) => item.status !== "active")
      }
    }

    setFilteredItems(filtered)
  }, [searchTerm, userFilter, statusFilter, items])

  // Status helpers
  const getStatusColor = (type) => {
    switch (type) {
      case "lost": return "bg-yellow-100 text-yellow-800"
      case "found": return "bg-green-100 text-green-800"
      default: return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusIcon = (type) => {
    switch (type) {
      case "lost": return <Clock className="w-4 h-4 mr-1" />
      case "found": return <CheckCircle className="w-4 h-4 mr-1" />
      default: return <XCircle className="w-4 h-4 mr-1" />
    }
  }

  // Update item status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/lost-and-found/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus === "resolved" ? "inactive" : "active" }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const updatedItem = await response.json()
      setItems(items.map((item) => (item.id === id ? {...updatedItem, userType: item.userType} : item)))
      toast.success(`Item status updated to ${newStatus}!`)
    } catch (err) {
      console.error("Error updating item status:", err)
      toast.error(`Failed to update status: ${err.message}`)
    }
  }
  // Delete item
  const deleteItem = async () => {
    if (!itemToDelete) return;
  
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `http://localhost:3000/api/lost-and-found/all2/${itemToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid response from server');
      }
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }
  
      // Update local state
      setItems(items.filter(item => item.id !== itemToDelete.id));
      setShowDeleteConfirm(false);
      
      toast.success(data.message || 'Item deleted successfully!');
      
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || 'Failed to delete item');
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
    }
  };

  // Add new item
  const handleAddItemSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    try {
      const uid = Cookies.get("sauto")?.split("-")[0]
      if (!uid) {
        toast.error("User ID is missing. Please log in again.")
        return
      }

      formData.append("id", uid)
      const response = await fetch("http://localhost:3000/api/lost-and-found", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`)
      }

      const data = await response.json()
      if (data.success) {
        const newItem = {
          ...data.item,
          userType: data.item.user.fname === "Admin" ? "Admin" : "User"
        }
        toast.success("Item added successfully!")
        setItems([...items, newItem])
        setShowAddItem(false)
      } else {
        toast.error("Failed to add the item. Please try again.")
      }
    } catch (error) {
      console.error("Error adding item:", error)
      toast.error(`Failed to add item: ${error.message}`)
    }
  }

  // Permission helpers
  const canEdit = (item) => currentUserRole === "Admin"
  const canContact = (item) => item.user.fname === "User" && item.user.num

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
              <option value="">Filter by User Type</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || userFilter || statusFilter
              ? "Try adjusting your search or filters"
              : "Start by adding a lost or found item"}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddItem(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img
                  src={(item.images && item.images[0] && `../../server${item.images[0].imageUrl}`) || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = "/placeholder.svg" }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.type)}`}>
                      {getStatusIcon(item.type)}
                      <span className="ml-1">{item.type.toUpperCase()}</span>
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

                    {canEdit(item) && (
                      <button
                        onClick={() => setShowAddItem(true)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Edit Item"
                      >
                        <Edit3 className="w-5 h-5 text-gray-600" />
                      </button>
                    )}

                    {canEdit(item) && (
                      <button
                        onClick={() => {
                          setItemToDelete(item)
                          setShowDeleteConfirm(true)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Delete Item"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      </button>
                    )}

                    {item.status === "active" && (
                      <button
                        onClick={() => updateStatus(item.id, "resolved")}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </button>
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
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Posted by: {item.userType}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <LostAndFoundForm isOpen={showAddItem} onClose={() => setShowAddItem(false)} onSubmit={handleAddItemSubmit} />
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">{selectedItem.title}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-600 text-sm">Location</h3>
                    <p className="text-xl font-medium">{selectedItem.location}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Date</h3>
                    <p className="text-xl font-medium">{new Date(selectedItem.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Description</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.type)}`}>
                      {getStatusIcon(selectedItem.type)}
                      <span className="ml-1">{selectedItem.type.toUpperCase()}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Reporter</h3>
                    <p className="text-gray-700">
                      {selectedItem.userType}
                      {selectedItem.user.num && canContact(selectedItem) && (
                        <span className="ml-2 text-sm text-blue-600">{selectedItem.user.num}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="relative bg-gray-100 rounded-lg">
                  <img
                    src={(selectedItem.images && selectedItem.images[0] && `../../server${selectedItem.images[0].imageUrl}`) || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="w-full h-[300px] md:h-[400px] object-contain rounded-lg"
                    onError={(e) => { e.target.src = "/placeholder.svg" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8 justify-end">
              {canContact(selectedItem) && (
                <>
                  <button
                    onClick={() => window.location.href = `tel:${selectedItem.user.num}`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Reporter
                  </button>
                  <button
                    onClick={() => window.location.href = `sms:${selectedItem.user.num}`}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    SMS Reporter
                  </button>
                </>
              )}

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
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete "{itemToDelete?.title}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={deleteItem}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
                disabled={isLoading}
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