"use client"

import { useState, useEffect } from "react"
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "react-toastify"

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
    images: [],
  })

  const [errors, setErrors] = useState({})

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setVehicle((prev) => ({ ...prev, [name]: value }))
    // Clear the error for this field when the user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }))
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

  const validateForm = () => {
    const newErrors = {}
    Object.keys(vehicle).forEach((key) => {
      if (key !== "images" && !vehicle[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Submitting vehicle:", vehicle)
      toast.success("Vehicle listed successfully!")
      onClose()
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1)
    } else {
      toast.error("Please fill in all required fields for this step")
    }
  }

  const validateStep = () => {
    const stepFields = {
      1: ["title", "make", "model", "year"],
      2: ["type", "color", "totalKm", "fuelType", "transmission", "price"],
      3: ["description"],
    }
    const currentStepFields = stepFields[step]
    const stepErrors = {}
    currentStepFields.forEach((field) => {
      if (!vehicle[field]) {
        stepErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

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
                error={errors.title}
              />
              <InputField
                label="Make"
                name="make"
                value={vehicle.make}
                onChange={handleChange}
                placeholder="e.g., Toyota"
                error={errors.make}
              />
              <InputField
                label="Model"
                name="model"
                value={vehicle.model}
                onChange={handleChange}
                placeholder="e.g., Camry"
                error={errors.model}
              />
              <InputField
                label="Year"
                name="year"
                type="number"
                value={vehicle.year}
                onChange={handleChange}
                placeholder="e.g., 2023"
                error={errors.year}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vehicle Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                error={errors.type}
              />
              <InputField
                label="Color"
                name="color"
                value={vehicle.color}
                onChange={handleChange}
                placeholder="e.g., Red"
                error={errors.color}
              />
              <InputField
                label="Total Kilometers Run"
                name="totalKm"
                type="number"
                value={vehicle.totalKm}
                onChange={handleChange}
                placeholder="e.g., 50000"
                suffix="km"
                error={errors.totalKm}
              />
              <SelectField
                label="Fuel Type"
                name="fuelType"
                value={vehicle.fuelType}
                onChange={handleChange}
                options={[
                  { value: "Petrol", label: "Petrol" },
                  { value: "diesel", label: "Diesel" },
                  { value: "electric", label: "Electric" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
                error={errors.fuelType}
              />
              <SelectField
                label="Transmission"
                name="transmission"
                value={vehicle.transmission}
                onChange={handleChange}
                options={[
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                ]}
                error={errors.transmission}
              />
              <InputField
                label="Price (Rs.)"
                name="price"
                type="number"
                value={vehicle.price}
                onChange={handleChange}
                placeholder="e.g., 2500000"
                prefix="Rs."
                error={errors.price}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Description & Images</h2>
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
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Provide a detailed description of your vehicle..."
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Images</label>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {vehicle.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Vehicle ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
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
            {[1, 2, 3].map((stepNumber) => (
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
            {step < 3 ? (
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

const InputField = ({ label, name, type = "text", value, onChange, placeholder, prefix, suffix, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00] focus:ring-opacity-50 transition-colors ${
          prefix ? "pl-7" : "pl-4"
        } ${suffix ? "pr-12" : "pr-4"} py-2`}
        placeholder={placeholder}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
)

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-lg ${
        error ? "border-red-500" : "border-gray-300"
      } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
)

