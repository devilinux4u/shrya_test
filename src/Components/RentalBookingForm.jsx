import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Car,
  Info,
  AlertTriangle,
  ChevronLeft,
  Camera,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const RentalBookingForm = ({ vehicleId }) => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    priceHour: 0,
    priceDay: 0,
    priceWeek: 0,
    priceMonth: 0,
  });

  const [bookingData, setBookingData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    rentalType: "day",
    driveOption: "selfDrive",
    drivingLicense: "",
    licenseImage: null,
    paymentMethod: "khalti",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rentalDuration, setRentalDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifyingVehicle, setVerifyingVehicle] = useState(false);

  // Calculate total amount whenever rental details change
  useEffect(() => {
    if (
      bookingData.pickupDate &&
      bookingData.returnDate &&
      bookingData.pickupTime &&
      bookingData.returnTime
    ) {
      const duration = calculateDuration();
      setRentalDuration(duration > 0 ? duration : 1);
      calculateTotal(duration);
    } else {
      calculateTotal(rentalDuration);
    }
  }, [
    bookingData.pickupDate,
    bookingData.returnDate,
    bookingData.pickupTime,
    bookingData.returnTime,
    bookingData.rentalType,
    bookingData.driveOption,
    vehicle,
  ]);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setVerifyingVehicle(true);
        const response = await fetch(
          `http://localhost:3000/rent/one/${vehicleId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vehicle data");
        }
        const data = await response.json();

        // console.log(data)

        // Ensure we have the vehicle data with price fields
        if (data && data[0]) {
          const vehicleData = data[0];
          setVehicle({
            ...vehicleData,
            priceHour: Number(vehicleData.priceHour) || 0,
            priceDay: Number(vehicleData.priceDay) || 0,
            priceWeek: Number(vehicleData.priceWeek) || 0,
            priceMonth: Number(vehicleData.priceMonth) || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        toast.error("Unable to load vehicle data. Please try again later.");
      } finally {
        setVerifyingVehicle(false);
      }
    };

    fetchVehicleData();
  }, [vehicleId]);

  const calculateTotal = (duration = rentalDuration) => {
    let basePrice = 0;
    const calculatedDuration = duration || 1;

    // Get the correct price based on rental type
    const priceKey = `price${
      bookingData.rentalType.charAt(0).toUpperCase() +
      bookingData.rentalType.slice(1)
    }`;
    basePrice = (vehicle[priceKey] || 0) * calculatedDuration;

    let driverCost = 0;
    if (bookingData.driveOption === "hireDriver") {
      switch (bookingData.rentalType) {
        case "hour":
          driverCost = 200 * calculatedDuration;
          break;
        case "day":
          driverCost = 2000 * calculatedDuration;
          break;
        case "week":
          driverCost = 7500 * calculatedDuration;
          break;
        case "month":
          driverCost = 25000 * calculatedDuration;
          break;
      }
    }

    setTotalAmount(basePrice + driverCost);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setBookingData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setBookingData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const calculateDuration = () => {
    if (
      !bookingData.pickupDate ||
      !bookingData.returnDate ||
      !bookingData.pickupTime ||
      !bookingData.returnTime
    )
      return 1;

    const pickup = new Date(
      `${bookingData.pickupDate}T${bookingData.pickupTime}`
    );
    const returnDate = new Date(
      `${bookingData.returnDate}T${bookingData.returnTime}`
    );

    if (isNaN(pickup.getTime()) || isNaN(returnDate.getTime())) return 1;

    const diffTime = Math.abs(returnDate - pickup);

    if (diffTime <= 0) return 1;

    switch (bookingData.rentalType) {
      case "hour":
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60)));
      case "day":
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      case "week":
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));
      case "month":
        return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)));
      default:
        return 1;
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!bookingData.pickupLocation)
        newErrors.pickupLocation = "Pickup location is required";
      if (!bookingData.dropoffLocation)
        newErrors.dropoffLocation = "Drop-off location is required";
      if (!bookingData.pickupDate)
        newErrors.pickupDate = "Pickup date is required";
      if (!bookingData.pickupTime)
        newErrors.pickupTime = "Pickup time is required";
      if (!bookingData.returnDate)
        newErrors.returnDate = "Return date is required";
      if (!bookingData.returnTime)
        newErrors.returnTime = "Return time is required";

      if (
        bookingData.pickupDate &&
        bookingData.returnDate &&
        bookingData.pickupTime &&
        bookingData.returnTime
      ) {
        const pickup = new Date(
          `${bookingData.pickupDate}T${bookingData.pickupTime}`
        );
        const returnDate = new Date(
          `${bookingData.returnDate}T${bookingData.returnTime}`
        );

        if (returnDate <= pickup) {
          newErrors.returnDate =
            "Return date/time must be after pickup date/time";
        }
      }
    }

    if (step === 2) {
      if (bookingData.driveOption === "selfDrive") {
        if (!bookingData.drivingLicense)
          newErrors.drivingLicense = "Driving license number is required";
        if (!bookingData.licenseImage)
          newErrors.licenseImage = "License image is required";
      }

      if (!bookingData.termsAccepted)
        newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      const duration = calculateDuration();
      const userId = Cookies.get("sauto")?.split("-")[0];

      if (!userId) {
        toast.error("User authentication error. Please log in again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("vehicleId", vehicle.id);
      formData.append("pickupLocation", bookingData.pickupLocation);
      formData.append("dropoffLocation", bookingData.dropoffLocation);
      formData.append("pickupDate", bookingData.pickupDate);
      formData.append("pickupTime", bookingData.pickupTime);
      formData.append("returnDate", bookingData.returnDate);
      formData.append("returnTime", bookingData.returnTime);
      formData.append("rentalType", bookingData.rentalType);
      formData.append("driveOption", bookingData.driveOption);
      formData.append("paymentMethod", bookingData.paymentMethod);
      formData.append("termsAccepted", bookingData.termsAccepted);
      formData.append("totalAmount", totalAmount);
      formData.append("rentalDuration", duration);
      if (bookingData.paymentMethod === "payLater") {
        formData.append("status", "pending");
      } else {
        formData.append("status", "not_paid");
      }

      if (bookingData.driveOption === "selfDrive" && bookingData.licenseImage) {
        formData.append("licenseImage", bookingData.licenseImage);
      }

      const response = await axios.post(
        "http://localhost:3000/api/rentals",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 5000,
        }
      );

      console.log(response);

      if (
        formData.get("paymentMethod") != "payLater" &&
        response.status === 201
      ) {
        const paymentUrl = response.data.data.payment_url;
        window.location.href = paymentUrl; // Redirect to Khalti
      } else {
        toast.success("Booking confirmed!");
        navigate("/UserBookings");
      }

      throw new Error(response.data.message || "Unexpected response");
    } catch (error) {
      if (error.response) {
        console.error("Server error:", {
          status: error.response.status,
          data: error.response.data,
        });
        toast.error(error.response.data?.message || "Booking failed");
      } else {
        console.error("Request error:", error.message);
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString() || "0"}`;
  };

  const getDriverCost = () => {
    const calculatedDuration = rentalDuration || 1;

    switch (bookingData.rentalType) {
      case "hour":
        return 200 * calculatedDuration;
      case "day":
        return 2000 * calculatedDuration;
      case "week":
        return 7500 * calculatedDuration;
      case "month":
        return 25000 * calculatedDuration;
      default:
        return 0;
    }
  };

  const getBasePrice = () => {
    const priceKey = `price${
      bookingData.rentalType.charAt(0).toUpperCase() +
      bookingData.rentalType.slice(1)
    }`;
    return (vehicle[priceKey] || 0) * rentalDuration;
  };

  const renderStep1 = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-white text-base sm:text-lg font-semibold flex items-center">
            <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Rental Details
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label
                htmlFor="pickupLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pickup Location*
              </label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={bookingData.pickupLocation}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.pickupLocation ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                placeholder="Enter pickup location"
              />
              {errors.pickupLocation && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {errors.pickupLocation}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dropoffLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Drop-off Location*
              </label>
              <input
                type="text"
                id="dropoffLocation"
                name="dropoffLocation"
                value={bookingData.dropoffLocation}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.dropoffLocation ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                placeholder="Enter drop-off location"
              />
              {errors.dropoffLocation && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {errors.dropoffLocation}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="rentalType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rental Type
            </label>
            <select
              id="rentalType"
              name="rentalType"
              value={bookingData.rentalType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3"
            >
              <option value="hour">
                Hourly (Rs. {vehicle.priceHour}/hour)
              </option>
              <option value="day">Daily (Rs. {vehicle.priceDay}/day)</option>
              <option value="week">
                Weekly (Rs. {vehicle.priceWeek}/week)
              </option>
              <option value="month">
                Monthly (Rs. {vehicle.priceMonth}/month)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="pickupDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pickup Date*
              </label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                value={bookingData.pickupDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full rounded-lg border ${
                  errors.pickupDate ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.pickupDate && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {errors.pickupDate}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="pickupTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pickup Time*
              </label>
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                value={bookingData.pickupTime}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.pickupTime ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.pickupTime && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {errors.pickupTime}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="returnDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Return Date*
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={bookingData.returnDate}
                onChange={handleChange}
                min={
                  bookingData.pickupDate ||
                  new Date().toISOString().split("T")[0]
                }
                className={`w-full rounded-lg border ${
                  errors.returnDate ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.returnDate && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {errors.returnDate}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="returnTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Return Time*
              </label>
              <input
                type="time"
                id="returnTime"
                name="returnTime"
                value={bookingData.returnTime}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.returnTime ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.returnTime && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {errors.returnTime}
                </p>
              )}
            </div>
          </div>

          {bookingData.pickupDate &&
            bookingData.returnDate &&
            bookingData.pickupTime &&
            bookingData.returnTime && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Duration:
                    </p>
                    <p className="font-medium text-sm sm:text-base text-gray-900">
                      {rentalDuration} {bookingData.rentalType}
                      {rentalDuration > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Base Price:
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#ff6b00]">
                      {formatCurrency(getBasePrice())}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm"
        >
          Continue to Service Options
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-white text-base sm:text-lg font-semibold flex items-center">
            <Car className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Choose a Service
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Drive Option
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                  bookingData.driveOption === "selfDrive"
                    ? "border-[#ff6b00] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setBookingData((prev) => ({
                    ...prev,
                    driveOption: "selfDrive",
                  }))
                }
              >
                <div className="flex items-center mb-1 sm:mb-2">
                  <input
                    type="radio"
                    id="selfDrive"
                    name="driveOption"
                    value="selfDrive"
                    checked={bookingData.driveOption === "selfDrive"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ff6b00] focus:ring-[#ff6b00]"
                  />
                  <label
                    htmlFor="selfDrive"
                    className="ml-2 block text-sm sm:text-base font-medium text-gray-900"
                  >
                    Self Drive
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 ml-6">
                  Drive the vehicle yourself. Valid driving license required.
                </p>
              </div>

              <div
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                  bookingData.driveOption === "hireDriver"
                    ? "border-[#ff6b00] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setBookingData((prev) => ({
                    ...prev,
                    driveOption: "hireDriver",
                  }))
                }
              >
                <div className="flex items-center mb-1 sm:mb-2">
                  <input
                    type="radio"
                    id="hireDriver"
                    name="driveOption"
                    value="hireDriver"
                    checked={bookingData.driveOption === "hireDriver"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#ff6b00] focus:ring-[#ff6b00]"
                  />
                  <label
                    htmlFor="hireDriver"
                    className="ml-2 block text-sm sm:text-base font-medium text-gray-900"
                  >
                    Hire a Driver
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 ml-6">
                  Professional driver included. Additional charges apply.
                </p>
              </div>
            </div>
          </div>

          {bookingData.driveOption === "selfDrive" && (
            <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                License Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="drivingLicense"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Driving License Number*
                  </label>
                  <input
                    type="text"
                    id="drivingLicense"
                    name="drivingLicense"
                    value={bookingData.drivingLicense}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.drivingLicense
                        ? "border-red-500"
                        : "border-gray-300"
                    } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                    placeholder="Enter your license number"
                  />
                  {errors.drivingLicense && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {errors.drivingLicense}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload License Image*
                  </label>
                  <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8">
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="licenseImage"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-[#ff6b00] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#ff6b00] focus-within:ring-offset-2 hover:text-[#ff8533]"
                        >
                          <span>Upload an image</span>
                          <input
                            id="licenseImage"
                            name="licenseImage"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      {bookingData.licenseImage && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {bookingData.licenseImage.name} selected
                        </p>
                      )}
                    </div>
                  </div>
                  {errors.licenseImage && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {errors.licenseImage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {bookingData.driveOption === "hireDriver" && (
            <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-blue-800">
                      Driver Service Information
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-blue-700">
                      Our professional drivers are experienced, vetted, and
                      trained to provide excellent service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Driver Charge:</span>
                  <span className="font-medium text-sm sm:text-base text-gray-900">
                    {formatCurrency(getDriverCost())}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
              Payment Method
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                    bookingData.paymentMethod === "khalti"
                      ? "border-[#ff6b00] bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      paymentMethod: "khalti",
                    }))
                  }
                >
                  <div className="flex items-center mb-1 sm:mb-2">
                    <input
                      type="radio"
                      id="khalti"
                      name="paymentMethod"
                      value="khalti"
                      checked={bookingData.paymentMethod === "khalti"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#ff6b00] focus:ring-[#ff6b00]"
                    />
                    <label
                      htmlFor="khalti"
                      className="ml-2 block text-sm sm:text-base font-medium text-gray-900"
                    >
                      Pay with Khalti
                    </label>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 ml-6">
                    Secure online payment via Khalti digital wallet
                  </p>
                </div>

                <div
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                    bookingData.paymentMethod === "payLater"
                      ? "border-[#ff6b00] bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      paymentMethod: "payLater",
                    }))
                  }
                >
                  <div className="flex items-center mb-1 sm:mb-2">
                    <input
                      type="radio"
                      id="payLater"
                      name="paymentMethod"
                      value="payLater"
                      checked={bookingData.paymentMethod === "payLater"}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#ff6b00] focus:ring-[#ff6b00]"
                    />
                    <label
                      htmlFor="payLater"
                      className="ml-2 block text-sm sm:text-base font-medium text-gray-900"
                    >
                      Pay at Pickup
                    </label>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 ml-6">
                    Pay the full amount when you pick up the vehicle
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={bookingData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-[#ff6b00] focus:ring-[#ff6b00] rounded"
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="ml-3 block text-xs sm:text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-[#ff6b00] hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#ff6b00] hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {errors.termsAccepted}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Duration:</p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {rentalDuration} {bookingData.rentalType}
                  {rentalDuration > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-600">
                  Estimated Total:
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#ff6b00]">
                  {formatCurrency(totalAmount)}
                </p>
                {bookingData.driveOption === "hireDriver" && (
                  <p className="text-xs text-gray-600">
                    (Includes driver charges)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm text-sm"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-4 sm:px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm text-sm"
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-white text-base sm:text-lg font-semibold flex items-center">
            <Car className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Booking Summary
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-full sm:w-1/3 h-36 sm:h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  `../../server${
                    vehicle.rentVehicleImages[0].image || "/placeholder.svg"
                  }` ||
                  "/placeholder-car.jpg" ||
                  "/placeholder.svg"
                }
                alt={vehicle.make || "Vehicle"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {vehicle.make || "Unknown Vehicle"}
              </h3>
              <p className="text-sm text-gray-600">
                {vehicle.model || "Unknown Model"} Model
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Seats:</span>
                  <span className="ml-1">{vehicle.seats}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Doors:</span>
                  <span className="ml-1">{vehicle.doors}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Transmission:</span>
                  <span className="ml-1">{vehicle.transmission}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Fuel:</span>
                  <span className="ml-1">{vehicle.fuelType}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              Rental Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Pickup Location
                </p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {bookingData.pickupLocation}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Drop-off Location
                </p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {bookingData.dropoffLocation}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Pickup Date & Time
                </p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {bookingData.pickupDate &&
                    new Date(bookingData.pickupDate).toLocaleDateString()}{" "}
                  at {bookingData.pickupTime}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Return Date & Time
                </p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {bookingData.returnDate &&
                    new Date(bookingData.returnDate).toLocaleDateString()}{" "}
                  at {bookingData.returnTime}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Duration</p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {rentalDuration} {bookingData.rentalType}
                  {rentalDuration > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Service Type</p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {bookingData.driveOption === "selfDrive"
                    ? "Self Drive"
                    : "With Driver"}
                </p>
              </div>
            </div>
          </div>

          {bookingData.driveOption === "selfDrive" && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                License Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    License Number
                  </p>
                  <p className="font-medium text-sm sm:text-base text-gray-900">
                    {bookingData.drivingLicense}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    License Image
                  </p>
                  <p className="font-medium text-sm sm:text-base text-gray-900">
                    {bookingData.licenseImage ? (
                      <span className="text-[#ff6b00]">✓ Uploaded</span>
                    ) : (
                      <span className="text-red-500">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              Payment Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Payment Method
                </p>
                <p className="font-medium text-sm sm:text-base text-gray-900">
                  {bookingData.paymentMethod === "khalti"
                    ? "Pay with Khalti"
                    : "Pay at Pickup"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
              Price Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">
                  {vehicle.name} ({rentalDuration} {bookingData.rentalType}
                  {rentalDuration > 1 ? "s" : ""})
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(getBasePrice())}
                </span>
              </div>

              {bookingData.driveOption === "hireDriver" && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Driver Service</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(getDriverCost())}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-sm sm:text-base text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-base sm:text-lg text-[#ff6b00]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {bookingData.paymentMethod === "payLater" && (
            <div className="mt-3 sm:mt-4 bg-yellow-50 p-3 sm:p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-yellow-800">
                    Payment Due at Pickup
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-yellow-700">
                    Please note that you will need to pay the full amount of{" "}
                    {formatCurrency(totalAmount)} at the time of pickup.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm text-sm"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
          Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || verifyingVehicle}
          className="px-4 sm:px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm flex items-center text-sm"
        >
          {loading || verifyingVehicle ? (
            <>
              <Clock className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {verifyingVehicle ? "Verifying..." : "Processing..."}
            </>
          ) : (
            <>Complete Booking</>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-0 my-2 sm:my-3">
        <div className="mb-0">
          <a
            href="#"
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-600 hover:text-[#ff6b00] text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Vehicle
          </a>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            Book Your Rental
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Complete the form below to reserve your {vehicle.name}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-4 mt-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? "bg-[#ff6b00] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step === 1 && (
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    {step === 2 && <Car className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {step === 3 && <Info className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>
                  <span
                    className={`text-xs sm:text-sm mt-1 sm:mt-2 ${
                      currentStep >= step
                        ? "text-[#ff6b00] font-medium"
                        : "text-gray-500"
                    } hidden sm:block`}
                  >
                    {step === 1 && "Details"}
                    {step === 2 && "Payment"}
                    {step === 3 && "Summary"}
                  </span>
                </div>

                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 ${
                      currentStep > step ? "bg-[#ff6b00]" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </form>
      </div>
    </>
  );
};

export default RentalBookingForm;
