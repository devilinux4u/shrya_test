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
  XCircle,
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
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

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

        console.log(data);

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
    toast.success("Wishlist request submitted successfully!");
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
          `http://localhost:3000/wishlist/${itemToDelete.id}`, // Correct endpoint
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
        `http://localhost:3000/wishlist/edit/${selectedItem.id}`, // Correct endpoint
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

      const updatedItem = await response.json();

      // Update the local state with the edited item
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

  const handleCancelClick = (item) => {
    setSelectedItem(item);
    setIsCancelModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (!selectedItem) return;

    setIsCancelling(true);

    try {
      // Simulate cancellation API call
      await fetch(`http://localhost:3000/wishlist/${selectedItem.id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: cancelReason,
          vehicle: selectedItem,
        }),
      });

      // Update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id
            ? { ...item, status: "cancelled", cancelReason }
            : item
        )
      );

      toast.success("Item cancelled successfully");
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling item:", error);
      toast.error("Failed to cancel item. Please try again.");
    } finally {
      setIsCancelling(false);
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
          <div className="p-4 flex flex-wrap items-center gap-4">
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

              <button
                onClick={() => handleStatusFilterChange("available")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  statusFilter === "available"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                Arrived
              </button>

              <button
                onClick={() => handleStatusFilterChange("pending")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  statusFilter === "pending"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                Pending
              </button>

              <button
                onClick={() => handleStatusFilterChange("cancelled")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  statusFilter === "cancelled"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                Cancelled
              </button>
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
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/WishlistVehicleDetail/${item.id}`)}
                >
                  <div className="relative">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? `../../server${item.images[0].imageUrl}`
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
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "available" ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Arrived
                          </>
                        ) : item.status === "pending" ? (
                          <>
                            <Clock className="w-4 h-4 mr-1" />
                            Pending
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Cancelled
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

                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                      {item.status !== "cancelled" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(item);
                            }}
                            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelClick(item);
                            }}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                      {item.status === "cancelled" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item);
                          }}
                          className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      )}
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
      {isEditing && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Edit Wishlist Item
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Make", field: "make", fullWidth: true },
                { label: "Model", field: "model" },
                { label: "KM Run", field: "kmRun" },
                {
                  label: "Fuel Type",
                  field: "fuelType",
                  isDropdown: true,
                  options: ["Petrol", "Diesel", "Electric", "Hybrid"],
                },
                { label: "Year", field: "year" },
                { label: "Color", field: "color" },
                { label: "Budget", field: "budget" },
                {
                  label: "Description",
                  field: "description",
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
                    className={`mb-2 ${
                      fullWidth ? "col-span-1 sm:col-span-2" : ""
                    }`}
                    key={field}
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
                        className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
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
                        className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
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
                        className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
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

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Cancel Wishlist Item
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
                  Are you sure you want to cancel your wishlist request for{" "}
                  <span className="font-medium">
                    {selectedItem.make} {selectedItem.model}
                  </span>
                  ?
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
                  Keep Item
                </button>
                <button
                  onClick={confirmCancellation}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourList;
