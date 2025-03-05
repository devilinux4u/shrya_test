"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Car,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  Clock,
  ShoppingBag,
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const WishlistBookNow = ({ vehicle, onClose }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingData, setBookingData] = useState({
    // Step 1: Personal Information
    fullName: "",
    email: "",
    phone: "",
    address: "",

    // Step 2: Booking Details
    startDate: "",
    endDate: "",
    purpose: "rent", // Default to rent, but user can change
    paymentMethod: "credit_card",

    // Step 3: Review & Confirm
    agreeToTerms: false,
    additionalNotes: "",
  })

  // Calculate rental duration and price
  const calculateDuration = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0

    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays || 1
  }

  const calculatePrice = () => {
    const duration = calculateDuration()
    const basePrice = Number.parseInt(vehicle?.budget || 0)

    return bookingData.purpose === "rent" ? basePrice * duration : basePrice
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setBookingData({
      ...bookingData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.address) {
        toast.error("Please fill in all required fields")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(bookingData.email)) {
        toast.error("Please enter a valid email address")
        return
      }

      // Phone validation
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(bookingData.phone.replace(/[^0-9]/g, ""))) {
        toast.error("Please enter a valid 10-digit phone number")
        return
      }
    }

    if (currentStep === 2) {
      // Validate step 2
      if (!bookingData.startDate || (bookingData.purpose === "rent" && !bookingData.endDate)) {
        toast.error("Please select the required dates")
        return
      }

      // Validate date range
      if (bookingData.purpose === "rent") {
        const start = new Date(bookingData.startDate)
        const end = new Date(bookingData.endDate)

        if (end <= start) {
          toast.error("End date must be after start date")
          return
        }
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!bookingData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setBookingComplete(true)
      toast.success("Your booking has been confirmed!")
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error("Failed to complete your booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? "bg-[#4B3EAE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div className={`w-12 h-1 ${currentStep >= 2 ? "bg-[#4B3EAE]" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? "bg-[#4B3EAE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <div className={`w-12 h-1 ${currentStep >= 3 ? "bg-[#4B3EAE]" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 3 ? "bg-[#4B3EAE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>
    )
  }

  const renderStepTitle = () => {
    const titles = ["Personal Information", "Booking Details", "Review & Confirm"]

    return (
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{titles[currentStep - 1]}</h2>
        <p className="text-gray-600 mt-1">
          {currentStep === 1 && "Please provide your contact information"}
          {currentStep === 2 && `Select your ${vehicle?.purpose === "rent" ? "rental" : "purchase"} details`}
          {currentStep === 3 && "Review your information and confirm your booking"}
        </p>
      </div>
    )
  }

  const renderStep1 = () => {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={bookingData.fullName}
              onChange={handleInputChange}
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4B3EAE] focus:border-[#4B3EAE]"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={bookingData.email}
              onChange={handleInputChange}
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4B3EAE] focus:border-[#4B3EAE]"
              placeholder="john.doe@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={bookingData.phone}
              onChange={handleInputChange}
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4B3EAE] focus:border-[#4B3EAE]"
              placeholder="9876543210"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="address"
              name="address"
              value={bookingData.address}
              onChange={handleInputChange}
              rows={3}
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4B3EAE] focus:border-[#4B3EAE]"
              placeholder="Your full address"
              required
            ></textarea>
          </div>
        </div>
      </div>
    )
  }

  const renderStep2 = () => {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <Car className="w-5 h-5 text-[#4B3EAE] mr-2" />
            <h3 className="font-medium">Vehicle Details</h3>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Vehicle:</span>
              <p className="font-medium">{vehicle?.vehicleName || "Toyota Camry"}</p>
            </div>
            <div>
              <span className="text-gray-600">Purpose:</span>
              <p className="font-medium capitalize">{vehicle?.purpose || "Rent"}</p>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <p className="font-medium">
                Rs. {vehicle?.budget || "45,000"}
                {vehicle?.purpose === "rent" ? "/day" : ""}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">I want to:</label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <input
                type="radio"
                id="rent_purpose"
                name="purpose"
                value="rent"
                checked={bookingData.purpose === "rent"}
                onChange={handleInputChange}
                className="sr-only"
              />
              <label
                htmlFor="rent_purpose"
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  bookingData.purpose === "rent"
                    ? "border-[#4B3EAE] bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Clock
                  className={`w-5 h-5 mr-2 ${bookingData.purpose === "rent" ? "text-[#4B3EAE]" : "text-gray-400"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    bookingData.purpose === "rent" ? "text-[#4B3EAE]" : "text-gray-700"
                  }`}
                >
                  Rent this Vehicle
                </span>
              </label>
            </div>

            <div>
              <input
                type="radio"
                id="buy_purpose"
                name="purpose"
                value="buy"
                checked={bookingData.purpose === "buy"}
                onChange={handleInputChange}
                className="sr-only"
              />
              <label
                htmlFor="buy_purpose"
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  bookingData.purpose === "buy"
                    ? "border-[#4B3EAE] bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <ShoppingBag
                  className={`w-5 h-5 mr-2 ${bookingData.purpose === "buy" ? "text-[#4B3EAE]" : "text-gray-400"}`}
                />
                <span
                  className={`text-sm font-medium ${
                    bookingData.purpose === "buy" ? "text-[#4B3EAE]" : "text-gray-700"
                  }`}
                >
                  Buy this Vehicle
                </span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            {bookingData.purpose === "rent" ? "Start Date" : "Pickup Date"} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={bookingData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4B3EAE] focus:border-[#4B3EAE]"
              required
            />
          </div>
        </div>

        {bookingData.purpose === "rent" && (
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={bookingData.endDate}
                onChange={handleInputChange}
                min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4B3EAE] focus:border-[#4B3EAE]"
                required={bookingData.purpose === "rent"}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
            <div>
              <input
                type="radio"
                id="credit_card"
                name="paymentMethod"
                value="credit_card"
                checked={bookingData.paymentMethod === "credit_card"}
                onChange={handleInputChange}
                className="sr-only"
              />
              <label
                htmlFor="credit_card"
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  bookingData.paymentMethod === "credit_card"
                    ? "border-[#4B3EAE] bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard
                  className={`w-6 h-6 mb-2 ${
                    bookingData.paymentMethod === "credit_card" ? "text-[#4B3EAE]" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    bookingData.paymentMethod === "credit_card" ? "text-[#4B3EAE]" : "text-gray-700"
                  }`}
                >
                  Credit Card
                </span>
              </label>
            </div>

            <div>
              <input
                type="radio"
                id="debit_card"
                name="paymentMethod"
                value="debit_card"
                checked={bookingData.paymentMethod === "debit_card"}
                onChange={handleInputChange}
                className="sr-only"
              />
              <label
                htmlFor="debit_card"
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  bookingData.paymentMethod === "debit_card"
                    ? "border-[#4B3EAE] bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard
                  className={`w-6 h-6 mb-2 ${
                    bookingData.paymentMethod === "debit_card" ? "text-[#4B3EAE]" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    bookingData.paymentMethod === "debit_card" ? "text-[#4B3EAE]" : "text-gray-700"
                  }`}
                >
                  Debit Card
                </span>
              </label>
            </div>

            <div>
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={bookingData.paymentMethod === "cash"}
                onChange={handleInputChange}
                className="sr-only"
              />
              <label
                htmlFor="cash"
                className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                  bookingData.paymentMethod === "cash"
                    ? "border-[#4B3EAE] bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <DollarSign
                  className={`w-6 h-6 mb-2 ${
                    bookingData.paymentMethod === "cash" ? "text-[#4B3EAE]" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    bookingData.paymentMethod === "cash" ? "text-[#4B3EAE]" : "text-gray-700"
                  }`}
                >
                  Cash
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep3 = () => {
    const duration = calculateDuration()
    const totalPrice = calculatePrice()

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#4B3EAE]" />
            Booking Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Vehicle</span>
              <span className="font-medium">{vehicle?.vehicleName || "Toyota Camry"}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Purpose</span>
              <span className="font-medium capitalize">{bookingData.purpose || "Rent"}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">{bookingData.purpose === "rent" ? "Start Date" : "Pickup Date"}</span>
              <span className="font-medium">{bookingData.startDate}</span>
            </div>

            {bookingData.purpose === "rent" && (
              <>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium">{bookingData.endDate}</span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {duration} day{duration !== 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">
                {bookingData.paymentMethod === "credit_card" && "Credit Card"}
                {bookingData.paymentMethod === "debit_card" && "Debit Card"}
                {bookingData.paymentMethod === "cash" && "Cash"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-800 font-medium">Total Amount</span>
              <span className="text-lg font-bold text-[#4B3EAE]">Rs. {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>


        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={bookingData.additionalNotes}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#4B3EAE] focus:border-[#4B3EAE]"
            placeholder="Any special requests or information..."
          ></textarea>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={bookingData.agreeToTerms}
                onChange={handleInputChange}
                className="focus:ring-[#4B3EAE] h-4 w-4 text-[#4B3EAE] border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                I agree to the terms and conditions
              </label>
              <p className="text-gray-500">
                By confirming this booking, you agree to our terms of service, cancellation policy, and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderBookingComplete = () => {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your booking for {vehicle?.vehicleName || "Toyota Camry"} has been confirmed.
          {bookingData.purpose === "rent"
            ? ` The vehicle will be available for pickup on ${bookingData.startDate}.`
            : ` The vehicle will be ready for pickup on ${bookingData.startDate}.`}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto text-left">
          <h3 className="font-medium mb-2">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">
                BK
                {Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">Rs. {calculatePrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize">{bookingData.paymentMethod.replace("_", " ")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/YourList")}
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Your List
          </button>
          <button
            onClick={() => navigate("/BookingHistory")}
            className="bg-[#4B3EAE] text-white px-6 py-2 rounded-lg hover:bg-[#3c318a] transition-colors"
          >
            View Booking History
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <ToastContainer />

      {bookingComplete ? (
        renderBookingComplete()
      ) : (
        <div>
          {renderStepIndicator()}
          {renderStepTitle()}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-2 bg-[#4B3EAE] text-white rounded-lg hover:bg-[#3c318a] transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-6 py-2 bg-[#4B3EAE] text-white rounded-lg hover:bg-[#3c318a] transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <CheckCircle className="w-5 h-5 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default WishlistBookNow

