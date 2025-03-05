import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Car,
  MapPin,
  Shield,
  Clock,
  Headphones,
  Search,
  CreditCard,
  CheckCircle,
  Calendar,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomeImg from "../assets/HomeImg.png";
import HowItWorks from "../assets/HowItWorks.png";
import HomeBuySell from "../assets/HomeBuySell.png";
import Wishlist from "../assets/Wishlist.png";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("rent");
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleRentNow = () => {
    navigate("/RentalGallery");
  };
  const handleExplore = () => {
    navigate("/VehicleListing");
  };
  const handleSellYourVehicle = () => {
    navigate("/BuyVehicles");
  };
  const handleWishlist = () => {
    navigate("/YourList");
  };

  const handleLostAndFound = () => {
    navigate("/LostAndFound");
  };

  const handleCreateAccount = () => {
    navigate("/Register");
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={HomeImg || "/placeholder.svg"}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
        <div className="container relative z-10 h-full flex flex-col justify-center items-end px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-right"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Your Journey, Your Choice
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Rent, buy, or sell vehicles with ease. Find exactly what you need
              or list what you don't.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleRentNow}
                className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors"
              >
                Rent Now
              </button>
              <button
                onClick={handleExplore}
                className="px-6 py-3 text-white bg-transparent border border-white/30 hover:bg-white/10 rounded-md font-medium transition-colors backdrop-blur-sm"
              >
                Explore Marketplace
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <motion.section
        className="container px-4 md:px-6 py-12 md:py-16 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="text-center mb-10">
          <span className="text-orange-500 uppercase tracking-wider text-sm">
            Why Choose Us
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Benefits of Our Service
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Experience premium service with features designed to make your
            vehicle rental and purchase journey seamless and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-500">
              All payments and personal information are protected with
              industry-leading security measures.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
            <p className="text-gray-500">
              Book, buy, or list vehicles anytime, anywhere with our always-on
              platform.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Support</h3>
            <p className="text-gray-500">
              Our dedicated customer service team is ready to assist you with
              any questions or concerns.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="bg-gray-100 py-12 md:py-16"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-10">
            <span className="text-orange-500 uppercase tracking-wider text-sm">
              Simple Process
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our simple process makes renting, buying, or selling vehicles
              straightforward and hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants} className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src={
                    HowItWorks ||
                    "/placeholder.svg?height=600&width=800&text=Car Booking Process"
                  }
                  alt="Car booking process"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold">
                    Seamless Experience
                  </h3>
                  <p className="text-white/80">
                    From search to drive in just a few clicks
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <Search className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Search</h3>
                  <p className="text-gray-600">
                    Browse our extensive collection of vehicles to find the
                    perfect match for your needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <Calendar className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    2. Book or Select
                  </h3>
                  <p className="text-gray-600">
                    Choose your dates for rental or select a vehicle to purchase
                    from our marketplace.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Payment</h3>
                  <p className="text-gray-600">
                    Complete your transaction securely with our multiple payment
                    options.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">4. Enjoy</h3>
                  <p className="text-gray-600">
                    Pick up your rental or finalize your purchase and enjoy your
                    new vehicle.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Rental Services Section*/}
      <motion.section
        className="container px-4 md:px-6 py-12 md:py-16 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="bg-orange-50 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-orange-500 uppercase tracking-wider text-sm">
                Rental Services
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Premium Vehicle Rentals
              </h2>
              <p className="text-gray-500 max-w-xl">
                Experience the freedom of the open road with our premium rental
                fleet. From compact cars to luxury SUVs, we have the perfect
                vehicle for your journey.
              </p>
            </div>
            <div>
              <button
                onClick={handleRentNow}
                className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
              >
                Explore Rental
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Buy & Sell Section */}
      <motion.section
        className="bg-gradient-to-r from-indigo-50 to-orange-50 py-12 md:py-16"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants}>
              <span className="text-orange-500 uppercase tracking-wider text-sm">
                Marketplace
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Buy & Sell Vehicles
              </h2>
              <p className="text-gray-500 mb-6">
                Our marketplace connects buyers and sellers for seamless vehicle
                transactions. Find your next car or list your current one with
                confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleExplore}
                  className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                  Explore Vehicles
                </button>
              </div>
              {/* Added image for mobile view */}
              <div className="md:hidden mt-6">
                <div className="relative rounded-lg overflow-hidden shadow-lg h-56">
                  <img
                    src={HomeBuySell || "/placeholder.svg"}
                    alt="Vehicle marketplace"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-white" />
                      <span className="text-white font-medium text-sm">
                        Buy
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="h-4 w-4 text-white" />
                      <span className="text-white font-medium text-sm">
                        Sell
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Slightly larger image for desktop view */}
            <motion.div
              variants={itemVariants}
              className="relative hidden md:block"
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg h-64 max-w-lg mx-auto">
                <img
                  src={HomeBuySell || "/placeholder.svg"}
                  alt="Vehicle marketplace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-white" />
                    <span className="text-white font-medium">Buy</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-5 w-5 text-white" />
                    <span className="text-white font-medium">Sell</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Lost and Found  */}
      <motion.section
        className="container px-4 md:px-6 py-12 md:py-16 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="bg-indigo-50 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-orange-500 uppercase tracking-wider text-sm">
                Support
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Lost & Found
              </h2>
              <p className="text-gray-500 max-w-xl">
                Lost something during your rental? Or found an item left behind?
                Our lost and found system helps reconnect people with their
                belongings.
              </p>
            </div>
            <div>
              <button
                onClick={handleLostAndFound}
                className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
              >
                Explore Lost And Found
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Wishlist Highlight  */}
      <motion.section
        className="bg-gradient-to-r from-orange-100 to-indigo-50 py-12 md:py-16"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              variants={itemVariants}
              className="relative h-72 md:h-96 order-2 md:order-1"
            >
              <img
                src={
                  Wishlist ||
                  "/placeholder.svg?height=600&width=800&text=Wishlist"
                }
                alt="Wishlist illustration"
                className="w-full h-full object-contain"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <span className="text-orange-500 uppercase tracking-wider text-sm">
                Wishlist
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-gray-500 mb-6">
                Add vehicles to your wishlist and we'll notify you when they
                become available for rent or purchase.
              </p>
              <button
                onClick={handleWishlist}
                className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
              >
                Explore Wishlist
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="container px-4 md:px-6 text-center mx-auto">
          <span className="text-orange-300 uppercase tracking-wider text-sm">
            Join Us Today
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8">
            Join thousands of satisfied customers who rent, buy, and sell
            vehicles on our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCreateAccount}
              className="py-3 px-6 bg-white text-indigo-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
