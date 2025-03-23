"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2, MapPin, Calendar, CheckCircle, XCircle, AlertTriangle, Eye, Clock, Edit3, Filter, Phone, MessageSquare, X, User } from 'lucide-react'
import LostAndFoundForm from "../../Components/LostAndFoundForm"
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function LostAndFound() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUserRole, setCurrentUserRole] = useState("Admin"); // Simulate current user role
  const [filteredItems, setFilteredItems] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/lost-and-found/all");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setItems(data.data || []); // Ensure data.items is an array
        setFilteredItems(data.data || []);
      } catch (err) {
        console.error("Error fetching lost and found items:", err);
        setError(err.message);
        toast.error(`Failed to load items: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (userFilter) {
      filtered = filtered.filter((item) => item.postedBy.role.toLowerCase() === userFilter.toLowerCase());
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  }, [searchTerm, userFilter, statusFilter, items]);

  // Helper functions for status display
  const getStatusColor = (status) => {
    switch (status) {
      case "lost":
        return "bg-yellow-100 text-yellow-800";
      case "found":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "lost":
        return <Clock className="w-4 h-4 mr-1" />;
      case "found":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "resolved":
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return <AlertTriangle className="w-4 h-4 mr-1" />;
    }
  };

  // Update item status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/lost-and-found/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

<<<<<<< HEAD
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedItem = await response.json();
      setItems(items.map((item) => (item.id === id ? updatedItem : item)));
      toast.success(`Item status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating item status:", err);
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/lost-and-found/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setItems(items.filter((item) => item.id !== id));
      setShowDeleteConfirm(null);
      toast.success("Item deleted successfully");
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(`Failed to delete item: ${err.message}`);
    }
  };

  // Add new item
  const handleAddItemSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const uid = Cookies.get("sauto")?.split("-")[0];
      if (!uid) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      formData.append("id", uid);

      const response = await fetch("http://localhost:3000/api/lost-and-found", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Lost and Found report submitted successfully!");
        setItems([...items, data.item]);
        setShowAddItem(false);
      } else {
        toast.error("Failed to submit the report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(`Failed to submit report: ${error.message}`);
    }
  };

  // Check if current user can edit an item (only admins can edit)
  const canEdit = (item) => {
    return currentUserRole === "Admin";
  };

  // Check if current user can contact the reporter (only contact if reporter is a user, not an admin)
  const canContact = (item) => {
    return item.postedBy.role === "User" && item.postedBy.contact;
  };

  return (
    <div className="min-h-screen bg-gray-100 ml-64 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Lost and Found</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Filter by User/Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Filter by Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="resolved">Resolved</option>
            </select>
          <button
            onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
          </div>
        </div>
        </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || userFilter || statusFilter
              ? "Try adjusting your search or filters"
              : "Start by adding a lost or found item"}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddItem(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </button>
          </div>
          
          {/* Clear Filters Button */}
          {(statusFilter || userFilter) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setStatusFilter("");
                  setUserFilter("");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Items Grid */}
      {!isLoading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              <img
                  src={(item.images && item.images[0] && `../../server${item.images[0].imageUrl}`) || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status.toUpperCase()}</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>

                    {canEdit(item) && (
                      <button
                        onClick={() => setShowAddItem(true)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Edit Item"
                      >
                        <Edit3 className="w-5 h-5 text-gray-600" />
                      </button>
                    )}

                    {item.status !== "resolved" && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, "resolved")}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          title="Mark as Resolved"
                        >
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </button>

                        {canEdit(item) && (
                          <button
                            onClick={() => setShowDeleteConfirm(item.id)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            title="Delete Item"
                          >
                            <Trash2 className="w-5 h-5 text-gray-600" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>
                      Posted by: {item.user.fname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No items found message */}
      {items.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter || userFilter
              ? "Try adjusting your filters or search terms"
              : "There are no lost and found items to display"}
          </p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <LostAndFoundForm isOpen={showAddItem} onClose={() => setShowAddItem(false)} onSubmit={handleAddItemSubmit} />
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">{selectedItem.name}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-600 text-sm">Location</h3>
                    <p className="text-xl font-medium">{selectedItem.location}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Date Found</h3>
                    <p className="text-xl font-medium">{selectedItem.dateFound}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Description</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Status</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedItem.status
                      )}`}
                    >
                      {getStatusIcon(selectedItem.status)}
                      <span className="ml-1">{selectedItem.status.toUpperCase()}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-600 text-sm">Reporter</h3>
                    <p className="text-gray-700">
                      {selectedItem.postedBy.name} ({selectedItem.postedBy.role})
                      {selectedItem.postedBy.contact && canContact(selectedItem) && (
                        <span className="ml-2 text-sm text-blue-600">{selectedItem.postedBy.contact}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="relative bg-gray-100 rounded-lg">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="w-full h-[300px] md:h-[400px] object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8 justify-end">
              {canContact(selectedItem) && (
                <>
                  <button
                    onClick={() => handleCallReporter(selectedItem)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Reporter
                  </button>
                  <button
                    onClick={() => handleSendSMS(selectedItem)}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    SMS Reporter
                  </button>
                </>
              )}

              {canEdit(selectedItem) && (
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setShowAddItem(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Item
                </button>
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => deleteItem(showDeleteConfirm)}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}