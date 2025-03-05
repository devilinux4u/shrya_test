"use client";

// Add custom breakpoint for extra small screens
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
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
} from "lucide-react";

export default function Appointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch bookings data from your API
    const fetchBookings = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:3000/bookings");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookings(data.bookings || mockBookings); // Use mock data for preview
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings(mockBookings); // Use mock data if fetch fails
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toggleExpand = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const updateBookingStatus = async (id, status) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:3000/api/bookings/${id}/status`, // Ensure the endpoint matches your backend
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedBooking = await response.json();

      // Update local state with the updated booking
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id
            ? { ...booking, status: updatedBooking.status }
            : booking
        )
      );

      // If the updated booking is currently selected, update it
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking((prevSelected) => ({
          ...prevSelected,
          status: updatedBooking.status,
        }));
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleNextImage = (images) => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = (images) => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
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
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pl-64 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search by customer or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <div className="flex">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <li key={booking._id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center">
                        <img
                          src={
                            booking.vehicle.image || "/placeholder-image.jpg"
                          }
                          alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                          className="h-16 w-16 rounded-lg object-cover mr-4 flex-shrink-0"
                        />
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
                          className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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

            {/* This element is to trick the browser into centering the modal contents. */}
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

                <div className="w-full grid grid-cols-1 gap-y-4 gap-x-3 items-start sm:grid-cols-12 lg:gap-x-4">
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
                      {/* Adjusted Customer Information */}
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

                      {/* Adjusted Vehicle Information */}
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
                                  src={
                                    selectedBooking.vehicle.images[
                                      currentImageIndex
                                    ]
                                  }
                                  alt={`${selectedBooking.vehicle.make} ${selectedBooking.vehicle.model}`}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </div>
                              <button
                                onClick={() =>
                                  handlePrevImage(
                                    selectedBooking.vehicle.images
                                  )
                                }
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                              >
                                &#8249;
                              </button>
                              <button
                                onClick={() =>
                                  handleNextImage(
                                    selectedBooking.vehicle.images
                                  )
                                }
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                              >
                                &#8250;
                              </button>
                            </div>
                          </div>
                        ) : selectedBooking.vehicle.image ? (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Vehicle Image
                            </p>
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                              <img
                                src={
                                  selectedBooking.vehicle.image ||
                                  "/placeholder.svg"
                                }
                                alt={`${selectedBooking.vehicle.make} ${selectedBooking.vehicle.model}`}
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        ) : null}

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

                      {/* Adjusted Booking Details */}
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

                      {/* Adjusted Additional Information */}
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
                      {selectedBooking.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              updateBookingStatus(
                                selectedBooking._id,
                                "confirmed"
                              );
                              closeDetailsModal();
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Confirm Booking
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateBookingStatus(
                                selectedBooking._id,
                                "cancelled"
                              );
                              closeDetailsModal();
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </button>
                        </>
                      )}
                      {selectedBooking.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => {
                            updateBookingStatus(
                              selectedBooking._id,
                              "completed"
                            );
                            closeDetailsModal();
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Completed
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
        </div>
      )}
    </div>
  );
}

// Mock data for preview purposes
const mockBookings = [
  {
    _id: "b1001",
    date: "2023-04-20",
    time: "10:00 AM",
    location: "Shreya Auto Enterprises, Pragati Marga, Kathmandu",
    description:
      "I would like to test drive the vehicle before making a decision.",
    status: "pending",
    createdAt: "2023-04-15T10:30:00Z",
    user: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+977 9801234567",
    },
    vehicle: {
      make: "Toyota",
      model: "Fortuner",
      year: 2021,
      price: "8500000",
      color: "White",
      seller: "Shreya Auto",
      images: [
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
    },
  },
  {
    _id: "b1002",
    date: "2023-04-21",
    time: "2:30 PM",
    location: "Kathmandu Auto Gallery, New Baneshwor",
    description: "Looking for financing options. Will bring documents.",
    status: "confirmed",
    createdAt: "2023-04-16T14:20:00Z",
    user: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+977 9847654321",
    },
    vehicle: {
      make: "Honda",
      model: "City",
      year: 2022,
      price: "4200000",
      color: "Silver",
      seller: "Kathmandu Auto Gallery",
      images: [
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
    },
  },
  {
    _id: "b1003",
    date: "2023-04-18",
    time: "11:15 AM",
    location: "Shreya Auto Enterprises, Pragati Marga, Kathmandu",
    description: "Need to check the vehicle's condition and service history.",
    status: "completed",
    createdAt: "2023-04-14T09:45:00Z",
    user: {
      name: "Anil Thapa",
      email: "anil.thapa@example.com",
      phone: "+977 9812345678",
    },
    vehicle: {
      make: "Hyundai",
      model: "Creta",
      year: 2020,
      price: "3800000",
      color: "Blue",
      seller: "Shreya Auto",
      images: [
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
    },
  },
  {
    _id: "b1004",
    date: "2023-04-22",
    time: "4:00 PM",
    location: "Customer's Home, Baluwatar, Kathmandu",
    description: "Requested home visit to inspect the vehicle.",
    status: "cancelled",
    createdAt: "2023-04-17T16:10:00Z",
    user: {
      name: "Sunita Rai",
      email: "sunita.rai@example.com",
      phone: "+977 9861234567",
    },
    vehicle: {
      make: "Kia",
      model: "Seltos",
      year: 2021,
      price: "4500000",
      color: "Red",
      seller: "Premium Motors",
      images: [
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
    },
  },
  {
    _id: "b1005",
    date: "2023-04-23",
    time: "1:00 PM",
    location: "Shreya Auto Enterprises, Pragati Marga, Kathmandu",
    description: "Interested in the vehicle's off-road capabilities.",
    status: "pending",
    createdAt: "2023-04-18T11:30:00Z",
    user: {
      name: "Bikash Shrestha",
      email: "bikash.shrestha@example.com",
      phone: "+977 9823456789",
    },
    vehicle: {
      make: "Mahindra",
      model: "Thar",
      year: 2022,
      price: "5600000",
      color: "Black",
      seller: "Shreya Auto",
      images: [
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
        `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
      ],
      image: `https://source.unsplash.com/random/800x600?car,${Math.random()}`,
    },
  },
];
