import React from 'react';
import CarCard from '../Components/CarCard';
import { useNavigate } from 'react-router-dom';
import HomeCar from '../assets/HomeCar.png';
import Service from '../assets/Service.png';
import Payment from '../assets/Payment.png';
import LostAndFound from '../assets/LostAndFound.png';
import DiscoverCar from '../assets/DiscoverCar.png';
import BookingProcess from '../assets/BookingProcess.png';

const Home = () => {
  const navigate = useNavigate();

  const handleRentClick = () => {
    navigate('/RentalVehicles');
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-wrap items-center justify-between px-6 md:px-12 lg:px-20 py-12 gap-8 bg-gray-50">
        <div className="flex-1 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            <span className="text-orange-500">Looking</span> to <br /> Rent a car?
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            The purpose of Elite Drives is to be the best choice in automotive for its customers and to be part of the special moments of their lives.
          </p>
          <form className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-md">
            <select className="border border-gray-300 rounded-md p-2">
              <option value="" disabled>Passengers</option>
              <option value="2">2 Passengers</option>
              <option value="4">4 Passengers</option>
              <option value="5">5 Passengers</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2">
              <option value="" disabled>Vehicle Type</option>
              <option value="suv">SUV</option>
              <option value="sedan">Sedan</option>
              <option value="hatchback">Hatchback</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2">
              <option value="" disabled>Brand</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="volkswagen">Volkswagen</option>
            </select>
            <button type="submit" className="col-span-1 sm:col-span-3 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition">
              Submit
            </button>
          </form>
          <button onClick={handleRentClick} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition">
            Rent
          </button>
        </div>
        <div className="flex-1 flex justify-center relative">
          <div className="absolute top-0 left-0 w-4/5 h-4/5 bg-gradient-to-t from-orange-500 to-orange-300 rounded-lg -z-10"></div>
          <img src={HomeCar} alt="SUV" className="max-w-full h-auto relative" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-12 px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <span className="text-orange-500 uppercase tracking-wider text-sm">Benefits of Elite Drives</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
            Exclusive Benefits <span className="text-orange-500">of</span> <br /> Elite Drives
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
            <img src={LostAndFound} alt="Lost and Found" className="w-20 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Lost and Found Service</h3>
            <p className="text-gray-600">Misplaced something while on the go? Our dedicated service ensures your valuables are securely returned to you.</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
            <img src={Payment} alt="Secure Payment" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Payment</h3>
            <p className="text-gray-600">Enjoy seamless and secure payment options with encrypted transactions to safeguard your personal information.</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
            <img src={Service} alt="24/7 Support" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our expert team is available around the clock to assist with all your needs, ensuring a stress-free experience.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <span className="text-orange-500 uppercase tracking-wider text-sm">How it works</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
            Car Bookings Made Easy
            <br />
            <span className="text-lg text-gray-500">Explaining The Process</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-12 items-start">
          <div className="flex-1 space-y-8">
            {['Discover Your Perfect Car', 'Secure Your Rental Booking', 'Complete Your Booking Payment', 'Booking Confirmed'].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <img src={DiscoverCar} alt={step} className="w-12 h-12" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{step}</h3>
                  <p className="text-gray-600">Detailed description of the step to guide the user through the process.</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex justify-center">
            <img src={BookingProcess} alt="Booking Process Overview" className="max-w-full h-auto rounded-lg" />
          </div>
        </div>
      </section>

      <CarCard />
    </div>
  );
};

export default Home;
