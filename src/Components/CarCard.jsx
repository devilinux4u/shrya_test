import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Gauge, Fuel } from "lucide-react"; // Import icons for seats, transmission, and fuel

const CarCard = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/rent/ran6"); // Replace with your API endpoint
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCars();
  }, []);

  const handleExploreRental = () => {
    navigate("/RentalGallery");
  };

  const handleRentNow = (data) => {
    const vehicleParams = new URLSearchParams({ id: data.id });
    navigate(`/RentalVehicleDesc?${vehicleParams.toString()}`);
  };

  return (
    <section className="p-10 w-full h-full flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Explore our Top Deals
        </h2>
        <p className="text-lg text-gray-500">from Top Rated Dealers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2 flex flex-col overflow-hidden"
          >
            <div className="p-6 flex justify-center items-center">
              <img
                src={
                  `../../server${car.rentVehicleImages[0].image}` ||
                  "/placeholder.svg"
                }
                alt={car.model}
                className="w-full h-40 object-contain"
              />
            </div>
            <div className="p-4">
              <div className="bg-gray-200 text-gray-600 rounded-full px-3 py-1 text-xs mb-2 inline-block">
                {car.badge}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {car.model}
              </h3>
              <p className="text-red-500 font-semibold text-base mb-4">
                Rs. {car.priceHour}/-
              </p>
              <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> {/* Icon for seats */}
                  <span>{car.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" /> {/* Icon for transmission */}
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5" /> {/* Icon for fuel */}
                  <span>{car.fuelType}</span>
                </div>
              </div>
              <button
                onClick={() => handleRentNow(car)}
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Rent Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleExploreRental}
        className="mt-10 px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
      >
        Explore Rentals
      </button>
    </section>
  );
};

export default CarCard;
