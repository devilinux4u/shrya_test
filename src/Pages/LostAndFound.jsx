"use client"

import { useState } from "react"
import { MapPin, Calendar, ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Purse from "../assets/Purse.png"
import LostAndFoundForm from "../Components/LostAndFoundForm"

const items = [
  {
    id: 1,
    title: "Lost Purse",
    description:
      "aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae",
    location: "Central Mall, Downtown",
    date: "01/02/2024",
    type: "lost",
    status: "active",
    images: [Purse, "/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    details: {
      founderName: "Hari Ram",
      foundDate: "2022-11-10",
      foundLocation: "Kalanki",
      contact: "9876543210",
    },
  },
  {
    id: 2,
    title: "Wallet - Brown Leather",
    description: "Found a brown leather wallet near the food court.",
    location: "City Mall, Food Court",
    date: "02/02/2024",
    type: "found",
    status: "active",
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
  },
  {
    id: 3,
    title: "Phone - iPhone 13",
    description: "Lost iPhone 13 in black case",
    location: "Bus Stop",
    date: "01/02/2024",
    type: "lost",
    status: "resolved",
    images: ["/placeholder.svg?height=200&width=200"],
  },
  // Add more items as needed
]

export default function LostAndFound() {
  const [expandedItem, setExpandedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showReportItemForm, setShowReportItemForm] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const itemsPerPage = 6
  const navigate = useNavigate()

  const handleContactReporter = (item) => {
    setExpandedItem(expandedItem === item.id ? null : item.id)
    setCurrentImageIndex(0)
  }

  const handleReportItem = () => {
    setShowReportItemForm(true)
  }

  const handleFormSubmit = (formData) => {
    // Handle form submission here
    console.log("Form submitted:", formData)
    // You might want to add the new item to your items list or send it to an API
    setShowReportItemForm(false)
  }

  // Filter items based on activeFilter and search query
  const filteredItems = items.filter((item) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "resolved"
        ? item.status === "resolved"
        : item.type === activeFilter && item.status === "active")

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === expandedItem.images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? expandedItem.images.length - 1 : prevIndex - 1))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mt-12 max-w-6xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search lost or found items..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleReportItem}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Report Item
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "lost", "found", "resolved"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter)
                  setCurrentPage(1)
                }}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  activeFilter === filter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                expandedItem === item.id ? "lg:col-span-3 md:col-span-2" : ""
              }`}
            >
              {expandedItem === item.id ? (
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <h2 className="text-4xl font-bold">{item.title}</h2>

                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div>
                          <h3 className="text-sm text-gray-500 mb-1">Founder Name</h3>
                          <p className="text-xl">{item.details.founderName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-500 mb-1">Found Date</h3>
                          <p className="text-xl">{item.details.foundDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-500 mb-1">Found Location</h3>
                          <p className="text-xl">{item.details.foundLocation}</p>
                        </div>
                        <div>
                          <h3 className="text-sm text-gray-500 mb-1">Contact</h3>
                          <p className="text-xl">{item.details.contact}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm text-gray-500 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <a
                          href={`tel:${item.details.contact}`}
                          className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Call Reporter
                        </a>
                        <a
                          href={`sms:${item.details.contact}`}
                          className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Send SMS
                        </a>
                        <button
                          onClick={() => setExpandedItem(null)}
                          className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-start">
                      <div className="relative w-full max-w-md">
                        <img
                          src={item.images[currentImageIndex] || "/placeholder.svg"}
                          alt={`${item.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        {item.images.length > 1 && (
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
                      <div className="flex mt-4 space-x-2">
                        {item.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              currentImageIndex === index ? "bg-blue-600" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <span
                      className={`absolute top-4 right-4 px-2 py-1 rounded-full text-sm font-medium ${
                        item.type === "lost"
                          ? "bg-red-100 text-red-800"
                          : item.status === "resolved"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status === "resolved" ? "Resolved" : item.type === "lost" ? "Lost" : "Found"}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleContactReporter(item)}
                      className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center ${
                        item.status === "resolved"
                          ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={item.status === "resolved"}
                    >
                      {item.status === "resolved" ? "Resolved" : "Contact Reporter"}
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Report Item Form Modal */}
      <LostAndFoundForm
        isOpen={showReportItemForm}
        onClose={() => setShowReportItemForm(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}

