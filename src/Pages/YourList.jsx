"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Car,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Filter,
  Loader2,
  Edit,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WishlistForm from "../Components/WishlistForm";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const YourList = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [items, setItems] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    make: "",
    model: "",
    kmRun: "",
    fuelType: "",
    year: "",
    color: "",
    budget: "",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data from backend
  useEffect(() => {
    const fetchWishlistItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userId = Cookies.get("sauto")?.split("-")[0];
        if (!userId) {
          throw new Error("User not authenticated");
        }

        const response = await fetch(
          `http://localhost:3000/wishlist/${userId}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist items:", err);
        setError("Failed to load your wishlist. Please try again later.");
        toast.error("Failed to load your wishlist. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  // Handle new wishlist item addition
  const handleAddWishlistItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
    setIsModalOpen(false);
    toast.success("Vehicle added to your wishlist!");
  };

  // Filter items based on status filter and search query
  const filteredItems = items.filter((item) => {
    // Filter by status (available/pending)
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !item.make?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.model?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleBook = (id) => {
    navigate(`/VehicleBooking?vid=${id}`);
  };

  const toggleModal = () => {
    if (!Cookies.get("sauto")) {
      navigate("/login");
      return;
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3000/wishlist/delete/${itemToDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        setItems(items.filter((item) => item.id !== itemToDelete.id));
        setIsDeleteModalOpen(false);

        toast.success(
          `${itemToDelete.make} ${itemToDelete.model} has been removed from your wishlist`
        );

        setItemToDelete(null);
      } catch (err) {
        console.error("Failed to delete wishlist item:", err);
        toast.error("Failed to delete item. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setDropdownOpen(null);
    setCurrentPage(1);

    let message = "";
    if (status === "all") {
      message = "Showing all vehicles";
    } else {
      message = `Showing ${
        status === "available" ? "Arrived" : "Pending"
      } vehicles`;
    }

    toast.info(message);
  };

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".filter-dropdown")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setUpdatedData({
      make: item.make || "",
      model: item.model || "",
      kmRun: item.kmRun || "",
      fuelType: item.fuelType || "",
      year: item.year || "",
      color: item.color || "",
      budget: item.budget || "",
      description: item.description || "",
    });
    setIsEditing(true);
  };

  const handleUpdateData = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch(
        `http://localhost:3000/wishlist/edit/${selectedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const data = await response.json();

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id ? { ...item, ...updatedData } : item
        )
      );

      toast.success("Item updated successfully!");
      setIsEditing(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
        theme="light"
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="mt-12 text-4xl font-bold mb-4">
          <span className="text-orange-500">Your </span>
          <span className="font-mono"> List</span>
        </h1>

        {/* Wish Vehicle Button */}
        <div className="mb-6">
          <button
            onClick={toggleModal}
            className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
            disabled={isLoading}
          >
            Wish Vehicle
          </button>
        </div>

        {/* Filter Options */}
        <div className="mb-8">
          <div className="p-4 flex flex-wrap items-center gap-4 bg-white rounded-lg shadow-sm">
            {/* Search Bar */}
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by make or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 relative">
              <div className="flex items-center text-gray-700 font-medium">
                <Filter className="w-5 h-5 mr-2" />
                Filter by:
              </div>
              <button
                onClick={() => handleStatusFilterChange("all")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  statusFilter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                All
              </button>

              <div className="relative filter-dropdown">
                <button
                  onClick={() =>
                    setDropdownOpen(dropdownOpen === "status" ? null : "status")
                  }
                  className={`px-4 py-2 rounded-full transition-colors flex items-center ${
                    statusFilter !== "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={isLoading}
                >
                  Status
                  <ChevronLeft
                    className={`w-4 h-4 ml-1 transform transition-transform ${
                      dropdownOpen === "status" ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </button>

                {dropdownOpen === "status" && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-md z-10 w-40 py-2 border border-gray-100">
                    <button
                      onClick={() => handleStatusFilterChange("all")}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                        statusFilter === "all"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : ""
                      }`}
                    >
                      All Status
                    </button>
                    <button
                      onClick={() => handleStatusFilterChange("available")}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                        statusFilter === "available"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : ""
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Arrived
                    </button>
                    <button
                      onClick={() => handleStatusFilterChange("pending")}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                        statusFilter === "pending"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : ""
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Pending
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Wishlist Items */}
        {!isLoading && !error && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? `http://localhost:3000${item.images[0].imageUrl}`
                          : "/placeholder.svg"
                      }
                      alt={`${item.make} ${item.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "available" ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Arrived
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-1" />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {item.make} {item.model}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.description?.substring(0, 60)}...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Car className="w-4 h-4 mr-2" />
                        <span>{item.kmRun || "N/A"} km</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{item.year || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color || "gray" }}
                        />
                        <span>{item.color || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span>Rs. {item.budget || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Added: {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {item.status === "available" && (
                        <button
                          onClick={() => handleBook(item.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() =>
                          navigate(`/WishlistVehicleDetail/${item.id}`)
                        }
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
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

            {filteredItems.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? "No vehicles match your search criteria"
                    : "Your wishlist is currently empty"}
                </p>
                <button
                  onClick={toggleModal}
                  className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                >
                  {searchQuery ? "Clear Search" : "Add Vehicle"}
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredItems.length > 0 && (
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
      </div>

      {/* WishlistForm Modal */}
      <WishlistForm
        isOpen={isModalOpen}
        onClose={toggleModal}
        onAddItem={handleAddWishlistItem}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 z-10">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {itemToDelete?.make} {itemToDelete?.model}
              </span>{" "}
              from your wishlist?
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Vehicle</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  value={updatedData.make}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, make: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={updatedData.model}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, model: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={updatedData.year}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, year: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={updatedData.color}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, color: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Km Run
                  </label>
                  <input
                    type="number"
                    value={updatedData.kmRun}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, kmRun: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (Rs)
                  </label>
                  <input
                    type="number"
                    value={updatedData.budget}
                    onChange={(e) =>
                      setUpdatedData({ ...updatedData, budget: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={updatedData.fuelType}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, fuelType: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={updatedData.description}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full p-2 border rounded-md"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourList;
