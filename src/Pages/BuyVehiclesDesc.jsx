"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BuyNowForm from "../Components/BuyNowForm";
import { useLocation } from "react-router-dom";

export default function BuyVehiclesDesc() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showBuyNowForm, setShowBuyNowForm] = useState(false);
  const [vehicle, setVehicle] = useState(null); // Store fetched vehicle data
  const mainRef = useRef(null);
  const sections = useRef({});

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const vehicleId = params.get("id"); // Get the vehicle ID from URL params

  // Move useScroll here with layoutEffect: false
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    // Fetch vehicle data from the backend using the ID from the URL
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/vehicles/one/${vehicleId}`); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setVehicle(data.msg); // Set the vehicle data to the state
        } else {
          console.error("Vehicle not found");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    if (vehicleId) {
      fetchVehicle(); // Fetch vehicle data when the component mounts or vehicleId changes
    }
  }, [vehicleId]);

  useEffect(() => {
    const observers = {};
    const sectionIds = ["hero", "images", "specifications", "details"];

    sectionIds.forEach((id) => {
      observers[id] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.5 }
      );

      if (sections.current[id]) {
        observers[id].observe(sections.current[id]);
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  if (!vehicle) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

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
              <h1 className="text-red-600 text-2xl font-bold mb-2">{vehicle.model}</h1>
              <h2 className="text-4xl font-bold tracking-wider">
                {vehicle.make}
                <br />
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500">Year:</p>
                  <p className="text-xl">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-gray-500">Km</p>
                  <p className="text-xl">{vehicle.km}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Ownership</p>
                <p className="text-xl">{vehicle.own}</p>
              </div>

              <div>
                <p className="text-gray-500">Price</p>
                <p className="text-3xl font-bold">
                  Rs. <span className="text-red-600">{vehicle.price}</span>
                </p>
              </div>

              {/* Added Posted By and Posted Time */}
              <div>
                <p className="text-gray-500">Posted By</p>
                <p className="text-xl">{vehicle.postedBy}</p>
              </div>
              <div>
                <p className="text-gray-500">Posted Time</p>
                <p className="text-xl">{new Date(vehicle.createdAt).toLocaleString()}</p>
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
            {vehicle.images && vehicle.images.length > 0 ? (
              <img
                src={`../../server/controllers${vehicle.images[0].image}`} // Use the first image from the vehicle images array
                alt={vehicle.title}
                className="w-full h-auto"
              />
            ) : (
              <img
                src="/placeholder.svg"
                alt="Placeholder"
                className="w-full h-auto"
              />
            )}
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
                sections.current[section]?.scrollIntoView({ behavior: "smooth" });
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
          {vehicle.images && vehicle.images.length > 0 ? (
            vehicle.images.map((image, index) => (
              <div key={index} className="relative aspect-video">
                <img
                  src={`../../server/controllers${image.image}`}
                  alt={`${vehicle.type}-image`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))
          ) : (
            <div className="relative aspect-video">
              <img
                src="/placeholder.svg"
                alt="Placeholder"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
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
            { label: "Mileage", value: vehicle.mile },
            { label: "Seat", value: vehicle.seat },
            { label: "Fuel", value: vehicle.fuel },
            { label: "Transmission", value: vehicle.trans },
            { label: "Engine CC", value: vehicle.cc },
            { label: "Color", value: vehicle.color },
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
            <p className="text-gray-600">{vehicle.des}</p>
          </div>
          <div>
            {vehicle.images && vehicle.images.length > 0 ? (
              <img
                src={`../../server/controllers${vehicle.images[0].image}`} // Display the first image again in details
                alt={`${vehicle.title}-rear`}
                className="w-full h-auto rounded-lg mb-4"
              />
            ) : (
              <img
                src="/placeholder.svg"
                alt="Placeholder"
                className="w-full h-auto rounded-lg mb-4"
              />
            )}
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
            name: vehicle.title,
            year: vehicle.year,
            mileage: vehicle.km,
            ownership: "Single-Hand",
            price: vehicle.price,
          }}
          onClose={() => setShowBuyNowForm(false)}
        />
      )}
    </div>
  );
}