import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin= () => {
    navigate('/Login');
  };

  const handleRegister= () => {
    navigate('/Register');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-50">
      {/* Logo Section */}
      <div className="md:flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Shreya Auto Logo"
            className="h-10 w-36 object-contain"
          />
        </Link>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Links Section */}
      <div
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row items-center absolute md:relative top-full md:top-auto left-0 w-full md:w-auto bg-white shadow-md md:shadow-none z-50 px-6 md:px-0 space-y-4 md:space-y-0 md:gap-6`}
      >
        {/* Navigation Links */}
        <Link
          to="/RentalVehicles"
          className="block text-sm font-medium text-gray-700 hover:text-gray-900 text-center"
        >
          Rent
        </Link>
        <Link
          to="/BuyVehicles"
          className="block text-sm font-medium text-gray-700 hover:text-gray-900 text-center"
        >
          Buy & Sell
        </Link>
        <Link
          to="/LostAndFound"
          className="block text-sm font-medium text-gray-700 hover:text-gray-900 text-center"
        >
          Lost & Found
        </Link>
        <Link
          to="/Wishlist"
          className="block text-sm font-medium text-gray-700 hover:text-gray-900 text-center"
        >
          Wishlist
        </Link>

        {/* Buttons for Mobile */}
        <div className="md:hidden flex flex-col items-center gap-4 mt-4">
          <button className="px-4 py-2 bg-[#5850EC] hover:bg-[#4338CA] text-white rounded-md text-sm font-medium">
            Log In
          </button>
          <button className="px-4 py-2 border border-[#5850EC] text-[#5850EC] hover:bg-[#5850EC] hover:text-white rounded-md text-sm font-medium">
            Register
          </button>
        </div>
      </div>

      {/* Buttons Section for Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <button onClick={handleLogin} className="px-4 py-2 bg-[#5850EC] hover:bg-[#4338CA] text-white rounded-md text-sm font-medium">
          Log In
        </button>
        <button onClick={handleRegister} className="px-4 py-2 border border-[#5850EC] text-[#5850EC] hover:bg-[#5850EC] hover:text-white rounded-md text-sm font-medium">
          Register
        </button>
      </div>
    </nav>
  );
};

export default NavMenu;
