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
} from "lucide-react";

const RentalGallery = () => {
  const navigate = useNavigate();
  const [carsData, setCarsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    transmission: "all",
    fuel: "all",
    priceRange: "all",
    passengers: "all",
    features: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCars, setFilteredCars] = useState([]);
  const carsPerPage = 4; // Changed to show 4 cars (2 rows of 2)

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

    if (filters.transmission !== "all") {
      result = result.filter(
        (car) => car.transmission === filters.transmission
      );
    }

    if (filters.fuel !== "all") {
      result = result.filter((car) => car.fuelType === filters.fuel);
    }

    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((car) => {
        const price = Number(car.price);
        return price >= min && (max ? price <= max : true);
      });
    }

    if (filters.passengers !== "all") {
      result = result.filter((car) => car.seats === filters.passengers);
    }

    if (filters.features.length > 0) {
      result = result.filter((car) =>
        filters.features.every((feature) => car.features.includes(feature))
      );
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
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  return (
    <section className="mt-12 p-4 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Explore our Top Deals
        </h2>
        <p className="text-lg text-gray-500">from Top Rated Dealers</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Left Side */}
        <div className="lg:w-64 space-y-4">
          <div className="sticky top-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>

              <div className="space-y-3">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={filters.transmission}
                  onChange={(e) =>
                    setFilters({ ...filters, transmission: e.target.value })
                  }
                >
                  <option value="all">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={filters.fuel}
                  onChange={(e) =>
                    setFilters({ ...filters, fuel: e.target.value })
                  }
                >
                  <option value="all">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters({ ...filters, priceRange: e.target.value })
                  }
                >
                  <option value="all">All Prices</option>
                  <option value="0-1000">Under Rs. 1000</option>
                  <option value="1000-2000">Rs. 1000 - Rs. 2000</option>
                  <option value="2000-5000">Rs. 2000 - Rs. 5000</option>
                  <option value="5000">Above Rs. 5000</option>
                </select>

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={filters.passengers}
                  onChange={(e) =>
                    setFilters({ ...filters, passengers: e.target.value })
                  }
                >
                  <option value="all">All Passenger Capacities</option>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                </select>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <button
                        key={feature}
                        onClick={() => handleFeatureToggle(feature)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.features.includes(feature)
                            ? "bg-[#ff6b00] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Car Grid - Right Side */}
        <div className="flex-1">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col overflow-hidden"
                >
                  <div className="p-6 flex justify-center items-center bg-gray-50">
                    <img
                      src={
                        `../../server${car.rentVehicleImages[0].image}` ||
                        "/placeholder.svg"
                      }
                      alt={car.make}
                      className="w-full h-40 object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <div className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs mb-2 inline-block">
                      {car.make}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {car.model}
                    </h3>
                    <p className="text-red-500 font-semibold text-base mb-4">
                      Rs. {car.priceHour}/-
                    </p>
                    <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
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
                      {car.features.split(",").map((feature) => (
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
                      className="w-full py-2 bg-[#ff6b00] text-white rounded-md hover:bg-[#ff8533] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No cars found matching your criteria.
            </p>
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              →
            </button>
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                No cars found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RentalGallery;
