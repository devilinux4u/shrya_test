"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, User, Clock, MapPin, Tag, Fuel, Gauge, Settings, Shield, Phone, Mail } from 'lucide-react'

export default function ViewDetails() {
  const { id } = useParams()
  // const location = useLocation()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(location.state?.vehicle || null)
  const [loading, setLoading] = useState(!location.state?.vehicle)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const vehicleId = params.get("id");

  // Fetch vehicle data if not provided in location state
  useEffect(() => {
    if (!vehicle) {
      const fetchVehicleDetails = async () => {
        try {
          setLoading(true)
          // Replace with your actual API call
          // const response = await fetch(`/api/vehicles/${id}`)
          // const data = await response.json()
          
          // Simulating API response with sample data
          const response = await fetch(`http://localhost:3000/vehicles/one/${vehicleId}`); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setVehicle(data.msg)
          setLoading(false) // Set the vehicle data to the state
        } else {
          console.error("Vehicle not found");
        }
          
          
        } catch (err) {
          console.error("Error fetching vehicle details:", err)
          setError("Failed to load vehicle details. Please try again later.")
          setLoading(false)
        }
      }

      fetchVehicleDetails()
    } else {
      // If we have the vehicle from location state but it might be missing some fields
      // that are needed for the detailed view, we can supplement it here
      if (!vehicle.description) {
        setVehicle({
          ...vehicle,
          description: "Detailed information about this vehicle. Features a powerful engine, spacious interior, and advanced safety features.",
          features: ["Leather Seats", "Sunroof", "Navigation System", "Bluetooth", "Backup Camera", "Parking Sensors"],
          specifications: {
            engine: "Standard Engine",
            transmission: "Automatic",
            fuelType: "Petrol",
            mileage: "10 km/l",
            seatingCapacity: 5,
            color: "Silver"
          }
        })
      }
    }
  }, [id, vehicle])

  const handleGoBack = () => {
    navigate(-1)
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading vehicle details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Vehicle not found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Back button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4F46E5] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vehicles
        </button>

        {/* Vehicle header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{vehicle.make} {vehicle.model}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{vehicle.year}</span>
              <span className="mx-2">•</span>
              <Gauge className="w-4 h-4" />
              <span>{vehicle.km.toLocaleString()} km</span>
              <span className="mx-2">•</span>
              <Tag className="w-4 h-4" />
              <span>{vehicle.own}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-[#4F46E5]">
              Rs. {vehicle.price.toLocaleString()}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                vehicle.status === "Available" ? "bg-green-100 text-green-800" : 
                vehicle.status === "Sold" ? "bg-red-100 text-red-800" : 
                "bg-yellow-100 text-yellow-800"
              }`}
            >
              {vehicle.status}
            </span>
          </div>
        </div>

        {/* Image gallery and Contact information side by side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Image gallery - takes 2/3 of the width on medium screens and up */}
          <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={vehicle.images && vehicle.images.length > 0 ? 
                  `../../server/controllers${vehicle.images[activeImage].image}` : 
                  "/placeholder.svg"}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder.svg"
                }}
              />
            </div>
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {vehicle.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded ${
                      activeImage === index ? 'border-[#4F46E5]' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={`../../server/controllers${img.image}`}
                      alt={`${vehicle.make} ${vehicle.model} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact information - takes 1/3 of the width on medium screens and up */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Posted By</p>
                  <p className="font-medium">{vehicle.user.fname}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Posted On</p>
                  <p className="font-medium">{formatDate(vehicle.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{vehicle.user.num}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{vehicle.user.email}</p>
                </div>
              </div>
            </div>

            {/* Quick contact buttons */}
            {vehicle.status === "Available" && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => window.location.href = `tel:${vehicle.user.num}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Seller
                </button>
                <button
                  onClick={() => window.location.href = `sms:${vehicle.user.num}`}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send SMS
                </button>
               
              </div>
            )}
          </div>
        </div>

        {/* Vehicle details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{vehicle.des}</p>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">Engine</p>
                  <p className="font-medium">{vehicle.cc || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">Transmission</p>
                  <p className="font-medium">{vehicle.trans || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">Fuel Type</p>
                  <p className="font-medium">{vehicle.fuel || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">Mileage</p>
                  <p className="font-medium">{vehicle.mile || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">Seating Capacity</p>
                  <p className="font-medium">{vehicle.seat || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">Color</p>
                  <p className="font-medium">{vehicle.color || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
          >
            Edit Vehicle
          </button>
          <button
            className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this vehicle?")) {
                // Add delete logic here
                alert("Vehicle deleted successfully!");
                navigate(-1);
              }
            }}
          >
            Delete Vehicle
          </button>
        </div>
      </div>
    </div>
  )
}