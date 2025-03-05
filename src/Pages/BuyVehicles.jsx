import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Toyota from "../assets/Toyota.png";
import SellCarCard from "../Components/SellCarCard";
import SellVehicleForm from "../Components/SellVehicleForm";

export default function VehicleDetails() {
  const navigate = useNavigate();
  const [showSellVehicleForm, setShowSellVehicleForm] = useState(false);
  const [vehicle, setVehicle] = useState(null);  // state to store the vehicle data
  const [error, setError] = useState(null);  // state to store error messages

  const handleSellVehicleClick = () => {
    const cookie = Cookies.get('sauto');
    if (!cookie) {
      navigate("/Login");
    } else {
      setShowSellVehicleForm(true);
    }
  };

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/vehicles/random", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVehicle(data.msg); // Store fetched vehicle data in the state
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setError("Failed to load vehicle data. Please try again later.");
      }
    };

    fetchVehicle();
  }, []);

  if (error) {
    return <div>{error}</div>;  // Render error message if there's an error
  }

  if (!vehicle) {
    return <div>Loading...</div>;  // Render a loading message while the data is being fetched
  }

  // Log vehicle.img to check its content
  console.log(vehicle);

  return (
    <div className="mt-12 container mx-auto px-4 py-8 relative">
      {/* Top Button */}
      <div className="absolute left-4 top-4">
        <button
          onClick={handleSellVehicleClick}
          className="bg-[#C84C27] text-white px-6 py-2 rounded-full hover:bg-[#B43D1B] transition-colors"
        >
          Sell a vehicle
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Brand and Model */}
        <div className="text-center mb-4">
          <h1 className="text-[#C84C27] text-3xl font-medium mb-2">{vehicle.make}</h1>
          <h2 className="text-4xl tracking-[0.5em] font-bold">
            {vehicle.model}
          </h2>
        </div>

        {/* Vehicle Image and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-8">
          {/* Vehicle Image */}
          <div>
            {vehicle.images && vehicle.images.length > 0 ? (
              <img
                src={vehicle.images[0].image || "/placeholder.svg"}  // Check if image exists in array and provide fallback
                alt={vehicle.model}
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

          {/* Vehicle Specifications */}
          <div className="space-y-6">
            <h3 className="text-xl text-gray-600 italic">Expect the unexpected</h3>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Year:</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mileage:</p>
                  <p className="font-medium">{vehicle.mile} km</p>
                </div>
                <div>
                  <p className="text-gray-500">Fuel Type:</p>
                  <p className="font-medium">{vehicle.fuel}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price:</p>
                  <p className="font-medium">Rs. {vehicle.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl text-gray-600 mb-2">Change your perspectives</h3>
            <h2 className="text-4xl font-bold">Move your passion.</h2>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Choose the ideal model for your lifestyle
            </h3>
            <p className="text-gray-600">
              The purpose of Elite Drives is to be the best choice in automobiles for its
              customers and to be part of the special moments of their lives.
            </p>
          </div>
        </div>
      </div>
      <SellCarCard />

      {/* Sell Vehicle Form Modal */}
      <SellVehicleForm
        isOpen={showSellVehicleForm}
        onClose={() => setShowSellVehicleForm(false)}
      />
    </div>
  );
}