"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Gauge,
  Fuel,
  Filter,
} from "lucide-react";

const RentalGallery = () => {
  const navigate = useNavigate();
  const [carsData, setCarsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    model: "",
    passengers: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCars, setFilteredCars] = useState([]);
  const carsPerPage = 6; // Changed to show 6 cars per page

  const features = [
    "AC",
    "Bluetooth",
    "Airbags",
    "Sunroof",
    "Cruise Control",
    "Parking Sensors",
  ];

  const cars = useRef([]);

  useEffect(() => {
    // Fetch car data from API
    const fetchCars = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/rent/all"); // Replace with your API endpoint
        const data = await response.json();
        setCarsData(data);
        cars.current = data;
        setFilteredCars(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    let result = cars.current.filter(
      (car) =>
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.model) {
      result = result.filter((car) =>
        car.model.toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    if (filters.passengers !== "all") {
      result = result.filter((car) => car.seats === filters.passengers);
    }

    setFilteredCars(result);
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRentNow = (data) => {
    const vehicleParams = new URLSearchParams({ id: data.id });
    navigate(`/RentalVehicleDesc?${vehicleParams.toString()}`);
  };

  const handleFeatureToggle = (feature) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...(prev.features || []), feature],
    }));
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mt-12 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Explore our Top Deals
          </h2>
          <p className="text-lg text-gray-500">from Top Rated Dealers</p>
        </div>

        {/* Search Bar and Filter Options - Matching VehicleListing style */}
        <div className="mb-6 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for vehicles..."
              className="w-full pl-10 pr-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.model}
                onChange={(e) =>
                  setFilters({ ...filters, model: e.target.value })
                }
              />
              <select
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.passengers}
                onChange={(e) =>
                  setFilters({ ...filters, passengers: e.target.value })
                }
              >
                <option value="all">All Passengers</option>
                <option value="5">5 Seater</option>
                <option value="7">7 Seater</option>
              </select>
            </div>
          </div>
        </div>

        {/* Car Grid */}
        <div className="mb-8 max-w-7xl mx-auto">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden cursor-pointer"
                >
                  <div className="relative h-48 bg-gray-50">
                    <img
                      src={
                        `../../server${car.rentVehicleImages[0]?.image}` ||
                        "/placeholder.svg"
                      }
                      alt={car.make}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs mb-2 inline-block">
                      {car.make}
                    </div>
                    <h3 className="text-lg font-medium text-red-600 mb-1">
                      {car.model}
                    </h3>
                    <p className="text-base font-semibold text-orange-600 mb-3">
                      Rs. {car.priceHour}/-
                    </p>
                    <div className="flex justify-between items-center text-gray-500 text-sm mb-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-5 h-5" />
                        <span>{car.fuelType}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {car.features?.split(",").map((feature) => (
                        <span
                          key={feature}
                          className="bg-gray-50 text-gray-600 rounded-full px-2 py-1 text-xs border border-gray-100"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRentNow(car)}
                      className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                    >
                      View Details
                    </button>
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
        {filteredCars.length > 0 && totalPages > 1 && (
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
    </section>
  );
};

export default RentalGallery;
