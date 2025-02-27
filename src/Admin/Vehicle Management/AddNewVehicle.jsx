"use client"

import { useState } from "react"
import { Camera, Plus, X, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AddNewVehicle() {
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    type: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    price: "",
    rentalPrice: "",
    description: "",
    features: [],
    images: [],
  })

  const [newFeature, setNewFeature] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setVehicle((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeatureAdd = () => {
    if (newFeature.trim()) {
      setVehicle((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature("")
    }
  }

  const handleFeatureRemove = (index) => {
    setVehicle((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setVehicle((prev) => ({ ...prev, images: [...prev.images, ...imageUrls] }))
  }

  const handleImageRemove = (index) => {
    setVehicle((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the vehicle data to your backend
    console.log("Submitting vehicle:", vehicle)
    // Reset form or redirect after successful submission
  }

  return (
    // Add ml-64 to offset the fixed sidebar
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      {/* Add padding inside this container */}
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Vehicles
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to add a new vehicle to the inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                  Make
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={vehicle.make}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={vehicle.model}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  placeholder="e.g., Camry"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={vehicle.year}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={vehicle.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                >
                  <option value="">Select type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="coupe">Coupe</option>
                  <option value="wagon">Wagon</option>
                  <option value="convertible">Convertible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Technical Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                  Fuel Type
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={vehicle.fuelType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                >
                  <option value="">Select fuel type</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={vehicle.transmission}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                >
                  <option value="">Select transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={vehicle.mileage}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  placeholder="e.g., 50000"
                />
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Sale Price (Rs.)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={vehicle.price}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  placeholder="e.g., 2500000"
                />
              </div>
              <div>
                <label htmlFor="rentalPrice" className="block text-sm font-medium text-gray-700">
                  Rental Price (Rs. per day)
                </label>
                <input
                  type="number"
                  id="rentalPrice"
                  name="rentalPrice"
                  value={vehicle.rentalPrice}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </div>

          {/* Description & Features Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Description & Features</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={vehicle.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  placeholder="Provide a detailed description of the vehicle..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <div className="mt-2 flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 rounded-l-lg border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    placeholder="Add a feature (e.g., Leather seats)"
                  />
                  <button
                    type="button"
                    onClick={handleFeatureAdd}
                    className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-4 text-gray-700 hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-[#4F46E5]/10 py-1 pl-3 pr-2 text-sm font-medium text-[#4F46E5]"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[#4F46E5] hover:bg-[#4F46E5]/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Images</h2>
            <div className="space-y-6">
              <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-[#4F46E5] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#4F46E5] focus-within:ring-offset-2 hover:text-[#4338CA]"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vehicle.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Vehicle ${index + 1}`}
                      className="h-40 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] font-medium"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

