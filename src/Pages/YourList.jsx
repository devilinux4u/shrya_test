"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle,
  Clock,
  Car,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Filter,
  Loader2,
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import WishlistForm from "../Components/WishlistForm"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

const YourList = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [items, setItems] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [currentFilter, setCurrentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from backend
  useEffect(() => {
    const fetchWishlistItems = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:3000/wishlist/${Cookies.get("sauto").split("-")[0]}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        console.log(data.data)

        setItems(data.data)
      } catch (err) {
        console.error("Failed to fetch wishlist items:", err)
        setError("Failed to load your wishlist. Please try again later.")
        // Show error toast
        toast.error("Failed to load your wishlist. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlistItems()
  }, [])

  // Filter items based on current filters
  const filteredItems = items.filter((item) => {
    // Filter by purpose (buy/rent)
    if (currentFilter !== "all" && item.purpose !== currentFilter) {
      return false
    }

    // Filter by status (arrived/pending)
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false
    }

    return true
  })

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const handleBook = (id) => {
    console.log("Booking vehicle with id:", id)
    navigate("/VehicleBooking")
  }

  const toggleModal = () => {
    // Check if the cookie exists
    if (!Cookies.get("sauto")) {
      // If cookie doesn't exist, navigate to login page
      navigate("/login")
      return
    }

    // If cookie exists, open the modal
    setIsModalOpen(!isModalOpen)
  }

  // const handleView = () => {
  //   navigate('/WishlistVehicleDetail')
  // }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsLoading(true)

      try {
        // Replace with your actual delete API endpoint
        const response = await fetch(`http://127.0.0.1:3000/wishlist/delete/${itemToDelete.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }

        // Update local state after successful deletion
        setItems(items.filter((item) => item.id !== itemToDelete.id))
        setIsDeleteModalOpen(false)

        // Show toast notification
        toast.error(`${itemToDelete.vehicleName} has been removed from your wishlist`, {
          icon: "🗑️",
        })

        setItemToDelete(null)
      } catch (err) {
        console.error("Failed to delete wishlist item:", err)
        toast.error("Failed to delete item. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter)
    setCurrentPage(1) // Reset to first page when filter changes

    // Show toast notification for filter change
    let message = ""
    if (filter === "all") {
      message = `Showing all ${items.length} vehicles`
    } else {
      const count = items.filter((item) => item.purpose === filter).length
      message = `Showing ${count} ${filter === "buy" ? "vehicles for purchase" : "vehicles for rent"}`
    }

    toast.info(message, {
      icon: "🔍",
    })
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    setDropdownOpen(null)
    setCurrentPage(1)

    // Show toast notification for status filter change
    let message = ""
    if (status === "all") {
      message = "Showing vehicles with all statuses"
    } else {
      message = `Showing ${status === "arrived" ? "arrived" : "pending"} vehicles`
    }

    toast.info(message, {
      icon: status === "arrived" ? "✅" : "⏳",
    })
  }

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".filter-dropdown")) {
        setDropdownOpen(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  // Function to handle adding a new wishlist item
  const handleAddWishlistItem = async (newItem) => {
    setIsLoading(true)

    try {
      // Replace with your actual API endpoint for adding items
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const addedItem = await response.json()

      // Update local state with the new item
      setItems([...items, addedItem])

      // Close modal
      setIsModalOpen(false)

      // Show success toast
      toast.success(`${addedItem.vehicleName || "New vehicle"} added to your wishlist!`, {
        icon: "➕",
      })
    } catch (err) {
      console.error("Failed to add wishlist item:", err)
      toast.error("Failed to add item to wishlist. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <h1 className="mt-12 text-4xl font-bold mb-4">
        <span className="text-orange-500">Your </span>
        <span className="font-mono"> List</span>
      </h1>

      {/* Wish Vehicle Button */}
      <div className="mb-6">
        <button
          onClick={toggleModal}
          className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          disabled={isLoading}
        >
          Wish Vehicle
        </button>
      </div>

      {/* Filter Options */}
      <div className="mb-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center text-gray-700 font-medium">
            <Filter className="w-5 h-5 mr-2" />
            Filter by:
          </div>
          <div className="flex flex-wrap gap-3 relative">
            <button
              onClick={() => {
                setCurrentFilter("all")
                setStatusFilter("all")
                setDropdownOpen(null)
                toast.info(`Showing all ${items.length} vehicles`, {
                  icon: "🔍",
                })
              }}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={isLoading}
            >
              All
            </button>

            <div className="relative filter-dropdown">
              <button
                onClick={() => {
                  if (dropdownOpen === "buy") {
                    setDropdownOpen(null)
                  } else {
                    setCurrentFilter("buy")
                    setDropdownOpen("buy")
                    if (statusFilter === "all") {
                      const count = items.filter((item) => item.purpose === "buy").length
                      toast.info(`Showing ${count} vehicles for purchase`, {
                        icon: "🔍",
                      })
                    }
                  }
                }}
                className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                  currentFilter === "buy" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                Buy
                <ChevronLeft
                  className={`w-4 h-4 ml-1 transform transition-transform ${dropdownOpen === "buy" ? "rotate-90" : "-rotate-90"}`}
                />
              </button>

              {dropdownOpen === "buy" && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-md z-10 w-40 py-2 border border-gray-100">
                  <button
                    onClick={() => {
                      handleStatusFilterChange("all")
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      statusFilter === "all" && currentFilter === "buy" ? "bg-blue-50 text-blue-700 font-medium" : ""
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => {
                      handleStatusFilterChange("arrived")
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                      statusFilter === "arrived" && currentFilter === "buy"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : ""
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Arrived
                  </button>
                  <button
                    onClick={() => {
                      handleStatusFilterChange("pending")
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                      statusFilter === "pending" && currentFilter === "buy"
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : ""
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending
                  </button>
                </div>
              )}
            </div>

            <div className="relative filter-dropdown">
              <button
                onClick={() => {
                  if (dropdownOpen === "rent") {
                    setDropdownOpen(null)
                  } else {
                    setCurrentFilter("rent")
                    setDropdownOpen("rent")
                    if (statusFilter === "all") {
                      const count = items.filter((item) => item.purpose === "rent").length
                      toast.info(`Showing ${count} vehicles for rent`, {
                        icon: "🔍",
                      })
                    }
                  }
                }}
                className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                  currentFilter === "rent" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                Rent
                <ChevronLeft
                  className={`w-4 h-4 ml-1 transform transition-transform ${dropdownOpen === "rent" ? "rotate-90" : "-rotate-90"}`}
                />
              </button>

              {dropdownOpen === "rent" && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-md z-10 w-40 py-2 border border-gray-100">
                  <button
                    onClick={() => {
                      handleStatusFilterChange("all")
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      statusFilter === "all" && currentFilter === "rent"
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : ""
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => {
                      handleStatusFilterChange("arrived")
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                      statusFilter === "arrived" && currentFilter === "rent"
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : ""
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Arrived
                  </button>
                  <button
                    onClick={() => {
                      handleStatusFilterChange("pending")
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                      statusFilter === "pending" && currentFilter === "rent"
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : ""
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            {!isLoading && (
              <>
                Showing {filteredItems.length} vehicle{filteredItems.length !== 1 ? "s" : ""}
                {currentFilter !== "all" && <span> • {currentFilter === "buy" ? "Buy" : "Rent"}</span>}
                {statusFilter !== "all" && <span> • {statusFilter === "arrived" ? "Arrived" : "Pending"}</span>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-6xl mx-auto flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Wishlist Items */}
      {!isLoading && !error && (
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={`../../server${item.images[0].imageUrl}` || "/placeholder.svg"}
                    alt={item.vehicleName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {item.status === "arrived" ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Arrived
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.purpose === "buy" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.purpose === "buy" ? "Buy" : "Rent"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{item.vehicleName}</h3>
                    <p className="text-gray-600">{item.model}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Car className="w-4 h-4 mr-2" />
                      <span>{item.kmRun} km</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{item.year}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span
                        className="w-3 h-3 rounded-full bg-gray-400 mr-2"
                        style={{ backgroundColor: item.color.toLowerCase() }}
                      />
                      <span>{item.color}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>${item.budget}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Requested on: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.status === "arrived" && (
                      <button
                        onClick={() => handleBook(item.id)}
                        className="bg-[#4B3EAE] text-white px-6 py-2 rounded-lg hover:bg-[#3c318a] transition-colors"
                      >
                        Book Now
                      </button>
                    )}
                  </div>

                  {/* View and Delete buttons */}
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        navigate(`/WishlistVehicleDetail?vid=${item.id}`)
                      }}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No vehicles match your current filter.</p>
              <button
                onClick={() => {
                  setCurrentFilter("all")
                  setStatusFilter("all")
                  toast.info(`Showing all ${items.length} vehicles`, {
                    icon: "🔍",
                  })
                }}
                className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
              >
                Show all vehicles
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border-r border-gray-200 flex items-center ${
                    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 border-r border-gray-200 ${
                      currentPage === number ? "bg-orange-500 text-white font-medium" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 flex items-center ${
                    currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WishlistForm Modal */}
      <WishlistForm isOpen={isModalOpen} onClose={toggleModal} onSubmit={handleAddWishlistItem} />

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${isDeleteModalOpen ? "visible" : "invisible"}`}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 z-10 relative">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to remove <span className="font-semibold">{itemToDelete.vehicleName}</span> from
              your wishlist?
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default YourList

