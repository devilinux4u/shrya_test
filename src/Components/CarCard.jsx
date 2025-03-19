import React from 'react';
import Swift from '../assets/Swift.png';
import Polo from '../assets/Polo.png';
import Prado from '../assets/Prado.png';
import Defender from '../assets/Defender.png';
import Brezza from '../assets/Brezza.png';
import Creta from '../assets/Creta.png';
import { useNavigate } from 'react-router-dom';
import { Users, Gauge, Fuel } from 'lucide-react'; // Import icons for seats, transmission, and fuel

const CarCard = () => {
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
      price: '1000',
      seats: '5',
      transmission: 'Manual',
      fuel: 'Petrol',
      image: Creta
    },
    {
      id: 3,
      name: 'Volkswagen Polo',
      badge: 'Polo',
      price: '1000',
      seats: '5',
      transmission: 'Manual',
      fuel: 'Petrol',
      image: Polo
    },
    {
      id: 4,
      name: 'Maruti Suzuki Brezza',
      badge: 'Brezza',
      price: '1000',
      seats: '5',
      transmission: 'Manual',
      fuel: 'Petrol',
      image: Brezza
    },
    {
      id: 5,
      name: 'Landrover Defender',
      badge: 'Defender',
      price: '1000',
      seats: '5',
      transmission: 'Manual',
      fuel: 'Petrol',
      image: Defender
    },
    {
      id: 6,
      name: 'Toyota Prado',
      badge: 'Prado',
      price: '1000',
      seats: '5',
      transmission: 'Manual',
      fuel: 'Petrol',
      image: Prado
    }
  ];
  const navigate = useNavigate();
  const handleExploreRental = () => {
    navigate('/RentalGallery');
  };

  const handleRentNow = () => {
    navigate('/RentalVehicleDesc');
  };

  return (
    <section className="p-10 w-full h-full flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Explore our Top Deals</h2>
        <p className="text-lg text-gray-500">from Top Rated Dealers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {cars.map(car => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2 flex flex-col overflow-hidden"
          >
            <div className="p-6 flex justify-center items-center">
              <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-40 object-contain" />
            </div>
            <div className="p-4">
              <div className="bg-gray-200 text-gray-600 rounded-full px-3 py-1 text-xs mb-2 inline-block">{car.badge}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{car.name}</h3>
              <p className="text-red-500 font-semibold text-base mb-4">Rs. {car.price}/-</p>
              <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> {/* Icon for seats */}
                  <span>{car.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" /> {/* Icon for transmission */}
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5" /> {/* Icon for fuel */}
                  <span>{car.fuel}</span>
                </div>
              </div>
              <button
              onClick={handleRentNow}
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Rent Now</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleExploreRental} className="mt-10 px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
        Explore Rentals
      </button>
    </section>
  );
};

export default CarCard;