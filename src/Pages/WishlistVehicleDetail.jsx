"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import ItemBooking from "../Components/WishlistBookNow"
import {
  Car,
  Calendar,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Palette,
  User,
  Tag,
  ShoppingBag,
  AlertCircle,
  X, // Import the X icon
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const WishlistVehicleDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false) // State to control the visibility of the booking modal

  // Fetch vehicle data based on ID in the URL
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const vehicleId =
          new URLSearchParams(location.search).get("id") ||
          (location.state && location.state.id) ||
          location.pathname.split("/").pop()

        await new Promise((resolve) => setTimeout(resolve, 800))

        const mockVehicle = {
          id: vehicleId || 1,
          vehicleName: "Toyota Camry",
          brand: "Toyota",
          model: "Camry",
          year: "2024",
          kmRun: "50,000",
          fuelType: "Petrol",
          color: "Black",
          budget: "45,000",
          purpose: "buy",
          status: "arrived",
          ownership: "1st",
          vehicleType: "sedan",
          description:
            "This is a well-maintained Toyota Camry with all service records. The car is in excellent condition with no mechanical issues. It comes with premium features including leather seats, sunroof, and advanced safety features.",
          dateSubmitted: "2024-02-01",
          images: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600&text=Interior",
            "/placeholder.svg?height=400&width=600&text=Back",
          ],
        }

        setVehicle(mockVehicle)
      } catch (error) {
        console.error("Error fetching vehicle:", error)
        toast.error("Failed to load vehicle details")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [location])

  const handleBook = () => {
    setShowBookingModal(true) // Show the booking modal
  }

  const nextImage = () => {
    if (vehicle && vehicle.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    if (vehicle && vehicle.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
        <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/YourList")}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Back to Your List
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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

      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/YourList")}
          className="flex items-center text-gray-700 mb-6 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Your List
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header with status badge */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{vehicle.vehicleName}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    vehicle.purpose === "buy" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {vehicle.purpose === "buy" ? "Buy" : "Rent"}
                </span>
                {vehicle.status === "arrived" ? (
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
            </div>
            <p className="text-gray-600 mt-2">
              {vehicle.brand} {vehicle.model} • {vehicle.year}
            </p>
          </div>

          {/* Image gallery */}
          <div className="relative">
            {vehicle.images && vehicle.images.length > 0 && (
              <>
                <div className="relative h-[400px] w-full">
                  <img
                    src={vehicle.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${vehicle.vehicleName} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Image navigation arrows */}
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {vehicle.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail navigation */}
                {vehicle.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? "border-orange-500 scale-105" : "border-transparent"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Vehicle details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-gray-500" />
                      Brand
                    </h3>
                    <p className="text-lg">{vehicle.brand}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Car className="w-4 h-4 mr-2 text-gray-500" />
                      Model
                    </h3>
                    <p className="text-lg">{vehicle.model}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      Year
                    </h3>
                    <p className="text-lg">{vehicle.year}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-gray-500" />
                      Vehicle Type
                    </h3>
                    <p className="text-lg capitalize">{vehicle.vehicleType || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Car className="w-4 h-4 mr-2 text-gray-500" />
                      Kilometers
                    </h3>
                    <p className="text-lg">{vehicle.kmRun} km</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Fuel className="w-4 h-4 mr-2 text-gray-500" />
                      Fuel Type
                    </h3>
                    <p className="text-lg capitalize">{vehicle.fuelType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Palette className="w-4 h-4 mr-2 text-gray-500" />
                      Color
                    </h3>
                    <div className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: vehicle.color.toLowerCase() }}
                      ></span>
                      <p className="text-lg">{vehicle.color}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      Ownership
                    </h3>
                    <p className="text-lg">{vehicle.ownership || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      Budget
                    </h3>
                    <p className="text-lg">Rs. {vehicle.budget}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-gray-500" />
                      Purpose
                    </h3>
                    <p className="text-lg capitalize">{vehicle.purpose}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                      Status
                    </h3>
                    <p className="text-lg capitalize">{vehicle.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line mb-6">
                  {vehicle.description || "No description provided."}
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-2">Request Details</h3>
                  <p className="text-sm text-gray-600">
                    Requested on: {new Date(vehicle.dateSubmitted).toLocaleDateString()}
                  </p>
                </div>

                {vehicle.status === "arrived" && (
                  <button
                    onClick={handleBook}
                    className="w-full bg-[#4B3EAE] text-white px-6 py-3 rounded-lg hover:bg-[#3c318a] transition-colors flex items-center justify-center"
                  >
                    <Car className="w-5 h-5 mr-2" />
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <ItemBooking vehicle={vehicle} />
          </div>
        </div>
      )}
    </div>
  )
}

export default WishlistVehicleDetail