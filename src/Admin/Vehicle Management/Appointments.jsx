import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  Info,
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default function Appointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    action: null,
    bookingId: null,
    status: null,
  });
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/appointments");
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }
        const data = await response.json();

        const appointments = data?.data || [];
        console.log("Fetched bookings:", appointments);

        const mappedAppointments = appointments.map((app) => ({
          _id: app.id,
          date: app.date,
          time: app.time,
          location: app.location,
          description: app.description,
          status: app.status,
          createdAt: app.createdAt,
          user: {
            name: app.Buyer?.fname || "Unknown",
            email: app.Buyer?.email || "N/A",
            phone: app.Buyer?.num || "N/A",
            id: app.Buyer?.id,
          },
          vehicle: {
            id: app.SellVehicle?.id,
            make: app.SellVehicle?.make || "Unknown",
            model: app.SellVehicle?.model || "Unknown",
            year: app.SellVehicle?.year,
            price: app.SellVehicle?.price,
            color: app.SellVehicle?.color,
            seller: "Shreya Auto",
            images:
              app.SellVehicle?.SellVehicleImages?.map((img) => img.image) || [],
            cc: app.SellVehicle?.cc,
            fuel: app.SellVehicle?.fuel,
            km: app.SellVehicle?.km,
            mile: app.SellVehicle?.mile,
            seat: app.SellVehicle?.seat,
            trans: app.SellVehicle?.trans,
            own: app.SellVehicle?.own,
            des: app.SellVehicle?.des,
            status: app.SellVehicle?.status,
          },
        }));

        // Sort bookings by creation date in descending order
        mappedAppointments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBookings(mappedAppointments);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleStatusUpdate = (event) => {
      const { id, status, updatedAppointment } = event.detail;

      // Update local state in Appointments
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id
            ? {
                ...booking,
                status,
              }
            : booking
        )
      );
    };

    window.addEventListener("appointmentStatusUpdated", handleStatusUpdate);

    return () => {
      // Cleanup the event listener
      window.removeEventListener(
        "appointmentStatusUpdated",
        handleStatusUpdate
      );
    };
  }, []);

  useEffect(() => {
    const handleNewAppointment = (event) => {
      const newAppointment = event.detail;

      const mappedAppointment = {
        _id: newAppointment.id,
        date: newAppointment.date,
        time: newAppointment.time,
        location: newAppointment.location,
        description: newAppointment.description,
        status: newAppointment.status,
        createdAt: newAppointment.createdAt,
        user: {
          name: app.Buyer?.fname || "Unknown",
          email: app.Buyer?.email || "N/A",
          phone: app.Buyer?.num || "N/A",
          id: app.Buyer?.id,
        },
        vehicle: {
          id: newAppointment.SellVehicle?.id,
          make: newAppointment.SellVehicle?.make || "Unknown",
          model: newAppointment.SellVehicle?.model || "Unknown",
          year: newAppointment.SellVehicle?.year,
          price: newAppointment.SellVehicle?.price,
          color: newAppointment.SellVehicle?.color,
          seller: "Shreya Auto",
          images:
            newAppointment.SellVehicle?.SellVehicleImages?.map(
              (img) => img.image
            ) || [],
          cc: newAppointment.SellVehicle?.cc,
          fuel: newAppointment.SellVehicle?.fuel,
          km: newAppointment.SellVehicle?.km,
          mile: newAppointment.SellVehicle?.mile,
          seat: newAppointment.SellVehicle?.seat,
          trans: newAppointment.SellVehicle?.trans,
          own: newAppointment.SellVehicle?.own,
          des: newAppointment.SellVehicle?.des,
          status: newAppointment.SellVehicle?.status,
        },
      };

      setBookings((prevBookings) => [mappedAppointment, ...prevBookings]);
    };

    // Listen for the custom event
    window.addEventListener("newAppointmentCreated", handleNewAppointment);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("newAppointmentCreated", handleNewAppointment);
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setCurrentImageIndex(0); // Reset image index when opening modal
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  const isUserBuyer = (appointment) => {
    if (Cookies.get("sauto").split("-")[0] === appointment.user.id) {
      return true;
    }
  };

  const updateBookingStatus = async (id, status, role) => {
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
            `Failed to update booking: ${response.statusText}`
        );
      }

      const updatedBooking = await response.json();
      console.log("Updated booking:", updatedBooking);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: status } : booking
        )
      );

      // Dispatch event to update other components
      window.dispatchEvent(
        new CustomEvent("appointmentStatusUpdated", {
          detail: { id, status, updatedBooking },
        })
      );

      // Show toast notification
      if (status === "confirmed") {
        toast.success("Booking confirmed successfully!");
      } else if (status === "cancelled") {
        toast.success("Booking has been cancelled.");
      }

      // Close the modal and reset confirmation dialog
      closeDetailsModal();
      setConfirmationDialog({
        isOpen: false,
        action: null,
        bookingId: null,
        status: null,
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(`Failed to update booking: ${error.message}`);
    }
  };

  const handleNextImage = () => {
    if (selectedBooking && selectedBooking.vehicle.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedBooking.vehicle.images.length - 1
          ? 0
          : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedBooking && selectedBooking.vehicle.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0
          ? selectedBooking.vehicle.images.length - 1
          : prevIndex - 1
      );
    }
  };

  const handleCancelClick = (booking, role) => {
    setBookingToCancel(booking, role);
    setIsCancelModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (!bookingToCancel) return;

    try {
      await fetch(
        `http://localhost:3000/api/appointments/${bookingToCancel._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
            reason: cancelReason,
            role: isUserBuyer(bookingToCancel) ? "buyer" : "seller",
          }),
        }
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingToCancel._id
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully");
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const filteredBookings = bookings
    .filter((booking) => booking.vehicle.seller === "Shreya Auto") // Filter by seller
    .filter((booking) => {
      const matchesSearch =
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || booking.status === filterStatus;

      return matchesSearch && matchesFilter;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pl-0 md:pl-64 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Appointment Management
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all vehicle booking requests
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Search by customer or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <div className="flex">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={() => {
                  const select = document.getElementById("status-filter");
                  select.click();
                }}
              >
                <Filter className="mr-2 h-5 w-5 text-gray-400" />
                <span className="hidden xs:inline">Filter by Status</span>
                <span className="xs:hidden">Filter</span>
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              </button>
              <select
                id="status-filter"
                className="absolute opacity-0 w-full h-full cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {paginatedBookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {paginatedBookings.map((booking) => (
                <li key={booking._id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center">
                        {booking.vehicle.images &&
                        booking.vehicle.images.length > 0 ? (
                          <img
                            src={`../../server/controllers${booking.vehicle.images[0]}`}
                            alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                            className="h-16 w-16 rounded-lg object-cover mr-4 flex-shrink-0"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-gray-200 mr-4 flex-shrink-0 flex items-center justify-center">
                            <Car className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {booking.user.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {booking.vehicle.make} {booking.vehicle.model} (
                            {booking.vehicle.year})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          aria-label="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {booking.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 sm:col-span-2">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {booking.location}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                      ? "bg-orange-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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
      </div>

      {/* Detailed View Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 z-10 overflow-y-auto pl-64">
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

            <div className="flex flex-col w-full transform text-left text-base transition md:inline-block md:max-w-2xl md:px-3 md:my-6 md:align-middle lg:max-w-3xl">
              <div className="w-full relative flex items-center bg-white px-3 pt-6 pb-4 overflow-hidden shadow-2xl sm:px-3 sm:pt-4 md:p-3 lg:p-4 rounded-t-lg md:rounded-lg">
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-500 md:right-3 md:top-3 lg:right-4 lg:top-4"
                  onClick={closeDetailsModal}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>

                <div className="w-full max-h-[70vh] overflow-y-auto grid grid-cols-1 gap-y-4 gap-x-3 items-start sm:grid-cols-12 lg:gap-x-4">
                  <div className="sm:col-span-12">
                    <h2 className="text-lg font-bold text-gray-900 sm:pr-8">
                      Booking Details
                    </h2>

                    <div className="bg-purple-50 p-2 rounded-lg my-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <div>
                          <p className="text-xs font-medium text-purple-800">
                            Booking ID
                          </p>
                          <p className="text-sm font-semibold text-purple-900">
                            {selectedBooking._id}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            selectedBooking.status
                          )}`}
                        >
                          {selectedBooking.status.charAt(0).toUpperCase() +
                            selectedBooking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {/* Customer Information */}
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <User className="h-3 w-3 mr-1 text-purple-600" />
                          Customer Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Name
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedBooking.user.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Email
                            </p>
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1 text-gray-400" />
                              <p className="text-sm text-gray-900">
                                {selectedBooking.user.email}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Phone
                            </p>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              <p className="text-sm text-gray-900">
                                {selectedBooking.user.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Information */}
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <Car className="h-3 w-3 mr-1 text-purple-600" />
                          Vehicle Information
                        </h4>

                        {/* Vehicle Images Gallery */}
                        {selectedBooking.vehicle.images &&
                        selectedBooking.vehicle.images.length > 0 ? (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Vehicle Images
                            </p>
                            <div className="relative">
                              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                                <img
                                  src={`../../server/controllers${selectedBooking.vehicle.images[currentImageIndex]}`}
                                  alt={`${selectedBooking.vehicle.make} ${selectedBooking.vehicle.model}`}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </div>
                              {selectedBooking.vehicle.images.length > 1 && (
                                <>
                                  <button
                                    onClick={handlePrevImage}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                                  >
                                    &#8249;
                                  </button>
                                  <button
                                    onClick={handleNextImage}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                                  >
                                    &#8250;
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Vehicle Image
                            </p>
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                              <Car className="h-12 w-12 text-gray-400" />
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Vehicle
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedBooking.vehicle.make}{" "}
                              {selectedBooking.vehicle.model} (
                              {selectedBooking.vehicle.year})
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Price
                              </p>
                              <p className="text-sm text-gray-900">
                                Rs. {selectedBooking.vehicle.price}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Color
                              </p>
                              <p className="text-sm text-gray-900">
                                {selectedBooking.vehicle.color}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Seller
                            </p>
                            <p className="text-sm text-gray-900">
                              {selectedBooking.vehicle.seller}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-purple-600" />
                          Appointment Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Date
                              </p>
                              <p className="text-sm text-gray-900">
                                {new Date(
                                  selectedBooking.date
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Time
                              </p>
                              <p className="text-sm text-gray-900">
                                {selectedBooking.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                Location
                              </p>
                              <p className="text-sm text-gray-900">
                                {selectedBooking.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <Info className="h-3 w-3 mr-1 text-purple-600" />
                          Additional Information
                        </h4>
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Description
                          </p>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedBooking.description ||
                              "No additional information provided."}
                          </p>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs font-medium text-gray-500">
                            Created At
                          </p>
                          <p className="text-sm text-gray-900">
                            {new Date(
                              selectedBooking.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                      {selectedBooking.status === "pending" &&
                        selectedBooking.user.name !== "Shreya Auto" && (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmationDialog({
                                isOpen: true,
                                action: "confirm",
                                bookingId: selectedBooking._id,
                                status: "confirmed",
                                role: isUserBuyer(selectedBooking)
                                  ? "buyer"
                                  : "seller",
                              });
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Confirm Booking
                          </button>
                        )}
                      {selectedBooking.status === "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCancelClick(
                              selectedBooking,
                              isUserBuyer(selectedBooking) ? "buyer" : "seller"
                            )
                          }
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <X className="mr-2 h-4 w-4" />
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
                      <Check className={`h-6 w-6 text-green-600`} />
                    ) : (
                      <X className={`h-6 w-6 text-red-600`} />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {confirmationDialog.action === "confirm"
                        ? "Confirm Booking"
                        : "Cancel Booking"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {confirmationDialog.action === "confirm"
                          ? "Are you sure you want to confirm this booking? This action cannot be undone."
                          : "Are you sure you want to cancel this booking? This action cannot be undone."}
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
                    updateBookingStatus(
                      confirmationDialog.bookingId,
                      confirmationDialog.status,
                      confirmationDialog.role
                    );
                  }}
                >
                  {confirmationDialog.action === "confirm"
                    ? "Confirm"
                    : "Cancel Booking"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() =>
                    setConfirmationDialog({
                      isOpen: false,
                      action: null,
                      bookingId: null,
                      status: null,
                    })
                  }
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
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel this booking?
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
                  Keep Booking
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
        autoClose={2000}
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
