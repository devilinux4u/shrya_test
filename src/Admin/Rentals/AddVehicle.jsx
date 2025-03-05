import { useState, useEffect } from "react";
import {
  Camera,
  X,
  ChevronLeft,
  Car,
  DollarSign,
  Settings,
  ListChecks,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function AddVehicle() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    numberPlate: "",
    price: {
      day: "",
      hour: "",
      week: "",
      month: "",
    },
    images: [],
    imagePreviewUrls: [],
    specs: {
      seats: "",
      doors: "",
      transmission: "",
      fuel: "",
      mileage: "",
      engine: "",
      power: "",
    },
    features: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      vehicle.imagePreviewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [vehicle.imagePreviewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in vehicle.price) {
      setVehicle((prev) => ({
        ...prev,
        price: { ...prev.price, [name]: value },
      }));
    } else if (name in vehicle.specs) {
      setVehicle((prev) => ({
        ...prev,
        specs: { ...prev.specs, [name]: value },
      }));
    } else {
      setVehicle((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setVehicle((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviewUrls: [...prev.imagePreviewUrls, ...newPreviewUrls],
    }));
  };

  const handleImageRemove = (index) => {
    setVehicle((prev) => {
      if (prev.imagePreviewUrls[index]) {
        URL.revokeObjectURL(prev.imagePreviewUrls[index]);
      }

      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imagePreviewUrls: prev.imagePreviewUrls.filter((_, i) => i !== index),
      };
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "make",
      "model",
      "year",
      "numberPlate",
      "description",
    ];

    const priceFields = ["day", "hour", "week", "month"];
    const specFields = [
      "seats",
      "doors",
      "transmission",
      "fuel",
      "mileage",
      "engine",
      "power",
    ];

    const formErrors = {};

    requiredFields.forEach((field) => {
      if (!vehicle[field]) {
        formErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
      }
    });

    priceFields.forEach((field) => {
      if (!vehicle.price[field]) {
        formErrors[field] = `Price per ${field} is required`;
        toast.error(`Price per ${field} is required`);
      }
    });

    specFields.forEach((field) => {
      if (!vehicle.specs[field]) {
        formErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
      }
    });

    if (vehicle.images.length === 0) {
      formErrors.images = "Please upload at least one image";
      toast.error("Please upload at least one image");
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Log the form data before sending
      console.log("Form data being submitted:", {
        ...vehicle,
        specs: vehicle.specs,
        price: vehicle.price,
      });

      const formData = new FormData();

      // Append basic fields
      formData.append("make", vehicle.make);
      formData.append("model", vehicle.model);
      formData.append("year", vehicle.year);
      formData.append("numberPlate", vehicle.numberPlate);
      formData.append("description", vehicle.description);
      formData.append("features", vehicle.features);

      // Append specs
      Object.entries(vehicle.specs).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append prices
      Object.entries(vehicle.price).forEach(([key, value]) => {
        formData.append(`price_${key}`, value);
      });

      // Append images
      vehicle.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await fetch("http://localhost:3000/api/add-vehicle", {
        method: "POST",
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("Server error:", data);
        throw new Error(data.message || "Failed to add vehicle");
      }

      console.log("Success response:", data);
      toast.success("Vehicle added successfully!");

      // Delay redirect by 2 seconds
      setTimeout(() => {
        navigate("/admin/allvehicles");
      }, 2000);

      // Reset form
      setVehicle({
        make: "",
        model: "",
        year: "",
        numberPlate: "",
        price: { day: "", hour: "", week: "", month: "" },
        images: [],
        imagePreviewUrls: [],
        specs: {
          seats: "",
          doors: "",
          transmission: "",
          fuel: "",
          mileage: "",
          engine: "",
          power: "",
        },
        features: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to add vehicle. Please try again.");
    }
  };
  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-[#ff6b00] mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="border-l-4 border-[#ff6b00] pl-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Add Rental Vehicle
              </h1>
              <p className="mt-2 text-gray-600">
                Fill in the details below to add a new vehicle to your rental
                fleet.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff8533] px-6 py-4">
              <h2 className="text-white text-lg font-semibold flex items-center">
                <Car className="mr-2 h-5 w-5" />
                Vehicle Information Form
              </h2>
            </div>

            <div className="px-4 sm:px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    <Car className="mr-2 h-5 w-5 text-[#ff6b00]" />
                    Basic Information
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <InputField
                      label="Make"
                      name="make"
                      value={vehicle.make}
                      onChange={handleChange}
                      placeholder="e.g., Toyota"
                      error={errors.make}
                    />
                    <InputField
                      label="Model"
                      name="model"
                      value={vehicle.model}
                      onChange={handleChange}
                      placeholder="e.g., Camry"
                      error={errors.model}
                    />
                    <InputField
                      label="Year"
                      name="year"
                      type="number"
                      value={vehicle.year}
                      onChange={handleChange}
                      placeholder="e.g., 2023"
                      error={errors.year}
                    />
                    <InputField
                      label="Number Plate"
                      name="numberPlate"
                      value={vehicle.numberPlate}
                      onChange={handleChange}
                      placeholder="e.g., ABC-1234"
                      error={errors.numberPlate}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    <DollarSign className="mr-2 h-5 w-5 text-[#ff6b00]" />
                    Pricing Information
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InputField
                      label="Price per Hour (Rs.)"
                      name="hour"
                      type="number"
                      value={vehicle.price.hour}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      prefix="Rs."
                      error={errors.hour}
                    />
                    <InputField
                      label="Price per Day (Rs.)"
                      name="day"
                      type="number"
                      value={vehicle.price.day}
                      onChange={handleChange}
                      placeholder="e.g., 2500"
                      prefix="Rs."
                      error={errors.day}
                    />
                    <InputField
                      label="Price per Week (Rs.)"
                      name="week"
                      type="number"
                      value={vehicle.price.week}
                      onChange={handleChange}
                      placeholder="e.g., 15000"
                      prefix="Rs."
                      error={errors.week}
                    />
                    <InputField
                      label="Price per Month (Rs.)"
                      name="month"
                      type="number"
                      value={vehicle.price.month}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      prefix="Rs."
                      error={errors.month}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    <Settings className="mr-2 h-5 w-5 text-[#ff6b00]" />
                    Vehicle Specifications
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InputField
                      label="Seats"
                      name="seats"
                      type="number"
                      value={vehicle.specs.seats}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                      error={errors.seats}
                    />
                    <InputField
                      label="Doors"
                      name="doors"
                      type="number"
                      value={vehicle.specs.doors}
                      onChange={handleChange}
                      placeholder="e.g., 4"
                      error={errors.doors}
                    />
                    <SelectField
                      label="Transmission"
                      name="transmission"
                      value={vehicle.specs.transmission}
                      onChange={handleChange}
                      options={[
                        { value: "automatic", label: "Automatic" },
                        { value: "manual", label: "Manual" },
                        { value: "cvt", label: "CVT" },
                      ]}
                      error={errors.transmission}
                    />
                    <SelectField
                      label="Fuel Type"
                      name="fuel"
                      value={vehicle.specs.fuel}
                      onChange={handleChange}
                      options={[
                        { value: "petrol", label: "Petrol" },
                        { value: "diesel", label: "Diesel" },
                        { value: "electric", label: "Electric" },
                        { value: "hybrid", label: "Hybrid" },
                        { value: "cng", label: "CNG" },
                      ]}
                      error={errors.fuel}
                    />
                    <InputField
                      label="Mileage (km/l)"
                      name="mileage"
                      type="number"
                      value={vehicle.specs.mileage}
                      onChange={handleChange}
                      placeholder="e.g., 15"
                      suffix="km/l"
                      error={errors.mileage}
                    />
                    <InputField
                      label="Engine"
                      name="engine"
                      value={vehicle.specs.engine}
                      onChange={handleChange}
                      placeholder="e.g., 1.5L"
                      error={errors.engine}
                    />
                    <InputField
                      label="Power (hp)"
                      name="power"
                      type="number"
                      value={vehicle.specs.power}
                      onChange={handleChange}
                      placeholder="e.g., 120"
                      suffix="hp"
                      error={errors.power}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    <ListChecks className="mr-2 h-5 w-5 text-[#ff6b00]" />
                    Features & Description
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="features"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Features (comma-separated)
                      </label>
                      <textarea
                        id="features"
                        name="features"
                        rows={3}
                        value={vehicle.features}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          errors.features ? "border-red-500" : "border-gray-300"
                        } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] transition-colors`}
                        placeholder="GPS, Bluetooth, Sunroof, Leather Seats, Climate Control..."
                      ></textarea>
                      {errors.features && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.features}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={vehicle.description}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                        } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] transition-colors`}
                        placeholder="Provide a detailed description of the vehicle..."
                      ></textarea>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    <Camera className="mr-2 h-5 w-5 text-[#ff6b00]" />
                    Vehicle Images
                  </div>
                  <div>
                    <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition-all hover:border-[#ff6b00]/50">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex flex-wrap justify-center text-sm text-gray-600">
                          <label
                            htmlFor="images"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-[#ff6b00] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#ff6b00] focus-within:ring-offset-2 hover:text-[#ff8533]"
                          >
                            <span>Upload images</span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>

                    {vehicle.imagePreviewUrls.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Uploaded Images ({vehicle.imagePreviewUrls.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {vehicle.imagePreviewUrls.map((previewUrl, index) => (
                            <div
                              key={index}
                              className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                            >
                              <div className="aspect-square w-full overflow-hidden bg-gray-100">
                                <img
                                  src={previewUrl || "/placeholder.svg"}
                                  alt={`Vehicle ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.images && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.images}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={goBack}
                      className="mr-3 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6b00] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors shadow-sm flex items-center"
                    >
                      <Car className="mr-2 h-4 w-4" />
                      Add Vehicle
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  error,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onWheel={(e) => e.target.blur()} // Disable scrolling
        className={`w-full rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00] focus:ring-opacity-50 transition-colors ${
          prefix ? "pl-10" : "pl-3"
        } ${suffix ? "pr-12" : "pr-3"} py-2`}
        placeholder={placeholder}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-lg border ${
        error ? "border-red-500" : "border-gray-300"
      } shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00] py-2 px-3 transition-colors`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
