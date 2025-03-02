"use client"

import { useState } from "react"
import { Camera, Plus, X } from "lucide-react"

export default function SellVehicle() {
  const [vehicle, setVehicle] = useState({
    title: "",
    make: "",
    model: "",
    year: "",
    type: "",
    color: "",
    totalKm: "",
    fuelType: "",
    transmission: "",
    price: "",
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
    console.log("Submitting vehicle:", vehicle)
    // Here you would typically send the data to your backend
  }

  const colorOptions = [
    "White",
    "Black",
    "Silver",
    "Gray",
    "Red",
    "Blue",
    "Green",
    "Brown",
    "Gold",
    "Orange",
    "Yellow",
    "Purple",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Sell Your Vehicle</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={vehicle.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                  placeholder="e.g., 2023 Toyota Camry Hybrid XLE"
                />
              </div>
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={vehicle.make}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                  placeholder="e.g., Toyota"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={vehicle.model}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                  placeholder="e.g., Camry"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={vehicle.year}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                  placeholder="e.g., 2023"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Details</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={vehicle.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
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
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  id="color"
                  name="color"
                  value={vehicle.color}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                >
                  <option value="">Select color</option>
                  {colorOptions.map((color) => (
                    <option key={color} value={color.toLowerCase()}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="totalKm" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Kilometers Run
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="number"
                    id="totalKm"
                    name="totalKm"
                    value={vehicle.totalKm}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 pr-12 focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                    placeholder="e.g., 50000"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">km</span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={vehicle.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                >
                  <option value="">Select fuel type</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={vehicle.transmission}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                >
                  <option value="">Select transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs.)
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rs.</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={vehicle.price}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 pl-12 focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                    placeholder="e.g., 2500000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Description & Features</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={vehicle.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
                  placeholder="Provide a detailed description of your vehicle..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 rounded-l-lg border-gray-300 focus:border-[#ff6b00] focus:ring-[#ff6b00]"
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
                      className="inline-flex items-center rounded-full bg-[#ff6b00]/10 py-1 pl-3 pr-2 text-sm font-medium text-[#ff6b00]"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[#ff6b00] hover:bg-[#ff6b00]/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Images</h2>
            <div className="space-y-6">
              <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-[#ff6b00] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#ff6b00] focus-within:ring-offset-2 hover:text-[#ff8533]"
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-[#ff6b00] text-white rounded-full hover:bg-[#ff8533] font-medium text-lg transition-colors"
            >
              List Your Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

