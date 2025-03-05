"use client";

import { useState, useEffect, useRef } from "react";
import {
  Car,
  DollarSign,
  Camera,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const WishlistForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    purpose: "buy",
    model: "",
    make: "",
    year: "",
    color: "",
    budget: "",
    kmRun: "",
    fuelType: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);

    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    const newPreviewImages = [...previewImages];

    URL.revokeObjectURL(newPreviewImages[index]);

    newSelectedImages.splice(index, 1);
    newPreviewImages.splice(index, 1);

    setSelectedImages(newSelectedImages);
    setPreviewImages(newPreviewImages);
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.model || !formData.make) {
          toast.error("Please fill in all required vehicle details");
          return false;
        }
        return true;
      case 2:
        if (!formData.description) {
          toast.error("Please provide a description");
          return false;
        }
        if (selectedImages.length === 0) {
          toast.error("Please upload at least one image");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(2)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formDataToSubmit.append("images[]", image);
        });
      }

      formDataToSubmit.append("id", Cookies.get("sauto").split("-")[0]);

      const response = await fetch("http://localhost:3000/wishlistForm", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${errorDetails}`
        );
      }

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success("Added to your wishlist.");

        setFormData({
          purpose: "buy",
          model: "",
          make: "",
          year: "",
          color: "",
          budget: "",
          kmRun: "",
          fuelType: "",
          description: "",
        });

        setSelectedImages([]);
        setPreviewImages([]);

        setCurrentStep(1);
        onClose();

        setTimeout(() => {
          navigate("/YourList");
        }, 2000);

        window.location.reload();
      } else {
        toast.error("Failed to list vehicle in Wishlist. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting wishlist:", error);
      toast.error(`Failed to submit wishlist request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${
              currentStep >= 1
                ? "bg-[#ff6b00] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`h-1 w-12 ${
              currentStep >= 2 ? "bg-[#ff6b00]" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${
              currentStep >= 2
                ? "bg-[#ff6b00] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
        </div>
      </div>
    );
  };

  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Vehicle Details";
      case 2:
        return "Description & Images";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 text-gray-800 rounded-full p-2 hover:bg-gray-300 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-[#ff6b00]">Can't</span>
              <span className="font-mono"> find a Vehicle?</span>
            </h1>
            <p className="text-gray-600">
              The purpose of Elite Drives is to be the best choice in
              automobiles for its customers.
            </p>
          </div>

          {renderStepIndicator()}

          <h2 className="text-xl font-semibold text-center mb-6">
            {renderStepTitle()}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Car className="w-5 h-5" />
                  <h2>Vehicle Details</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make*
                    </label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      placeholder="e.g., Honda, Toyota"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model*
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g., Camry, X5"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Km Run
                    </label>
                    <input
                      type="number"
                      name="kmRun"
                      value={formData.kmRun}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Fuel type</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric Car</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="e.g., 2024"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g., Black, White"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        className="w-full pl-9 p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the vehicle you're looking for, including any specific features or requirements..."
                    className="w-full p-2 border rounded-md resize-none"
                    rows="4"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Mention any specific features, modifications, or
                    requirements you're looking for.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images*
                  </label>
                  <div
                    className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-[#ff6b00] transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Camera className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>

                  {previewImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected Images:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {previewImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index}`}
                              className="h-24 w-full object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center bg-[#ff6b00] text-white py-2 px-4 rounded-md hover:bg-[#ff8533] transition-colors"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center bg-[#ff6b00] text-white py-2 px-4 rounded-md hover:bg-[#ff8533] transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Wishlist"}
                  <Check className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default WishlistForm;
