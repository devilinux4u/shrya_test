"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CheckCircle,
  XCircle,
  Clock3,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  User,
  Mail,
  Phone,
  MessageCircle,
  UserCheck,
  Tag,
} from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("all"); // "all", "buyer", "seller"
  const [currentUserId, setCurrentUserId] = useState("user123"); // This would come from auth

  useEffect(() => {
    // Fetch user's appointments from your API
    const fetchAppointments = async () => {
      try {
        // Replace with your actual API endpoint
        // This would typically include the user's ID or token for authentication
        const response = await fetch("http://localhost:3000/user/appointments");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAppointments(data.appointments || mockAppointments); // Use mock data for preview
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments(mockAppointments); // Use mock data if fetch fails
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const toggleExpand = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const cancelAppointment = async (id, e) => {
    if (e) {
      e.stopPropagation(); // Prevent card click when clicking the button
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:3000/appointments/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );

      // If the updated appointment is currently selected, update it
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: "cancelled" });
      }

      // Close modal if open
      if (showDetailsModal) {
        closeDetailsModal();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  const approveAppointment = async (id, e) => {
    if (e) {
      e.stopPropagation(); // Prevent card click when clicking the button
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:3000/appointments/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "confirmed" }
            : appointment
        )
      );

      // If the updated appointment is currently selected, update it
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: "confirmed" });
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
      alert("Failed to approve appointment. Please try again.");
    }
  };

  const completeAppointment = async (id) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:3000/appointments/${id}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "completed" }
            : appointment
        )
      );

      // If the updated appointment is currently selected, update it
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: "completed" });
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert("Failed to mark appointment as completed. Please try again.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by role (buyer/seller)
    if (viewMode === "buyer" && appointment.buyer.id !== currentUserId)
      return false;
    if (viewMode === "seller" && appointment.seller.id !== currentUserId)
      return false;

    // Filter by status
    if (activeFilter !== "all" && appointment.status !== activeFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.vehicle.make.toLowerCase().includes(query) ||
        appointment.vehicle.model.toLowerCase().includes(query) ||
        appointment.location.toLowerCase().includes(query) ||
        (appointment.description &&
          appointment.description.toLowerCase().includes(query)) ||
        (appointment.buyer.name &&
          appointment.buyer.name.toLowerCase().includes(query)) ||
        (appointment.seller.name &&
          appointment.seller.name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock3 className="h-5 w-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Awaiting confirmation";
      case "confirmed":
        return "Appointment confirmed";
      case "cancelled":
        return "Appointment cancelled";
      case "completed":
        return "Appointment completed";
      default:
        return "Unknown status";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const isUserBuyer = (appointment) => {
    return appointment.buyer.id === currentUserId;
  };

  const isUserSeller = (appointment) => {
    return appointment.seller.id === currentUserId;
  };

  const getAppointmentRole = (appointment) => {
    if (isUserBuyer(appointment)) return "buyer";
    if (isUserSeller(appointment)) return "seller";
    return "unknown";
  };

  const getOtherPartyInfo = (appointment) => {
    return isUserBuyer(appointment) ? appointment.seller : appointment.buyer;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4 text-left">
          <span className="text-purple-600">My</span> Appointments
        </h1>
        <p className="text-sm text-gray-600 text-left">
          Track and manage your vehicle viewing appointments
        </p>
      </div>

      {/* View Mode Tabs */}
      <div className="mb-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === "all"
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setViewMode("buyer")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === "buyer"
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            As Buyer
          </button>
          <button
            onClick={() => setViewMode("seller")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === "seller"
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            As Seller
          </button>
        </div>
      </div>

      {/* Search and Filter Options */}
      <div className="mb-8 max-w-6xl mx-auto">
        <div className="p-4 flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Options */}
          <div className="flex items-center text-gray-700 font-medium">
            <Filter className="w-5 h-5 mr-2" />
            Filter by:
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter("confirmed")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "confirmed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setActiveFilter("cancelled")}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === "cancelled"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="max-w-6xl mx-auto">
        {currentAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No appointments found
            </h3>
            <p className="text-gray-500">
              {activeFilter === "all"
                ? "You don't have any appointments yet."
                : `You don't have any ${activeFilter} appointments.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openDetailsModal(appointment)}
              >
                <div className="relative">
                  <img
                    src={appointment.vehicle.image || "/placeholder-image.jpg"}
                    alt={`${appointment.vehicle.make} ${appointment.vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 flex items-center`}
                    >
                      {isUserBuyer(appointment) ? (
                        <>
                          <Tag className="w-3 h-3 mr-1" />
                          Buying
                        </>
                      ) : (
                        <>
                          <Tag className="w-3 h-3 mr-1" />
                          Selling
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {appointment.vehicle.make} {appointment.vehicle.model}
                    </h3>
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-gray-600">
                        {isUserBuyer(appointment)
                          ? `Seller: ${appointment.seller.name}`
                          : `Buyer: ${appointment.buyer.name}`}
                      </p>
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                      {appointment.description || "No description provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{appointment.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </span>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {isUserSeller(appointment) &&
                        appointment.status === "pending" && (
                          <button
                            onClick={(e) =>
                              approveAppointment(appointment._id, e)
                            }
                            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm
                          </button>
                        )}
                      {appointment.status === "pending" && (
                        <button
                          onClick={(e) => cancelAppointment(appointment._id, e)}
                          className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredAppointments.length > itemsPerPage && (
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
                        ? "bg-purple-600 text-white font-medium"
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

      {/* Detailed View Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen text-center md:block md:px-2 lg:px-4">
            <div
              className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block"
              aria-hidden="true"
              onClick={closeDetailsModal}
            ></div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden md:inline-block md:align-middle md:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="flex flex-col w-full transform text-left text-base transition md:inline-block md:max-w-3xl md:px-4 md:my-4 md:align-middle">
              <div className="w-full relative flex items-center bg-white px-6 pt-6 pb-6 overflow-y-auto max-h-[80vh] shadow-2xl sm:px-8 sm:pt-6 md:p-8 lg:p-10 rounded-lg">
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 md:right-6 md:top-6 lg:right-8 lg:top-8"
                  onClick={closeDetailsModal}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedAppointment.status
                      )}`}
                    >
                      {getStatusIcon(selectedAppointment.status)}
                      <span className="ml-2">
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800`}
                    >
                      {isUserBuyer(selectedAppointment) ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          You are the buyer
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          You are the seller
                        </>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12 mb-4">
                    Appointment Details
                  </h2>

                  {/* Vehicle Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Car className="h-5 w-5 mr-2 text-purple-600" />
                      Vehicle Information
                    </h3>

                    <div className="flex items-center mb-4">
                      <img
                        src={
                          selectedAppointment.vehicle.image ||
                          "/placeholder-image.jpg"
                        }
                        alt={`${selectedAppointment.vehicle.make} ${selectedAppointment.vehicle.model}`}
                        className="h-24 w-24 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {selectedAppointment.vehicle.make}{" "}
                          {selectedAppointment.vehicle.model}
                        </h4>
                        <p className="text-gray-500">
                          {selectedAppointment.vehicle.year} •{" "}
                          {selectedAppointment.vehicle.color}
                        </p>
                        <p className="text-gray-900 font-medium mt-1">
                          Rs. {selectedAppointment.vehicle.price}
                        </p>
                      </div>
                    </div>

                    {/* Vehicle Images Gallery */}
                    {selectedAppointment.vehicle.images &&
                      selectedAppointment.vehicle.images.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Vehicle Images
                          </h4>
                          <div className="flex space-x-2 overflow-x-auto pb-2">
                            {selectedAppointment.vehicle.images.map(
                              (image, index) => (
                                <div
                                  key={index}
                                  className="relative flex-shrink-0 w-32 h-24 overflow-hidden rounded-lg"
                                >
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`${selectedAppointment.vehicle.make} ${
                                      selectedAppointment.vehicle.model
                                    } - ${index + 1}`}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Listed By</p>
                        <p className="font-medium">
                          {selectedAppointment.seller.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Listing Date</p>
                        <p className="font-medium">
                          {new Date(
                            selectedAppointment.vehicle.listedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2 text-purple-600" />
                      {isUserBuyer(selectedAppointment)
                        ? "Seller Information"
                        : "Buyer Information"}
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {isUserBuyer(selectedAppointment)
                              ? selectedAppointment.seller.name
                              : selectedAppointment.buyer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {isUserBuyer(selectedAppointment)
                              ? "Seller"
                              : "Interested Buyer"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span>
                            {isUserBuyer(selectedAppointment)
                              ? selectedAppointment.seller.email
                              : selectedAppointment.buyer.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span>
                            {isUserBuyer(selectedAppointment)
                              ? selectedAppointment.seller.phone
                              : selectedAppointment.buyer.phone}
                          </span>
                        </div>
                      </div>

                      {selectedAppointment.status === "confirmed" && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                          <p className="text-sm text-green-800">
                            <CheckCircle className="inline-block h-4 w-4 mr-1" />
                            Contact information is now visible because the
                            appointment has been confirmed.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                      Appointment Schedule
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium">
                            {formatDate(selectedAppointment.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-500">Time</p>
                          <p className="font-medium">
                            {selectedAppointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start sm:col-span-2">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-medium">
                            {selectedAppointment.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {isUserBuyer(selectedAppointment)
                        ? "Your Request"
                        : "Buyer's Request"}
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {selectedAppointment.description ||
                        "No additional notes provided."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-end gap-3 mt-6">
                    {/* Buyer Actions */}
                    {isUserBuyer(selectedAppointment) &&
                      selectedAppointment.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => {
                            cancelAppointment(selectedAppointment._id);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Request
                        </button>
                      )}

                    {/* Seller Actions */}
                    {isUserSeller(selectedAppointment) &&
                      selectedAppointment.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              approveAppointment(selectedAppointment._id);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Booking
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              cancelAppointment(selectedAppointment._id);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </button>
                        </>
                      )}

                    {/* Seller Actions for Confirmed Appointments */}
                    {isUserSeller(selectedAppointment) &&
                      selectedAppointment.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => {
                            completeAppointment(selectedAppointment._id);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </button>
                      )}

                    {/* Buyer Actions for Confirmed Appointments */}
                    {isUserBuyer(selectedAppointment) &&
                      selectedAppointment.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => {
                            cancelAppointment(selectedAppointment._id);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </button>
                      )}

                    {/* Contact Button (visible for confirmed appointments) */}
                    {selectedAppointment.status === "confirmed" && (
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Message
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={closeDetailsModal}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mock data for preview purposes
const mockAppointments = [
  {
    _id: "a1001",
    date: "2023-04-20",
    time: "10:00 AM",
    location: "Shreya Auto Enterprises, Pragati Marga, Kathmandu",
    description:
      "I would like to test drive the vehicle before making a decision.",
    status: "pending",
    createdAt: "2023-04-15T10:30:00Z",
    buyer: {
      id: "user123",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+977 9801234567",
    },
    seller: {
      id: "seller456",
      name: "Shreya Auto",
      email: "support@shreyaauto.com",
      phone: "+977 9812345678",
    },
    vehicle: {
      make: "Toyota",
      model: "Fortuner",
      year: 2021,
      price: "8,500,000",
      color: "White",
      listedDate: "2023-04-10T10:30:00Z",
      images: [
        `https://source.unsplash.com/random/800x600?suv,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?toyota,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?fortuner,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?fortuner,${Math.random()}`,
    },
  },
  {
    _id: "a1002",
    date: "2023-04-21",
    time: "2:30 PM",
    location: "Kathmandu Auto Gallery, New Baneshwor",
    description: "Looking for financing options. Will bring documents.",
    status: "confirmed",
    createdAt: "2023-04-16T14:20:00Z",
    buyer: {
      id: "user123",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+977 9801234567",
    },
    seller: {
      id: "seller789",
      name: "Kathmandu Auto Gallery",
      email: "info@kathmanduauto.com",
      phone: "+977 9847654321",
    },
    vehicle: {
      make: "Honda",
      model: "City",
      year: 2022,
      price: "4,200,000",
      color: "Silver",
      listedDate: "2023-04-12T14:20:00Z",
      images: [
        `https://source.unsplash.com/random/800x600?honda,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?city,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?sedan,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?honda,${Math.random()}`,
    },
  },
  {
    _id: "a1003",
    date: "2023-04-18",
    time: "11:15 AM",
    location: "Shreya Auto Enterprises, Pragati Marga, Kathmandu",
    description: "Need to check the vehicle's condition and service history.",
    status: "completed",
    createdAt: "2023-04-14T09:45:00Z",
    buyer: {
      id: "buyer321",
      name: "Anil Thapa",
      email: "anil.thapa@example.com",
      phone: "+977 9812345678",
    },
    seller: {
      id: "user123",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+977 9801234567",
    },
    vehicle: {
      make: "Hyundai",
      model: "Creta",
      year: 2020,
      price: "3,800,000",
      color: "Blue",
      listedDate: "2023-04-05T09:45:00Z",
      images: [
        `https://source.unsplash.com/random/800x600?hyundai,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?creta,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?suv,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?creta,${Math.random()}`,
    },
  },
  {
    _id: "a1004",
    date: "2023-04-22",
    time: "4:00 PM",
    location: "Premium Motors, Tinkune, Kathmandu",
    description: "Requested home visit to inspect the vehicle.",
    status: "cancelled",
    createdAt: "2023-04-17T16:10:00Z",
    buyer: {
      id: "buyer456",
      name: "Sunita Rai",
      email: "sunita.rai@example.com",
      phone: "+977 9861234567",
    },
    seller: {
      id: "user123",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+977 9801234567",
    },
    vehicle: {
      make: "Kia",
      model: "Seltos",
      year: 2021,
      price: "4,500,000",
      color: "Red",
      listedDate: "2023-04-10T16:10:00Z",
      images: [
        `https://source.unsplash.com/random/800x600?kia,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?seltos,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?suv,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?kia,${Math.random()}`,
    },
  },
  {
    _id: "a1005",
    date: "2023-04-23",
    time: "1:00 PM",
    location: "Shreya Auto Enterprises, Pragati Marga, Kathmandu",
    description: "Interested in the vehicle's off-road capabilities.",
    status: "pending",
    createdAt: "2023-04-18T11:30:00Z",
    buyer: {
      id: "buyer789",
      name: "Bikash Shrestha",
      email: "bikash.shrestha@example.com",
      phone: "+977 9823456789",
    },
    seller: {
      id: "user123",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+977 9801234567",
    },
    vehicle: {
      make: "Mahindra",
      model: "Thar",
      year: 2022,
      price: "5,600,000",
      color: "Black",
      listedDate: "2023-04-15T11:30:00Z",
      images: [
        `https://source.unsplash.com/random/800x600?mahindra,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?thar,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?offroad,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?jeep,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?thar,${Math.random()}`,
    },
  },
];
