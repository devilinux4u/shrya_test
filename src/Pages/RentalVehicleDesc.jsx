import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, User, Car, GaugeCircle, Cog } from 'lucide-react';
import Sonata from '../assets/Sonata.png';
import CarCard from '../Components/CarCard';

const RentalVehicleDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('specs');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    dropDate: '',
    selfDrive: false,
    hireDriver: false,
    insurance: false,
    roadside: false,
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const carDetails = {
    brand: 'HYUNDAI',
    model: 'SONATA',
    year: '2019',
    rating: 4.1,
    image: Sonata,
    specs: {
      passengers: 5,
      doors: 4,
      consumption: '10 lt/100 km',
      transmission: 'Manual',
      fuel: 'Petrol',
    },
    metrics: {
      topSpeed: '280',
      mileage: '12',
      horsePower: '46',
      rating: '8',
    },
    price: 500,
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mt-12 flex flex-col gap-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {carDetails.brand} {carDetails.model}
              </h1>
              <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-md">
                {carDetails.year}
              </span>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-yellow-500">★</span>
                <span>{carDetails.rating}</span>
              </div>
            </div>
            <button
              className={`p-2 ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={isWishlisted ? 'fill-current' : ''} size={20} />
            </button>
          </div>

          <div className="mb-6">
            <img
              src={carDetails.image}
              alt={`${carDetails.brand} ${carDetails.model}`}
              className="w-full h-auto object-contain rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-6 h-6 text-red-500" />
              <span>{carDetails.specs.passengers} Passengers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Car className="w-6 h-6 text-red-500" />
              <span>{carDetails.specs.doors} Doors</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GaugeCircle className="w-6 h-6 text-red-500" />
              <span>{carDetails.specs.consumption}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Cog className="w-6 h-6 text-red-500" />
              <span>{carDetails.specs.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="w-6 h-6 text-red-500">⛽</span>
              <span>{carDetails.specs.fuel}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Details */}
          <div className="bg-white rounded-xl p-6 col-span-2 shadow-md">
            <div className="flex gap-4 border-b mb-6">
              {['specs', 'description', 'contact', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 ${
                    activeTab === tab
                      ? 'text-[#E94A35] border-b-2 border-[#E94A35]'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(carDetails.metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                    <span className="text-xl font-semibold text-gray-900">{value}</span>
                    <span className="text-sm text-gray-600"> {key.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'description' && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  This is a comfortable and fuel-efficient car, perfect for city drives, with an elegant design and top-notch features.
                </p>
              </div>
            )}
            {activeTab === 'contact' && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">For inquiries, call 123-456-7890 or email info@rentalcars.com.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">"An amazing ride, smooth and reliable!" - John</p>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            {Object.keys(bookingForm).map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-600">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type={typeof bookingForm[field] === 'boolean' ? 'checkbox' : 'text'}
                  name={field}
                  checked={bookingForm[field]}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            ))}
            <button type="submit" className="w-full py-2 bg-[#E94A35] text-white rounded-md">Book Now</button>
          </div>
        </div>
      </div>
      <CarCard/>
    </div>
  );
};

export default RentalVehicleDetails;
