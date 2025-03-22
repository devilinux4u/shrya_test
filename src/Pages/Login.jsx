"use client"

import { useState } from "react"
import { FaUser, FaLock, FaGoogle, FaExclamationTriangle } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useGoogleLogin } from "@react-oauth/google"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("") // State for managing error message
  const navigate = useNavigate() // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user = formData.username
    const pass = formData.password

    try {
      const response = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, pass }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.msg == 'itsadmin') {
          toast.success("Admin Logged in!")
          Cookies.set("sauto", data.cok, { expires: 10 })
          navigate("/admin/dashboard")
        }
        else if (data.msg == 'pending') {
          
          sessionStorage.setItem(
            "pendingVerification",
            JSON.stringify({
              userId: data.dd.id,
              email: data.dd.email
            }),
          )
  
          // Navigate to verification page instead of login
          toast.error("Please verify your account.")
  
          setTimeout(() => {
            navigate("/UserVerification");
          }, 1000);

        }
        else { 
          Cookies.set("sauto", data.cok, { expires: 10 })
          setError("")
          onLogin({ username: user, password: pass }) // Call onLogin with credentials
          toast.success("Login successful!")
          navigate("/")
          window.location.reload();

        }
      } else {
        setError(data.msg)
        toast.error(data.msg)
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.")
      toast.error("An error occurred while logging in. Please try again.")
    }
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      x: -200,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: 200,
    },
  }

  const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const handleRegisterClick = (e) => {
    e.preventDefault()
    navigate("/Register")
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch("http://127.0.0.1:3000/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.access_token }),
        });

        if (res.status === 404) {
          toast.error("Google login endpoint not found. Please check the server.");
          return;
        }

        const data = await res.json();

        if (data.success) {
          Cookies.set("sauto", data.cok, { expires: 10 });
          toast.success("Google login successful!");
          navigate("/");
          window.location.reload();
        } else {
          toast.error(data.msg);
        }
      } catch (error) {
        toast.error("An error occurred while logging in with Google. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Google login failed. Please try again.");
    },
    flow: "implicit",
  })

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
          {/* Left Side - Blue Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:w-1/2 bg-[#6B7CFF] p-12 text-white flex flex-col justify-center items-center"
          >
            <h2 className="text-4xl font-bold mb-6">Hello, Welcome!</h2>
            <p className="text-lg mb-8 text-center">Don't have an account?</p>
            <button
              onClick={handleRegisterClick}
              className="px-8 py-3 border-2 border-white rounded-lg text-white hover:bg-white hover:text-[#6B7CFF] transition-colors duration-300"
            >
              Register
            </button>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md:w-1/2 p-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
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
                <div className="text-right">
                  <a href="#" className="text-sm text-[#6B7CFF] hover:underline">
                    Forgot password?
                  </a>
                </div>
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
                Login
              </motion.button>

              <div className="relative my-8">
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
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  googleLogin();
                }}
                className="w-full py-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-red-500" /> Login with Google
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}