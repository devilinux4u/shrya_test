"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  CheckCircle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  User,
  Fuel,
  Settings,
  Gauge,
  Tag,
  Plus,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellVehicleForm from "../Components/SellVehicleForm";
import Cookies from "js-cookie";

// Replace the VehicleCard component with this improved version
function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onMarkAsSold,
  onViewDetails,
}) {
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden cursor-pointer"
      onClick={() => onViewDetails(vehicle)}
    >
      <div className="relative h-48 bg-gray-100">
        <img
          src={
            (vehicle.images &&
              vehicle.images.length > 0 &&
              `../../server/controllers${
                vehicle.images[0].image || "/placeholder.svg"
              }`) ||
            "/placeholder.svg"
          }
          alt={`${vehicle.make || "Unknown"} ${vehicle.model || ""}`}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            vehicle.status === "available"
              ? "bg-green-100 text-green-800"
              : vehicle.status === "sold"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {vehicle.status}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-medium text-red-600 mb-1">
          {vehicle.make || "Unknown"} {vehicle.model || "Model N/A"}
        </h3>

        <div className="space-y-1 mb-3 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Year:</p>
            <p className="text-sm font-medium">{vehicle.year || "Year N/A"}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Total Run:</p>
            <p className="text-sm font-medium">
              {vehicle.km ? vehicle.km.toLocaleString() : "N/A"} km
            </p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">Price:</p>
            <p className="text-base font-semibold text-orange-600">
              Rs. {vehicle.price ? vehicle.price.toLocaleString() : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex justify-between w-full pt-3 mt-2 border-t border-gray-100">
          <div className="flex-1 text-left">
            {vehicle.status === "available" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(vehicle);
                }}
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            )}
          </div>

          <div className="flex-1 text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(vehicle);
              }}
              className="flex items-center text-red-600 hover:text-red-800 transition-colors mx-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>

          <div className="flex-1 text-right">
            {vehicle.status !== "sold" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsSold(vehicle);
                }}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors ml-auto"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark as Sold
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Vehicle Details Modal Component
function VehicleDetailsModal({
  vehicle,
  onClose,
  onEdit,
  onDelete,
  onMarkAsSold,
}) {
  const [activeImage, setActiveImage] = useState(0);

  if (!vehicle) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Vehicle header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold">
                {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Calendar className="w-4 h-4" />
                <span>{vehicle.year}</span>
                <span className="mx-2">•</span>
                <Gauge className="w-4 h-4" />
                <span>
                  {vehicle.mile ? vehicle.mile.toLocaleString() : "N/A"} km
                </span>
                <span className="mx-2">•</span>
                <Tag className="w-4 h-4" />
                <span>{vehicle.own || "N/A"}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold text-orange-500">
                Rs. {vehicle.price ? vehicle.price.toLocaleString() : "N/A"}
              </div>
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

          {/* Image gallery and details side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Image gallery - takes 2/3 of the width on medium screens and up */}
            <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={
                    vehicle.images && vehicle.images.length > 0
                      ? `../../server/controllers${
                          vehicle.images[activeImage]?.image ||
                          "/placeholder.svg"
                        }`
                      : "/placeholder.svg"
                  }
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </div>
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {vehicle.images.map((img, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded ${
                        activeImage === index
                          ? "border-orange-500"
                          : "border-transparent"
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={`../../server/controllers${
                          img.image || "/placeholder.svg"
                        }`}
                        alt={`${vehicle.make} ${vehicle.model} thumbnail ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact information - takes 1/3 of the width on medium screens and up */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Engine</p>
                    <p className="font-medium">
                      {vehicle.cc || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Transmission</p>
                    <p className="font-medium">
                      {vehicle.trans || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Fuel Type</p>
                    <p className="font-medium">
                      {vehicle.fuel || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Mileage</p>
                    <p className="font-medium">
                      {vehicle.mile || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Seating Capacity</p>
                    <p className="font-medium">
                      {vehicle.seat || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Color</p>
                    <p className="font-medium">
                      {vehicle.color || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle details */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-gray-700">
                {vehicle.des || "No description provided."}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {vehicle.status !== "sold" && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(vehicle);
                }}
                className="flex-1 min-w-[120px] bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onDelete(vehicle);
              }}
              className="flex-1 min-w-[120px] bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
            {vehicle.status !== "sold" && (
              <button
                onClick={() => {
                  onClose();
                  onMarkAsSold(vehicle);
                }}
                className="flex-1 min-w-[120px] bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Sold
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 min-w-[120px] bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main MySales component
export default function MySales() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/vehicles/user/all/${
            Cookies.get("sauto").split("-")[0]
          }`
        ); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json(); // Read response as text

        // Update this line to correctly handle the array response from the updated API
        setVehicles(Array.isArray(data.data) ? data.data : []);

        console.log("Fetched vehicles:", data.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        // Initialize with empty array on error
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    price: "",
    fuel: "",
    trans: "",
    own: "",
    km: "",
    mile: "",
    seat: "",
    cc: "",
    des: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [viewedVehicle, setViewedVehicle] = useState(null);
  const [isSellVehicleFormOpen, setIsSellVehicleFormOpen] = useState(false); // State for SellVehicleForm modal

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdatedData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || "",
      price: vehicle.price,
      fuel: vehicle.fuel || "",
      trans: vehicle.trans || "",
      own: vehicle.own || "",
      km: vehicle.km || "",
      mile: vehicle.mile,
      seat: vehicle.seat || "",
      cc: vehicle.cc || "",
      des: vehicle.des || "",
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

      toast.success("Vehicle updated successfully!");
      setIsEditing(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle. Please try again.");
    }
  };

  const handleDeleteVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicle) return;

    await fetch(`http://localhost:3000/vehicles/delete/${selectedVehicle.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    setVehicles((prevVehicles) =>
      prevVehicles.filter((v) => v.id !== selectedVehicle.id)
    );
    setIsDeleteModalOpen(false);
    setSelectedVehicle(null);
    toast.success("Vehicle deleted successfully!");
  };

  const handleMarkAsSold = async (vehicle) => {
    await fetch(`http://localhost:3000/vehicles/sold/${vehicle.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    setVehicles((prevVehicles) =>
      prevVehicles.map((v) =>
        v.id === vehicle.id ? { ...v, status: "sold" } : v
      )
    );
    toast.success(`${vehicle.make} ${vehicle.model} marked as sold!`);
  };

  const handleViewDetails = (vehicle) => {
    setViewedVehicle(vehicle);
    setIsViewingDetails(true);
    // Prevent scrolling of the background when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeDetailsView = () => {
    setIsViewingDetails(false);
    setViewedVehicle(null);
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = "auto";
  };

  const handleSellVehicleClick = () => {
    setIsSellVehicleFormOpen(true);
  };

  const closeSellVehicleForm = () => {
    setIsSellVehicleFormOpen(false);
    document.body.style.overflow = "auto";
  };

  // Function to handle adding a new vehicle
  const handleAddVehicle = (newVehicle) => {
    setVehicles((prevVehicles) => [newVehicle, ...prevVehicles]);
    toast.success(
      `${newVehicle.make} ${newVehicle.model} listed successfully!`
    );
  };

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filter vehicles based on current filters and search query
  // Ensure vehicles is an array before filtering
  const filteredVehicles = Array.isArray(vehicles)
    ? vehicles.filter((vehicle) => {
        // Filter by status
        if (statusFilter !== "all" && vehicle.status !== statusFilter) {
          return false;
        }

        // Filter by search query
        if (searchTerm) {
          const query = searchTerm.toLowerCase();
          return (
            (vehicle.make && vehicle.make.toLowerCase().includes(query)) ||
            (vehicle.model && vehicle.model.toLowerCase().includes(query)) ||
            (vehicle.year && vehicle.year.toString().includes(query))
          );
        }

        return true;
      })
    : [];

  // Apply sorting
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      default:
        return 0;
    }
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedVehicles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setSortBy("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  useEffect(() => {
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      console.log(
        "Vehicle statuses:",
        vehicles.map((v) => v.status)
      );
      console.log("Current status filter:", statusFilter);
      console.log("Filtered count:", filteredVehicles.length);
    }
  }, [vehicles, statusFilter, filteredVehicles.length]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Show loading spinner while fetching data */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div> {/* Add a loader component or CSS */}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mt-12 max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Sales</h1>
            <button
              onClick={handleSellVehicleClick}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-md flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Sell Vehicle
            </button>
          </div>

          {/* Search Bar and Filter Options */}
          <div className="mb-6 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for vehicles..."
                className="w-full pl-10 pr-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Options */}
            <div className="p-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center text-gray-700 font-medium">
                <Filter className="w-5 h-5 mr-2" />
                Filter by:
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    statusFilter === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("available")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    statusFilter === "available"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => setStatusFilter("sold")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    statusFilter === "sold"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Sold
                </button>
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="mb-8 max-w-7xl mx-auto">
            {sortedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onEdit={handleEditVehicle}
                    onDelete={handleDeleteVehicle}
                    onMarkAsSold={handleMarkAsSold}
                    onViewDetails={handleViewDetails}
                  />
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
                  {searchTerm || statusFilter !== "all" || sortBy
                    ? "Try adjusting your filters or search terms"
                    : "You haven't listed any vehicles for sale yet"}
                </p>
                {(searchTerm || statusFilter !== "all" || sortBy) && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
                {!searchTerm && statusFilter === "all" && !sortBy && (
                  <button
                    onClick={() => setIsSellVehicleFormOpen(true)}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Sell Vehicle
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedVehicles.length > 0 && totalPages > 1 && (
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
                          fullWidth
                            ? "col-span-1 sm:col-span-2 lg:col-span-3"
                            : ""
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
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && selectedVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl overflow-hidden w-full max-w-md shadow-2xl">
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
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Details Modal */}
          {isViewingDetails && viewedVehicle && (
            <VehicleDetailsModal
              vehicle={viewedVehicle}
              onClose={closeDetailsView}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
              onMarkAsSold={handleMarkAsSold}
            />
          )}

          {/* Sell Vehicle Form Modal */}
          {isSellVehicleFormOpen && (
            <SellVehicleForm
              isOpen={isSellVehicleFormOpen}
              onClose={closeSellVehicleForm}
              onAddVehicle={handleAddVehicle}
            />
          )}
        </>
      )}
    </div>
  );
}
