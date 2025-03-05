import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { Menu, X, ChevronDown, User } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const NavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/Login");
  };

  const handleLogo = () => {
    navigate("/Home");
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setIsProfileMenuOpen(false);
  };

  // New function to handle protected routes
  const handleProtectedRoute = (route) => {
    if (Cookies.get("sauto")) {
      navigate(route);
    } else {
      toast.info("You must be registered to access this feature.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/Login");
    }
    closeMenu();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check login status and user info
    const checkLoginStatus = () => {
      const loggedIn = Cookies.get("sauto") ? true : false;
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const fullName = Cookies.get("sauto").split("-")[2];
        setUserFullName(fullName || "");
      }
    };

    checkLoginStatus();

    const handleClickOutside = (event) => {
      if (isServicesOpen || isProfileMenuOpen) {
        setIsServicesOpen(false);
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("sauto");
    setIsLoggedIn(false);
    setUserFullName("");
    navigate("/Login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={Logo || "/placeholder.svg"}
                alt="Shreya Auto Logo"
                className="h-12 w-auto shadow-white"
                onClick={handleLogo}
              />
            </Link>
          </div>

          {/* Navigation and User Profile */}
          <div className="hidden md:flex md:items-center">
            {/* Desktop Navigation */}
            <div className="flex items-baseline space-x-8">
              <NavLink to="/" onClick={closeMenu} isScrolled={isScrolled}>
                Home
              </NavLink>
              <div className="relative">
                <button
                  onClick={toggleServices}
                  className={`flex items-center px-3 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out ${
                    isScrolled
                      ? "text-black hover:text-blue-600"
                      : "text-black hover:text-blue-300"
                  }`}
                >
                  Services
                  <ChevronDown
                    className={`ml-1 w-5 h-5 transition-transform duration-300 ease-in-out ${
                      isServicesOpen ? "rotate-180" : ""
                    } ${isScrolled ? "text-black" : "text-white"}`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-2"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <NavLink
                        to="/RentalVehicles"
                        menuItem
                        onClick={closeMenu}
                        isScrolled={isScrolled}
                      >
                        Rent
                      </NavLink>
                      <NavLink
                        to="/BuyVehicles"
                        menuItem
                        onClick={closeMenu}
                        isScrolled={isScrolled}
                      >
                        Buy And Sell
                      </NavLink>
                      <button
                        onClick={() => handleProtectedRoute("/YourList")}
                        className="block w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out"
                      >
                        Wishlist
                      </button>
                      <button
                        onClick={() => handleProtectedRoute("/LostAndFound")}
                        className="block w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-300 ease-in-out"
                      >
                        Lost and Found
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <NavLink
                to="/AboutUs"
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                About Us
              </NavLink>
              <NavLink
                to="/Contact"
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                Contact
              </NavLink>
            </div>

            {/* User Profile or Get Started Button */}
            <div className="flex items-center space-x-4 ml-8">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={toggleProfileMenu}
                      className={`flex items-center space-x-2 p-2 rounded-full ${
                        isScrolled
                          ? "bg-gray-200 text-black hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out`}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium text-sm hidden sm:inline">
                        {userFullName}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 hidden sm:inline transition-transform duration-300 ease-in-out ${
                          isProfileMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <Link
                            to="/Profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            role="menuitem"
                            onClick={closeMenu}
                          >
                            My Profile
                          </Link>
                          <Link
                            to="/UserBookings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            role="menuitem"
                            onClick={closeMenu}
                          >
                            My Bookings
                          </Link>

                          <Link
                            to="/MySales"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            role="menuitem"
                            onClick={closeMenu}
                          >
                            My Sales
                          </Link>
                          <Link
                            to="/YourList"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            role="menuitem"
                            onClick={closeMenu}
                          >
                            My Wishlist
                          </Link>
                          <Link
                            to="/UserAppointments"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            role="menuitem"
                            onClick={closeMenu}
                          >
                            Appointments
                          </Link>
                          <Link
                            to="/ReportedItems"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            role="menuitem"
                            onClick={closeMenu}
                          >
                            Reported Items
                          </Link>

                          <button
                            onClick={() => {
                              handleLogout();
                              closeMenu();
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            role="menuitem"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className={`px-6 py-3 rounded-full text-lg font-semibold ${
                    isScrolled
                      ? "text-black bg-gray-200 hover:bg-gray-300"
                      : "text-white bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105`}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition duration-300 ease-in-out"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <Menu className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white">
          <NavLink to="/" mobile onClick={closeMenu} isScrolled={isScrolled}>
            Home
          </NavLink>
          <button
            onClick={toggleServices}
            className="text-gray-800 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition duration-300 ease-in-out"
          >
            Services
          </button>
          {isServicesOpen && (
            <div className="pl-4 space-y-1">
              <NavLink
                to="/RentalVehicles"
                mobile
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                Rent
              </NavLink>
              <NavLink
                to="/BuyVehicles"
                mobile
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                Buy And Sell
              </NavLink>
              {/* Modified mobile menu items */}
              <button
                onClick={() => handleProtectedRoute("/Wishlist")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out hover:bg-blue-50 hover:text-blue-600"
              >
                Wishlist
              </button>
              <button
                onClick={() => handleProtectedRoute("/LostAndFound")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out hover:bg-blue-50 hover:text-blue-600"
              >
                Lost and Found
              </button>
            </div>
          )}
          <NavLink
            to="/AboutUs"
            mobile
            onClick={closeMenu}
            isScrolled={isScrolled}
          >
            About Us
          </NavLink>
          <NavLink
            to="/Contact"
            mobile
            onClick={closeMenu}
            isScrolled={isScrolled}
          >
            Contact
          </NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 bg-white">
          <div className="px-4">
            {isLoggedIn ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">
                  {userFullName}
                </span>
                <button
                  onClick={toggleProfileMenu}
                  className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                >
                  <User className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGetStarted}
                className="block w-full px-5 py-3 text-center text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mt-3"
              >
                Get Started
              </button>
            )}
          </div>
          {isProfileMenuOpen && (
            <div className="mt-3 space-y-1">
              <NavLink
                to="/Profile"
                mobile
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                My Profile
              </NavLink>
              <NavLink
                to="/UserBookings"
                mobile
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                My Bookings
              </NavLink>

              <NavLink
                to="/MySales"
                mobile
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                My Sales
              </NavLink>
              <NavLink
                to="/YourList"
                mobile
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                My Wishlist
              </NavLink>
              <Link
                to="/UserAppointments"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                role="menuitem"
                onClick={closeMenu}
              >
                Appointments
              </Link>
              <NavLink
                to="/ReportedItems"
                mobile
                onClick={closeMenu}
                isScrolled={isScrolled}
              >
                Items Reported
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, mobile, menuItem, onClick, isScrolled }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      ${
        mobile
          ? "block px-3 py-2 rounded-md text-base font-medium"
          : menuItem
          ? "block px-4 py-2 text-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          : "hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium"
      }
      transition duration-300 ease-in-out hover:bg-blue-50
      ${!mobile && !menuItem ? "text-black" : ""}
    `}
  >
    {children}
  </Link>
);

export default NavMenu;
