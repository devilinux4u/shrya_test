import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Card component for displaying vehicle information
function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        const vehicleParams = new URLSearchParams(vehicle);
        navigate(`/BuyVehiclesDesc?${vehicleParams}`);
      }}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center cursor-pointer"
    >
      <img
        src={
          (vehicle.images &&
            vehicle.images.length > 0 &&
            `../../server/controllers${vehicle.images[0].image}`) ||
          "/placeholder.svg"
        }
        alt={`${vehicle.model || "Unknown"} ${vehicle.type || ""}`}
        className="w-full h-48 object-contain"
      />
      <div className="p-4">
        <h3 className="text-red-600 font-medium">
          {vehicle.make || "Unknown"} {vehicle.model || "Model N/A"}
        </h3>
        <p className="text-gray-600">Year: {vehicle.year || "Year N/A"}</p>
        <p className="text-gray-600">
          Total Km Run:{" "}
          {vehicle.km ? vehicle.km.toLocaleString() : "Mileage N/A"} km
        </p>
        <p className="mt-2 font-semibold">
          Rs. {vehicle.price ? vehicle.price.toLocaleString() : "Price N/A"}
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
          {vehicles.slice(0, 6).map(
            (
              vehicle,
              index // Limit to 6 vehicles
            ) => (
              <VehicleCard key={index} vehicle={vehicle} />
            )
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
