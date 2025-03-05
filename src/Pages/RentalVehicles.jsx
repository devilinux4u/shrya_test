import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "../Components/CarCard";

function RentalVehicles() {
  const navigate = useNavigate();
  const [carData, setCarData] = useState(null);

  useEffect(() => {
    // Fetch car data from API
    fetch("http://127.0.0.1:3000/rent/ran1") // Replace with actual API endpoint
      .then((response) => response.json())
      .then((data) => setCarData(data))
      .catch((error) => console.error("Error fetching car data:", error));
  }, []);

  const handleRentNow = (data) => {
    const vehicleParams = new URLSearchParams({ id: data.id });
    navigate(`/RentalVehicleDesc?${vehicleParams.toString()}`);
  };

  if (!carData) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="mt-12 min-h-screen w-full bg-white flex flex-col items-center justify-start relative overflow-hidden">
      {/* Hero Section */}
      <div className="w-full max-w-[100rem] mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
        {/* Text Content */}
        <div className="space-y-6">
          {/* Brand and Model */}
          <div>
            <h2 className="text-[#E94A35] font-semibold text-3xl lg:text-4xl">
              {carData?.make?.toUpperCase() || "Unknown Make"}
            </h2>
            <h1 className="text-black text-5xl lg:text-6xl font-extrabold tracking-wider">
              {carData?.model?.toUpperCase() || "Unknown Model"}
            </h1>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-lg">
            {carData?.description || "No description available."}
          </p>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-[#E94A35] text-3xl lg:text-4xl font-bold">
              Rs. {carData?.priceHour || "N/A"}
            </span>
            <span className="text-gray-600 text-lg">/hr</span>
          </div>

          {/* Rent Now Button */}
          <button
            onClick={() => handleRentNow(carData)}
            className="bg-[#5B5FDD] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#4A4EC9] transition-colors"
          >
            Rent Now
          </button>
        </div>

        {/* Car Image */}
        <div className="relative">
          <img
            src={
              carData?.rentVehicleImages?.[0]?.image
                ? `../../server${carData.rentVehicleImages[0].image}`
                : "placeholder.jpg"
            }
            alt={`${carData?.make || "Car"} ${carData?.model || "Image"}`}
            className="w-full h-auto max-w-full object-contain"
          />
        </div>
      </div>

      {/* Car Cards Section */}
      <div className="w-full max-w-7xl mx-auto p-6 mt-10 space-y-6">
        <CarCard />
      </div>
    </div>
  );
}

export default RentalVehicles;
