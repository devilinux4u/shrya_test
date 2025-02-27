import { useState } from "react";
import Thar from "../assets/Thar.png";
import SellSonata from "../assets/SellSonata.png";
import Mazda from "../assets/Mazda.png";
import Filter from "../Components/Filter";

const vehicles = [
  {
    brand: "MAZDA",
    model: "MAZDA6",
    year: "2024",
    mileage: "18000 Km",
    price: 1900000,
    image: Mazda,
  },
  {
    brand: "HYUNDAI",
    model: "SONATA",
    year: "2021",
    mileage: "5000 Km",
    price: 8000000,
    image: SellSonata,
  },
  {
    brand: "MAHINDRA",
    model: "THAR",
    year: "2023",
    mileage: "8000 Km",
    price: 20000000,
    image: Thar,
  },
];

const brands = ["Mazda", "Hyundai", "Mahindra", "Toyota", "Honda"];
const vehicleTypes = ["SUV", "Sedan", "Hatchback", "Luxury"];

export default function VehicleListing() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000000);
  const [currentPage, setCurrentPage] = useState(1);

  // Duplicate vehicles array to match the image
  const allVehicles = [...vehicles, ...vehicles, ...vehicles, ...vehicles];
  const itemsPerPage = 9;
  const totalPages = Math.ceil(allVehicles.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedVehicles = allVehicles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
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

            <Filter />
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVehicles.map((vehicle, index) => (
              <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-48 object-contain"
                />
                <div className="p-4">
                  <h3 className="text-red-600 font-medium">{vehicle.brand}</h3>
                  <p className="text-gray-600">{vehicle.model}</p>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{vehicle.year}</span>
                    <span>{vehicle.mileage}</span>
                  </div>
                  <p className="mt-2 font-semibold">Rs. {vehicle.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

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
