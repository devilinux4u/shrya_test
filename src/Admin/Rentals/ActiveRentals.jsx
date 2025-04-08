"use client";

import { useState, useEffect } from "react";
import {
  Car,
  Calendar,
  Clock,
  User,
  Search,
  Eye,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ActiveRentals() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/vehicles/active/all"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch rentals data");
        }
        const data = await response.json();
        setRentals(data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/vehicles/active/all"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch rentals data");
      }
      const data = await response.json();
      setRentals(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/rental-details/${id}`);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate percentage of time elapsed
  const calculateTimeProgress = (rental) => {
    const { totalHours, hoursRemaining } = rental.rentalPeriod;
    const hoursElapsed = totalHours - hoursRemaining;
    return Math.round((hoursElapsed / totalHours) * 100);
  };

  // Format rental duration
  const formatDuration = (rental) => {
    const { type } = rental.rentalPeriod;
    switch (type) {
      case "hour":
        return `${rental.rentalPeriod.totalHours} hours`;
      case "day":
        return `${rental.rentalPeriod.totalHours / 24} days`;
      case "week":
        return `${rental.rentalPeriod.totalHours / 168} weeks`;
      case "month":
        return `${rental.rentalPeriod.totalHours / 720} months`;
      default:
        return `${rental.rentalPeriod.totalHours} hours`;
    }
  };

  // Format time remaining
  const formatTimeRemaining = (hours) => {
    if (hours < 1) {
      return "Less than 1 hour";
    }
    if (hours < 24) {
      return `${Math.round(hours)} hours`;
    }
    if (hours < 168) {
      return `${Math.round(hours / 24)} days, ${Math.round(hours % 24)} hours`;
    }
    return `${Math.floor(hours / 24)} days`;
  };

  // Filter rentals
  const filteredRentals = rentals.filter((rental) => {
    // Search filter
    const searchMatch =
      rental.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle.numberPlate
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Type filter
    if (filterType === "all") return searchMatch;
    return searchMatch && rental.rentalPeriod.type === filterType;
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRentals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Filter button component
  const FilterButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <div className="border-l-4 border-[#ff6b00] pl-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Active Rentals
              </h1>
              <p className="mt-2 text-gray-600">
                Monitor and manage currently active vehicle rentals
              </p>
            </div>
          </div>

          {/* Search Bar and Filters Section */}
          <div className="  mb-6 p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by vehicle, user or number plate..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-700" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Filter By
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={filterType === "all"}
                    onClick={() => setFilterType("all")}
                  >
                    All Types
                  </FilterButton>
                  <FilterButton
                    active={filterType === "hour"}
                    onClick={() => setFilterType("hour")}
                  >
                    Hourly
                  </FilterButton>
                  <FilterButton
                    active={filterType === "day"}
                    onClick={() => setFilterType("day")}
                  >
                    Daily
                  </FilterButton>
                  <FilterButton
                    active={filterType === "week"}
                    onClick={() => setFilterType("week")}
                  >
                    Weekly
                  </FilterButton>
                  <FilterButton
                    active={filterType === "month"}
                    onClick={() => setFilterType("month")}
                  >
                    Monthly
                  </FilterButton>
                </div>
              </div>
            </div>
          </div>

          {/* Rentals List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#ff6b00] animate-spin" />
              <span className="ml-2 text-lg text-gray-600">
                Loading active rentals...
              </span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Error loading rentals
                </h3>
                <p className="mt-1 text-red-700">{error}</p>
                <button
                  onClick={fetchRentals}
                  className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : filteredRentals.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active rentals found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "There are currently no active vehicle rentals"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentItems.map((rental) => (
                <div
                  key={rental._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {/* Vehicle Image and Info */}
                    <div className="md:col-span-1 relative">
                      <div className="h-full">
                        <img
                          src={rental.vehicle.imageUrl || "/placeholder.svg"}
                          alt={`${rental.vehicle.make} ${rental.vehicle.model}`}
                          className="w-full h-full object-cover md:h-full"
                          style={{ minHeight: "200px" }}
                        />
                        <div className="absolute top-0 left-0 bg-[#ff6b00] text-white px-3 py-1 rounded-br-lg font-medium">
                          {rental.rentalPeriod.type.charAt(0).toUpperCase() +
                            rental.rentalPeriod.type.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Rental Details */}
                    <div className="p-5 md:col-span-2 lg:col-span-3">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Vehicle Info */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {rental.vehicle.make} {rental.vehicle.model} (
                            {rental.vehicle.year})
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Number Plate: {rental.vehicle.numberPlate}
                          </p>

                          <div className="flex items-center mb-4">
                            <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3">
                              <img
                                src={
                                  rental.user.profileImage || "/placeholder.svg"
                                }
                                alt={rental.user.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {rental.user.name}
                              </p>
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="h-3 w-3 mr-1" />
                                <span>Renter</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{rental.user.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{rental.user.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              <span>
                                {rental.driverService === "self-drive"
                                  ? "Self Drive"
                                  : "Hire a Driver"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rental Period */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-[#ff6b00]" />
                            Rental Period
                          </h4>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600">
                                Start Date
                              </p>
                              <p className="font-medium text-gray-900">
                                {formatDate(rental.rentalPeriod.startDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">End Date</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(rental.rentalPeriod.endDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-medium text-gray-900">
                                {formatDuration(rental)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Amount
                              </p>
                              <p className="font-medium text-gray-900">
                                Rs. {rental.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Time Remaining */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-[#ff6b00]" />
                            Time Remaining
                          </h4>

                          {/* Removed progress bar and percentage display */}

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Time Left</p>
                            <p className="font-medium text-gray-900">
                              {formatTimeRemaining(
                                rental.rentalPeriod.hoursRemaining
                              )}
                            </p>
                          </div>

                          <div className="flex items-center">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rental.rentalPeriod.hoursRemaining < 12
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {rental.rentalPeriod.hoursRemaining < 12 ? (
                                <AlertTriangle className="h-3 w-3 inline mr-1" />
                              ) : (
                                <CheckCircle className="h-3 w-3 inline mr-1" />
                              )}
                              {rental.rentalPeriod.hoursRemaining < 12
                                ? "Ending Soon"
                                : "On Schedule"}
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewDetails(rental._id)}
                            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredRentals.length > 0 && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border-r border-gray-200 flex items-center ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 border-r border-gray-200 ${
                        currentPage === number
                          ? "bg-orange-500 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 flex items-center ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
