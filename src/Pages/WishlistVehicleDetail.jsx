import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Car,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Palette,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishlistVehicleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    description: "",
  });

  // Fetch vehicle data based on ID in the URL
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);

        if (!id) {
          throw new Error("Vehicle ID not found");
        }

        const response = await fetch(
          `http://localhost:3000/wishlist/one/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle data");
        }

        const vehicleData = await response.json();
        setVehicle(vehicleData.data);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        toast.error("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleBook = () => {
    setShowBookingModal(true);
  };

  const nextImage = () => {
    if (vehicle && vehicle.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle && vehicle.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Back button handler
  const handleBackToList = () => {
    navigate("/YourList");
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = Cookies.get("sauto").split("-")[0];
      const payload = {
        userId,
        vehicleId: vehicle?.id,
        ...bookingDetails,
      };

      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create appointment: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setShowBookingModal(false);
      navigate("/UserAppointments");
    } catch (error) {
      console.error("Error submitting booking:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
        <p className="text-gray-600 mb-6">
          The vehicle you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleBackToList}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Back to Your List
        </button>
      </div>
    );
  }

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

      <div className="max-w-6xl mx-auto mt-12">
        {/* Back button */}
        <button
          onClick={handleBackToList}
          className="mb-4 flex items-center text-gray-600 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Your List
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header with status badge */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">
                {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex items-center gap-3">
                {vehicle.purpose && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.purpose === "buy"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {vehicle.purpose === "buy" ? "Buy" : "Rent"}
                  </span>
                )}
                {vehicle.status === "available" ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Arrived
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              {vehicle.make} {vehicle.model} • {vehicle.year || "Year N/A"}
            </p>
          </div>

          {/* Image gallery */}
          <div className="relative">
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <div className="relative h-[400px] w-full">
                  <img
                    src={`../../server${vehicle.images[currentImageIndex].imageUrl}`}
                    alt={`${vehicle.make} ${vehicle.model} - Image ${
                      currentImageIndex + 1
                    }`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                      e.target.onerror = null;
                    }}
                  />

                  {/* Image navigation arrows */}
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {vehicle.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail navigation */}
                {vehicle.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? "border-orange-500 scale-105"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={`../../server${image.imageUrl}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                            e.target.onerror = null;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-[200px] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Vehicle details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Car className="w-4 h-4 mr-2 text-gray-500" />
                      Make & Model
                    </h3>
                    <p className="text-lg">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      Year
                    </h3>
                    <p className="text-lg">{vehicle.year || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Car className="w-4 h-4 mr-2 text-gray-500" />
                      Kilometers
                    </h3>
                    <p className="text-lg">{vehicle.kmRun || "0"} km</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Fuel className="w-4 h-4 mr-2 text-gray-500" />
                      Fuel Type
                    </h3>
                    <p className="text-lg capitalize">
                      {vehicle.fuelType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <Palette className="w-4 h-4 mr-2 text-gray-500" />
                      Color
                    </h3>
                    <div className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor: vehicle.color || "gray",
                        }}
                      ></span>
                      <p className="text-lg">
                        {vehicle.color || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      Budget
                    </h3>
                    <p className="text-lg">
                      Rs. {vehicle.budget || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                      Status
                    </h3>
                    <p className="text-lg capitalize">
                      {vehicle.status || "Pending"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line mb-6">
                  {vehicle.description || "No description provided."}
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-2">Request Details</h3>
                  <p className="text-sm text-gray-600">
                    Requested on:{" "}
                    {new Date(vehicle.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {vehicle.status === "available" && (
                  <button
                    onClick={handleBook}
                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <Car className="w-5 h-5 mr-2" />
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Book Now</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingDetails.date}
                  onChange={handleBookingChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={bookingDetails.time}
                  onChange={handleBookingChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={bookingDetails.location}
                  onChange={handleBookingChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={bookingDetails.description}
                  onChange={handleBookingChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional details..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistVehicleDetail;
