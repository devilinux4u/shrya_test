"use client"

import { useState, useEffect } from "react"
import { Car, DollarSign, Camera, X } from "lucide-react"

const WishlistForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    purpose: "",
    vehicleType: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    budget: "",
    duration: "",
    additionalRequirements: "",
    name: "",
    email: "",
    phone: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    // Simple validation
    if (
      !formData.purpose ||
      !formData.vehicleType ||
      !formData.brand ||
      !formData.model ||
      !formData.name ||
      !formData.email
    ) {
      setMessage("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log(formData)
      setMessage("Wishlist request submitted successfully!")
      setFormData({
        purpose: "",
        vehicleType: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        budget: "",
        duration: "",
        additionalRequirements: "",
        name: "",
        email: "",
        phone: "",
      })

      // Close modal after successful submission
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setMessage("Failed to submit wishlist request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 text-gray-800 rounded-full p-2 hover:bg-gray-300 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              <span className="text-[#ff6b00]">Can't</span>
              <span className="font-mono"> find a Vehicle?</span>
            </h1>
            <p className="text-gray-600">
              The purpose of Elite Drives is to be the best choice in automobiles for its customers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Purpose Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Purpose*</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="purpose"
                    value="buy"
                    checked={formData.purpose === "buy"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-[#ff6b00]"
                    required
                  />
                  <span className="ml-2">Buy</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="purpose"
                    value="rent"
                    checked={formData.purpose === "rent"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-[#ff6b00]"
                    required
                  />
                  <span className="ml-2">Rent</span>
                </label>
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Car className="w-5 h-5" />
              <h2>Vehicle Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type*</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                  <option value="sports">Sports Car</option>
                  <option value="van">Van</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand*</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., Toyota, BMW"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name*</label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleChange}
                  placeholder="e.g., Sonata, Polo"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model*</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., Camry, X5"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Km Run*</label>
                <input
                  type="text"
                  name="kmRun"
                  value={formData.kmRun}
                  onChange={handleChange}
                  placeholder="e.g., 50,000"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ownership*</label>
                <select
                  name="ownership"
                  value={formData.ownership}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Ownership</option>
                  <option value="1st">1st Hand</option>
                  <option value="2nd">2nd Hand</option>
                  <option value="3rd">3rd Hand</option>
                  <option value="4th">4th Hand</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type*</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Fuel type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric Car</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2024"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Black, White"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.purpose === "buy" ? "Budget" : "Budget (per day)"}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full pl-9 p-2 border rounded-md"
                  />
                </div>
              </div>

              {formData.purpose === "rent" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rental Duration</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select rental duration</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="long-term">Long Term (3+ months)</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                placeholder="Any specific features or requirements..."
                className="w-full p-2 border rounded-md resize-none"
                rows="4"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Mention any specific features, modifications, or requirements you're looking for.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-[#ff6b00] transition">
                <Camera className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                <input type="file" className="hidden" accept="image/*" multiple />
              </div>
            </div>

            
    

            {message && (
              <div
                className={`p-4 rounded-md ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#ff6b00] text-white py-2 px-4 rounded-md hover:bg-[#ff8533] transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Wishlist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WishlistForm

