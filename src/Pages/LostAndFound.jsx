"use client"

import { useState } from "react"
import { CheckCircle, Clock, MapPin, Calendar, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LostAndFoundForm from "../Components/LostAndFoundForm"
import { useNavigate } from "react-router-dom"

// Sample data - In real app, this would come from an API
const lostAndFoundItems = [
  {
    id: 1,
    title: "Lost Purse",
    description:
      "aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae",
    location: "Kalanki",
    date: "2022-11-10",
    type: "lost",
    status: "active",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sNDHchJeiUfQ3xGjqBJBxVnLHkRdK1.png",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    dateSubmitted: "2024-02-01",
    reporter: {
      name: "Hari Ram",
      contact: "9876543210",
    },
  },
  {
    id: 2,
    title: "Found Wallet",
    description: "Brown leather wallet with driver's license and credit cards.",
    location: "City Park, Near Fountain",
    date: "2024-02-03",
    type: "found",
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-02-03",
    reporter: {
      name: "John Doe",
      contact: "555-987-6543",
    },
  },
  {
    id: 3,
    title: "Lost iPhone 13",
    description: "Black iPhone 13 with red case. Lock screen has mountain wallpaper.",
    location: "Coffee Shop on Main Street",
    date: "2024-02-10",
    type: "lost",
    status: "resolved",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-02-10",
    reporter: {
      name: "Michael Johnson",
      contact: "555-456-7890",
    },
  },
  {
    id: 4,
    title: "Found Backpack",
    description: "Blue Jansport backpack with textbooks and a laptop inside.",
    location: "University Library, 2nd Floor",
    date: "2024-02-15",
    type: "found",
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-02-15",
    reporter: {
      name: "Emily Wilson",
      contact: "555-234-5678",
    },
  },
  {
    id: 5,
    title: "Lost Prescription Glasses",
    description: "Black-framed prescription glasses in a red case.",
    location: "Movie Theater, Cinema 3",
    date: "2024-02-20",
    type: "lost",
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-02-20",
    reporter: {
      name: "David Brown",
      contact: "555-345-6789",
    },
  },
  {
    id: 6,
    title: "Found Car Keys",
    description: "Toyota car keys with a rabbit foot keychain.",
    location: "Shopping Mall Parking Lot",
    date: "2024-02-25",
    type: "found",
    status: "resolved",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-02-25",
    reporter: {
      name: "Sarah Miller",
      contact: "555-567-8901",
    },
  },
  {
    id: 7,
    title: "Lost Laptop",
    description: "Dell XPS 13 laptop with stickers on the cover.",
    location: "Bus Stop on 5th Avenue",
    date: "2024-03-01",
    type: "lost",
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-03-01",
    reporter: {
      name: "Robert Taylor",
      contact: "555-678-9012",
    },
  },
  {
    id: 8,
    title: "Found Headphones",
    description: "Sony WH-1000XM4 noise-cancelling headphones in black.",
    location: "Gym, Cardio Section",
    date: "2024-03-05",
    type: "found",
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-03-05",
    reporter: {
      name: "Jessica Anderson",
      contact: "555-789-0123",
    },
  },
  {
    id: 9,
    title: "Lost Engagement Ring",
    description: "Gold engagement ring with diamond. Very sentimental value.",
    location: "Beach Boardwalk",
    date: "2024-03-10",
    type: "lost",
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
    dateSubmitted: "2024-03-10",
    reporter: {
      name: "Amanda Clark",
      contact: "555-890-1234",
    },
  },
  // Add more items as needed
]

const LostAndFound = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [items, setItems] = useState(lostAndFoundItems)
  const [currentFilter, setCurrentFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Filter items based on current filters and search query
  const filteredItems = items.filter((item) => {
    // Filter by type (all/lost/found/resolved)
    if (currentFilter !== "all") {
      if (currentFilter === "resolved") {
        if (item.status !== "resolved") return false
      } else {
        if (item.type !== currentFilter || item.status === "resolved") return false
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const handleContact = (item) => {
    setSelectedItem(item)
    setCurrentImageIndex(0)
    setIsContactModalOpen(true)
  }

  const nextImage = () => {
    if (!selectedItem) return
    setCurrentImageIndex((prevIndex) => (prevIndex === selectedItem.images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    if (!selectedItem) return
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? selectedItem.images.length - 1 : prevIndex - 1))
  }

  const handleCallReporter = () => {
    if (selectedItem) {
      window.location.href = `tel:${selectedItem.reporter.contact}`
    }
  }

  const handleSendSMS = () => {
    if (selectedItem) {
      window.location.href = `sms:${selectedItem.reporter.contact}`
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter)
    setCurrentPage(1)

    // Show toast notification for filter change
    let message = ""
    if (filter === "all") {
      message = `Showing all ${items.length} items`
    } else if (filter === "resolved") {
      const count = items.filter((item) => item.status === "resolved").length
      message = `Showing ${count} resolved items`
    } else {
      const count = items.filter((item) => item.type === filter && item.status !== "resolved").length
      message = `Showing ${count} ${filter} items`
    }

    toast.info(message, {
      icon: "🔍",
    })
  }

  // Function to handle adding a new lost and found item
  const handleAddItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: Date.now(),
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "active",
    }

    setItems([itemWithId, ...items])

    toast.success(`Your ${newItem.type} item report has been submitted!`, {
      icon: newItem.type === "lost" ? "🔍" : "✅",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />

      {/* Header */}
      <h1 className="mt-12 text-4xl font-bold mb-4">
        <span className="text-blue-600">Lost</span> & <span className="text-blue-600">Found</span>
      </h1>

      {/* Search Bar */}
      <div className="mb-6 max-w-6xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for lost or found items..."
            className="w-full pl-10 pr-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Report Item Button */}
      <div className="mb-6">
        <button
          onClick={toggleModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          Report Item
        </button>
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
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("lost")}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "lost" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => handleFilterChange("found")}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "found" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Found
            </button>
            <button
              onClick={() => handleFilterChange("resolved")}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "resolved" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Lost and Found Items */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={item.images?.[0] || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  {item.status === "resolved" ? (
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolved
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Active
                    </span>
                  )}
                </div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.type === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.type === "lost" ? "Lost" : "Found"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{item.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Reported on: {new Date(item.dateSubmitted).toLocaleDateString()}
                  </span>
                  {item.status === "active" && (
                    <button
                      onClick={() => handleContact(item)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Contact Reporter
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No items match your current filter or search.</p>
            <button
              onClick={() => {
                handleFilterChange("all")
                setSearchQuery("")
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Show all items
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
                    currentPage === number ? "bg-blue-600 text-white font-medium" : "text-gray-700 hover:bg-gray-50"
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

      {/* LostAndFoundForm Modal */}
      <LostAndFoundForm isOpen={isModalOpen} onClose={toggleModal} onSubmit={handleAddItem} />

      {/* Contact Reporter Modal */}
      {selectedItem && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${isContactModalOpen ? "visible" : "invisible"}`}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsContactModalOpen(false)}></div>
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 z-10 relative">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side - Details */}
              <div>
                <h2 className="text-3xl font-bold mb-6">{selectedItem.title}</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-600">Founder Name</h3>
                    <p className="text-xl">{selectedItem.reporter.name}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600">Found Date</h3>
                    <p className="text-xl">{selectedItem.date}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600">Found Location</h3>
                    <p className="text-xl">{selectedItem.location}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600">Contact</h3>
                    <p className="text-xl">{selectedItem.reporter.contact}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600">Description</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                </div>
              </div>

              {/* Right side - Image carousel */}
              <div>
                <div className="relative">
                  <img
                    src={selectedItem.images[currentImageIndex] || "/placeholder.svg"}
                    alt={selectedItem.title}
                    className="w-full h-[400px] object-contain rounded-lg"
                  />
                  {selectedItem.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Image dots */}
                {selectedItem.images.length > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {selectedItem.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          currentImageIndex === index ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleCallReporter}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Call Reporter
              </button>
              <button
                onClick={handleSendSMS}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Send SMS
              </button>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
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

export default LostAndFound

