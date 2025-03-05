"use client";

import { useState, useEffect } from "react";
import {
  Car,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Loader2,
  AlertCircle,
  DollarSign,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { subMonths, subYears } from "date-fns"; // Import date-fns for date manipulation

export default function AdminRentalVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [postedByFilter, setPostedByFilter] = useState("all");
  const [sortByFilter, setSortByFilter] = useState("default");

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedVehicleData, setUpdatedVehicleData] = useState({
    make: "",
    model: "",
    year: "",
    price: { hour: 0, day: 0, week: 0, month: 0 },
    specs: {
      seats: 0,
      doors: 0,
      transmission: "",
      fuel: "",
      mileage: 0,
      engine: "",
      power: 0,
    },
    features: "",
    description: "",
    numberPlate: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedVehicle, setViewedVehicle] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6;

  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/vehicles");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const { data } = await response.json();

      const transformedVehicles = data.map((vehicle) => ({
        _id: vehicle.id.toString(),
        make: vehicle.make || "Unknown",
        model: vehicle.model || "Unknown",
        year: vehicle.year || new Date().getFullYear(),
        price: {
          hour: vehicle.priceHour || 0,
          day: vehicle.priceDay || 0,
          week: vehicle.priceWeek || 0,
          month: vehicle.priceMonth || 0,
        },
        specs: {
          seats: vehicle.seats || 4,
          doors: vehicle.doors || 4,
          transmission: vehicle.transmission || "Automatic",
          fuel: vehicle.fuelType || "Petrol",
          mileage: vehicle.mileage || 0,
          engine: vehicle.engine || "N/A",
          power: vehicle.power || 0,
        },
        features: vehicle.features || "N/A",
        description: vehicle.description || "N/A",
        // Update this line to match the alias from your backend
        imagePreviewUrls: vehicle.rentVehicleImages
          ? vehicle.rentVehicleImages.map((img) =>
              img.image.startsWith("http")
                ? img.image
                : `http://localhost:3000/uploads/${img.image}`
            )
          : ["/placeholder.svg"],
        createdAt: vehicle.createdAt || new Date().toISOString(),
        status: vehicle.status || "available",
        postedBy: "admin",
        numberPlate: vehicle.numberPlate || "N/A",
        vehicle_images: vehicle.rentVehicleImages || [], // Update this reference too
      }));

      setVehicles(transformedVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError(error.message);
      toast.error(`Failed to load vehicles: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setVehicleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/vehicles/${vehicleToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setVehicles(
        vehicles.filter((vehicle) => vehicle._id !== vehicleToDelete)
      );
      setIsDeleteModalOpen(false);
      setVehicleToDelete(null);
      toast.success("Vehicle deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      }); // Updated toast message
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      }); // Updated toast message
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate("/admin/addvehicle");
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdatedVehicleData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      specs: vehicle.specs,
      features: vehicle.features,
      description: vehicle.description,
      numberPlate: vehicle.numberPlate,
    });
    setIsEditModalOpen(true);
  };

  const handleView = (vehicle) => {
    setViewedVehicle(vehicle);
    setIsViewModalOpen(true);
  };

  const handleUpdateVehicle = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/vehicles/${selectedVehicle._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVehicleData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update vehicle");
      }

      const updatedVehicle = await response.json();
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === selectedVehicle._id
            ? { ...vehicle, ...updatedVehicleData }
            : vehicle
        )
      );
      setIsEditModalOpen(false);
      toast.success("Vehicle updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      }); // Updated toast message
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      }); // Updated toast message
    }
  };

  const filteredVehicles = vehicles
    .filter((vehicle) => {
      const searchMatch =
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.year.toString().includes(searchTerm) ||
        vehicle.numberPlate.toLowerCase().includes(searchTerm.toLowerCase());

      const postedByMatch =
        postedByFilter === "all" ||
        (postedByFilter === "admin" && vehicle.postedBy === "admin") ||
        (postedByFilter === "user" && vehicle.postedBy !== "admin");

      const vehicleDate = new Date(vehicle.createdAt);
      let matchesDate = true;

      if (dateFilter === "lastMonth") {
        matchesDate = vehicleDate >= subMonths(new Date(), 1);
      } else if (dateFilter === "lastYear") {
        matchesDate = vehicleDate >= subYears(new Date(), 1);
      } else if (dateFilter === "custom") {
        const startDate = customDateRange.start
          ? new Date(customDateRange.start)
          : new Date(0);
        const endDate = customDateRange.end
          ? new Date(customDateRange.end)
          : new Date();
        matchesDate = vehicleDate >= startDate && vehicleDate <= endDate;
      }

      return searchMatch && postedByMatch && matchesDate;
    })
    .sort((a, b) => {
      switch (sortByFilter) {
        case "date-latest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-high":
          return (
            Number.parseFloat(b.price.day) - Number.parseFloat(a.price.day)
          );
        case "price-low":
          return (
            Number.parseFloat(a.price.day) - Number.parseFloat(b.price.day)
          );
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle
  );

  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const FilterButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
      <ToastContainer />
      {/* Ensure ToastContainer is included */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <div className="border-l-4 border-orange-500 pl-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Rental Vehicles
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your rental vehicle inventory
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between">
            <div className="relative w-full sm:w-auto flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles by make, model, year or plate..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-auto"
              >
                <option value="all">All Dates</option>
                <option value="lastMonth">Added Last Month</option>
                <option value="lastYear">Added Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              {dateFilter === "custom" && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) =>
                      setCustomDateRange({
                        ...customDateRange,
                        start: e.target.value,
                      })
                    }
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-auto"
                  />
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) =>
                      setCustomDateRange({
                        ...customDateRange,
                        end: e.target.value,
                      })
                    }
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-auto"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            <span className="ml-2 text-lg text-gray-600">
              Loading vehicles...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Error loading vehicles
              </h3>
              <p className="mt-1 text-red-700">{error}</p>
              <button
                onClick={fetchVehicles}
                className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || postedByFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Add your first rental vehicle to get started"}
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Add Vehicle</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleView(vehicle)}
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {vehicle.vehicle_images && vehicle.vehicle_images[0] ? (
                    <img
                      src={
                        vehicle.vehicle_images[0].image.startsWith("http")
                          ? vehicle.vehicle_images[0].image
                          : `../../server${vehicle.vehicle_images[0].image}`
                      }
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Car className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg font-medium">
                    Rs. {vehicle.price.day}/day
                  </div>
                  {vehicle.status === "sold" && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 rounded-br-lg font-medium">
                      Sold
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{vehicle.year}</span>
                        <span className="mx-2">•</span>
                        <Users className="h-4 w-4 mr-1" />
                        <span className="capitalize">{vehicle.postedBy}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-gray-500">Hourly</span>
                      <span className="font-semibold text-gray-900">
                        Rs. {vehicle.price.hour}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Seats:</span>
                      <span className="ml-1">{vehicle.specs.seats}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Fuel:</span>
                      <span className="ml-1">{vehicle.specs.fuel}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Trans:</span>
                      <span className="ml-1">{vehicle.specs.transmission}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Engine:</span>
                      <span className="ml-1">{vehicle.specs.engine}</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(vehicle);
                      }}
                      className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(vehicle._id);
                      }}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVehicles.length > 0 && (
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
      {isEditModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Edit Vehicle
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
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
                { label: "Number Plate", field: "numberPlate" },
                { label: "Price (Hour)", field: "price.hour" },
                { label: "Price (Day)", field: "price.day" },
                { label: "Price (Week)", field: "price.week" },
                { label: "Price (Month)", field: "price.month" },
                { label: "Seats", field: "specs.seats" },
                { label: "Doors", field: "specs.doors" },
                { label: "Transmission", field: "specs.transmission" },
                { label: "Fuel Type", field: "specs.fuel" },
                { label: "Mileage", field: "specs.mileage" },
                { label: "Engine", field: "specs.engine" },
                { label: "Power", field: "specs.power" },
                {
                  label: "Features (comma-separated)",
                  field: "features",
                  isTextarea: true,
                  fullWidth: true,
                },
                {
                  label: "Description",
                  field: "description",
                  isTextarea: true,
                  fullWidth: true,
                },
              ].map(({ label, field, isTextarea, fullWidth }) => (
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
                  {isTextarea ? (
                    <textarea
                      id={field}
                      value={
                        field.includes(".")
                          ? eval(`updatedVehicleData.${field}`)
                          : updatedVehicleData[field]
                      }
                      onChange={(e) =>
                        setUpdatedVehicleData((prev) => {
                          const updated = { ...prev };
                          if (field.includes(".")) {
                            const [parent, child] = field.split(".");
                            updated[parent][child] = e.target.value;
                          } else {
                            updated[field] = e.target.value;
                          }
                          return updated;
                        })
                      }
                      rows="3"
                      className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 text-sm sm:text-base"
                    ></textarea>
                  ) : (
                    <input
                      type="text"
                      id={field}
                      value={
                        field.includes(".")
                          ? eval(`updatedVehicleData.${field}`)
                          : updatedVehicleData[field]
                      }
                      onChange={(e) =>
                        setUpdatedVehicleData((prev) => {
                          const updated = { ...prev };
                          if (field.includes(".")) {
                            const [parent, child] = field.split(".");
                            updated[parent][child] = e.target.value;
                          } else {
                            updated[field] = e.target.value;
                          }
                          return updated;
                        })
                      }
                      className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 text-sm sm:text-base"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVehicle}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {isViewModalOpen && viewedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-md w-full max-w-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 px-4 py-3">
              <h2 className="text-xl font-bold text-gray-900">
                Vehicle Details
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Vehicle Image */}
                <div className="w-full sm:w-1/3 h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {viewedVehicle.vehicle_images &&
                  viewedVehicle.vehicle_images[0] ? (
                    <img
                      src={
                        viewedVehicle.vehicle_images[0].image.startsWith("http")
                          ? viewedVehicle.vehicle_images[0].image
                          : `../../server${viewedVehicle.vehicle_images[0].image}`
                      }
                      alt={`${viewedVehicle.make} ${viewedVehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {viewedVehicle.make} {viewedVehicle.model}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Year: {viewedVehicle.year} • Plate:{" "}
                        {viewedVehicle.numberPlate}
                      </p>
                    </div>
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-medium">
                      Rs. {viewedVehicle.price.day}/day
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Seats:</span>{" "}
                      {viewedVehicle.specs.seats}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Doors:</span>{" "}
                      {viewedVehicle.specs.doors}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        Transmission:
                      </span>{" "}
                      {viewedVehicle.specs.transmission}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Fuel:</span>{" "}
                      {viewedVehicle.specs.fuel}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Engine:</span>{" "}
                      {viewedVehicle.specs.engine}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        Mileage:
                      </span>{" "}
                      {viewedVehicle.specs.mileage}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Hourly</p>
                    <p className="font-bold">Rs. {viewedVehicle.price.hour}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Daily</p>
                    <p className="font-bold">Rs. {viewedVehicle.price.day}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Weekly</p>
                    <p className="font-bold">Rs. {viewedVehicle.price.week}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly</p>
                    <p className="font-bold">Rs. {viewedVehicle.price.month}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                <p className="text-sm text-gray-700">
                  {viewedVehicle.description || "No description available"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(viewedVehicle);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Edit className="h-4 w-4 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setVehicleToDelete(viewedVehicle._id);
                  setIsDeleteModalOpen(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this vehicle? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Vehicle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
