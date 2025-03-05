"use client";

import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  Fuel,
  Gauge,
  Settings,
  Phone,
  Mail,
  X,
  Edit,
  Trash2,
  AlertTriangle,
  Save,
  CheckCircle,
} from "lucide-react";

export default function ViewDetails() {
  const { id } = useParams();
  // const location = useLocation()
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [loading, setLoading] = useState(!location.state?.vehicle);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const vehicleId = params.get("id");

  // Fetch vehicle data if not provided in location state
  useEffect(() => {
    if (!vehicle) {
      const fetchVehicleDetails = async () => {
        try {
          setLoading(true);
          // Replace with your actual API call
          // const response = await fetch(`/api/vehicles/${id}`)
          // const data = await response.json()

          // Simulating API response with sample data
          const response = await fetch(
            `http://localhost:3000/vehicles/one/${vehicleId}`
          ); // Replace with your actual endpoint
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success) {
            setVehicle(data.msg);
            setLoading(false); // Set the vehicle data to the state
          } else {
            console.error("Vehicle not found");
          }
        } catch (err) {
          console.error("Error fetching vehicle details:", err);
          setError("Failed to load vehicle details. Please try again later.");
          setLoading(false);
        }
      };

      fetchVehicleDetails();
    } else {
      // If we have the vehicle from location state but it might be missing some fields
      // that are needed for the detailed view, we can supplement it here
      if (!vehicle.description) {
        setVehicle({
          ...vehicle,
          description:
            "Detailed information about this vehicle. Features a powerful engine, spacious interior, and advanced safety features.",
          features: [
            "Leather Seats",
            "Sunroof",
            "Navigation System",
            "Bluetooth",
            "Backup Camera",
            "Parking Sensors",
          ],
          specifications: {
            engine: "Standard Engine",
            transmission: "Automatic",
            fuelType: "Petrol",
            mileage: "10 km/l",
            seatingCapacity: 5,
            color: "Silver",
          },
        });
      }
    }
  }, [id, vehicle]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = () => {
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
    try {
      const response = await fetch(
        `http://localhost:3000/vehicles/edit/${vehicle.id}`,
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
      setVehicle((prev) => ({ ...prev, ...updatedData }));
      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle. Please try again.");
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteVehicle = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:3000/vehicles/delete/${vehicle.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }

      // Show success message briefly before navigating
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setIsDeleting(false);
      alert("Failed to delete vehicle. Please try again.");
    }
  };

  const handleBookNow = () => {
    navigate(`/book/${vehicle.id}`);
  };

  if (loading) {
    return (
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Vehicle not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Back button */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4F46E5] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vehicles
        </button>

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
              <span>{vehicle.km.toLocaleString()} km</span>
              <span className="mx-2">•</span>
              <Tag className="w-4 h-4" />
              <span>{vehicle.own}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-[#4F46E5]">
              Rs. {vehicle.price.toLocaleString()}
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

        {/* Image gallery and Contact information side by side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Image gallery - takes 2/3 of the width on medium screens and up */}
          <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={
                  vehicle.images && vehicle.images.length > 0
                    ? `../../server/controllers${vehicle.images[activeImage].image}`
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
                        ? "border-[#4F46E5]"
                        : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={`../../server/controllers${img.image}`}
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
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Posted By</p>
                  <p className="font-medium">{vehicle.user.fname}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Posted On</p>
                  <p className="font-medium">{formatDate(vehicle.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{vehicle.user.num}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#4F46E5]" />
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{vehicle.user.email}</p>
                </div>
              </div>
            </div>

            {/* Quick contact buttons */}
            {vehicle.status === "available" && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={() =>
                    (window.location.href = `tel:${vehicle.user.num}`)
                  }
                  className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Seller
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `sms:${vehicle.user.num}`)
                  }
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send SMS
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{vehicle.des}</p>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-500 text-sm">Engine</p>
                  <p className="font-medium">{vehicle.cc || "Not specified"}</p>
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

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {vehicle.status === "available" && (
            <button
              className="flex-1 bg-[#4F46E5] text-white px-6 py-3 rounded-lg hover:bg-[#4338CA] transition-colors flex items-center justify-center gap-2"
              onClick={handleEditClick}
            >
              <Edit className="w-5 h-5" />
              Edit Vehicle
            </button>
          )}
          <button
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-5 h-5" />
            Delete Vehicle
          </button>
          {vehicle.user.uname !== "ShreyaAuto" && (
            <button
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              onClick={handleBookNow}
            >
              <CheckCircle className="w-5 h-5" />
              Book Now
            </button>
          )}
        </div>

        {/* Edit Vehicle Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all animate-scaleIn">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Edit className="w-6 h-6 mr-2 text-[#4F46E5]" />
                  Edit Vehicle
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                </button>
              </div>

              {saveSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-800">Success!</h3>
                    <p className="text-green-700">
                      Vehicle information has been updated successfully.
                    </p>
                  </div>
                </div>
              ) : (
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
                            className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring focus:ring-[#4F46E5] focus:ring-opacity-50 text-sm sm:text-base"
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
                            className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring focus:ring-[#4F46E5] focus:ring-opacity-50 text-sm sm:text-base"
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
                            className="p-2 border-[1px] block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4F46E5] focus:ring focus:ring-[#4F46E5] focus:ring-opacity-50 text-sm sm:text-base"
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateData}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors flex items-center"
                  disabled={saveSuccess}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-xl overflow-hidden w-full max-w-md shadow-2xl transform transition-all animate-scaleIn">
              <div className="bg-red-50 p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Vehicle
                </h3>
                <p className="text-gray-600 mb-1">
                  Are you sure you want to delete this vehicle?
                </p>
                <p className="text-lg font-medium text-red-600 mb-6">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteVehicle}
                    className="px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
