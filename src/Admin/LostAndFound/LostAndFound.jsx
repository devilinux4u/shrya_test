"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Clock,
} from "lucide-react"

// Mock data remains the same
const initialItems = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    location: "Library",
    dateFound: "2024-01-15",
    status: "pending",
    image: "/laptop.jpg",
    description: "Silver MacBook Pro with a dent on the lid.",
  },
  {
    id: 2,
    name: "Wallet",
    category: "Personal Items",
    location: "Cafeteria",
    dateFound: "2024-01-20",
    status: "claimed",
    image: "/wallet.jpg",
    description: "Brown leather wallet with ID and credit cards.",
  },
  {
    id: 3,
    name: "Keys",
    category: "Accessories",
    location: "Main Entrance",
    dateFound: "2024-01-25",
    status: "pending",
    image: "/keys.jpg",
    description: "Set of keys with a blue keychain.",
  },
  {
    id: 4,
    name: "Document",
    category: "Documents",
    location: "Lecture Hall A",
    dateFound: "2024-01-28",
    status: "disposed",
    image: "/document.jpg",
    description: "Important document left in lecture hall.",
  },
  {
    id: 5,
    name: "Charger",
    category: "Electronics",
    location: "Student Union",
    dateFound: "2024-02-01",
    status: "pending",
    image: "/charger.jpg",
    description: "iPhone charger found near the couches.",
  },
  
]

export default function LostAndFound() {
  const [items, setItems] = useState(initialItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddItem, setShowAddItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const filteredItems = items.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const categoryMatch = filterCategory === "all" || item.category === filterCategory
    const statusMatch = filterStatus === "all" || item.status === filterStatus

    return searchMatch && categoryMatch && statusMatch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "claimed":
        return "bg-green-100 text-green-800"
      case "disposed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />
      case "claimed":
        return <CheckCircle className="w-4 h-4 mr-1" />
      case "disposed":
        return <XCircle className="w-4 h-4 mr-1" />
      default:
        return <AlertTriangle className="w-4 h-4 mr-1" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 ml-64 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Lost and Found</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500">Total Items</h3>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{items.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500">Pending Claims</h3>
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{items.filter((item) => item.status === "pending").length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500">Claimed Items</h3>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{items.filter((item) => item.status === "claimed").length}</p>
          </div>
        </div>

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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Personal Items">Personal Items</option>
              <option value="Accessories">Accessories</option>
              <option value="Documents">Documents</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="claimed">Claimed</option>
              <option value="disposed">Disposed</option>
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

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
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
                  <button onClick={() => setSelectedItem(item)} className="p-2 hover:bg-gray-100 rounded-full">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  {item.status === "pending" && (
                    <>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      </button>
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Item</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter item name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option>Electronics</option>
                  <option>Personal Items</option>
                  <option>Accessories</option>
                  <option>Documents</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                  Location Found
                </label>
                <input
                  type="text"
                  id="location"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter location found"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                  Date Found
                </label>
                <input
                  type="date"
                  id="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter image URL"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter item description"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setShowAddItem(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedItem.name}</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 mb-4">
              <img
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.name}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{selectedItem.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{selectedItem.dateFound}</span>
              </div>
              <p className="text-gray-700">{selectedItem.description}</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  selectedItem.status,
                )}`}
              >
                {getStatusIcon(selectedItem.status)}
                <span className="ml-1">{selectedItem.status.toUpperCase()}</span>
              </span>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setSelectedItem(null)}
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

