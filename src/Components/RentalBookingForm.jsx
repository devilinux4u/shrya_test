"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  Car,
  Info,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const RentalBookingForm = ({ vehicleId }) => {
  const navigate = useNavigate();
  // Vehicle data state
  const [vehicle, setVehicle] = useState({
    id: vehicleId || "v1",
    name: "Land Rover Defender",
    model: "2023",
    imageUrl: "/placeholder.svg?height=400&width=600",
    price: 3000, 
    priceDetails: { 
      hour: 500,
      day: 3000, 
      week: 18000,
      month: 70000
    },
    specs: {
      seats: "5",
      doors: "4",
      transmission: "Automatic",
      fuel: "Diesel",
      type: "SUV"
    }
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
    paymentMethod: "creditCard",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    termsAccepted: false,
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rentalDuration, setRentalDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifyingVehicle, setVerifyingVehicle] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  // Calculate total amount whenever rental details change
  useEffect(() => {
    calculateTotal();
  }, [bookingData.rentalType, rentalDuration, bookingData.driveOption]);

  const calculateTotal = () => {
    let basePrice = 0;

    switch (bookingData.rentalType) {
      case "hour":
        basePrice = vehicle.priceDetails.hour * rentalDuration;
        break;
      case "day":
        basePrice = vehicle.priceDetails.day * rentalDuration;
        break;
      case "week":
        basePrice = vehicle.priceDetails.week * rentalDuration;
        break;
      case "month":
        basePrice = vehicle.priceDetails.month * rentalDuration;
        break;
      default:
        basePrice = vehicle.priceDetails.day * rentalDuration;
    }

    let driverCost = 0;
    if (bookingData.driveOption === "hireDriver") {
      switch (bookingData.rentalType) {
        case "hour":
          driverCost = 200 * rentalDuration;
          break;
        case "day":
          driverCost = 2000 * rentalDuration;
          break;
        case "week":
          driverCost = 7500 * rentalDuration;
          break;
        case "month":
          driverCost = 25000 * rentalDuration;
          break;
        default:
          driverCost = 0;
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
    if (!bookingData.pickupDate || !bookingData.returnDate) return 1;

    const pickup = new Date(
      `${bookingData.pickupDate}T${bookingData.pickupTime || "00:00"}`
    );
    const returnDate = new Date(
      `${bookingData.returnDate}T${bookingData.returnTime || "00:00"}`
    );

    const diffTime = Math.abs(returnDate - pickup);

    switch (bookingData.rentalType) {
      case "hour":
        return Math.ceil(diffTime / (1000 * 60 * 60));
      case "day":
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      case "week":
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      case "month":
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      default:
        return 1;
    }
  };

  const handleDateChange = (e) => {
    handleChange(e);
    setTimeout(() => {
      const duration = calculateDuration();
      setRentalDuration(duration > 0 ? duration : 1);
    }, 100);
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

      if (bookingData.pickupDate && bookingData.returnDate) {
        const pickup = new Date(
          `${bookingData.pickupDate}T${bookingData.pickupTime || "00:00"}`
        );
        const returnDate = new Date(
          `${bookingData.returnDate}T${bookingData.returnTime || "00:00"}`
        );

        if (returnDate <= pickup) {
          newErrors.returnDate = "Return date must be after pickup date";
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
    }

    if (step === 3) {
      if (bookingData.paymentMethod === "creditCard") {
        if (!bookingData.cardNumber)
          newErrors.cardNumber = "Card number is required";
        else if (!/^\d{16}$/.test(bookingData.cardNumber.replace(/\s/g, "")))
          newErrors.cardNumber = "Card number must be 16 digits";

        if (!bookingData.cardName)
          newErrors.cardName = "Name on card is required";
        if (!bookingData.expiryDate)
          newErrors.expiryDate = "Expiry date is required";
        if (!bookingData.cvv) newErrors.cvv = "CVV is required";
        else if (!/^\d{3,4}$/.test(bookingData.cvv))
          newErrors.cvv = "CVV must be 3 or 4 digits";
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
  
  function calculateRentalDays() {
    const start = new Date(`${bookingData.pickupDate}T${bookingData.pickupTime}`);
    const end = new Date(`${bookingData.returnDate}T${bookingData.returnTime}`);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: Cookies.get('sauto')?.split('-')[0],
        vehicleId: vehicle.id,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        pickupDate: bookingData.pickupDate,
        pickupTime: bookingData.pickupTime,
        returnDate: bookingData.returnDate,
        returnTime: bookingData.returnTime,
        rentalType: bookingData.rentalType || 'day',
        driveOption: bookingData.driveOption || 'selfDrive',
        paymentMethod: bookingData.paymentMethod || 'payLater',
        termsAccepted: bookingData.termsAccepted,
        totalAmount: vehicle.price * calculateRentalDays(), 
        rentalDuration: calculateRentalDays(),
        status: 'confirmed' 
      };
  
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(key, value);
      }
      
      if (bookingData.driveOption === 'selfDrive' && bookingData.licenseImage) {
        formData.append('licenseImage', bookingData.licenseImage);
      }
    
      // console.log('Attempting to POST to:', 'http://localhost:3000/api/rentals');
    const response = await axios.post('http://localhost:3000/api/rentals', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 5000
    });

    // console.log('Response received:', response);
    
    if (response.status === 201) {
      toast.success("Booking confirmed!");
      navigate("/RentalVehicleDesc");
      return;
    }

    throw new Error(response.data.message || "Unexpected response");

  } catch (error) {
    if (error.response) {
      // Proper server response with error
      console.error('Server error:', {
        status: error.response.status,
        data: error.response.data
      });
      toast.error(error.response.data?.message || 'Booking failed');
    } else {
      // Network or other errors
      console.error('Request error:', error.message);
      toast.error('Network error. Please try again.');
    }
  } finally {
    setLoading(false);
  }
  };
  
  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString?.() || '0'}`;
  };

  const getDriverCost = () => {
    switch (bookingData.rentalType) {
      case "hour":
        return 200 * rentalDuration;
      case "day":
        return 2000 * rentalDuration;
      case "week":
        return 7500 * rentalDuration;
      case "month":
        return 25000 * rentalDuration;
      default:
        return 0;
    }
  };

  const renderAvailableVehicles = () => {
    // Ensure availableVehicles is always an array
    const vehicles = Array.isArray(availableVehicles) ? availableVehicles : [];

    if (vehicles.length === 0) return null;

    return (
      <div className="mt-4 bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <div className="flex items-start mb-3">
          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-orange-800">
              Vehicle Not Available
            </h3>
            <p className="text-sm text-orange-700">
              The vehicle you selected is not available. Please choose one of these alternatives:
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map((avVehicle) => (
            <div key={avVehicle.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="font-medium">{avVehicle.make} {avVehicle.model}</div>
              <div className="text-sm text-gray-600 mb-2">Year: {avVehicle.year}</div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#ff6b00]">
                  {formatCurrency(avVehicle.priceDetails?.day)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVehicle({
                      ...avVehicle,
                      name: `${avVehicle.make} ${avVehicle.model}`,
                      model: avVehicle.year,
                      price: {
                        hour: avVehicle.priceDetails?.hour || Math.round((avVehicle.priceDetails?.day || 0) / 24),
                        day: avVehicle.priceDetails?.day || 0,
                        week: avVehicle.priceDetails?.week || Math.round((avVehicle.priceDetails?.day || 0) * 5),
                        month: avVehicle.priceDetails?.month || Math.round((avVehicle.priceDetails?.day || 0) * 30)
                      },
                      specs: {
                        seats: avVehicle.specs?.seats || "5",
                        doors: avVehicle.specs?.doors || "4",
                        transmission: avVehicle.specs?.transmission || "Automatic",
                        fuel: avVehicle.specs?.fuel || "Petrol",
                        type: avVehicle.specs?.type || "SUV"
                      }
                    });
                    setAvailableVehicles([]);
                  }}
                  className="px-3 py-1 bg-[#ff6b00] text-white rounded hover:bg-[#ff8533] text-sm"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
          <h2 className="text-white text-lg font-semibold flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Rental Details
          </h2>
        </div>
        <div className="p-6">
          {renderAvailableVehicles()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                <p className="mt-1 text-sm text-red-500">
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
                <p className="mt-1 text-sm text-red-500">
                  {errors.dropoffLocation}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
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
                  Hourly (Rs. {vehicle.priceDetails.hour}/hour)
                </option>
                <option value="day">Daily (Rs. {vehicle.priceDetails.day}/day)</option>
                <option value="week">
                  Weekly (Rs. {vehicle.priceDetails.week}/week)
                </option>
                <option value="month">
                  Monthly (Rs. {vehicle.priceDetails.month}/month)
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full rounded-lg border ${
                  errors.pickupDate ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.pickupDate && (
                <p className="mt-1 text-sm text-red-500">{errors.pickupDate}</p>
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
                onChange={handleDateChange}
                className={`w-full rounded-lg border ${
                  errors.pickupTime ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.pickupTime && (
                <p className="mt-1 text-sm text-red-500">{errors.pickupTime}</p>
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
                onChange={handleDateChange}
                min={
                  bookingData.pickupDate ||
                  new Date().toISOString().split("T")[0]
                }
                className={`w-full rounded-lg border ${
                  errors.returnDate ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.returnDate && (
                <p className="mt-1 text-sm text-red-500">{errors.returnDate}</p>
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
                onChange={handleDateChange}
                className={`w-full rounded-lg border ${
                  errors.returnTime ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
              />
              {errors.returnTime && (
                <p className="mt-1 text-sm text-red-500">{errors.returnTime}</p>
              )}
            </div>
          </div>

          {bookingData.pickupDate && bookingData.returnDate && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Duration:</p>
                  <p className="font-medium text-gray-900">
                    {rentalDuration} {bookingData.rentalType}
                    {rentalDuration > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Base Price:</p>
                  <p className="text-xl font-bold text-[#ff6b00]">
                    {formatCurrency(
                      vehicle.priceDetails[bookingData.rentalType] * rentalDuration
                    )}
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
          className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm"
        >
          Continue to Service Options
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
          <h2 className="text-white text-lg font-semibold flex items-center">
            <Car className="mr-2 h-5 w-5" />
            Choose a Service
          </h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Drive Option
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
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
                <div className="flex items-center mb-2">
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
                    className="ml-2 block text-base font-medium text-gray-900"
                  >
                    Self Drive
                  </label>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Drive the vehicle yourself. Valid driving license required.
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
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
                <div className="flex items-center mb-2">
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
                    className="ml-2 block text-base font-medium text-gray-900"
                  >
                    Hire a Driver
                  </label>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Professional driver included. Additional charges apply:
                  <br />
                  Rs. 200/hour, Rs. 2,000/day, Rs. 7,500/week, Rs. 25,000/month
                </p>
              </div>
            </div>
          </div>

          {bookingData.driveOption === "selfDrive" && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                License Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="mt-1 text-sm text-red-500">
                      {errors.drivingLicense}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="licenseImage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload License Image*
                  </label>
                  <input
                    type="file"
                    id="licenseImage"
                    name="licenseImage"
                    accept="image/*"
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.licenseImage ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                  />
                  {errors.licenseImage && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.licenseImage}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a clear image of your driving license (front side)
                  </p>
                </div>
              </div>
            </div>
          )}

          {bookingData.driveOption === "hireDriver" && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">
                      Driver Service Information
                    </h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Our professional drivers are experienced, vetted, and
                      trained to provide excellent service. The driver will
                      contact you before pickup to confirm details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Driver Charge:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(getDriverCost())}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Duration:</p>
                <p className="font-medium text-gray-900">
                  {rentalDuration} {bookingData.rentalType}
                  {rentalDuration > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Estimated Total:</p>
                <p className="text-xl font-bold text-[#ff6b00]">
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
          className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 inline mr-1" />
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
          <h2 className="text-white text-lg font-semibold flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Details
          </h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  checked={bookingData.paymentMethod === "creditCard"}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#ff6b00] focus:ring-[#ff6b00]"
                />
                <label
                  htmlFor="creditCard"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Credit/Debit Card
                </label>
              </div>
              <div className="flex items-center">
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
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Pay at Pickup
                </label>
              </div>
            </div>
          </div>

          {bookingData.paymentMethod === "creditCard" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Card Number*
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={bookingData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full rounded-lg border ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name on Card*
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={bookingData.cardName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.cardName ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                />
                {errors.cardName && (
                  <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Expiry Date*
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={bookingData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full rounded-lg border ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CVV*
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={bookingData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    className={`w-full rounded-lg border ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3`}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
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
                className="ml-3 block text-sm text-gray-700"
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
              <p className="mt-1 text-sm text-red-500">
                {errors.termsAccepted}
              </p>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {vehicle.name} ({rentalDuration} {bookingData.rentalType}
                  {rentalDuration > 1 ? "s" : ""})
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(
                    vehicle.priceDetails[bookingData.rentalType] * rentalDuration
                  )}
                </span>
              </div>

              {bookingData.driveOption === "hireDriver" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Driver Service</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(getDriverCost())}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-[#ff6b00]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 inline mr-1" />
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm"
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {renderAvailableVehicles()}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
          <h2 className="text-white text-lg font-semibold flex items-center">
            <Car className="mr-2 h-5 w-5" />
            Booking Summary
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="w-full sm:w-1/3 h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={vehicle.imageUrl || "/placeholder-car.jpg"}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
              <p className="text-gray-600">{vehicle.model} Model</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Seats:</span>
                  <span className="ml-1">{vehicle.specs.seats}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Doors:</span>
                  <span className="ml-1">{vehicle.specs.doors}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Transmission:</span>
                  <span className="ml-1">{vehicle.specs.transmission}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Fuel:</span>
                  <span className="ml-1">{vehicle.specs.fuel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rental Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Pickup Location</p>
                <p className="font-medium text-gray-900">{bookingData.pickupLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Drop-off Location</p>
                <p className="font-medium text-gray-900">{bookingData.dropoffLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pickup Date & Time</p>
                <p className="font-medium text-gray-900">
                  {new Date(bookingData.pickupDate).toLocaleDateString()} at {bookingData.pickupTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Return Date & Time</p>
                <p className="font-medium text-gray-900">
                  {new Date(bookingData.returnDate).toLocaleDateString()} at {bookingData.returnTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium text-gray-900">
                  {rentalDuration} {bookingData.rentalType}
                  {rentalDuration > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-medium text-gray-900">
                  {bookingData.driveOption === "selfDrive" ? "Self Drive" : "With Driver"}
                </p>
              </div>
            </div>
          </div>

          {/* License Information (if self drive) */}
          {bookingData.driveOption === "selfDrive" && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">License Number</p>
                  <p className="font-medium text-gray-900">{bookingData.drivingLicense}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">License Image</p>
                  <p className="font-medium text-gray-900">
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

          {/* Payment Information */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-gray-900">
                  {bookingData.paymentMethod === "creditCard" ? "Credit/Debit Card" : "Pay at Pickup"}
                </p>
              </div>
              {bookingData.paymentMethod === "creditCard" && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Cardholder Name</p>
                    <p className="font-medium text-gray-900">{bookingData.cardName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Card Number</p>
                    <p className="font-medium text-gray-900">
                      **** **** **** {bookingData.cardNumber.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-medium text-gray-900">{bookingData.expiryDate}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {vehicle.name} ({rentalDuration} {bookingData.rentalType}
                  {rentalDuration > 1 ? "s" : ""})
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(vehicle.priceDetails[bookingData.rentalType] * rentalDuration)}
                </span>
              </div>

              {bookingData.driveOption === "hireDriver" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver Service</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(getDriverCost())}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="font-bold text-[#ff6b00]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pay at pickup notice */}
          {bookingData.paymentMethod === "payLater" && (
            <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Payment Due at Pickup
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Please note that you will need to pay the full amount of{" "}
                    {formatCurrency(totalAmount)} at the time of pickup. We
                    accept cash, credit cards, and debit cards.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 inline mr-1" />
          Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || verifyingVehicle}
          className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm flex items-center"
        >
          {loading || verifyingVehicle ? (
            <>
              <Clock className="animate-spin h-4 w-4 mr-2" />
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
        <div className="max-w-8xl mx-auto px-4 py-0 my-3 min-h-screen"> 
          <div className="mb-0"> 
            <a href="#" onClick={() => window.history.back()}  className="inline-flex items-center text-gray-600 hover:text-[#ff6b00]">
              <ChevronLeft className="h-5 w-5 mr-1" />
             Back to Vehicle
            </a>
            <h1 className="text-3xl font-bold text-gray-900 mt-2"> {/* Changed mt-4 to mt-2 */}
              Book Your Rental
            </h1>
            <p className="text-gray-600 mt-1"> {/* Changed mt-2 to mt-1 */}
              Complete the form below to reserve your {vehicle.name}
            </p>
          </div>

        {/* Progress Steps */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? "bg-[#ff6b00] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step === 1 && <Calendar className="h-5 w-5" />}
                    {step === 2 && <Car className="h-5 w-5" />}
                    {step === 3 && <CreditCard className="h-5 w-5" />}
                    {step === 4 && <Info className="h-5 w-5" />}
                  </div>
                  <span
                    className={`text-sm mt-2 ${
                      currentStep >= step
                        ? "text-[#ff6b00] font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step === 1 && "Rental Details"}
                    {step === 2 && "Service Options"}
                    {step === 3 && "Payment"}
                    {step === 4 && "Summary"}
                  </span>
                </div>

                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
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
          {currentStep === 4 && renderStep4()}
        </form>
        </div>
    </>
  );
};

export default RentalBookingForm;