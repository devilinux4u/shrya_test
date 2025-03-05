"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Car,
  Clock,
  Download,
  FileText,
  Star,
  ChevronDown,
  ChevronUp,
  XCircle,
  CheckCircle,
  Ban,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
} from "lucide-react";

export default function RentalHistory() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRental, setSelectedRental] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "pickupDate",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/api/vehicles/history/all"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rental data");
        }
        const data = await response.json();

        // Check if data.data exists and is an array
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error("Invalid data format received from API");
        }

        // Map API response to required structure
        const mappedRentals = data.data.map((rental) => ({
          id: rental.id,
          status: rental.status,
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
          deposit: rental.deposit || 0,
          depositReturned: rental.depositReturned || false,
          rating: rental.rating || null,
          review: rental.review || null,
          damageReport: rental.damageReport || null,
          rentVehicle: {
            id: rental.rentVehicle?.id || "",
            make: rental.rentVehicle?.make || "",
            model: rental.rentVehicle?.model || "",
            year: rental.rentVehicle?.year || "",
            numberPlate: rental.rentVehicle?.numberPlate || "",
            color: rental.rentVehicle?.color || "N/A",
            fuelType: rental.rentVehicle?.fuelType || "",
            transmission: rental.rentVehicle?.transmission || "",
          },
          user: {
            id: rental.user?.id || "",
            fname: rental.user?.fname || "",
            lname: rental.user?.lname || "",
            uname: rental.user?.uname || "",
            email: rental.user?.email || "",
            phone: rental.user?.phone || "N/A",
          },
        }));

        setRentals(mappedRentals);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching rental data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "completed_late":
        return "bg-[#4F46E5]/10 text-[#4F46E5]";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "completed_late":
        return <Clock className="w-5 h-5 text-[#4F46E5]" />;
      case "cancelled":
        return <Ban className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5); // Assuming time is in HH:MM format
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return (
      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
    );
  };

  const filteredAndSortedRentals = rentals
    .filter((rental) => {
      const matchesSearch =
        rental.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) || // Convert rental.id to string
        `${rental.user.fname} ${rental.user.lname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        `${rental.rentVehicle.make} ${rental.rentVehicle.model}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        rental.rentVehicle.numberPlate
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || rental.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortConfig.key === "rating") {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return sortConfig.direction === "asc"
          ? ratingA - ratingB
          : ratingB - ratingA;
      }
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedRentals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedRentals.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <div className="border-l-4 border-[#ff6b00] pl-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Rental History
            </h1>
            <p className="mt-2 text-gray-600">
              View past rental transactions and customer feedback
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b00]"></div>
            <span className="ml-4 text-lg text-gray-600">
              Loading rental history...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Error loading rental history
              </h3>
              <p className="mt-1 text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Total Rentals</h3>
                  <div className="p-3 bg-[#4F46E5]/10 rounded-full">
                    <Car className="w-6 h-6 text-[#4F46E5]" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{rentals.length}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Completed</h3>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {rentals.filter((r) => r.status === "completed").length}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Late Returns</h3>
                  <div className="p-3 bg-[#4F46E5]/10 rounded-full">
                    <Clock className="w-6 h-6 text-[#4F46E5]" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {rentals.filter((r) => r.status === "completed_late").length}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Cancelled</h3>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Ban className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {rentals.filter((r) => r.status === "cancelled").length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rentals by ID, name, vehicle or plate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="completed_late">Late Returns</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => {
                    console.log("Exporting data...");
                  }}
                  className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>

            {/* Rentals Table */}
            {filteredAndSortedRentals.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No rental history found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "There are no rental records in the system"}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#4F46E5] transition-colors"
                            onClick={() => handleSort("id")}
                          >
                            <div className="flex items-center gap-2">
                              Rental ID
                              {getSortIcon("id")}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th
                            className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#4F46E5] transition-colors"
                            onClick={() => handleSort("pickupDate")}
                          >
                            <div className="flex items-center gap-2">
                              Dates
                              {getSortIcon("pickupDate")}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th
                            className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#4F46E5] transition-colors"
                            onClick={() => handleSort("rating")}
                          >
                            <div className="flex items-center gap-2">
                              Rating
                              {getSortIcon("rating")}
                            </div>
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((rental) => (
                          <tr
                            key={rental.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {rental.id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {rental.user.fname} {rental.user.lname}
                              </div>
                              <div className="text-sm text-gray-500">
                                {rental.user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {rental.rentVehicle.make}{" "}
                                {rental.rentVehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {rental.rentVehicle.numberPlate}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(rental.pickupDate)} at{" "}
                                {formatTime(rental.pickupTime)}
                              </div>
                              <div className="text-sm text-gray-500">
                                to {formatDate(rental.returnDate)} at{" "}
                                {formatTime(rental.returnTime)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  rental.status
                                )}`}
                              >
                                {getStatusIcon(rental.status)}
                                <span className="ml-1">
                                  {rental.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {rental.rating ? (
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="ml-1 text-sm text-gray-600">
                                    {rental.rating}/5
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => setSelectedRental(rental)}
                                className="text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                              >
                                <FileText className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {filteredAndSortedRentals.length > itemsPerPage && (
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
              </>
            )}

            {/* Rental Detail Modal */}
            {selectedRental && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedRental(null)}
              >
                <div
                  className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Rental Details
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        View rental information and customer feedback
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                          selectedRental.status
                        )}`}
                      >
                        {getStatusIcon(selectedRental.status)}
                        <span className="ml-1">
                          {selectedRental.status
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedRental(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Vehicle Information
                      </h3>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Make & Model
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.rentVehicle.make}{" "}
                          {selectedRental.rentVehicle.model} (
                          {selectedRental.rentVehicle.year})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          License Plate
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.rentVehicle.numberPlate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Color
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.rentVehicle.color}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Transmission
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.rentVehicle.transmission}
                        </p>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Customer Information
                      </h3>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Name
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.user.fname}{" "}
                          {selectedRental.user.lname}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.user.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Drive Option
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.driveOption === "self-drive"
                            ? "Self Drive"
                            : "With Driver"}
                        </p>
                      </div>
                    </div>

                    {/* Rental Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Rental Details
                      </h3>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Pickup Date & Time
                        </p>
                        <p className="text-gray-900">
                          {formatDate(selectedRental.pickupDate)} at{" "}
                          {formatTime(selectedRental.pickupTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Return Date & Time
                        </p>
                        <p className="text-gray-900">
                          {formatDate(selectedRental.returnDate)} at{" "}
                          {formatTime(selectedRental.returnTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Duration
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.rentalDuration}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Pickup Location
                        </p>
                        <p className="text-gray-900">
                          {selectedRental.pickupLocation || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Financial Details
                      </h3>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Amount
                        </p>
                        <p className="text-gray-900">
                          Rs. {selectedRental.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Security Deposit
                        </p>
                        <p className="text-gray-900">
                          Rs. {selectedRental.deposit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Deposit Status
                        </p>
                        <p
                          className={`text-${
                            selectedRental.depositReturned ? "green" : "red"
                          }-600`}
                        >
                          {selectedRental.depositReturned
                            ? "Returned"
                            : "Not Returned"}
                        </p>
                      </div>
                    </div>

                    {/* Review and Damage Report */}
                    {(selectedRental.review || selectedRental.damageReport) && (
                      <div className="col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Additional Information
                        </h3>
                        {selectedRental.review && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500">
                              Customer Review
                            </p>
                            {selectedRental.rating && (
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-gray-600">
                                  {selectedRental.rating}/5
                                </span>
                              </div>
                            )}
                            <p className="text-gray-900">
                              {selectedRental.review}
                            </p>
                          </div>
                        )}
                        {selectedRental.damageReport && (
                          <div className="bg-red-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-red-500">
                              Damage Report
                            </p>
                            <p className="text-red-900">
                              {selectedRental.damageReport}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <button
                      onClick={() => setSelectedRental(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors font-medium flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Export Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
