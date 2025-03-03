"use client"

import { useState, useEffect } from "react"
import { Camera, Plus, X, ChevronLeft, ChevronRight } from "lucide-react"

export default function SellVehicleForm({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
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

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

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
    onClose()
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

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  if (!isOpen) return null

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InputField
                label="Vehicle Title"
                name="title"
                value={vehicle.title}
                onChange={handleChange}
                placeholder="e.g., 2023 Toyota Camry Hybrid XLE"
              />
              <InputField
                label="Make"
                name="make"
                value={vehicle.make}
                onChange={handleChange}
                placeholder="e.g., Toyota"
              />
              <InputField
                label="Model"
                name="model"
                value={vehicle.model}
                onChange={handleChange}
                placeholder="e.g., Camry"
              />
              <InputField
                label="Year"
                name="year"
                type="number"
                value={vehicle.year}
                onChange={handleChange}
                placeholder="e.g., 2023"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vehicle Details</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="Type"
                name="type"
                value={vehicle.type}
                onChange={handleChange}
                options={[
                  { value: "sedan", label: "Sedan" },
                  { value: "suv", label: "SUV" },
                  { value: "truck", label: "Truck" },
                  { value: "van", label: "Van" },
                  { value: "coupe", label: "Coupe" },
                  { value: "wagon", label: "Wagon" },
                  { value: "convertible", label: "Convertible" },
                ]}
              />
              <SelectField
                label="Color"
                name="color"
                value={vehicle.color}
                onChange={handleChange}
                options={colorOptions.map((color) => ({ value: color.toLowerCase(), label: color }))}
              />
              <InputField
                label="Total Kilometers Run"
                name="totalKm"
                type="number"
                value={vehicle.totalKm}
                onChange={handleChange}
                placeholder="e.g., 50000"
                suffix="km"
              />
              <SelectField
                label="Fuel Type"
                name="fuelType"
                value={vehicle.fuelType}
                onChange={handleChange}
                options={[
                  { value: "gasoline", label: "Gasoline" },
                  { value: "diesel", label: "Diesel" },
                  { value: "electric", label: "Electric" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
              />
              <SelectField
                label="Transmission"
                name="transmission"
                value={vehicle.transmission}
                onChange={handleChange}
                options={[
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                  { value: "cvt", label: "CVT" },
                ]}
              />
              <InputField
                label="Price (Rs.)"
                name="price"
                type="number"
                value={vehicle.price}
                onChange={handleChange}
                placeholder="e.g., 2500000"
                prefix="Rs."
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Description & Features</h2>
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
        )
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vehicle Images</h2>
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
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Sell Your Vehicle</h1>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`h-2 rounded-full flex-1 transition-colors duration-200 ${
                  step >= stepNumber ? "bg-[#ff6b00]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form content */}
        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
          <form onSubmit={handleSubmit}>{renderStep()}</form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors flex items-center ml-auto"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors ml-auto"
              >
                List Your Vehicle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const InputField = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00] focus:ring-opacity-50 transition-colors"
      placeholder={placeholder}
    />
  </div>
)

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

