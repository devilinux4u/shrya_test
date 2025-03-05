"use client";

import { useState, useEffect } from "react";
import {
  Car,
  Calendar,
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
  XCircle,
  Clock,
  MoreHorizontal,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ActiveRentals() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/vehicles/active/all"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch rentals data");
      }
      const data = await response.json();

      console.log(data);

      // Check if data.data exists and is an array
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid data format received from API");
      }

      // Map API response to required structure
      const mappedRentals = data.data.map((rental) => ({
        id: rental.id,
        status: rental.status || "pending", // Default to pending if status is not provided
        rentalType: rental.rentalType,
        rentalDuration: rental.rentalDuration,
        totalAmount: rental.totalAmount,
        pickupLocation: rental.pickupLocation,
        dropoffLocation: rental.dropoffLocation,
        pickupDate: rental.pickupDate,
        pickupTime: rental.pickupTime,
        returnDate: rental.returnDate,
        returnTime: rental.returnTime,
        driveOption: rental.driveOption,
        rentVehicle: {
          id: rental.rentVehicle?.id || "",
          make: rental.rentVehicle?.make || "",
          model: rental.rentVehicle?.model || "",
          year: rental.rentVehicle?.year || "",
          numberPlate: rental.rentVehicle?.numberPlate || "",
          fuelType: rental.rentVehicle?.fuelType || "",
          transmission: rental.rentVehicle?.transmission || "",
          mileage: rental.rentVehicle?.mileage || "",
          seats: rental.rentVehicle?.seats || "",
          doors: rental.rentVehicle?.doors || "",
          engine: rental.rentVehicle?.engine || "",
          priceHour: rental.rentVehicle?.priceHour || 0,
          priceDay: rental.rentVehicle?.priceDay || 0,
          priceWeek: rental.rentVehicle?.priceWeek || 0,
          priceMonth: rental.rentVehicle?.priceMonth || 0,
          status: rental.rentVehicle?.status || "",
          description: rental.rentVehicle?.description || "",
          rentVehicleImages: rental.rentVehicle?.rentVehicleImages || [],
        },
        user: {
          id: rental.user?.id || "",
          fname: rental.user?.fname || "",
          lname: rental.user?.lname || "",
          uname: rental.user?.uname || "",
          email: rental.user?.email || "",
          phone: rental.user?.num || "",
        },
      }));

      setRentals(mappedRentals);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/rental-details/${id}`);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time to readable format
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5); // Assuming time is in HH:MM format
  };

  // Update rental status
  const updateRentalStatus = async (rentalId, newStatus) => {
    try {
      setLoading(true);
      // In a real application, you would make an API call here
      // const response = await fetch(`http://localhost:3000/api/rentals/${rentalId}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update rental status');
      // }

      // For demo purposes, we'll just update the state directly
      setRentals((prevRentals) =>
        prevRentals.map((rental) =>
          rental.id === rentalId ? { ...rental, status: newStatus } : rental
        )
      );

      setShowStatusMenu(null);
      toast.success(`Rental status updated to ${newStatus.replace("-", " ")}`);
    } catch (err) {
      toast.error(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel rental
  const cancelRental = (rental) => {
    setSelectedRental(rental);
    setIsCancelModalOpen(true);
  };

  // Confirm cancellation
  const confirmCancellation = async () => {
    if (!selectedRental) return;

    try {
      setIsCancelling(true);
      // In a real application, you would make an API call here
      // const response = await fetch(`http://localhost:3000/api/rentals/${selectedRental.id}/cancel`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ reason: cancelReason }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to cancel rental');
      // }

      // For demo purposes, we'll just update the state directly
      setRentals((prevRentals) =>
        prevRentals.map((rental) =>
          rental.id === selectedRental.id
            ? { ...rental, status: "cancelled" }
            : rental
        )
      );

      setIsCancelModalOpen(false);
      setCancelReason("");
      toast.success("Rental has been cancelled successfully");
    } catch (err) {
      toast.error(`Failed to cancel rental: ${err.message}`);
    } finally {
      setIsCancelling(false);
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-3 w-3 inline mr-1" />,
          label: "Pending",
        };
      case "active":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3 inline mr-1" />,
          label: "Active",
        };
      case "completed":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="h-3 w-3 inline mr-1" />,
          label: "Completed",
        };
      case "completed-late":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <CheckCircle className="h-3 w-3 inline mr-1" />,
          label: "Completed Late",
        };
      case "late":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: <AlertTriangle className="h-3 w-3 inline mr-1" />,
          label: "Late",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-3 w-3 inline mr-1" />,
          label: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Clock className="h-3 w-3 inline mr-1" />,
          label: "Unknown",
        };
    }
  };

  // Filter rentals based on search term and status
  const filteredRentals = rentals.filter((rental) => {
    // Filter by search term
    const searchMatch =
      rental.rentVehicle.make
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      rental.rentVehicle.model
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${rental.user.fname} ${rental.user.lname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      rental.rentVehicle.numberPlate
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Filter by status
    const statusMatch =
      statusFilter === "all" || rental.status === statusFilter;

    return searchMatch && statusMatch;
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
  const FilterButton = ({ value, label, active, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-[#ff6b00] text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
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
                Rental Management
              </h1>
              <p className="mt-2 text-gray-600">
                Monitor and manage all vehicle rentals
              </p>
            </div>
          </div>

          {/* Search Bar and Filters Section */}
          <div className="mb-6 p-5 bg-white rounded-xl shadow-sm">
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

              {/* Filter by Status */}
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 mr-3">
                  Filter by status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    value="all"
                    label="All"
                    active={statusFilter === "all"}
                    onClick={setStatusFilter}
                  />
                  <FilterButton
                    value="pending"
                    label="Pending"
                    active={statusFilter === "pending"}
                    onClick={setStatusFilter}
                  />
                  <FilterButton
                    value="active"
                    label="Active"
                    active={statusFilter === "active"}
                    onClick={setStatusFilter}
                  />
                  <FilterButton
                    value="late"
                    label="Late"
                    active={statusFilter === "late"}
                    onClick={setStatusFilter}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rentals List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#ff6b00] animate-spin" />
              <span className="ml-2 text-lg text-gray-600">
                Loading rentals...
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
                No rentals found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "There are currently no vehicle rentals"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentItems.map((rental) => {
                const statusInfo = getStatusInfo(rental.status);

                return (
                  <div
                    key={rental.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                      {/* Vehicle Image and Info */}
                      <div className="md:col-span-1 relative">
                        <div className="h-full">
                          <img
                            src={
                              (rental.rentVehicle.rentVehicleImages &&
                                rental.rentVehicle.rentVehicleImages.length >
                                  0 &&
                                `../../server${
                                  rental.rentVehicle.rentVehicleImages[0]
                                    .image || "/placeholder.svg"
                                }`) ||
                              "/placeholder.svg"
                            }
                            alt={`${rental.rentVehicle.make} ${rental.rentVehicle.model}`}
                            className="w-full h-full object-cover md:h-full"
                            style={{ minHeight: "200px" }}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute top-0 left-0 bg-[#ff6b00] text-white px-3 py-1 rounded-br-lg font-medium">
                            {rental.rentalType?.charAt(0).toUpperCase() +
                              rental.rentalType?.slice(1) || "Rental"}
                          </div>
                        </div>
                      </div>

                      {/* Rental Details */}
                      <div className="p-5 md:col-span-2 lg:col-span-3">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Vehicle Info */}
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {rental.rentVehicle.make}{" "}
                                {rental.rentVehicle.model} (
                                {rental.rentVehicle.year})
                              </h3>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                              >
                                {statusInfo.icon}
                                <span>{statusInfo.label}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Number Plate: {rental.rentVehicle.numberPlate}
                            </p>

                            <div className="flex items-center mb-4">
                              <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {rental.user.fname} {rental.user.lname}
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
                                <span>{rental.user.phone || "N/A"}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{rental.user.email}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                <span>
                                  {rental.driveOption === "self-drive"
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
                                  Pickup Date
                                </p>
                                <p className="font-medium text-gray-900">
                                  {formatDate(rental.pickupDate)} at{" "}
                                  {formatTime(rental.pickupTime)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Return Date
                                </p>
                                <p className="font-medium text-gray-900">
                                  {formatDate(rental.returnDate)} at{" "}
                                  {formatTime(rental.returnTime)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Duration
                                </p>
                                <p className="font-medium text-gray-900">
                                  {rental.rentalDuration || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Total Amount
                                </p>
                                <p className="font-medium text-gray-900">
                                  Rs.{" "}
                                  {rental.totalAmount?.toLocaleString() || "0"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-[#ff6b00]" />
                              Actions
                            </h4>

                            <div className="space-y-3">
                              {/* Status Update Button */}
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setShowStatusMenu(
                                      rental.id === showStatusMenu
                                        ? null
                                        : rental.id
                                    )
                                  }
                                  className="w-full flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  <span>Update Status</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>

                                {showStatusMenu === rental.id && (
                                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                                    <div className="py-1">
                                      {rental.status !== "pending" && (
                                        <button
                                          onClick={() =>
                                            updateRentalStatus(
                                              rental.id,
                                              "pending"
                                            )
                                          }
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          Set as Pending
                                        </button>
                                      )}
                                      {rental.status !== "active" && (
                                        <button
                                          onClick={() =>
                                            updateRentalStatus(
                                              rental.id,
                                              "active"
                                            )
                                          }
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          Set as Active
                                        </button>
                                      )}
                                      {rental.status !== "completed" && (
                                        <button
                                          onClick={() =>
                                            updateRentalStatus(
                                              rental.id,
                                              "completed"
                                            )
                                          }
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          Set as Completed
                                        </button>
                                      )}
                                      {rental.status !== "late" && (
                                        <button
                                          onClick={() =>
                                            updateRentalStatus(
                                              rental.id,
                                              "late"
                                            )
                                          }
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          Set as Late
                                        </button>
                                      )}
                                      {rental.status !== "completed-late" && (
                                        <button
                                          onClick={() =>
                                            updateRentalStatus(
                                              rental.id,
                                              "completed-late"
                                            )
                                          }
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          Set as Completed Late
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Cancel Button - Only show if not already cancelled or completed */}
                              {rental.status !== "cancelled" &&
                                rental.status !== "completed" &&
                                rental.status !== "completed-late" && (
                                  <button
                                    onClick={() => cancelRental(rental)}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Rental
                                  </button>
                                )}

                              {/* View Details Button */}
                              <button
                                onClick={() => handleViewDetails(rental.id)}
                                className="w-full flex items-center justify-center px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredRentals.length > itemsPerPage && (
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
      {/* Cancel Booking Modal */}
      {isCancelModalOpen && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Cancel Rental
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
                        Cancelling a rental may affect the customer's experience
                        and future bookings. Please ensure you have a valid
                        reason for cancellation and have communicated with the
                        customer if possible.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel the rental for
                  <span className="font-medium">
                    {selectedRental.rentVehicle.make}{" "}
                    {selectedRental.rentVehicle.model}
                  </span>
                  ?
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="cancelReason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for cancellation
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
                  Keep Rental
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
    </>
  );
}
