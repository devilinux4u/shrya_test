import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";

export default function VehicleListing() {
  const [vehicles, setVehicles] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000000);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ make: "", model: "" });

  const navigate = useNavigate();

  const handleCarClick = () => {
    navigate("/BuyVehiclesDesc");
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setVehicles(data.msg);
        } else {
          console.error("Failed to fetch vehicles.");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to load vehicles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesMake = filters.make
      ? vehicle.make.toLowerCase().includes(filters.make.toLowerCase())
      : true;
    const matchesModel = filters.model
      ? vehicle.model.toLowerCase().includes(filters.model.toLowerCase())
      : true;
    const matchesPrice = vehicle.price >= minPrice && vehicle.price <= maxPrice;

    return matchesMake && matchesModel && matchesPrice;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mt-12 max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Listings</h1>
      </div>

      {/* Search Bar and Filter Options */}
      <div className="mb-6 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for vehicles..."
            className="w-full pl-10 pr-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={filters.make}
            onChange={(e) => setFilters({ ...filters, make: e.target.value })}
          />
        </div>

        {/* Filter Options */}
        <div className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center text-gray-700 font-medium">
            <Filter className="w-5 h-5 mr-2" />
            Filter by:
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Model"
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              value={filters.model}
              onChange={(e) =>
                setFilters({ ...filters, model: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="mb-8 max-w-7xl mx-auto">
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVehicles.map((vehicle, index) => (
              <div
                key={index}
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
                      <p className="text-sm font-medium">
                        {vehicle.year || "N/A"}
                      </p>
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
                        Rs.{" "}
                        {vehicle.price ? vehicle.price.toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No vehicles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredVehicles.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border-r border-gray-200 flex items-center ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-4 py-2 border-r border-gray-200 ${
                    currentPage === number
                      ? "bg-orange-500 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 flex items-center ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
