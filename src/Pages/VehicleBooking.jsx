"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  ChevronRight,
  DollarSign,
  Shield,
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const VehicleBooking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Form data state
  const [formData, setFormData] = useState({
    // Personal details
    fullName: "",
    email: "",
    phone: "",
    address: "",

    // Booking details
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",

    // Payment details
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",

    // Additional options
    insurance: false,
    additionalDriver: false,
    childSeat: false,
    gpsNavigation: false,
  })

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        // Get vehicle ID from URL params or location state
        const vehicleId = new URLSearchParams(location.search).get("id") || (location.state && location.state.id)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock data for demonstration
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
          description: "This is a well-maintained Toyota Camry with all service records.",
          dateSubmitted: "2024-02-01",
          image: "/placeholder.svg?height=200&width=300",
          dailyRate: "3,500",
          securityDeposit: "10,000",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const validateStep = (step) => {
    switch (step) {
      case 1: // Personal details
        if (!formData.fullName || !formData.email || !formData.phone) {
          toast.error("Please fill in all required fields")
          return false
        }
        if (!validateEmail(formData.email)) {
          toast.error("Please enter a valid email address")
          return false
        }
        if (!validatePhone(formData.phone)) {
          toast.error("Please enter a valid phone number")
          return false
        }
        return true

      case 2: // Booking details
        if (!formData.pickupDate || !formData.pickupTime || !formData.returnDate || !formData.returnTime) {
          toast.error("Please select all date and time fields")
          return false
        }

        const pickup = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
        const returnDate = new Date(`${formData.returnDate}T${formData.returnTime}`)

        if (pickup >= returnDate) {
          toast.error("Return date must be after pickup date")
          return false
        }

        return true

      case 3: // Payment details
        if (formData.paymentMethod === "card") {
          if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
            toast.error("Please fill in all payment details")
            return false
          }

          if (!validateCardNumber(formData.cardNumber)) {
            toast.error("Please enter a valid card number")
            return false
          }

          if (!validateExpiryDate(formData.expiryDate)) {
            toast.error("Please enter a valid expiry date (MM/YY)")
            return false
          }

          if (!validateCVV(formData.cvv)) {
            toast.error("Please enter a valid CVV")
            return false
          }
        }
        return true

      default:
        return true
    }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const validatePhone = (phone) => {
    return phone.length >= 10
  }

  const validateCardNumber = (cardNumber) => {
    return cardNumber.replace(/\s/g, "").length === 16
  }

  const validateExpiryDate = (expiryDate) => {
    return /^\d{2}\/\d{2}$/.test(expiryDate)
  }

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random booking reference
      const reference = `BK${Math.floor(100000 + Math.random() * 900000)}`
      setBookingReference(reference)

      // Show success message
      toast.success("Booking confirmed successfully!")

      // Set booking as complete
      setBookingComplete(true)
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error("Failed to process booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    if (!vehicle) return 0

    // For buy purpose, return the budget
    if (vehicle.purpose === "buy") {
      return vehicle.budget
    }

    // For rent purpose, calculate based on days
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate)
      const returnDate = new Date(formData.returnDate)
      const days = Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24))

      if (days > 0) {
        // Remove commas and convert to number
        const dailyRate = Number(vehicle.dailyRate.replace(/,/g, ""))
        let total = dailyRate * days

        // Add costs for additional options
        if (formData.insurance) total += 500 * days
        if (formData.additionalDriver) total += 300 * days
        if (formData.childSeat) total += 200 * days
        if (formData.gpsNavigation) total += 150 * days

        return total.toLocaleString()
      }
    }

    return vehicle.dailyRate
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${
              currentStep >= 1 ? "bg-[#4B3EAE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className={`h-1 w-12 ${currentStep >= 2 ? "bg-[#4B3EAE]" : "bg-gray-200"}`}></div>
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${
              currentStep >= 2 ? "bg-[#4B3EAE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div className={`h-1 w-12 ${currentStep >= 3 ? "bg-[#4B3EAE]" : "bg-gray-200"}`}></div>
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${
              currentStep >= 3 ? "bg-[#4B3EAE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
          <div className={`h-1 w-12 ${currentStep >= 4 ? "bg-[#4B3EAE]" : "bg-gray-200"}`}></div>
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${
              currentStep >= 4 ? "bg-[#4B3EAE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            4
          </div>
        </div>
      </div>
    )
  }

  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Details"
      case 2:
        return "Booking Details"
      case 3:
        return "Payment Information"
      case 4:
        return "Review & Confirm"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B3EAE]"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
        <p className="text-gray-600 mb-6">The vehicle you're trying to book doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/your-list")}
          className="bg-[#4B3EAE] text-white px-6 py-2 rounded-lg hover:bg-[#3c318a] transition-colors"
        >
          Back to Your List
        </button>
      </div>
    )
  }

  // If booking is complete, show confirmation
  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <ToastContainer />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">Your booking has been successfully processed.</p>
              <p className="text-lg font-semibold mt-2">Booking Reference: {bookingReference}</p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 my-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.vehicleName}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold">{vehicle.vehicleName}</h3>
                  <p className="text-gray-600 mb-4">
                    {vehicle.brand} {vehicle.model} • {vehicle.year}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Pickup Date</p>
                      <p className="font-medium">
                        {formData.pickupDate} at {formData.pickupTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Return Date</p>
                      <p className="font-medium">
                        {formData.returnDate} at {formData.returnTime}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold">Rs. {calculateTotal()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                A confirmation email has been sent to {formData.email} with all the details.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/your-list")}
                  className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Your List
                </button>
                <button
                  onClick={() => navigate("/bookings")}
                  className="bg-[#4B3EAE] text-white px-6 py-3 rounded-lg hover:bg-[#3c318a] transition-colors"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />

      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/wishlist-vehicle-detail/${vehicle.id}`)}
          className="flex items-center text-gray-700 mb-6 hover:text-[#4B3EAE] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Vehicle Details
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold">Book {vehicle.vehicleName}</h1>
            <p className="text-gray-600 mt-1">Complete the form below to finalize your booking</p>
          </div>

          <div className="p-6">
            {/* Step indicator */}
            {renderStepIndicator()}

            <h2 className="text-xl font-semibold text-center mb-6">{renderStepTitle()}</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Left column - Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border rounded-lg"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border rounded-lg"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border rounded-lg"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border rounded-lg"
                            placeholder="Enter your address"
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Booking Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date*</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              name="pickupDate"
                              value={formData.pickupDate}
                              onChange={handleChange}
                              className="w-full pl-10 p-3 border rounded-lg"
                              min={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time*</label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="time"
                              name="pickupTime"
                              value={formData.pickupTime}
                              onChange={handleChange}
                              className="w-full pl-10 p-3 border rounded-lg"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date*</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              name="returnDate"
                              value={formData.returnDate}
                              onChange={handleChange}
                              className="w-full pl-10 p-3 border rounded-lg"
                              min={formData.pickupDate || new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Return Time*</label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="time"
                              name="returnTime"
                              value={formData.returnTime}
                              onChange={handleChange}
                              className="w-full pl-10 p-3 border rounded-lg"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Additional Options</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="insurance"
                              checked={formData.insurance}
                              onChange={handleChange}
                              className="h-5 w-5 text-[#4B3EAE] rounded"
                            />
                            <span className="ml-2">
                              <span className="font-medium">Insurance Coverage</span>
                              <span className="text-sm text-gray-500 block">Additional Rs. 500 per day</span>
                            </span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="additionalDriver"
                              checked={formData.additionalDriver}
                              onChange={handleChange}
                              className="h-5 w-5 text-[#4B3EAE] rounded"
                            />
                            <span className="ml-2">
                              <span className="font-medium">Additional Driver</span>
                              <span className="text-sm text-gray-500 block">Additional Rs. 300 per day</span>
                            </span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="childSeat"
                              checked={formData.childSeat}
                              onChange={handleChange}
                              className="h-5 w-5 text-[#4B3EAE] rounded"
                            />
                            <span className="ml-2">
                              <span className="font-medium">Child Seat</span>
                              <span className="text-sm text-gray-500 block">Additional Rs. 200 per day</span>
                            </span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="gpsNavigation"
                              checked={formData.gpsNavigation}
                              onChange={handleChange}
                              className="h-5 w-5 text-[#4B3EAE] rounded"
                            />
                            <span className="ml-2">
                              <span className="font-medium">GPS Navigation</span>
                              <span className="text-sm text-gray-500 block">Additional Rs. 150 per day</span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Information */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Payment Method</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <label
                            className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                              formData.paymentMethod === "card" ? "border-[#4B3EAE] bg-purple-50" : "border-gray-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="card"
                              checked={formData.paymentMethod === "card"}
                              onChange={handleChange}
                              className="h-4 w-4 text-[#4B3EAE]"
                            />
                            <span className="ml-2 flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                              Credit/Debit Card
                            </span>
                          </label>

                          <label
                            className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                              formData.paymentMethod === "cash" ? "border-[#4B3EAE] bg-purple-50" : "border-gray-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cash"
                              checked={formData.paymentMethod === "cash"}
                              onChange={handleChange}
                              className="h-4 w-4 text-[#4B3EAE]"
                            />
                            <span className="ml-2 flex items-center">
                              <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                              Pay at Pickup
                            </span>
                          </label>
                        </div>
                      </div>

                      {formData.paymentMethod === "card" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number*</label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border rounded-lg"
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                required={formData.paymentMethod === "card"}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name*</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleChange}
                                className="w-full pl-10 p-3 border rounded-lg"
                                placeholder="Name on card"
                                required={formData.paymentMethod === "card"}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                              <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="MM/YY"
                                maxLength="5"
                                required={formData.paymentMethod === "card"}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                              <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="123"
                                maxLength="4"
                                required={formData.paymentMethod === "card"}
                              />
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm text-gray-500 flex items-center">
                              <Shield className="h-4 w-4 mr-1 text-gray-400" />
                              Your payment information is secure and encrypted
                            </p>
                          </div>
                        </div>
                      )}

                      {formData.paymentMethod === "cash" && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Pay at Pickup Information</h4>
                          <p className="text-sm text-blue-700">
                            You'll need to pay the full amount when you pick up the vehicle. We accept cash, credit
                            cards, and debit cards.
                          </p>
                          <p className="text-sm text-blue-700 mt-2">
                            A security deposit of Rs. {vehicle.securityDeposit} will be required at pickup.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Review & Confirm */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{formData.fullName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{formData.phone}</p>
                          </div>
                          {formData.address && (
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium">{formData.address}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Booking Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Pickup Date</p>
                            <p className="font-medium">
                              {formData.pickupDate} at {formData.pickupTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Return Date</p>
                            <p className="font-medium">
                              {formData.returnDate} at {formData.returnTime}
                            </p>
                          </div>
                        </div>

                        {(formData.insurance ||
                          formData.additionalDriver ||
                          formData.childSeat ||
                          formData.gpsNavigation) && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">Additional Options</p>
                            <ul className="list-disc list-inside text-sm mt-1">
                              {formData.insurance && <li>Insurance Coverage</li>}
                              {formData.additionalDriver && <li>Additional Driver</li>}
                              {formData.childSeat && <li>Child Seat</li>}
                              {formData.gpsNavigation && <li>GPS Navigation</li>}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Payment Method</h3>
                        <p className="font-medium">
                          {formData.paymentMethod === "card" ? "Credit/Debit Card" : "Pay at Pickup"}
                        </p>

                        {formData.paymentMethod === "card" && (
                          <div className="mt-2">
                            <p className="text-sm">Card ending in {formData.cardNumber.slice(-4)}</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#4B3EAE] bg-opacity-10 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-[#4B3EAE]">Total Amount</h3>
                          <p className="text-xl font-bold text-[#4B3EAE]">Rs. {calculateTotal()}</p>
                        </div>

                        {vehicle.purpose === "rent" && (
                          <p className="text-sm text-gray-600 mt-2">
                            Security deposit of Rs. {vehicle.securityDeposit} will be required at pickup.
                          </p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label className="flex items-center">
                          <input type="checkbox" required className="h-5 w-5 text-[#4B3EAE] rounded" />
                          <span className="ml-2 text-sm">
                            I agree to the{" "}
                            <a href="#" className="text-[#4B3EAE] underline">
                              terms and conditions
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-[#4B3EAE] underline">
                              privacy policy
                            </a>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2 bg-[#4B3EAE] text-white rounded-lg hover:bg-[#3c318a] flex items-center"
                      >
                        Next
                        <ChevronRight className="ml-1 h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={`px-6 py-2 bg-[#4B3EAE] text-white rounded-lg hover:bg-[#3c318a] flex items-center ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                        {!isSubmitting && <CheckCircle className="ml-1 h-5 w-5" />}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right column - Vehicle Summary */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4 sticky top-6">
                  <h3 className="font-medium mb-3">Booking Summary</h3>

                  <div className="mb-4">
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.vehicleName}
                      className="w-full h-auto rounded-lg mb-3"
                    />
                    <h4 className="font-medium">{vehicle.vehicleName}</h4>
                    <p className="text-sm text-gray-600">
                      {vehicle.brand} {vehicle.model} • {vehicle.year}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{vehicle.purpose === "buy" ? "Price" : "Daily Rate"}</span>
                      <span className="font-medium">
                        Rs. {vehicle.purpose === "buy" ? vehicle.budget : vehicle.dailyRate}
                      </span>
                    </div>

                    {vehicle.purpose === "rent" && formData.pickupDate && formData.returnDate && (
                      <>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">
                            {(() => {
                              const pickup = new Date(formData.pickupDate)
                              const returnDate = new Date(formData.returnDate)
                              const days = Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24))
                              return `${days} day${days !== 1 ? "s" : ""}`
                            })()}
                          </span>
                        </div>

                        {formData.insurance && (
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-600">Insurance</span>
                            <span>+ Rs. 500/day</span>
                          </div>
                        )}

                        {formData.additionalDriver && (
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-600">Additional Driver</span>
                            <span>+ Rs. 300/day</span>
                          </div>
                        )}

                        {formData.childSeat && (
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-600">Child Seat</span>
                            <span>+ Rs. 200/day</span>
                          </div>
                        )}

                        {formData.gpsNavigation && (
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-600">GPS Navigation</span>
                            <span>+ Rs. 150/day</span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>Rs. {calculateTotal()}</span>
                    </div>

                    {vehicle.purpose === "rent" && (
                      <div className="mt-3 text-sm text-gray-600">
                        <p>Security deposit: Rs. {vehicle.securityDeposit}</p>
                        <p className="mt-1">Refundable upon vehicle return in good condition</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleBooking

