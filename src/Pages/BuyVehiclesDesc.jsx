"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import BuyNowForm from "../Components/BuyNowForm"

export default function BuyVehiclesDesc() {
  const [activeSection, setActiveSection] = useState("hero")
  const [showBuyNowForm, setShowBuyNowForm] = useState(false)
  const mainRef = useRef(null)
  const sections = useRef({})

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const observers = {}
    const sectionIds = ["hero", "images", "specifications", "details"]

    sectionIds.forEach((id) => {
      observers[id] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.5 },
      )

      if (sections.current[id]) {
        observers[id].observe(sections.current[id])
      }
    })

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect())
    }
  }, [])

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  return (
    <div ref={mainRef} className="relative">
      {/* Hero Section */}
      <motion.section
        ref={(el) => (sections.current.hero = el)}
        style={{ opacity, scale }}
        className="min-h-screen relative flex items-center py-20 px-8"
      >
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-red-600 text-2xl font-bold mb-2">TOYOTA</h1>
              <h2 className="text-4xl font-bold tracking-wider">
                LAND CRUISER
                <br />
                PRADO
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500">Year:</p>
                  <p className="text-xl">2023/2024</p>
                </div>
                <div>
                  <p className="text-gray-500">Km</p>
                  <p className="text-xl">19000</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Ownership</p>
                <p className="text-xl">Single-Hand</p>
              </div>

              <div>
                <p className="text-gray-500">Price</p>
                <p className="text-3xl font-bold">
                  Rs. <span className="text-red-600">10,000,000</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBuyNowForm(true)}
              className="bg-[#4F46E5] text-white px-8 py-3 rounded-full text-lg hover:bg-[#4338CA] transition-colors"
            >
              Buy Now
            </button>
          </div>

          <div className="relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yYEfMtCEIUbS41feUOsWLakxRbQ3Xd.png"
              alt="Toyota Land Cruiser Prado"
              className="w-full h-auto"
            />
          </div>
        </div>
      </motion.section>

      {/* Navigation */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 space-y-8 z-50">
        <div className="flex flex-col items-start space-y-6">
          {["images", "specifications", "details"].map((section) => (
            <button
              key={section}
              onClick={() => {
                sections.current[section]?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`relative text-lg font-medium uppercase ${
                activeSection === section ? "text-red-600" : "text-gray-700"
              }`}
            >
              {section}
              {activeSection === section && (
                <motion.div
                  layoutId="indicator"
                  className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-red-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Images Section */}
      <section ref={(el) => (sections.current.images = el)} className="min-h-screen py-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="relative aspect-video">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yYEfMtCEIUbS41feUOsWLakxRbQ3Xd.png"
                alt={`Toyota Land Cruiser Prado View ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Specifications Section */}
      <section ref={(el) => (sections.current.specifications = el)} className="min-h-screen py-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto grid grid-cols-3 gap-x-16 gap-y-8"
        >
          {[
            { label: "Mileage", value: "10 km/lr" },
            { label: "Seat", value: "7 seater" },
            { label: "Fuel", value: "Petrol" },
            { label: "Transmission", value: "Auto" },
            { label: "Engine CC", value: "3000" },
            { label: "Color", value: "Silver" },
          ].map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-gray-500">{spec.label}</p>
              <p className="text-2xl font-medium">{spec.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Details Section */}
      <section ref={(el) => (sections.current.details = el)} className="min-h-screen py-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto grid md:grid-cols-2 gap-12"
        >
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
              corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt
              in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>
          </div>
          <div>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yYEfMtCEIUbS41feUOsWLakxRbQ3Xd.png"
              alt="Toyota Land Cruiser Prado Rear View"
              className="w-full h-auto rounded-lg mb-4"
            />
            <button
              onClick={() => setShowBuyNowForm(true)}
              className="w-full bg-[#4F46E5] text-white px-8 py-3 rounded-full text-lg hover:bg-[#4338CA] transition-colors"
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      </section>
      {showBuyNowForm && (
        <BuyNowForm
          vehicle={{
            name: "Toyota Land Cruiser Prado",
            year: "2023/2024",
            mileage: "19000",
            ownership: "Single-Hand",
            price: "10,000,000",
          }}
          onClose={() => setShowBuyNowForm(false)}
        />
      )}
    </div>
  )
}
 
