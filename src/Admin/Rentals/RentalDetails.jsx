import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Car,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileText,
  DollarSign,
  ArrowRight,
  Fuel,
  Settings,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RentalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLicensePreviewOpen, setIsLicensePreviewOpen] = useState(false);

  useEffect(() => {
    fetchRentalDetails();
  }, [id]);

  const fetchRentalDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/vehicles/active/one/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch rental details");
      }
      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error("No rental data found");
      }

      const rentalData = data.data[0];

      // Map the API response to our expected structure
      const mappedRental = {
        ...rentalData,
        RentalVehicle: {
          ...rentalData.RentalVehicle,
          seats: rentalData.RentalVehicle?.seats || 5,
          fuelType: rentalData.RentalVehicle?.fuelType || "petrol",
          transmission: rentalData.RentalVehicle?.transmission || "manual",
          engine: rentalData.RentalVehicle?.engine || "N/A",
          rentVehicleImages: rentalData.RentalVehicle?.rentVehicleImages || [],
        },
        user: {
          ...rentalData.User,
        },
        paymentDetails: {
          method: rentalData.paymentMethod || "payLater",
          status: rentalData.paymentMethod === "payLater" ? "pending" : "paid",
          transactionId: rentalData.transactionId || "N/A",
          date: rentalData.createdAt || new Date().toISOString(),
        },
        rentalPeriod: {
          startDate: rentalData.pickupDate,
          endDate: rentalData.returnDate,
          hoursRemaining: calculateHoursRemaining(
            rentalData.returnDate,
            rentalData.returnTime
          ),
          totalHours: calculateTotalHours(
            rentalData.pickupDate,
            rentalData.pickupTime,
            rentalData.returnDate,
            rentalData.returnTime
          ),
          type: rentalData.rentalType || "hour",
        },
        driverOption: rentalData.driveOption,
        additionalServices: [], // Add if available in API
      };

      setRental(mappedRental);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rental details:", error);
      setError(error.message);
      toast.error("Failed to fetch rental details");
      setLoading(false);
    }
  };

  // Calculate hours remaining until return
  const calculateHoursRemaining = (returnDate, returnTime) => {
    if (!returnDate || !returnTime) return 0;

    const returnDateTime = new Date(
      `${returnDate.split("T")[0]}T${returnTime}`
    );
    const now = new Date();
    const diffMs = returnDateTime - now;

    if (diffMs <= 0) return 0;
    return Math.round(diffMs / (1000 * 60 * 60));
  };

  // Calculate total rental hours
  const calculateTotalHours = (
    pickupDate,
    pickupTime,
    returnDate,
    returnTime
  ) => {
    if (!pickupDate || !returnDate) return 0;

    const pickupDateTime = new Date(
      `${pickupDate.split("T")[0]}T${pickupTime}`
    );
    const returnDateTime = new Date(
      `${returnDate.split("T")[0]}T${returnTime}`
    );
    const diffMs = returnDateTime - pickupDateTime;

    return Math.round(diffMs / (1000 * 60 * 60));
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time to readable format
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5); // Assuming time is in HH:MM format
  };

  // Format time remaining
  const formatTimeRemaining = (hours) => {
    if (hours <= 0) return "Completed";
    if (hours < 1) return "Less than 1 hour";
    if (hours < 24) return `${Math.round(hours)} hours`;
    if (hours < 168)
      return `${Math.round(hours / 24)} days, ${Math.round(hours % 24)} hours`;
    return `${Math.floor(hours / 24)} days`;
  };

  if (loading) {
    return (
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 text-[#ff6b00] animate-spin" />
          <span className="ml-2 text-lg text-gray-600">
            Loading rental details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-800">
              Error loading rental details
            </h3>
            <p className="mt-1 text-red-700">{error}</p>
            <button
              onClick={fetchRentalDetails}
              className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">
              Rental not found
            </h3>
            <p className="mt-1 text-yellow-700">
              The requested rental could not be found.
            </p>
            <button
              onClick={() => navigate("/admin/activerentals")}
              className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900"
            >
              Back to active rentals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate("/admin/activerentals")}
              className="flex items-center text-gray-600 hover:text-[#ff6b00] mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Active Rentals
            </button>
            <div className="border-l-4 border-[#ff6b00] pl-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Rental Details
              </h1>
              <p className="mt-2 text-gray-600">
                {rental.RentalVehicle?.make} {rental.RentalVehicle?.model} •{" "}
                {formatDate(rental.pickupDate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle and Images */}
            <div className="lg:col-span-2 space-y-6">
              {/* Vehicle Images */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100">
                  {rental.RentalVehicle?.rentVehicleImages?.length > 0 ? (
                    <img
                      src={
                        `../../server${rental.RentalVehicle.rentVehicleImages[activeImage].image}` ||
                        "/placeholder.svg"
                      }
                      alt={`${rental.RentalVehicle?.make} ${rental.RentalVehicle?.model}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                </div>

                {rental.RentalVehicle?.rentVehicleImages?.length > 1 && (
                  <div className="p-4 overflow-x-auto">
                    <div className="flex space-x-2">
                      {rental.RentalVehicle.rentVehicleImages.map(
                        (image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                              activeImage === index
                                ? "border-[#ff6b00]"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={image.image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
                  <h2 className="text-white text-lg font-semibold flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    Vehicle Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {rental.RentalVehicle?.make}{" "}
                        {rental.RentalVehicle?.model} (
                        {rental.RentalVehicle?.year})
                      </h3>
                      <p className="text-gray-600 mb-4">
                        License Plate: {rental.RentalVehicle?.numberPlate}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-[#ff6b00]" />
                          <span className="font-medium">Seats:</span>
                          <span className="ml-1">
                            {rental.RentalVehicle?.seats || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Fuel className="h-4 w-4 mr-2 text-[#ff6b00]" />
                          <span className="font-medium">Fuel:</span>
                          <span className="ml-1">
                            {rental.RentalVehicle?.fuelType || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Settings className="h-4 w-4 mr-2 text-[#ff6b00]" />
                          <span className="font-medium">Trans:</span>
                          <span className="ml-1">
                            {rental.RentalVehicle?.transmission || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Settings className="h-4 w-4 mr-2 text-[#ff6b00]" />
                          <span className="font-medium">Engine:</span>
                          <span className="ml-1">
                            {rental.RentalVehicle?.engine || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600">
                          Pickup Location
                        </h4>
                        <p className="font-medium text-gray-900 flex items-start mt-1">
                          <MapPin className="h-4 w-4 mr-2 text-[#ff6b00] mt-1 flex-shrink-0" />
                          {rental.pickupLocation || "N/A"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-600">
                          Dropoff Location
                        </h4>
                        <p className="font-medium text-gray-900 flex items-start mt-1">
                          <MapPin className="h-4 w-4 mr-2 text-[#ff6b00] mt-1 flex-shrink-0" />
                          {rental.dropoffLocation || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
                  <h2 className="text-white text-lg font-semibold flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Payment Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600">
                          Payment Method
                        </h4>
                        <p className="font-medium text-gray-900 flex items-center mt-1">
                          <CreditCard className="h-4 w-4 mr-2 text-[#ff6b00]" />
                          {rental.paymentMethod === "payLater"
                            ? "Pay Later"
                            : rental.paymentMethod === "khalti"
                            ? "Khalti"
                            : "N/A"}
                        </p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600">
                          Payment Date
                        </h4>
                        <p className="font-medium text-gray-900 mt-1">
                          {formatDate(rental.createdAt) || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">
                        Payment Breakdown
                      </h4>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Base Rental ({rental.rentalType || "hour"})
                          </span>
                          <span className="font-medium text-gray-900">
                            Rs. {rental.totalAmount?.toLocaleString() || "0"}
                          </span>
                        </div>

                        {rental.additionalServices?.map((service, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {service.name || "Additional service"}
                            </span>
                            <span className="font-medium text-gray-900">
                              Rs. {service.price?.toLocaleString() || "0"}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="font-medium text-gray-900">
                          Total Amount
                        </span>
                        <span className="font-bold text-gray-900">
                          Rs. {rental.totalAmount?.toLocaleString() || "0"}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            rental.paymentDetails?.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          } flex items-center`}
                        >
                          {rental.paymentDetails?.status === "paid" ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 mr-2" />
                          )}
                          {rental.paymentDetails?.status === "paid"
                            ? "Payment Completed"
                            : rental.paymentMethod === "payLater"
                            ? "Payment Pending (Pay Later)"
                            : "Payment Status Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Customer and Rental Period */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
                  <h2 className="text-white text-lg font-semibold flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Customer Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden mr-4 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {rental.user?.fname || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Customer ID: {rental.user?.id || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-start text-sm">
                      <Phone className="h-4 w-4 mr-2 text-[#ff6b00] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">
                          {rental.user?.num || rental.user?.phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start text-sm">
                      <Mail className="h-4 w-4 mr-2 text-[#ff6b00] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                          {rental.user?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start text-sm">
                      <FileText className="h-4 w-4 mr-2 text-[#ff6b00] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-600">Driving License</p>
                        <p className="font-medium text-gray-900">
                          {rental.licenseImageUrl ? (
                            <img
                              src={`../../server${rental.licenseImageUrl}`}
                              alt="Driving License"
                              className="h-32 w-32 object-cover rounded-md border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setIsLicensePreviewOpen(true)}
                            />
                          ) : (
                            "No License Image"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
                  <h2 className="text-white text-lg font-semibold flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Rental Period
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Start Date
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          End Date
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {formatDate(rental.pickupDate) || "N/A"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                        <span className="font-medium text-gray-900">
                          {formatDate(rental.returnDate) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Duration
                      </p>
                      <p className="font-medium text-gray-900">
                        {rental.rentalDuration}{" "}
                        {rental.rentalType === "hour"
                          ? "hours"
                          : rental.rentalType === "day"
                          ? "days"
                          : rental.rentalType === "week"
                          ? "weeks"
                          : rental.rentalType === "month"
                          ? "months"
                          : "hours"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Rental Type
                      </p>
                      <p className="font-medium text-gray-900 capitalize">
                        {rental.rentalType || "hour"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Driver Option
                      </p>
                      <p className="font-medium text-gray-900 capitalize">
                        {rental.driverOption === "selfDrive"
                          ? "Self Drive"
                          : rental.driverOption === "hireDriver"
                          ? "Hire a Driver"
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Time Remaining
                      </p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-[#ff6b00]" />
                        <p className="font-medium text-gray-900">
                          {formatTimeRemaining(
                            rental.rentalPeriod?.hoursRemaining || 0
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          (rental.rentalPeriod?.hoursRemaining || 0) < 12
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        } flex items-center justify-center`}
                      >
                        {(rental.rentalPeriod?.hoursRemaining || 0) < 12 ? (
                          <AlertTriangle className="h-4 w-4 mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {(rental.rentalPeriod?.hoursRemaining || 0) < 12
                          ? "Ending Soon"
                          : "On Schedule"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* License Image Preview Modal */}
      {isLicensePreviewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLicensePreviewOpen(false)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden max-w-3xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Driving License</h3>
              <button
                onClick={() => setIsLicensePreviewOpen(false)}
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
            <div className="p-4 flex items-center justify-center">
              <img
                src={
                  `../../server${rental.licenseImageUrl}` || "/placeholder.svg"
                }
                alt="Driving License"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
