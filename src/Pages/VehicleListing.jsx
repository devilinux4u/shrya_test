import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Filter from "../Components/Filter";

export default function VehicleListing() {
  const [vehicles, setVehicles] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000000);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);  // state to store error messages
  const [loading, setLoading] = useState(true); // Add loading state
  const [filters, setFilters] = useState({ make: "", model: "" }); // state to store filter values

  const navigate = useNavigate(); // Initialize navigate

  const handleCarClick = () => {
    navigate("/BuyVehiclesDesc"); // Correct route name
  }

  // Fetch vehicles data from backend on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles/all"); // replace with your backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setVehicles(data.msg); // Assuming the response contains vehicles in `msg` field
        } else {
          console.error("Failed to fetch vehicles.");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to load vehicles. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchVehicles();
  }, []);

  // Apply filters to vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesMake = filters.make
      ? vehicle.make.toLowerCase().includes(filters.make.toLowerCase())
      : true;
    const matchesModel = filters.model
      ? vehicle.model.toLowerCase().includes(filters.model.toLowerCase())
      : true;
    const matchesPrice =
      vehicle.price >= minPrice && vehicle.price <= maxPrice;

    return matchesMake && matchesModel && matchesPrice;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-12 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range (Rs.)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                <span>-</span>
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Make Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Make</h3>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter make"
                value={filters.make}
                onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              />
            </div>

            {/* Model Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Model</h3>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter model"
                value={filters.model}
                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="flex-1">
          {error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : loading ? (
            <p className="text-center text-gray-600">Loading vehicles...</p>
          ) : displayedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVehicles.map((vehicle, index) => (
                <div
                  key={index}
                  onClick={() => {
                    const vehicleParams = new URLSearchParams(vehicle);
                    navigate(`/BuyVehiclesDesc?${vehicleParams}`)}
                  } // Correct route name
              
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center cursor-pointer"
                >
                  <img
                    src={(vehicle.images && vehicle.images.length > 0 && `../../server/controllers${vehicle.images[0].image}`) || "/placeholder.svg"}
                    alt={`${vehicle.model} ${vehicle.type}`}
                    className="w-full h-48 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="text-red-600 font-medium">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-gray-600">Year: {vehicle.year}</p>
                    <p className="text-gray-600">Total Km Run: {vehicle.mile.toLocaleString()} km</p>
                    <p className="mt-2 font-semibold">Rs. {vehicle.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No vehicles found.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              ←
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}