"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Phone,
  MessageSquare,
  X,
  Car,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLostAndFoundForm from "../Components/UserLostAndFoundForm";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LostAndFound = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [items, setItems] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  const checkCookiesAvailable = () => {
    const cookie = Cookies.get("sauto");
    if (cookie) {
      try {
        const userData = JSON.parse(cookie);
        setCurrentUserId(userData.id);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    // Fetch items from the backend
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/lost-and-found/all"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setItems(data.data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to load lost and found items.");
        setItems([]); // Set empty array on error
      }
    };

    fetchItems();
    checkCookiesAvailable(); // Initialize currentUserId
  }, []);

  // Filter items based on current filters and search query
  const filteredItems = items.filter((item) => {
    // Filter by type (all/lost/found/resolved)
    if (currentFilter !== "all") {
      if (currentFilter === "resolved") {
        if (item.status !== "resolved") return false;
      } else {
        if (item.type !== currentFilter || item.status === "resolved")
          return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        (item.make && item.make.toLowerCase().includes(query)) ||
        (item.model && item.model.toLowerCase().includes(query)) ||
        (item.nplate && item.nplate.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleContact = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setIsContactModalOpen(true);
  };

  const nextImage = () => {
    if (
      !selectedItem ||
      !selectedItem.images ||
      selectedItem.images.length <= 1
    )
      return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedItem.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (
      !selectedItem ||
      !selectedItem.images ||
      selectedItem.images.length <= 1
    )
      return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedItem.images.length - 1 : prevIndex - 1
    );
  };

  const handleCallReporter = () => {
    if (selectedItem?.user?.num) {
      // Use tel: protocol to initiate a phone call
      window.location.href = `tel:${selectedItem.user.num}`;
    } else {
      toast.error("Reporter contact information is not available.");
    }
  };

  const handleSendSMS = () => {
    if (selectedItem?.user?.num) {
      // Use sms: protocol to open SMS app
      window.location.href = `sms:${selectedItem.user.num}`;
    } else {
      toast.error("Reporter contact information is not available.");
    }
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    // Optional: add a small delay before clearing the selected item
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  };

  const toggleModal = () => {
    if (checkCookiesAvailable()) {
      setIsModalOpen(!isModalOpen);
    } else {
      navigate("/Login");
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setCurrentPage(1);

    // Show toast notification for filter change
    let message = "";
    if (filter === "all") {
      message = `Showing all ${items.length} items`;
    } else if (filter === "resolved") {
      const count = items.filter((item) => item.status === "resolved").length;
      message = `Showing ${count} resolved items`;
    } else {
      const count = items.filter(
        (item) => item.type === filter && item.status !== "resolved"
      ).length;
      message = `Showing ${count} ${filter} items`;
    }
  };

  // Function to handle adding a new lost and found item
  const handleAddItem = async (newItem) => {
    const itemWithId = {
      ...newItem,
      id: Date.now(),
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "active",
    };

    try {
      const response = await fetch("/api/lost-and-found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemWithId),
      });

      if (response.ok) {
        const addedItem = await response.json();
        setItems([addedItem, ...items]);

        toast.success(`Your ${newItem.type} item report has been submitted!`, {
          icon: newItem.type === "lost" ? "🔍" : "✅",
        });
      } else {
        toast.error("Failed to submit the item report.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to submit the item report.");
    }
  };

  // Check if current user is the reporter of the selected item
  const isCurrentUserReporter =
    selectedItem && currentUserId === selectedItem.uid;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />

      {/* Header */}
      <h1 className="mt-12 text-4xl font-bold mb-4">
        <span className="text-blue-600">Lost</span> &{" "}
        <span className="text-blue-600">Found</span>
      </h1>

      {/* Report Item Button */}
      <div className="mb-6">
        <button
          onClick={toggleModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          Report Item
        </button>
      </div>

      {/* Search and Filter Options */}
      <div className="mb-8 max-w-6xl mx-auto">
        <div className=" p-4 flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for lost or found items..."
              className="w-full pl-10 pr-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("lost")}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "lost"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => handleFilterChange("found")}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentFilter === "found"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Found
            </button>
          </div>
        </div>
      </div>

      {/* Lost and Found Items */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleContact(item)}
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
                <div className="absolute top-4 right-4">
                  {item.status === "resolved" && (
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolved
                    </span>
                  )}
                </div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.type === "lost"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.type === "lost" ? "Lost" : "Found"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{item.location}</span>
                  </div>
                  {item.make && (
                    <div className="flex items-center text-gray-600">
                      <Car className="w-4 h-4 mr-2" />
                      <span>
                        {item.make} {item.model}
                        {item.nplate && ` (${item.nplate})`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Reported on: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">
              No items match your current filter or search.
            </p>
            <button
              onClick={() => {
                handleFilterChange("all");
                setSearchQuery("");
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Show all items
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
                        ? "bg-blue-600 text-white font-medium"
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

      {/* LostAndFoundForm Modal */}
      <UserLostAndFoundForm
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleAddItem}
      />

      {/* Contact Reporter Modal */}
      {isContactModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeContactModal}
          ></div>
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-4xl w-full mx-4 z-10 relative">
            {/* Close button */}
            <button
              onClick={closeContactModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side - Details */}
              <div className="overflow-y-auto max-h-[70vh]">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  {selectedItem.title}
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-600 text-sm">Reporter Name</h3>
                    <p className="text-xl font-medium">
                      {selectedItem.user.fname || "Anonymous"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-600 text-sm">
                      {selectedItem.type === "lost" ? "Lost" : "Found"} Date
                    </h3>
                    <p className="text-xl font-medium">
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-600 text-sm">
                      {selectedItem.type === "lost" ? "Lost" : "Found"} Location
                    </h3>
                    <p className="text-xl font-medium">
                      {selectedItem.location}
                    </p>
                  </div>

                  {selectedItem.make && (
                    <div>
                      <h3 className="text-gray-600 text-sm">Vehicle Make</h3>
                      <p className="text-xl font-medium">{selectedItem.make}</p>
                    </div>
                  )}

                  {selectedItem.model && (
                    <div>
                      <h3 className="text-gray-600 text-sm">Vehicle Model</h3>
                      <p className="text-xl font-medium">
                        {selectedItem.model}
                      </p>
                    </div>
                  )}

                  {selectedItem.nplate && (
                    <div>
                      <h3 className="text-gray-600 text-sm">Number Plate</h3>
                      <p className="text-xl font-medium">
                        {selectedItem.nplate}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-gray-600 text-sm">Contact</h3>
                    <p className="text-xl font-medium">
                      {selectedItem.user.num || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-600 text-sm">Description</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-600 text-sm">Report Date</h3>
                    <p className="text-gray-700">
                      {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Image carousel */}
              <div>
                <div className="relative bg-gray-100 rounded-lg">
                  <img
                    src={
                      (selectedItem.images &&
                        selectedItem.images[currentImageIndex] &&
                        `../../server${
                          selectedItem.images[currentImageIndex].imageUrl ||
                          "/placeholder.svg"
                        }`) ||
                      "/placeholder.svg"
                    }
                    alt={selectedItem.title}
                    className="w-full h-[300px] md:h-[400px] object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  {selectedItem.images && selectedItem.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Image dots */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {selectedItem.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          currentImageIndex === index
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleCallReporter}
                disabled={isCurrentUserReporter}
                className={`flex-1 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isCurrentUserReporter
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Phone className="w-5 h-5" />
                Call Reporter
              </button>
              <button
                onClick={handleSendSMS}
                disabled={isCurrentUserReporter}
                className={`flex-1 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isCurrentUserReporter
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Send SMS
              </button>
              <button
                onClick={closeContactModal}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFound;
