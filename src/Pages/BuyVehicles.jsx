import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from 'lucide-react'; 
import Toyota from "../assets/Toyota.png";
import SellCarCard from "../Components/SellCarCard";
import SellVehicleForm from "../Components/SellVehicleForm";

export default function VehicleDetails() {
  const navigate = useNavigate();
  const [showSellVehicleForm, setShowSellVehicleForm] = useState(false);

  return (
    <div className="mt-12 container mx-auto px-4 py-8 relative">
      {/* Top Button */}
      <div className="absolute left-4 top-4">
        <button
          onClick={() => setShowSellVehicleForm(true)}
          className="bg-[#C84C27] text-white px-6 py-2 rounded-full hover:bg-[#B43D1B] transition-colors"
        >
          Sell a vehicle
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Brand and Model */}
        <div className="text-center mb-4">
          <h1 className="text-[#C84C27] text-3xl font-medium mb-2">TOYOTA</h1>
          <h2 className="text-4xl tracking-[0.5em] font-bold">
            LAND CRUISER PRADO
          </h2>
        </div>

        {/* Vehicle Image and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-8">
          {/* Vehicle Image */}
          <div>
            <img
              src={Toyota || "/placeholder.svg"}
              alt="Toyota Land Cruiser Prado"
              className="w-full h-auto"
            />
          </div>

          {/* Vehicle Specifications */}
          <div className="space-y-6">
            <h3 className="text-xl text-gray-600 italic">Expect the unexpected</h3>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Year:</p>
                  <p className="font-medium">2024</p>
                </div>
                <div>
                  <p className="text-gray-500">Mileage:</p>
                  <p className="font-medium">10 km/hr</p>
                </div>
                <div>
                  <p className="text-gray-500">Km:</p>
                  <p className="font-medium">19000</p>
                </div>
                <div>
                  <p className="text-gray-500">Price:</p>
                  <p className="font-medium">Rs. 10,000,000</p>
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
