import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Card component for displaying vehicle information
function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => {
        const vehicleParams = new URLSearchParams(vehicle);
        navigate(`/BuyVehiclesDesc?${vehicleParams}`); // Correct route name
      }}
    >
      <img
        src={`../../server/controllers${vehicle.images[0].image}` || "default_image_url.jpg"} // Provide a default image
        alt={`${vehicle.make || "Unknown"} ${vehicle.model || ""}`}
        className="w-full max-w-xs object-cover rounded-lg hover:scale-105 transition-transform duration-300"
      />
      <div className="text-center mt-4">
        <p className="text-red-600 font-semibold uppercase tracking-wide">
          {vehicle.make || "Unknown"}
        </p>
        <p className="text-gray-700 text-lg font-medium mt-1">
          {vehicle.model || "Model N/A"}
        </p>
        <div className="flex justify-center gap-4 mt-2 text-sm text-gray-600">
          <span>{vehicle.year || "Year N/A"}</span>
          <span>{vehicle.mile || "Mileage N/A"}</span>
        </div>
        <p className="text-gray-800 text-lg font-semibold mt-2">
          Rs. {vehicle.price || "Price N/A"}
        </p>
      </div>
    </div>
  );
}

// Main component to display the list of vehicles
export default function SellCarCard() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]); // Ensure vehicles is always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("http://127.0.0.1:3000/vehicles/three"); // Adjust URL based on your backend
        const data = await response.json();

        if (data.success) {
          // Ensure msg is an array. If not, wrap it in an array.
          const vehicleArray = Array.isArray(data.msg) ? data.msg : [data.msg];
          setVehicles(vehicleArray);
        } else {
          setError("Error loading vehicles");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header button */}
      <div className="flex justify-center mb-8">
        <button className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors">
          Our Vehicles
        </button>
      </div>

      {/* Show loading/error text */}
      {error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : loading ? (
        <p className="text-center text-gray-600">Loading vehicles...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <VehicleCard key={index} vehicle={vehicle} />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              No vehicles found.
            </p>
          )}
        </div>
      )}

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