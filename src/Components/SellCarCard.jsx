import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Thar from "../assets/Thar.png";
import SellSonata from "../assets/SellSonata.png";
import Mazda from "../assets/Mazda.png";

// Vehicle data with basic details and images
const vehicles = [
  {
    brand: "MAZDA",
    model: "MAZDA6",
    year: "2024",
    mileage: "18000 Km",
    price: "1,900,000",
    image: Mazda,
  },
  {
    brand: "MAHINDRA",
    model: "THAR",
    year: "2023",
    mileage: "8000 Km",
    price: "20,000,000",
    image: Thar,
  },
  {
    brand: "HYUNDAI",
    model: "SONATA",
    year: "2021",
    mileage: "5000 Km",
    price: "8,000,000",
    image: SellSonata,
  },
];
 
// Card component for displaying vehicle information
function VehicleCard({ vehicle }) {
  const navigate = useNavigate(); // Define navigate inside VehicleCard

  return (
    <div
      className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate("/BuyVehiclesDesc", { state: { vehicle } })} // Navigate with state
    >
      <img
        src={vehicle.image}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="w-full max-w-xs object-cover rounded-lg hover:scale-105 transition-transform duration-300"
      />
      <div className="text-center mt-4">
        <p className="text-red-600 font-semibold uppercase tracking-wide">
          {vehicle.brand}
        </p>
        <p className="text-gray-700 text-lg font-medium mt-1">{vehicle.model}</p>
        <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
          <span>{vehicle.year}</span>
          <span>{vehicle.mileage}</span>
        </div>
        <p className="text-gray-800 text-lg font-semibold mt-2">
          Rs. {vehicle.price}
        </p>
      </div>
    </div>
  );
}

// Main component to display the list of vehicles
export default function SellCarCard() {
  const navigate = useNavigate(); // Define navigate using useNavigate

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header button */}
      <div className="flex justify-center mb-8">
        <button className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors">
          Our Vehicles
        </button>
      </div>

      {/* Vehicle cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle, index) => (
          <VehicleCard key={index} vehicle={vehicle} />
        ))}
      </div>

      {/* Footer button */}
      <div className="flex justify-center mt-12">
        <button 
          onClick={() => navigate("/VehicleListing")} 
          className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors"
        >
          Discover All Vehicles
        </button>
      </div>
    </div>
  );
}
