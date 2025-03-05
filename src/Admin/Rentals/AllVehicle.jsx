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
  Check,
  X,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Dummy data for vehicles
const dummyVehicles = [
  {
    _id: "v1",
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    price: {
      hour: 500,
      day: 2500,
      week: 15000,
      month: 50000,
    },
    specs: {
      seats: 5,
      doors: 4,
      transmission: "automatic",
      fuel: "petrol",
      mileage: 18,
      engine: "1.8L",
      power: 140,
    },
    features: "GPS, Bluetooth, Sunroof, Leather Seats, Climate Control",
    description:
      "A reliable and comfortable sedan perfect for city driving and long trips. Excellent fuel economy and smooth ride.",
    imagePreviewUrls: ["/placeholder.svg?height=400&width=600"],
    createdAt: "2023-10-15T10:30:00Z",
    status: "available",
    postedBy: "admin",
  },
  {
    _id: "v2",
    make: "Honda",
    model: "Civic",
    year: 2021,
    price: {
      hour: 550,
      day: 2700,
      week: 16000,
      month: 55000,
    },
    specs: {
      seats: 5,
      doors: 4,
      transmission: "automatic",
      fuel: "petrol",
      mileage: 16,
      engine: "1.5L Turbo",
      power: 180,
    },
    features:
      "Apple CarPlay, Android Auto, Sunroof, Alloy Wheels, Backup Camera",
    description:
      "Sporty and efficient compact sedan with modern technology features and excellent handling.",
    imagePreviewUrls: ["/placeholder.svg?height=400&width=600"],
    createdAt: "2023-11-05T14:20:00Z",
    status: "available",
    postedBy: "admin",
  },
  {
    _id: "v3",
    make: "Suzuki",
    model: "Swift",
    year: 2023,
    price: {
      hour: 400,
      day: 2000,
      week: 12000,
      month: 40000,
    },
    specs: {
      seats: 5,
      doors: 4,
      transmission: "manual",
      fuel: "petrol",
      mileage: 22,
      engine: "1.2L",
      power: 90,
    },
    features: "Bluetooth, USB Charging, Air Conditioning, Power Windows",
    description:
      "Compact and fuel-efficient hatchback, perfect for city driving and easy parking.",
    imagePreviewUrls: ["/placeholder.svg?height=400&width=600"],
    createdAt: "2023-12-10T09:15:00Z",
    status: "available",
    postedBy: "user",
  },
  {
    _id: "v4",
    make: "Hyundai",
    model: "Tucson",
    year: 2022,
    price: {
      hour: 700,
      day: 3500,
      week: 21000,
      month: 70000,
    },
    specs: {
      seats: 5,
      doors: 5,
      transmission: "automatic",
      fuel: "diesel",
      mileage: 14,
      engine: "2.0L",
      power: 185,
    },
    features:
      "Panoramic Sunroof, Leather Seats, Navigation, Wireless Charging, 360 Camera",
    description:
      "Stylish and spacious SUV with advanced safety features and comfortable interior.",
    imagePreviewUrls: ["/placeholder.svg?height=400&width=600"],
    createdAt: "2023-09-20T11:45:00Z",
    status: "sold",
    postedBy: "admin",
  },
  {
    _id: "v5",
    make: "Kia",
    model: "Sportage",
    year: 2023,
    price: {
      hour: 750,
      day: 3700,
      week: 22000,
      month: 75000,
    },
    specs: {
      seats: 5,
      doors: 5,
      transmission: "automatic",
      fuel: "hybrid",
      mileage: 20,
      engine: "1.6L Hybrid",
      power: 226,
    },
    features:
      "Smart Cruise Control, Lane Keep Assist, Blind Spot Detection, Premium Audio",
    description:
      "Modern hybrid SUV with cutting-edge technology and excellent fuel efficiency.",
    imagePreviewUrls: ["/placeholder.svg?height=400&width=600"],
    createdAt: "2024-01-05T16:30:00Z",
    status: "available",
    postedBy: "user",
  },
  {
    _id: "v6",
    make: "Mazda",
    model: "CX-5",
    year: 2022,
    price: {
      hour: 650,
      day: 3200,
      week: 19000,
      month: 65000,
    },
    specs: {
      seats: 5,
      doors: 5,
      transmission: "automatic",
      fuel: "petrol",
      mileage: 15,
      engine: "2.5L",
      power: 187,
    },
    features:
      "Bose Sound System, Heated Seats, Power Tailgate, Apple CarPlay, Android Auto",
    description:
      "Premium crossover SUV with elegant design and engaging driving dynamics.",
    imagePreviewUrls: ["/placeholder.svg?height=400&width=600"],
    createdAt: "2023-08-15T13:20:00Z",
    status: "sold",
    postedBy: "admin",
  },
];

export default function AdminRentalVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [postedByFilter, setPostedByFilter] = useState("all");
  const [sortByFilter, setSortByFilter] = useState("default");

  useEffect(() => {
    // Simulate API call with dummy data
    setTimeout(() => {
      setVehicles(dummyVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  const fetchVehicles = async () => {
    // For demo purposes, just reset to dummy data
    setLoading(true);
    setTimeout(() => {
      setVehicles(dummyVehicles);
      setLoading(false);
    }, 1000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        // Simulate API call
        setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
        toast.success("Vehicle deleted successfully");
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        toast.error("Failed to delete vehicle");
      }
    }
  };

  const handleAddNew = () => {
    navigate("/admin/add-rental-vehicle");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-rental-vehicle/${id}`);
  };

  const handleView = (id) => {
    navigate(`/admin/view-rental-vehicle/${id}`);
  };

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      // Search filter
      const searchMatch =
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.year.toString().includes(searchTerm);

      // Posted By filter
      const postedByMatch =
        postedByFilter === "all" ||
        vehicle.postedBy === postedByFilter.toLowerCase();

      return searchMatch && postedByMatch;
    })
    .sort((a, b) => {
      // Sort
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
          return new Date(b.createdAt) - new Date(a.createdAt); // Default to newest
      }
    });

  // Filter button component
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
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <div className="border-l-4 border-[#ff6b00] pl-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Rental Vehicles
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your rental vehicle inventory
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-auto flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddNew}
                className="flex items-center px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>

          {/* Filters Section - Styled like the image */}
          <div className="bg-white rounded-xl shadow-md mb-6 p-5">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 mr-2 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="space-y-6">
              {/* Posted By Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Posted By
                </h3>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={postedByFilter === "all"}
                    onClick={() => setPostedByFilter("all")}
                  >
                    All Users
                  </FilterButton>
                  <FilterButton
                    active={postedByFilter === "admin"}
                    onClick={() => setPostedByFilter("admin")}
                  >
                    Admin
                  </FilterButton>
                  <FilterButton
                    active={postedByFilter === "user"}
                    onClick={() => setPostedByFilter("user")}
                  >
                    User
                  </FilterButton>
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Sort By
                </h3>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={sortByFilter === "default"}
                    onClick={() => setSortByFilter("default")}
                  >
                    Default
                  </FilterButton>
                  <FilterButton
                    active={sortByFilter === "price-low"}
                    onClick={() => setSortByFilter("price-low")}
                  >
                    <DollarSign className="h-4 w-4 mr-1 inline" /> Price: Low to
                    High
                  </FilterButton>
                  <FilterButton
                    active={sortByFilter === "price-high"}
                    onClick={() => setSortByFilter("price-high")}
                  >
                    <DollarSign className="h-4 w-4 mr-1 inline" /> Price: High
                    to Low
                  </FilterButton>
                  <FilterButton
                    active={sortByFilter === "date-latest"}
                    onClick={() => setSortByFilter("date-latest")}
                  >
                    <Calendar className="h-4 w-4 mr-1 inline" /> Date: Latest
                  </FilterButton>
                  <FilterButton
                    active={sortByFilter === "date-oldest"}
                    onClick={() => setSortByFilter("date-oldest")}
                  >
                    <Clock className="h-4 w-4 mr-1 inline" /> Date: Oldest
                  </FilterButton>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#ff6b00] animate-spin" />
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
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {vehicle.imagePreviewUrls && vehicle.imagePreviewUrls[0] ? (
                      <img
                        src={vehicle.imagePreviewUrls[0] || "/placeholder.svg"}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-[#ff6b00] text-white px-3 py-1 rounded-bl-lg font-medium">
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
                        <span className="ml-1">
                          {vehicle.specs.transmission}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Engine:</span>
                        <span className="ml-1">{vehicle.specs.engine}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleView(vehicle._id)}
                        className="text-gray-600 hover:text-[#ff6b00] transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(vehicle._id)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && filteredVehicles.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-md bg-[#ff6b00] text-white">
                  1
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
