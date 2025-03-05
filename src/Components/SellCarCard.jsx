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
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 bg-gray-100">
        <img
          src={
            (vehicle.images &&
              vehicle.images.length > 0 &&
              `../../server/controllers${vehicle.images[0].image}`) ||
            "/placeholder.svg"
          }
          alt={`${vehicle.make || "Unknown"} ${vehicle.model || ""}`}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-medium text-red-600 mb-1">
          {vehicle.make || "Unknown"} {vehicle.model || "Model N/A"}
        </h3>
        <div className="space-y-1 mb-3 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Year:</p>
            <p className="text-sm font-medium">{vehicle.year || "Year N/A"}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Total Run:</p>
            <p className="text-sm font-medium">
              {vehicle.km ? vehicle.km.toLocaleString() : "N/A"} km
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">Price:</p>
            <p className="text-base font-semibold text-orange-600">
              Rs. {vehicle.price ? vehicle.price.toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component to display the list of vehicles
export default function SellCarCard() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("http://127.0.0.1:3000/vehicles/six");
        const data = await response.json();

        if (data.success) {
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
          {vehicles.slice(0, 6).map((vehicle, index) => (
            <VehicleCard key={index} vehicle={vehicle} />
          ))}
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
