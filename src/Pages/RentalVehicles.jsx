import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sonata from '../assets/Sonata.png';
import CarCard from '../Components/CarCard';
import { Car } from 'lucide-react';

function RentalVehicles() {
  const navigate = useNavigate();

  const handleRentNow = () => {
    navigate(`/RentalVehicleDesc`);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-start relative overflow-hidden">
      {/* Hero Section */}
      <div className="w-full max-w-[100rem] mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
        {/* Text Content */}
        <div className="space-y-6">
          {/* Brand and Model */}
          <div>
            <h2 className="text-[#E94A35] font-semibold text-3xl lg:text-4xl">HYUNDAI</h2>
            <h1 className="text-black text-5xl lg:text-6xl font-extrabold tracking-wider">SONATA</h1>
          </div>
  
          {/* Description */}
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-lg">
            The purpose of Elite Drives is to be the best choice in automobiles for its customers and to be part of the
            special moments of their lives.
          </p>
  
          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-[#E94A35] text-3xl lg:text-4xl font-bold">Rs. 500</span>
            <span className="text-gray-600 text-lg">/hr</span>
          </div>
  
          {/* Rent Now Button */}
          <button
            onClick={handleRentNow}
            className="bg-[#5B5FDD] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#4A4EC9] transition-colors"
          >
            Rent Now
          </button>
        </div>
  
        {/* Car Image */}
        <div className="relative">
          <div className="absolute top-4 right-4 bg-[#FF5722] text-white flex flex-col items-center justify-center rounded-full w-24 h-24 shadow-lg">
            <span className="text-3xl font-bold">20%</span>
            <span className="text-sm font-medium">OFF</span>
          </div>
          <img
            src={Sonata}
            alt="Hyundai Sonata"
            className="w-full h-auto max-w-full object-contain"
          />
        </div>
      </div>

      {/* Car Cards Section */}
      <div className="w-full max-w-7xl mx-auto p-6 mt-10 space-y-6">
        {/* Individual Car Card */}
        <CarCard />
      </div>
    </div>
  );
}

export default RentalVehicles;
