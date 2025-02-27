"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, Building2, Wallet } from "lucide-react"

export default function BuyNowForm({ vehicle, onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "",
    termsAccepted: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && formData.paymentMethod) {
      setStep(3)
    }
  }

  const paymentMethods = [
    {
      id: "bank",
      title: "Bank Transfer",
      description: "Direct bank transfer with 2-3 business days processing",
      icon: Building2,
    },
    {
      id: "card",
      title: "Credit Card",
      description: "Secure payment via credit/debit card",
      icon: CreditCard,
    },
    {
      id: "cash",
      title: "Cash on Delivery",
      description: "Pay when you receive the vehicle",
      icon: Wallet,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="border-b p-6 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold">Purchase Vehicle</h2>
            <p className="text-gray-500">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100">
          <motion.div
            initial={{ width: "33.33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-[#4F46E5]"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex gap-6 items-start">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yYEfMtCEIUbS41feUOsWLakxRbQ3Xd.png"
                    alt="Toyota Land Cruiser Prado"
                    className="w-48 h-auto rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">Toyota Land Cruiser Prado</h3>
                    <p className="text-gray-500">2023/2024 • 19000 km • Single-Hand</p>
                    <p className="text-2xl font-bold mt-2">Rs. 10,000,000</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-[#4F46E5] text-white px-8 py-3 rounded-full text-lg hover:bg-[#4338CA] transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <h3 className="text-xl font-semibold">Select Payment Method</h3>
                  <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? "border-[#4F46E5] bg-[#4F46E5]/5"
                            : "hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <method.icon className="w-5 h-5" />
                            <span className="font-medium">{method.title}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-200 text-gray-800 px-8 py-3 rounded-full text-lg hover:bg-gray-300 transition-colors mb-4"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.paymentMethod}
                    className="w-full bg-[#4F46E5] text-white px-8 py-3 rounded-full text-lg hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Review
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Review Your Order</h3>

                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Toyota Land Cruiser Prado</h4>
                        <p className="text-sm text-gray-500">2023/2024 • 19000 km</p>
                      </div>
                      <p className="font-bold">Rs. 10,000,000</p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Buyer Information</h4>
                      <div className="grid gap-2 text-sm">
                        <p>
                          <span className="text-gray-500">Name:</span> {formData.fullName}
                        </p>
                        <p>
                          <span className="text-gray-500">Email:</span> {formData.email}
                        </p>
                        <p>
                          <span className="text-gray-500">Phone:</span> {formData.phone}
                        </p>
                        <p>
                          <span className="text-gray-500">Address:</span> {formData.address}
                        </p>
                        <p>
                          <span className="text-gray-500">City:</span> {formData.city}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <p className="text-sm">{paymentMethods.find((m) => m.id === formData.paymentMethod)?.title}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-500">
                      I agree to the terms and conditions of the sale, including the vehicle inspection policy and
                      return policy.
                    </label>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-gray-200 text-gray-800 px-8 py-3 rounded-full text-lg hover:bg-gray-300 transition-colors mb-4"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => {
                      // Handle purchase completion
                      onClose()
                    }}
                    disabled={!formData.termsAccepted}
                    className="w-full bg-[#4F46E5] text-white px-8 py-3 rounded-full text-lg hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Purchase
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

