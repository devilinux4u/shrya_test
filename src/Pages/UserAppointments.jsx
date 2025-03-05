import { useState, useEffect } from "react";
import Cookies from "js-cookie";
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
  UserCheck,
  Tag,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [currentUserId, setCurrentUserId] = useState("user123");
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    action: null,
    bookingId: null,
    role: null,
  });
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/appointments/user/" +
            Cookies.get("sauto").split("-")[0]
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        // Combine asBuyer and asSeller into a single array with role information
        const combinedAppointments = [
          ...data.data.asBuyer.map((app) => ({
            ...app,
            role: "buyer",
            vehicle: {
              ...app.SellVehicle,
              images:
                app.SellVehicle?.SellVehicleImages?.map((img) => img.image) ||
                [],
            },
            seller: app.User || {}, // Use User object for seller details
          })),
          ...data.data.asSeller.map((app) => ({
            ...app,
            role: "seller",
            vehicle: {
              ...app.SellVehicle,
              images:
                app.SellVehicle?.SellVehicleImages?.map((img) => img.image) ||
                [],
            },
            buyer: app.User || {}, // Use User object for buyer details
          })),
        ];

        // Sort appointments by creation date in descending order
        combinedAppointments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        console.log(combinedAppointments);

        setAppointments(combinedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const handleNewAppointment = (event) => {
      const newAppointment = event.detail;

      // Map the new appointment to match the expected structure
      const mappedAppointment = {
        ...newAppointment,
        role: newAppointment.userId === currentUserId ? "buyer" : "seller",
        vehicle: {
          ...newAppointment.SellVehicle,
          images:
            newAppointment.SellVehicle?.SellVehicleImages?.map(
              (img) => img.image
            ) || [],
        },
        seller: newAppointment.User || {},
      };

      setAppointments((prevAppointments) => [
        mappedAppointment,
        ...prevAppointments,
      ]);
    };

    // Listen for the custom event
    window.addEventListener("newAppointmentCreated", handleNewAppointment);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("newAppointmentCreated", handleNewAppointment);
    };
  }, [currentUserId]);

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

  const cancelAppointment = async (id, roles) => {
    try {
      setConfirmationDialog({
        isOpen: true,
        action: "cancel",
        bookingId: id,
        role: roles,
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(`Failed to cancel appointment: ${error.message}`);
    }
  };

  const approveAppointment = async (id, roles) => {
    try {
      // Set confirmation dialog state
      setConfirmationDialog({
        isOpen: true,
        action: "confirm",
        bookingId: id,
        role: roles,
      });
    } catch (error) {
      console.error("Error approving appointment:", error);
      toast.error("Failed to approve appointment");
    }
  };

  const handleConfirmedStatusUpdate = async (id, status, role) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          errorData.message ||
            `Failed to update appointment: ${response.statusText}`
        );
      }

      const updatedAppointment = await response.json();
      console.log("Updated appointment:", updatedAppointment);

      // Update local state
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: status } : app))
      );

      // Dispatch event to update other components
      window.dispatchEvent(
        new CustomEvent("appointmentStatusUpdated", {
          detail: { id, status, updatedAppointment },
        })
      );

      // Show toast notification
      if (status === "confirmed") {
        toast.success("Appointment successfully confirmed!");
      } else if (status === "cancelled") {
        toast.success("Appointment has been cancelled.");
      }

      // Close the modal
      if (showDetailsModal) {
        closeDetailsModal();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(`Failed to update appointment: ${error.message}`);
    } finally {
      // Reset confirmation dialog
      setConfirmationDialog({
        isOpen: false,
        action: null,
        bookingId: null,
        role: null,
      });
    }
  };

  const isUserBuyer = (appointment) => {
    return appointment.role === "buyer";
  };

  const isUserSeller = (appointment) => {
    return appointment.role === "seller";
  };

  const handleCancelClick = (appointment, role) => {
    setAppointmentToCancel({ id: appointment.id, role });
    setIsCancelModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (!appointmentToCancel) return;

    try {
      await fetch(
        `http://localhost:3000/api/appointments/${appointmentToCancel.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
            role: appointmentToCancel.role,
            reason: cancelReason,
          }),
        }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentToCancel.id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );

      toast.success("Appointment cancelled successfully");
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment. Please try again.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by role (buyer/seller)
    if (viewMode === "buyer" && !isUserBuyer(appointment)) return false;
    if (viewMode === "seller" && !isUserSeller(appointment)) return false;

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
        (appointment.seller.fname &&
          appointment.seller.fname.toLowerCase().includes(query))
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
      <div className="mt-12 max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4 text-left">
          <span className="text-orange-600">My</span> Appointments
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
                ? "bg-orange-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setViewMode("buyer")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === "buyer"
                ? "bg-orange-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            As Buyer
          </button>
          <button
            onClick={() => setViewMode("seller")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === "seller"
                ? "bg-orange-600 text-white"
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
              className="w-full pl-10 pr-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  ? "bg-orange-600 text-white"
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
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openDetailsModal(appointment)}
              >
                <div className="relative">
                  <img
                    src={`../../server/controllers${appointment.vehicle.SellVehicleImages[0].image}`}
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
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 flex items-center`}
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
                          ? `Seller: ${
                              appointment.seller.fname || "Shreya Auto"
                            }`
                          : `Buyer: ${appointment.buyer.fname}`}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              approveAppointment(
                                appointment.id,
                                isUserBuyer(appointment) ? "buyer" : "seller"
                              );
                            }}
                            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm
                          </button>
                        )}
                      {appointment.status === "pending" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelClick(
                              appointment,
                              isUserBuyer(appointment) ? "buyer" : "seller"
                            );
                          }}
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
                        ? "bg-orange-600 text-white font-medium"
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
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800`}
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
                      <Car className="h-5 w-5 mr-2 text-orange-600" />
                      Vehicle Information
                    </h3>

                    <div className="flex items-center mb-4">
                      <img
                        src={`../../server/controllers${selectedAppointment.vehicle.SellVehicleImages[0].image}`}
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
                    {selectedAppointment.vehicle.SellVehicleImages &&
                      selectedAppointment.vehicle.SellVehicleImages.length >
                        0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Vehicle Images
                          </h4>
                          <div className="flex space-x-2 overflow-x-auto pb-2">
                            {selectedAppointment.vehicle.SellVehicleImages?.map(
                              (image, index) => (
                                <div
                                  key={index}
                                  className="relative flex-shrink-0 w-32 h-24 overflow-hidden rounded-lg"
                                >
                                  <img
                                    src={`../../server/controllers/${image.image}`}
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
                          {selectedAppointment.User.fname}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2 text-orange-600" />
                      {isUserBuyer(selectedAppointment)
                        ? "Seller Information"
                        : "Buyer Information"}
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {isUserBuyer(selectedAppointment)
                              ? selectedAppointment.User.fname || "Shreya Auto"
                              : selectedAppointment.User.fname}
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
                              ? selectedAppointment.User.email
                              : selectedAppointment.User.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span>
                            {isUserBuyer(selectedAppointment)
                              ? selectedAppointment.seller.num
                              : selectedAppointment.buyer.num}
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
                      <Calendar className="h-5 w-5 mr-2 text-orange-600" />
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
                            cancelAppointment(
                              selectedAppointment.id,
                              isUserBuyer(selectedAppointment)
                                ? "buyer"
                                : "seller"
                            );
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
                              approveAppointment(
                                selectedAppointment.id,
                                isUserBuyer(appointment) ? "buyer" : "seller"
                              );
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Booking
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              cancelAppointment(
                                selectedAppointment.id,
                                isUserBuyer(selectedAppointment)
                                  ? "buyer"
                                  : "seller"
                              );
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </button>
                        </>
                      )}

                    {/* Buyer Actions for Confirmed Appointments */}
                    {isUserBuyer(selectedAppointment) &&
                      selectedAppointment.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => {
                            cancelAppointment(
                              selectedAppointment.id,
                              isUserBuyer(selectedAppointment)
                                ? "buyer"
                                : "seller"
                            );
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={closeDetailsModal}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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

      {/* Confirmation Dialog */}
      {confirmationDialog.isOpen && (
        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                      confirmationDialog.action === "confirm"
                        ? "bg-green-100"
                        : "bg-red-100"
                    } sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    {confirmationDialog.action === "confirm" ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {confirmationDialog.action === "confirm"
                        ? "Confirm Appointment"
                        : "Cancel Appointment"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {confirmationDialog.action === "confirm"
                          ? "Are you sure you want to confirm this appointment? This action cannot be undone."
                          : "Are you sure you want to cancel this appointment? This action cannot be undone."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                    confirmationDialog.action === "confirm"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    confirmationDialog.action === "confirm"
                      ? "focus:ring-green-500"
                      : "focus:ring-red-500"
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => {
                    handleConfirmedStatusUpdate(
                      confirmationDialog.bookingId,
                      confirmationDialog.action === "confirm"
                        ? "confirmed"
                        : "cancelled",
                      confirmationDialog.role
                    );
                  }}
                >
                  {confirmationDialog.action === "confirm"
                    ? "Confirm"
                    : "Cancel"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setConfirmationDialog({
                      isOpen: false,
                      action: null,
                      bookingId: null,
                      role: null,
                    });
                  }}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Cancel Appointment
                </h2>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel this appointment?
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
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-colors"
                    placeholder="Please provide a reason for cancellation..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={confirmCancellation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
