import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Car, Filter, Search, ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import Cookies from "js-cookie";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const bookingsPerPage = 6;

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBookings = [
        {
          id: "BK-1001",
          vehicleName: "Toyota Camry",
          vehicleImage: "/placeholder.svg?height=200&width=300",
          bookingDate: "2024-03-10",
          startDate: "2024-03-15",
          endDate: "2024-03-20",
          status: "active",
          price: 25000,
          location: "Pragati Marga, Kathmandu",
          vehicleType: "Sedan",
          color: "Silver",
        },
        {
          id: "BK-1002",
          vehicleName: "Honda CR-V",
          vehicleImage: "/placeholder.svg?height=200&width=300",
          bookingDate: "2024-02-25",
          startDate: "2024-03-01",
          endDate: "2024-03-05",
          status: "completed",
          price: 30000,
          location: "Pragati Marga, Kathmandu",
          vehicleType: "SUV",
          color: "Black",
        },
        {
          id: "BK-1003",
          vehicleName: "Hyundai i20",
          vehicleImage: "/placeholder.svg?height=200&width=300",
          bookingDate: "2024-03-05",
          startDate: "2024-03-25",
          endDate: "2024-03-30",
          status: "active",
          price: 18000,
          location: "Pragati Marga, Kathmandu",
          vehicleType: "Hatchback",
          color: "Red",
        },
        {
          id: "BK-1004",
          vehicleName: "Mahindra Scorpio",
          vehicleImage: "/placeholder.svg?height=200&width=300",
          bookingDate: "2024-01-15",
          startDate: "2024-01-20",
          endDate: "2024-01-25",
          status: "cancelled",
          price: 28000,
          location: "Pragati Marga, Kathmandu",
          vehicleType: "SUV",
          color: "White",
        },
        {
          id: "BK-1005",
          vehicleName: "Maruti Swift",
          vehicleImage: "/placeholder.svg?height=200&width=300",
          bookingDate: "2024-02-10",
          startDate: "2024-02-15",
          endDate: "2024-02-20",
          status: "completed",
          price: 15000,
          location: "Pragati Marga, Kathmandu",
          vehicleType: "Hatchback",
          color: "Blue",
        },
        {
          id: "BK-1006",
          vehicleName: "Tata Nexon",
          vehicleImage: "/placeholder.svg?height=200&width=300",
          bookingDate: "2024-03-08",
          startDate: "2024-04-01",
          endDate: "2024-04-05",
          status: "active",
          price: 22000,
          location: "Pragati Marga, Kathmandu",
          vehicleType: "Compact SUV",
          color: "Green",
        },
        {
          id: "BK-1007",
          vehicleName: "Ford EcoSport",
          vehicleImage: "/placeholder.svg?height=200&width=300",
          bookingDate: "2024-03-01",
          startDate: "2024-03-12",
          endDate: "2024-03-18",
          status: "active",
          price: 24000,
          location: "Pragati Marga, Kathmandu",
          vehicleType: "Compact SUV",
          color: "Orange",
        },
      ];
      
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter bookings based on status and search query
  useEffect(() => {
    let result = bookings;
    
    // Filter by status
    if (activeFilter !== "all") {
      result = result.filter(booking => booking.status === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.vehicleName.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query) ||
        booking.vehicleType.toLowerCase().includes(query) ||
        booking.color.toLowerCase().includes(query)
      );
    }
    
    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeFilter, searchQuery, bookings]);

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        };
      case "completed":
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        };
      case "cancelled":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <X className="w-4 h-4 mr-1" />,
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">View and manage all your vehicle bookings</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
            <div className={`sm:flex gap-2 ${showFilters ? 'flex' : 'hidden'} flex-wrap`}>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "active"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "completed"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveFilter("cancelled")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "No bookings match your search criteria."
                : activeFilter !== "all"
                ? `You don't have any ${activeFilter} bookings.`
                : "You haven't made any bookings yet."}
            </p>
            <Link
              to="/RentalVehicles"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={booking.vehicleImage || "/placeholder.svg"}
                        alt={booking.vehicleName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}>
                          {statusBadge.icon}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.vehicleName}</h3>
                        <span className="text-sm font-medium text-gray-500">#{booking.id}</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Car className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{booking.vehicleType} • {booking.color}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="text-lg font-bold text-gray-900">
                          Rs. {booking.price.toLocaleString()}
                        </div>
                        <Link
                          to={`/booking-details/${booking.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserBookings;