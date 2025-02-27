"use client"

import { useState } from "react"
import { FaUser, FaLock, FaGoogle,} from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import {useGoogleLogin} from '@react-oauth/google';

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate(); // Use useNavigate instead of useRouter

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    // Add your login logic here
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      x: -200
    },
    animate: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: 200
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/Register'); // Replaced router.push with navigate
  };
const responseGoogle = async (authResult)=>{
  try {
    if(authResult['code']){

    }
  } catch (error) {
    console.log('error: ', error);
  }
}
const googleLogin = useGoogleLogin({
  onSuccess: async (response) => {
    console.log("User Info:", response);
  },
  onError: (error) => console.error("Login Failed:", error),
  flow: "implicit", // This ensures you get 'authuser' and 'scope'
});


  return (
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

            <motion.button

              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-[#6B7CFF] text-white rounded-lg hover:bg-[#5A6AE6] transition-colors duration-300"
            >
              Login
            </motion.button>

            <div  className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or 
                </span>
              </div>
            </div>

<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={googleLogin}
  className="w-full py-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
>
  <FaGoogle className="w-5 h-5 mr-2 text-red-500" /> Login with Google
</motion.button>
            
            
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
