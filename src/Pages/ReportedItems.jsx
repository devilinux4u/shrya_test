"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Package,
  X,
  RefreshCw,
  Edit,
  Car,
  Trash2,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLostAndFoundForm from "../Components/UserLostAndFoundForm";

const ReportedItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    vehicleMake: "",
    vehicleModel: "",
    numberPlate: "",
  });
  const itemsPerPage = 6;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/lost-and-found/all2/${
            Cookies.get("sauto").split("-")[0]
          }`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.data) {
          console.log("Fetched items:", data.data);
          setItems(data.data);
          setFilteredItems(data.data);
        } else {
          console.error("Invalid data format:", data);
          setItems([]);
          setFilteredItems([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on status and search query
  useEffect(() => {
    if (!items || items.length === 0) {
      setFilteredItems([]);
      return;
    }

    console.log("Filtering with:", { activeFilter, searchQuery });

    let result = [...items];

    // Filter by status
    if (activeFilter !== "all") {
      if (activeFilter === "lost") {
        result = result.filter(
          (item) => item.type === "lost" && item.status !== "resolved"
        );
      } else if (activeFilter === "found") {
        result = result.filter(
          (item) => item.type === "found" && item.status !== "resolved"
        );
      } else if (activeFilter === "resolved") {
        result = result.filter((item) => item.status === "resolved");
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.id && String(item.id).toLowerCase().includes(query)) ||
          (item.description &&
            item.description.toLowerCase().includes(query)) ||
          (item.location && item.location.toLowerCase().includes(query)) ||
          (item.type && item.type.toLowerCase().includes(query)) ||
          (item.make && item.make.toLowerCase().includes(query)) ||
          (item.model && item.model.toLowerCase().includes(query)) ||
          (item.nplate && item.nplate.toLowerCase().includes(query))
      );
    }

    console.log("Filtered results:", result);
    setFilteredItems(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeFilter, searchQuery, items]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Get status badge color and icon
  const getStatusBadge = (status, type) => {
    if (status === "resolved") {
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
        label: "Resolved",
      };
    }

    if (type === "lost") {
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        icon: <AlertTriangle className="w-4 h-4 mr-1" />,
        label: "Lost",
      };
    }

    return {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: <Package className="w-4 h-4 mr-1" />,
      label: "Found",
    };
  };

  // Handle status change
  const handleStatusChange = async (itemId) => {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/lost-and-found/resolve/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, status: "resolved" } : item
        )
      );

      // Close modal if open
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem(null);
      }

      toast.success("Status updated to resolved successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update item status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    setSelectedItemId(itemId);
    setIsDeleting(false); // Reset the deleting state
    setShowDeleteConfirmation(true); // Show the confirmation modal
  };

  // Add this new function to handle the actual deletion after confirmation
  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/lost-and-found/${selectedItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Update local state
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== selectedItemId)
      );

      // Close modals
      setShowDeleteConfirmation(false);
      if (selectedItem && selectedItem.id === selectedItemId) {
        setIsViewing(false);
        setSelectedItem(null);
      }

      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdateData = async (itemId) => {
    if (!updatedData) {
      toast.error("No item selected");
      return;
    }
    if (!itemId) {
      toast.error("No item ID provided");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/lost-and-found/edit/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedData.title,
            description: updatedData.description,
            location: updatedData.location,
            date: updatedData.date,
            vehicleMake: updatedData.vehicleMake,
            vehicleModel: updatedData.vehicleModel,
            numberPlate: updatedData.numberPlate,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update item");
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...updatedData } : item
        )
      );

      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...updatedData } : item
        )
      );

      toast.success("Item updated successfully!");
      setIsEditing(false);
      setUpdatedData({
        title: "",
        description: "",
        location: "",
        date: "",
        vehicleMake: "",
        vehicleModel: "",
        numberPlate: "",
      });
    } catch (error) {
      toast.error(error.message || "Error updating item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Add ToastContainer here */}
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reported Items</h1>
          <p className="mt-2 text-gray-600">
            Track and manage your lost and found reports
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
            <div
              className={`sm:flex gap-2 ${
                showFilters ? "flex" : "hidden"
              } flex-wrap`}
            >
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("lost")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "lost"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setActiveFilter("found")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "found"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Found
              </button>
              <button
                onClick={() => setActiveFilter("resolved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "resolved"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>

        {/* Items List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "No items match your search criteria."
                : activeFilter !== "all"
                ? `You don't have any ${activeFilter} items.`
                : "You haven't reported any items yet."}
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Report an Item
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => {
                const statusBadge = getStatusBadge(item.status, item.type);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    onClick={() => {
                      setIsViewing(true);
                      setSelectedItem(item);
                    }}
                  >
                    <div className="relative">
                      <img
                        src={
                          (item.images &&
                            item.images[0] &&
                            `../../server${
                              item.images[0].imageUrl || "/placeholder.svg"
                            }`) ||
                          "/placeholder.svg"
                        }
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}
                        >
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <span className="text-sm font-medium text-gray-500">
                          #{item.id}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{item.location}</span>
                        </div>
                        {(item.make || item.model || item.nplate) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Car className="w-4 h-4 mr-2 text-gray-400" />
                            <span>
                              {item.make} {item.model}
                              {item.nplate && ` (${item.nplate})`}
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        {item.status !== "resolved" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click event
                              setIsEditing(true);
                              setSelectedItemId(item.id);
                              setUpdatedData({
                                title: item.title,
                                description: item.description,
                                location: item.location,
                                date: item.createdAt,
                                vehicleMake: item.make || "",
                                vehicleModel: item.model || "",
                                numberPlate: item.nplate || "",
                              });
                            }}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        )}
                        {item.status !== "resolved" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click event
                              handleStatusChange(item.id);
                            }}
                            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click event
                            handleDeleteItem(item.id);
                          }}
                          disabled={isDeleting}
                          className={`flex items-center text-red-600 hover:text-red-800 transition-colors ${
                            isDeleting ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isDeleting ? (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                          ? "bg-blue-600 text-white"
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
          </>
        )}
      </div>

      {/* Item Detail Modal */}
      {isViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
              {/* Images */}
              <div className="md:w-1/2 bg-gray-50 p-4 md:p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    {selectedItem.title}
                  </h2>
                  <button
                    onClick={() => {
                      setIsViewing(false);
                      setSelectedItem(null);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {/* Main image */}
                <div className="mb-4 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
                  <img
                    src={
                      (selectedItem.images &&
                        selectedItem.images.length > 0 &&
                        `../../server${
                          selectedItem.images[0].imageUrl || "/placeholder.svg"
                        }`) ||
                      "/placeholder.svg"
                    }
                    alt={selectedItem.title}
                    className="w-full h-64 object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                    id="main-image"
                  />
                </div>

                {/* Thumbnails */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedItem.images.map((image, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-md overflow-hidden border-2 hover:border-blue-500 transition-all"
                        onClick={() => {
                          document.getElementById(
                            "main-image"
                          ).src = `../../server${
                            image.imageUrl || "/placeholder.svg"
                          }`;
                        }}
                      >
                        <img
                          src={`../../server${
                            image.imageUrl || "/placeholder.svg"
                          }`}
                          alt={`${selectedItem.title} - image ${index + 1}`}
                          className="w-full h-16 object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/*Details */}
              <div className="md:w-1/2 p-4 md:p-6 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Report #{selectedItem.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedItem.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : selectedItem.type === "lost"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedItem.status === "resolved" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : selectedItem.type === "lost" ? (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      ) : (
                        <Package className="w-3 h-3 mr-1" />
                      )}
                      {selectedItem.status === "resolved"
                        ? "Resolved"
                        : selectedItem.type === "lost"
                        ? "Lost"
                        : "Found"}
                    </span>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Report Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Date Reported</p>
                        <p className="text-sm font-medium">
                          {formatDate(selectedItem.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium">
                          {selectedItem.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Vehicle Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.make && (
                        <div>
                          <p className="text-xs text-gray-500">Make</p>
                          <p className="text-sm font-medium">
                            {selectedItem.make}
                          </p>
                        </div>
                      )}
                      {selectedItem.model && (
                        <div>
                          <p className="text-xs text-gray-500">Model</p>
                          <p className="text-sm font-medium">
                            {selectedItem.model}
                          </p>
                        </div>
                      )}
                      {selectedItem.nplate && (
                        <div>
                          <p className="text-xs text-gray-500">Number Plate</p>
                          <p className="text-sm font-medium">
                            {selectedItem.nplate}
                          </p>
                        </div>
                      )}
                      {!selectedItem.make &&
                        !selectedItem.model &&
                        !selectedItem.nplate && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">
                              No vehicle information provided
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedItem.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      onClick={() => handleDeleteItem(selectedItem.id)}
                      disabled={isDeleting}
                      className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 flex items-center ${
                        isDeleting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isDeleting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </button>
                    {selectedItem.status !== "resolved" && (
                      <button
                        onClick={() => handleStatusChange(selectedItem.id)}
                        disabled={isUpdating}
                        className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 flex items-center ${
                          isUpdating ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Resolved
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit modal */}
      {isEditing && updatedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Edit Reported Item
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
                { label: "Title", field: "title" },
                {
                  label: "Description",
                  field: "description",
                  isTextarea: true,
                },
                { label: "Location", field: "location" },
                { label: "Date", field: "date", isDate: true },
                { label: "Vehicle Make", field: "vehicleMake" },
                { label: "Vehicle Model", field: "vehicleModel" },
                { label: "Number Plate", field: "numberPlate" },
              ].map(({ label, field, isTextarea, isDate }) => (
                <div key={field} className="mb-2">
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}
                  </label>
                  {isTextarea ? (
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
                  ) : isDate ? (
                    <input
                      type="date"
                      id={field}
                      value={
                        updatedData[field]
                          ? new Date(updatedData[field])
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setUpdatedData((prev) => ({
                          ...prev,
                          [field]: new Date(e.target.value).toISOString(),
                        }))
                      }
                      className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 text-sm sm:text-base"
                    />
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
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateData(selectedItemId)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 flex items-center justify-center w-full sm:w-auto"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating Action Button for reporting items */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed right-6 bottom-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors z-10 flex items-center justify-center"
          aria-label="Report an item"
        >
          <Package className="h-6 w-6" />
        </button>
      )}
      {/* LostAndFoundForm Modal */}
      <UserLostAndFoundForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddItem={(newItem) => {
          setItems((prevItems) => [newItem, ...prevItems]);
          setFilteredItems((prevItems) => [newItem, ...prevItems]);
          setIsFormOpen(false);
          toast.success("Item reported successfully!");
        }}
      />
    </div>
  );
};

export default ReportedItems;
