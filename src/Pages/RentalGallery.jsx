import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Swift from '../assets/Swift.png';
import Polo from '../assets/Polo.png';
import Prado from '../assets/Prado.png';
import Defender from '../assets/Defender.png';
import Brezza from '../assets/Brezza.png';
import Creta from '../assets/Creta.png';
import Seat from '../assets/Seat.png';
import Transmission from '../assets/Transmission.png';
import Fuel from '../assets/Fuel.png';

const RentalGallery = () => {
  const cars = [
    {
      id: 1,
      name: 'Maruti Suzuki Swift',
      badge: 'Swift',
      price: '1000',
      seats: '5',
      transmission: 'Manual',
      fuel: 'Petrol',
      image: Swift
    },
    {
      id: 2,
      name: 'Hyundai Creta',
      badge: 'Creta',
      price: '1500',
      seats: '5',
      transmission: 'Automatic',
      fuel: 'Diesel',
      image: Creta
    },
    {
      id: 3,
      name: 'Volkswagen Polo',
      badge: 'Polo',
      price: '1200',
      seats: '5',
      transmission: 'Manual',
      fuel: 'Petrol',
      image: Polo
    },
    {
      id: 4,
      name: 'Maruti Suzuki Brezza',
      badge: 'Brezza',
      price: '1300',
      seats: '5',
      transmission: 'Automatic',
      fuel: 'Petrol',
      image: Brezza
    },
    {
      id: 5,
      name: 'Landrover Defender',
      badge: 'Defender',
      price: '5000',
      seats: '7',
      transmission: 'Automatic',
      fuel: 'Diesel',
      image: Defender
    },
    {
      id: 6,
      name: 'Toyota Prado',
      badge: 'Prado',
      price: '4000',
      seats: '7',
      transmission: 'Automatic',
      fuel: 'Diesel',
      image: Prado
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    transmission: 'all',
    fuel: 'all',
    priceRange: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCars, setFilteredCars] = useState(cars);
  const carsPerPage = 6;

  // Filter cars based on search and filters
  useEffect(() => {
    let result = cars.filter(car => 
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.badge.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.transmission !== 'all') {
      result = result.filter(car => car.transmission === filters.transmission);
    }

    if (filters.fuel !== 'all') {
      result = result.filter(car => car.fuel === filters.fuel);
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(car => {
        const price = Number(car.price);
        return price >= min && (max ? price <= max : true);
      });
    }

    setFilteredCars(result);
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="mt-12 p-10 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Explore our Top Deals</h2>
        <p className="text-lg text-gray-500">from Top Rated Dealers</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by car name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
              value={filters.transmission}
              onChange={(e) => setFilters({...filters, transmission: e.target.value})}
            >
              <option value="all">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
              value={filters.fuel}
              onChange={(e) => setFilters({...filters, fuel: e.target.value})}
            >
              <option value="all">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            >
              <option value="all">All Prices</option>
              <option value="0-1000">Under Rs. 1000</option>
              <option value="1000-2000">Rs. 1000 - Rs. 2000</option>
              <option value="2000-5000">Rs. 2000 - Rs. 5000</option>
              <option value="5000">Above Rs. 5000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        {currentCars.map(car => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2 flex flex-col overflow-hidden"
          >
            <div className="p-6 flex justify-center items-center">
              <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-40 object-contain" />
            </div>
            <div className="p-4">
              <div className="bg-gray-200 text-gray-600 rounded-full px-3 py-1 text-xs mb-2 inline-block">
                {car.badge}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{car.name}</h3>
              <p className="text-red-500 font-semibold text-base mb-4">Rs. {car.price}/-</p>
              <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <img src={Seat || "/placeholder.svg"} alt="Seats" className="w-5 h-5" />
                  <span>{car.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={Transmission || "/placeholder.svg"} alt="Transmission" className="w-5 h-5" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={Fuel || "/placeholder.svg"} alt="Fuel" className="w-5 h-5" />
                  <span>{car.fuel}</span>
                </div>
              </div>
              <button className="w-full py-2 bg-[#ff6b00] text-white rounded-md hover:bg-[#ff8533] transition">
                Rent Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
                currentPage === index + 1
                  ? 'bg-[#ff6b00] text-white'
                  : 'hover:bg-gray-100'
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
    </section>
  );
};

export default RentalGallery;