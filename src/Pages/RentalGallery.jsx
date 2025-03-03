"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronLeft, ChevronRight, Users, Gauge, Fuel } from "lucide-react"
import Swift from "../assets/Swift.png"
import Polo from "../assets/Polo.png"
import Prado from "../assets/Prado.png"
import Defender from "../assets/Defender.png"
import Brezza from "../assets/Brezza.png"
import Creta from "../assets/Creta.png"

const RentalGallery = () => {
  const carsData = [
    {
      id: 1,
      name: "Maruti Suzuki Swift",
      badge: "Swift",
      price: "1000",
      seats: "5",
      transmission: "Manual",
      fuel: "Petrol",
      features: ["AC", "Bluetooth", "Airbags"],
      image: Swift,
    },
    {
      id: 2,
      name: "Hyundai Creta",
      badge: "Creta",
      price: "1500",
      seats: "5",
      transmission: "Automatic",
      fuel: "Diesel",
      features: ["AC", "Sunroof", "Cruise Control"],
      image: Creta,
    },
    {
      id: 3,
      name: "Volkswagen Polo",
      badge: "Polo",
      price: "1200",
      seats: "5",
      transmission: "Manual",
      fuel: "Petrol",
      features: ["AC", "Bluetooth"],
      image: Polo,
    },
    {
      id: 4,
      name: "Toyota Prado",
      badge: "Prado",
      price: "2500",
      seats: "7",
      transmission: "Automatic",
      fuel: "Diesel",
      features: ["AC", "Sunroof", "Cruise Control", "Airbags"],
      image: Prado,
    },
    {
      id: 5,
      name: "Land Rover Defender",
      badge: "Defender",
      price: "3000",
      seats: "5",
      transmission: "Automatic",
      fuel: "Diesel",
      features: ["AC", "Sunroof", "Cruise Control", "Airbags", "Parking Sensors"],
      image: Defender,
    },
    {
      id: 6,
      name: "Maruti Suzuki Brezza",
      badge: "Brezza",
      price: "1300",
      seats: "5",
      transmission: "Manual",
      fuel: "Petrol",
      features: ["AC", "Bluetooth", "Airbags"],
      image: Brezza,
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    transmission: "all",
    fuel: "all",
    priceRange: "all",
    passengers: "all",
    features: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredCars, setFilteredCars] = useState(carsData)
  const carsPerPage = 4 // Changed to show 4 cars (2 rows of 2)

  const features = ["AC", "Bluetooth", "Airbags", "Sunroof", "Cruise Control", "Parking Sensors"]

  const cars = useRef(carsData)

  useEffect(() => {
    let result = cars.current.filter(
      (car) =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.badge.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filters.transmission !== "all") {
      result = result.filter((car) => car.transmission === filters.transmission)
    }

    if (filters.fuel !== "all") {
      result = result.filter((car) => car.fuel === filters.fuel)
    }

    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number)
      result = result.filter((car) => {
        const price = Number(car.price)
        return price >= min && (max ? price <= max : true)
      })
    }

    if (filters.passengers !== "all") {
      result = result.filter((car) => car.seats === filters.passengers)
    }

    if (filters.features.length > 0) {
      result = result.filter((car) => filters.features.every((feature) => car.features.includes(feature)))
    }

    setFilteredCars(result)
    setCurrentPage(1)
  }, [searchTerm, filters])

  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleFeatureToggle = (feature) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  return (
    <section className="mt-12 p-4 md:p-10 max-w-[1400px] mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Explore our Top Deals</h2>
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
                  onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                >
                  <option value="all">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={filters.fuel}
                  onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                >
                  <option value="all">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
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
                  onChange={(e) => setFilters({ ...filters, passengers: e.target.value })}
                >
                  <option value="all">All Passenger Capacities</option>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                </select>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col overflow-hidden"
              >
                <div className="p-6 flex justify-center items-center bg-gray-50">
                  <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-40 object-contain" />
                </div>
                <div className="p-4">
                  <div className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs mb-2 inline-block">
                    {car.badge}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{car.name}</h3>
                  <p className="text-red-500 font-semibold text-base mb-4">Rs. {car.price}/-</p>
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
                      <span>{car.fuel}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.features?.map((feature) => (
                      <span
                        key={feature}
                        className="bg-gray-50 text-gray-600 rounded-full px-2 py-1 text-xs border border-gray-100"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2 bg-[#ff6b00] text-white rounded-md hover:bg-[#ff8533] transition">
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === index + 1 ? "bg-[#ff6b00] text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}

          {filteredCars.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default RentalGallery

