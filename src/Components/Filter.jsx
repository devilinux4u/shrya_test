import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select.jsx";

export default function Filter() {
  const [minPrice, setMinPrice] = useState(12600);
  const [maxPrice, setMaxPrice] = useState(41100);

  const filterOptions = [
    { name: "Year", options: ["2024", "2023", "2022", "2021", "2020"] },
    { name: "Make", options: ["Toyota", "Honda", "Ford", "BMW", "Mercedes"] },
    { name: "Model", options: ["Camry", "Civic", "F-150", "3 Series", "C-Class"] },
    { name: "Body Style", options: ["Sedan", "SUV", "Truck", "Coupe", "Van"] },
    { name: "Condition", options: ["New", "Used", "Certified Pre-Owned"] },
    { name: "Mileage", options: ["0-10,000", "10,001-30,000", "30,001-60,000", "60,001+"] },
    { name: "Engine", options: ["4 Cylinder", "6 Cylinder", "8 Cylinder", "Electric"] },
    { name: "Fuel Economy", options: ["Good", "Better", "Best"] },
    { name: "Exterior Color", options: ["Black", "White", "Silver", "Red", "Blue"] },
  ];

  const handleReset = () => {
    setMinPrice(12600);
    setMaxPrice(41100);
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
      {/* Price Filter Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">FILTER BY PRICE</h2>
        <div className="mb-4 flex gap-2">
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
        <div className="text-gray-600 mb-4">
          Price: Rs. {minPrice.toLocaleString()} - Rs. {maxPrice.toLocaleString()}
        </div>
        <button className="bg-[#D32F2F] text-white px-8 py-2 rounded hover:bg-[#B71C1C] transition-colors">
          Filter
        </button>
      </div>

      {/* Cars Filters Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">CARS FILTERS</h2>
        <div className="text-[#D32F2F] mb-4">51 Vehicles Matching</div>

        <div className="space-y-3">
          {filterOptions.map((filter) => (
            <Select key={filter.name}>
              <SelectTrigger className="w-full bg-white border text-gray-500">
                <SelectValue placeholder={filter.name} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="mt-6 w-full bg-[#D32F2F] text-white py-2 rounded hover:bg-[#B71C1C] transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
