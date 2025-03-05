"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Car,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserBookings = () => {
  const navigate = useNavigate();

  // State variables
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch booking data from API
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/bookings");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data.length > 0 ? data : []); // Ensure empty array if no bookings
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter((booking) => {
    // Filter by status
    if (statusFilter !== "all" && booking.status !== statusFilter) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.id.toLowerCase().includes(searchLower) ||
        booking.vehicleName.toLowerCase().includes(searchLower) ||
        booking.pickupLocation.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "price-high":
        return b.totalAmount - a.totalAmount;
      case "price-low":
        return a.totalAmount - b.totalAmount;
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "cancelled":
        return <X className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  // Confirm cancellation
  const confirmCancellation = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);

    try {
      // In a real app, you would call your API
      // await fetch(`http://localhost:3000/api/bookings/${selectedBooking.id}/cancel`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ reason: cancelReason }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "cancelled", cancelReason }
            : booking
        )
      );

      toast.success("Booking cancelled successfully");
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  // View booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className=" min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mt-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
          <p className="mt-2 text-gray-600">
            View and manage all your vehicle rental bookings
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking ID, vehicle name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent shadow-sm"
            />
          </div>

          {/* Filter By Section */}
          <div className=" p-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#ff6b00]" />
            <span className="text-lg font-medium text-gray-700">
              Filter By:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 ${
                  statusFilter === "all"
                    ? "bg-[#ff6b00] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Car className="w-4 h-4" />
                All
              </button>
              <button
                onClick={() => setStatusFilter("confirmed")}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 ${
                  statusFilter === "confirmed"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Confirmed
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 ${
                  statusFilter === "pending"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 ${
                  statusFilter === "completed"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Completed
              </button>
              <button
                onClick={() => setStatusFilter("cancelled")}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 ${
                  statusFilter === "cancelled"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <X className="w-4 h-4" />
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(statusFilter !== "all" || searchTerm || sortBy !== "newest") && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#ff6b00] hover:text-[#ff8533] flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b00]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Bookings State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No bookings found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "You haven't made any bookings yet"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
              >
                Clear All Filters
              </button>
            )}
            {!searchTerm && statusFilter === "all" && (
              <button
                onClick={() => navigate("/RentalVehicleDesc")}
                className="mt-4 px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
              >
                Browse Vehicles
              </button>
            )}
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-6">
            {currentItems.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden relative"
              >
                {/* Cancel Booking Button */}
                {(booking.status === "confirmed" ||
                  booking.status === "pending") && (
                  <button
                    onClick={() => handleCancelBooking(booking)}
                    className="absolute top-4 right-4 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}

                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Vehicle Image */}
                    <div className="w-full md:w-1/4 h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={booking.vehicleImage || "/placeholder.svg"}
                        alt={booking.vehicleName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.vehicleName}
                        </h3>
                        <p className="text-gray-600">
                          {booking.vehicleDetails.make}{" "}
                          {booking.vehicleDetails.model} (
                          {booking.vehicleDetails.year})
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Pickup</p>
                          <p className="font-medium">
                            {formatDate(booking.pickupDate)} at{" "}
                            {formatTime(booking.pickupTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Return</p>
                          <p className="font-medium">
                            {formatDate(booking.returnDate)} at{" "}
                            {formatTime(booking.returnTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Pickup Location
                          </p>
                          <p className="font-medium flex items-start">
                            <MapPin className="w-4 h-4 mr-1 mt-1 flex-shrink-0" />
                            <span>{booking.pickupLocation}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-bold text-[#ff6b00]">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium flex items-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-sm font-medium flex items-center ${getStatusBadge(
                                booking.status
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Payment Method
                          </p>
                          <p className="font-medium">
                            {booking.paymentMethod === "creditCard"
                              ? "Credit/Debit Card"
                              : "Pay at Pickup"}
                          </p>
                        </div>
                        {booking.cancelReason && (
                          <div>
                            <p className="text-sm text-gray-500">
                              Cancellation Reason
                            </p>
                            <p className="font-medium">
                              {booking.cancelReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Previous Button */}
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

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 border-r border-gray-200 ${
                          currentPage === number
                            ? "bg-[#ff6b00] text-white font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  {/* Next Button */}
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
        )}
      </div>

      {/* Cancel Booking Modal */}
      {isCancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Cancel Booking
                </h2>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">
                        Cancellation Policy
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Cancellations made at least 24 hours before the pickup
                        time will receive a full refund. Cancellations made
                        within 24 hours may be subject to a cancellation fee.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel your booking for{" "}
                  <span className="font-medium">
                    {selectedBooking.vehicleName}
                  </span>
                  ?
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="cancelReason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    id="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] transition-colors"
                    placeholder="Please provide a reason for cancellation..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancellation}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
