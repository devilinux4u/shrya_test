import { useState, useEffect } from "react"
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "react-toastify"
import Cookies from "js-cookie"

export default function SellVehicleForm({ isOpen, onClose }) {
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    totalKm: "",
    fuelType: "",
    transmission: "",
    price: "",
    description: "",
    images: [],
    imagePreviewUrls: [],
    ownership: "",
    mileage: "",
    seats: "",
    engineCC: "",
  })

  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      vehicle.imagePreviewUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [vehicle.imagePreviewUrls])

  const handleChange = (e) => {
    const { name, value } = e.target
    setVehicle((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))

    setVehicle((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviewUrls: [...prev.imagePreviewUrls, ...newPreviewUrls],
    }))
  }

  const handleImageRemove = (index) => {
    setVehicle((prev) => {
      if (prev.imagePreviewUrls[index]) {
        URL.revokeObjectURL(prev.imagePreviewUrls[index])
      }

      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imagePreviewUrls: prev.imagePreviewUrls.filter((_, i) => i !== index),
      }
    })
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(vehicle).forEach((key) => {
      if (key !== "images" && key !== "imagePreviewUrls" && !vehicle[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
      }
    })

    // Check if images are uploaded
    if (vehicle.images.length === 0) {
      newErrors.images = "Please upload at least one image"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const formData = new FormData()

        Object.entries(vehicle).forEach(([key, value]) => {
          if (key !== "images" && key !== "imagePreviewUrls") {
            formData.append(key, value)
          }
        })

        // Add actual image files to FormData
        if (vehicle.images.length > 0) {
          vehicle.images.forEach((imageData) => {
            formData.append(`images`, imageData)
          })
        }

        formData.append("id", Cookies.get("sauto").split("-")[0])

        console.log(formData)

        const response = await fetch("http://127.0.0.1:3000/addVehicle", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          // Remove the alert and just use toast
          toast.success("Vehicle listed successfully!")
          // Reset form and close it
          setVehicle({
            make: "",
            model: "",
            year: "",
            color: "",
            totalKm: "",
            fuelType: "",
            transmission: "",
            price: "",
            description: "",
            images: [],
            imagePreviewUrls: [],
            ownership: "",
            mileage: "",
            seats: "",
            engineCC: "",
          })
          setStep(1)
          onClose() // Close the form after successful submission
        } else {
          toast.error("Failed to list vehicle. Please try again.")
        }
      } catch (error) {
        console.error("Error listing vehicle:", error)
        toast.error("Failed to list vehicle. Please try again.")
      }
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const validateStep = () => {
    const stepFields = {
      1: ["make", "model", "year", "color"],
      2: ["totalKm", "fuelType", "transmission", "price", "ownership", "mileage", "seats", "engineCC"],
      3: ["description"], // Description is only validated in step 3
    }

    const currentStepFields = stepFields[step]
    const stepErrors = {}

    currentStepFields.forEach((field) => {
      if (!vehicle[field]) {
        stepErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    // Check for images in step 3
    if (step === 3 && vehicle.images.length === 0) {
      stepErrors.images = "Please upload at least one image"
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const prevStep = () => setStep(step - 1)
  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1)
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              <InputField
                label="Color"
                name="color"
                value={vehicle.color}
                onChange={handleChange}
                placeholder="e.g., Red"
                error={errors.color}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vehicle Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              <SelectField
                label="Ownership"
                name="ownership"
                value={vehicle.ownership}
                onChange={handleChange}
                options={[
                  { value: "1st", label: "1st Owner" },
                  { value: "2nd", label: "2nd Owner" },
                  { value: "3rd", label: "3rd Owner" },
                  { value: "4th+", label: "4th Owner or more" },
                ]}
                error={errors.ownership}
              />
              <InputField
                label="Mileage (km/l)"
                name="mileage"
                type="number"
                value={vehicle.mileage}
                onChange={handleChange}
                placeholder="e.g., 15"
                suffix="km/l"
                error={errors.mileage}
              />
              <InputField
                label="Number of Seats"
                name="seats"
                type="number"
                value={vehicle.seats}
                onChange={handleChange}
                placeholder="e.g., 5"
                error={errors.seats}
              />
              <InputField
                label="Engine Capacity"
                name="engineCC"
                type="number"
                value={vehicle.engineCC}
                onChange={handleChange}
                placeholder="e.g., 1500"
                suffix="cc"
                error={errors.engineCC}
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
                rows={4}
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
                {vehicle.imagePreviewUrls.map((previewUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={previewUrl || "/placeholder.svg"}
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
              {errors.images && <p className="mt-2 text-sm text-red-500">{errors.images}</p>}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="h-6 w-6" />
        </button>

        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Sell Your Vehicle</h1>
        </div>

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

        <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
          <form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="mt-6 flex justify-between">
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
                  List Vehicle
                </button>
              )}
            </div>
          </form>
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

