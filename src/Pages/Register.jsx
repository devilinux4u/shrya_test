"use client"

import { useState } from "react"
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaPhone, FaExclamationTriangle } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  })
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { fullName, username, email, phoneNumber, password } = formData

    try {
      const response = await fetch("http://127.0.0.1:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, user: username, email, phoneNumber, pass: password }),
      })

      const data = await response.json()

      if (data.value) {
        navigate("/Login")
        toast.success("Registration successful!")
      } else {
        toast.error(data.message || "Registration failed. Please try again.")
      }
    } catch (err) {
      toast.error("Registration failed: " + err.message)
    }
  }

  const googleLogin = () => {
    console.log("Google login clicked")
    // Add your Google login logic here
  }

  const pageVariants = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 },
  }

  const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    navigate("/Login")
  }

  return (
    <>
      <ToastContainer />
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ type: "tween", duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      >
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Registration Form */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:w-1/2 p-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]"
                  required
                />
              </div>

              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]"
                  required
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]"
                  required
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]"
                  required
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B7CFF]"
                  required
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={errorVariants}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start space-x-3"
                    role="alert"
                  >
                    <FaExclamationTriangle className="flex-shrink-0 w-5 h-5 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-[#6B7CFF] text-white rounded-lg hover:bg-[#5A6AE6] transition-colors duration-300"
              >
                Register
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={googleLogin}
                className="w-full py-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-red-500" /> Register with Google
              </motion.button>
            </form>
          </motion.div>

          {/* Right Side - Blue Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md:w-1/2 bg-[#6B7CFF] p-12 text-white flex flex-col justify-center items-center"
          >
            <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-lg mb-8 text-center">Already have an account?</p>
            <button
              onClick={handleLoginClick}
              className="px-8 py-3 border-2 border-white rounded-lg text-white hover:bg-white hover:text-[#6B7CFF] transition-colors duration-300"
            >
              Login
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}