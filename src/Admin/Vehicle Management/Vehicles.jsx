"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Check,
  X,
  Clock,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedVehicles, setDisplayedVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    price: "",
    des: "",
    km: "",
    fuel: "",
    trans: "",
    own: "",
    mile: "",
    seat: "",
    cc: "",
  });

  const navigate = useNavigate();

  // Add this new state variable near the top with your other state declarations
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Fetch vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API call
        // const response = await fetch('/api/vehicles')
        // const data = await response.json()

        // Simulating API response with sample data

        const response = await fetch(
          "http://localhost:3000/vehicles/admin/all"
        ); // replace with your backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setVehicles(data.msg); // Assuming the response contains vehicles in `msg` field
          setDisplayedVehicles(data.msg);
          setLoading(false);
        } else {
          console.error("Failed to fetch vehicles.");
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load vehicles. Please try again later.");
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Filter and sort vehicles
  // Filter and sort vehicles
  useEffect(() => {
    let filtered = [...vehicles];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply user/admin filter - FIXED: Now checks user role instead of username
    if (userFilter) {
      if (userFilter.toLowerCase() === "admin") {
        filtered = filtered.filter(
          (vehicle) => vehicle.user?.role?.toLowerCase() === "admin"
        );
      } else if (userFilter.toLowerCase() === "user") {
        filtered = filtered.filter(
          (vehicle) => vehicle.user?.role?.toLowerCase() === "user"
        );
      }
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (vehicle) => vehicle.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "oldest":
          filtered.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
          break;
        default:
          break;
      }
    }

    setDisplayedVehicles(filtered);
  }, [vehicles, searchTerm, userFilter, statusFilter, sortBy]);

  const handleAddVehicle = () => {
    navigate("/admin/addnewvehicles");
  };

  const handleViewDetails = (vehicle) => {
    const vehicleParams = new URLSearchParams({ id: vehicle.id });
    navigate(`/admin/viewdetails?${vehicleParams.toString()}`);
  };

  const handleEditVehicle = (vehicle) => {
    if (vehicle.status === "sold") return;

    setSelectedVehicle(vehicle);
    setUpdatedData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: vehicle.price,
      des: vehicle.des,
      km: vehicle.km,
      fuel: vehicle.fuel,
      trans: vehicle.trans,
      own: vehicle.own,
      mile: vehicle.mile,
      seat: vehicle.seat,
      cc: vehicle.cc,
    });
    setIsEditing(true);
  };

  const handleUpdateData = async () => {
    if (!selectedVehicle) return;

    try {
      const response = await fetch(
        `http://localhost:3000/vehicles/edit/${selectedVehicle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update vehicle");
      }

      const updatedVehicle = await response.json();

      // Update the local state with the edited vehicle
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.id === selectedVehicle.id
            ? { ...vehicle, ...updatedData }
            : vehicle
        )
      );

      setIsEditing(false);
      setSelectedVehicle(null);
      toast.success("Vehicle updated successfully!");
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle. Please try again.");
    }
  };

  // Replace the handleDeleteVehicle function with this updated version
  const handleDeleteVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  // Add this new function to handle the actual deletion
  const confirmDelete = async () => {
    if (!selectedVehicle) return;

    try {
      await fetch(
        `http://localhost:3000/vehicles/delete/${selectedVehicle.id}`,
        {
          method: "DELETE",
        }
      );

      // Update the local state
      setVehicles(vehicles.filter((v) => v.id !== selectedVehicle.id));
      setIsDeleteModalOpen(false);
      setSelectedVehicle(null);
      toast.success("Vehicle deleted successfully!");
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      toast.error("Failed to delete vehicle. Please try again.");
    }
  };

  // Add function to handle status change
  const handleStatusChange = (vehicle) => {
    setSelectedVehicle(vehicle);
    setNewStatus(vehicle.status === "available" ? "sold" : "available");
    setIsStatusModalOpen(true);
  };

  // Add function to confirm status change
  const confirmStatusChange = async () => {
    if (!selectedVehicle) return;

    try {
      const response = await fetch(
        `http://localhost:3000/vehicles/sold/${selectedVehicle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update vehicle status");
      }

      // Update the local state
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.id === selectedVehicle.id
            ? { ...vehicle, status: newStatus }
            : vehicle
        )
      );

      setIsStatusModalOpen(false);
      setSelectedVehicle(null);
      toast.success(`Vehicle marked as ${newStatus}!`);
    } catch (err) {
      console.error("Error updating vehicle status:", err);
      toast.error("Failed to update vehicle status. Please try again.");
    }
  };

  const clearAllFilters = () => {
    setUserFilter("");
    setStatusFilter("");
    setSortBy("");
    setSearchTerm("");
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedVehicles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(displayedVehicles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <div className="border-l-4 border-orange-500 pl-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Vehicle Management
            </h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex-1"></div>{" "}
          {/* Spacer to push the button to the right */}
          <button
            onClick={handleAddVehicle}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by make, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
          <div className="flex items-center text-gray-700 font-medium mb-4">
            <Filter className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-lg">Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* User Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Posted By
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setUserFilter("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !userFilter
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setUserFilter("admin")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    userFilter === "admin"
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => setUserFilter("user")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    userFilter === "user"
                      ? "bg-indigo-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  User
                </button>
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !statusFilter
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter("available")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    statusFilter === "available"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Check
                    className={`w-4 h-4 mr-1 ${
                      statusFilter === "available"
                        ? "text-white"
                        : "text-green-500"
                    }`}
                  />
                  Available
                </button>
                <button
                  onClick={() => setStatusFilter("sold")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    statusFilter === "sold"
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <X
                    className={`w-4 h-4 mr-1 ${
                      statusFilter === "sold" ? "text-white" : "text-red-500"
                    }`}
                  />
                  Sold
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Sort By
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy("")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    !sortBy
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setSortBy("price-asc")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "price-asc"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <DollarSign
                    className={`w-4 h-4 mr-1 ${
                      sortBy === "price-asc" ? "text-white" : "text-blue-500"
                    }`}
                  />
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortBy("price-desc")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "price-desc"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <DollarSign
                    className={`w-4 h-4 mr-1 ${
                      sortBy === "price-desc" ? "text-white" : "text-blue-500"
                    }`}
                  />
                  Price: High to Low
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "newest"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Calendar
                    className={`w-4 h-4 mr-1 ${
                      sortBy === "newest" ? "text-white" : "text-blue-500"
                    }`}
                  />
                  Date: Latest
                </button>
                <button
                  onClick={() => setSortBy("oldest")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
                    sortBy === "oldest"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Clock
                    className={`w-4 h-4 mr-1 ${
                      sortBy === "oldest" ? "text-white" : "text-blue-500"
                    }`}
                  />
                  Date: Oldest
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(userFilter || statusFilter || sortBy || searchTerm) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Vehicles Grid */}
        <div className="flex-1">
          {error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : loading ? (
            <p className="text-center text-gray-600">Loading vehicles...</p>
          ) : displayedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden cursor-pointer"
                  onClick={() => handleViewDetails(vehicle)}
                >
                  {/* Image Container - Fixed Height */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        (vehicle.images &&
                          vehicle.images.length > 0 &&
                          `../../server/controllers${
                            vehicle.images[0].image || "/placeholder.svg"
                          }`) ||
                        "/placeholder.svg"
                      }
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          vehicle.status === "available"
                            ? "bg-green-100 text-green-800"
                            : vehicle.status === "sold"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                  </div>

                  {/* Content Container - Equal Height */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-red-600 font-medium text-lg mb-1">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
                        <p className="text-gray-600 text-sm flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          Year: {vehicle.year}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          Total Run: {vehicle.km.toLocaleString()} km
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Posted by: {vehicle.user?.fname || "Unknown"}
                      </p>
                      <p className="text-xl font-semibold text-gray-800 mb-3">
                        Rs. {vehicle.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                      {vehicle.status === "available" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditVehicle(vehicle);
                          }}
                          className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVehicle(vehicle);
                        }}
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                      {vehicle.status !== "sold" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(vehicle);
                          }}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Sold
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No vehicles found
              </h3>
              <p className="text-gray-500">
                {searchTerm || userFilter || statusFilter || sortBy
                  ? "Try adjusting your filters or search terms"
                  : "There are no vehicles to display"}
              </p>
              {(searchTerm || userFilter || statusFilter || sortBy) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {displayedVehicles.length > 0 && (
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

      {/* Edit Vehicle Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Edit Vehicle
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Make", field: "make" },
                { label: "Model", field: "model" },
                { label: "Year", field: "year" },
                { label: "Color", field: "color" },
                { label: "Price", field: "price" },
                {
                  label: "Fuel Type",
                  field: "fuel",
                  isDropdown: true,
                  options: ["Petrol", "Diesel", "Electric", "Hybrid"],
                },
                {
                  label: "Transmission",
                  field: "trans",
                  isDropdown: true,
                  options: ["Manual", "Automatic"],
                },
                {
                  label: "Ownership",
                  field: "own",
                  isDropdown: true,
                  options: ["First", "Second", "Third", "Other"],
                },
                { label: "KM", field: "km" },
                { label: "Mileage", field: "mile" },
                { label: "Seats", field: "seat" },
                { label: "Engine CC", field: "cc" },
                {
                  label: "Description",
                  field: "des",
                  isTextarea: true,
                  fullWidth: true,
                },
              ].map(
                ({
                  label,
                  field,
                  isTextarea,
                  isDropdown,
                  options,
                  fullWidth,
                }) => (
                  <div
                    key={field}
                    className={`mb-2 ${
                      fullWidth ? "col-span-1 sm:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {label}
                    </label>
                    {isDropdown ? (
                      <select
                        id={field}
                        value={updatedData[field]}
                        onChange={(e) =>
                          setUpdatedData((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 text-sm sm:text-base"
                      >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : isTextarea ? (
                      <textarea
                        id={field}
                        value={updatedData[field]}
                        onChange={(e) =>
                          setUpdatedData((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        rows="3"
                        className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 text-sm sm:text-base"
                      ></textarea>
                    ) : (
                      <input
                        type="text"
                        id={field}
                        value={updatedData[field]}
                        onChange={(e) =>
                          setUpdatedData((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 text-sm sm:text-base"
                      />
                    )}
                  </div>
                )
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateData}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-md shadow-2xl transform transition-all animate-scaleIn">
            <div className="bg-red-50 p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Vehicle
              </h3>
              <p className="text-gray-600 mb-1">
                Are you sure you want to delete this vehicle?
              </p>
              <p className="text-lg font-medium text-red-600 mb-6">
                {selectedVehicle.make} {selectedVehicle.model} (
                {selectedVehicle.year})
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {isStatusModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-md shadow-2xl transform transition-all animate-scaleIn">
            <div
              className={`${
                newStatus === "sold" ? "bg-red-50" : "bg-green-50"
              } p-6 text-center`}
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                {newStatus === "sold" ? (
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                ) : (
                  <Check className="h-8 w-8 text-green-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Change Vehicle Status
              </h3>
              <p className="text-gray-600 mb-1">
                Are you sure you want to mark this vehicle as{" "}
                <span
                  className={
                    newStatus === "sold"
                      ? "text-red-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  {newStatus}
                </span>
                ?
              </p>
              <p className="text-lg font-medium text-blue-600 mb-6">
                {selectedVehicle.make} {selectedVehicle.model} (
                {selectedVehicle.year})
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className={`px-4 py-2 ${
                    newStatus === "sold"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  } rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    newStatus === "sold"
                      ? "focus:ring-blue-500"
                      : "focus:ring-green-500"
                  } flex items-center justify-center`}
                >
                  {newStatus === "sold" ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Sold
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Available
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
