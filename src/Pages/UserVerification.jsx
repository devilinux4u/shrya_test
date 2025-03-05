import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaCheckCircle, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function UserVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [userData, setUserData] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(true);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Get user data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem("pendingVerification");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      // If no data, redirect to registration
      navigate("/register");
      toast.error("Please complete registration first");
    }
  }, [navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only take the first character

    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    // Validate OTP
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:3000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.userId,
          otp: otpValue,
        }),
      });

      // console.log(userData?.email, otpValue);

      const data = await response.json();

      if (!data.success) {
        setError(data.msg);
        throw new Error(data.msg);
      }

      toast.success("Account verified successfully!");

      // Clear session storage
      sessionStorage.removeItem("pendingVerification");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset countdown
      setCountdown(60);
      setResendDisabled(true);

      toast.info(`New OTP sent to your email`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const successVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };

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
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="initial"
                  animate="animate"
                  className="flex flex-col items-center justify-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <FaCheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Verification Successful!
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Your account has been verified successfully. Redirecting to
                    login...
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Verify Your Account
                    </h2>
                    <p className="text-gray-600">
                      We've sent a verification code to your email
                    </p>
                    {userData && (
                      <p className="text-sm font-medium text-[#6B7CFF] mt-2">
                        {userData.email}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center space-x-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-[#6B7CFF] focus:ring-2 focus:ring-[#6B7CFF] focus:outline-none transition-colors"
                          maxLength={1}
                        />
                      ))}
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
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
                      disabled={loading}
                      className="w-full py-3 bg-[#6B7CFF] text-white rounded-lg hover:bg-[#5A6AE6] transition-colors duration-300 flex items-center justify-center"
                    >
                      {loading ? (
                        <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      ) : null}
                      Verify Account
                    </motion.button>
                  </form>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={handleResendOtp}
                      disabled={resendDisabled || loading}
                      className={`flex items-center ${
                        resendDisabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#6B7CFF] hover:text-[#5A6AE6]"
                      }`}
                    >
                      <FaRedo className="mr-2" />
                      {resendDisabled
                        ? `Resend in ${countdown}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
