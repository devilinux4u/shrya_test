"use client";

import { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie";

const LostAndFoundForm = ({ isOpen, onClose, onSubmit }) => {
  const navigate = useNavigate(); // ✅ Correct: Call useNavigate inside the component

  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    location: "",
    date: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
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
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files], // Store actual File objects
    }));
  };

  const handleImageRemove = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    try {
      // Retrieve uid from cookies
      const uid = Cookies.get("sauto").split("-")[0];
      if (!uid) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      // Convert formData to FormData for submission
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((file) => {
            formDataToSubmit.append("images", file); // Append actual File objects
          });
        } else {
          formDataToSubmit.append(key, value);
        }
      });

      // Append uid to the form data
      formDataToSubmit.append("id", uid);

      // Send the request to the backend
      const response = await fetch("http://localhost:3000/api/lost-and-found", {
        method: "POST",
        body: formDataToSubmit,
      });

      // Check if the response is OK, if not throw an error
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("HTTP error details:", errorDetails);
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${errorDetails}`
        );
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      // Handle the success response from the server
      if (data.success) {
        const newItem = data.item; // Extract the newly added item
        console.log("Report submitted successfully!");
        toast.success("Lost and Found report submitted successfully!");

        // Reset the form state including images
        setFormData({
          type: "lost",
          title: "",
          description: "",
          location: "",
          date: "",
          images: [],
        });

        window.location.reload();

        // Clear selected images and previews
        onClose(); // Close the form/modal
        onSubmit(newItem); // Pass the new item to the parent component

        // Redirect to the lost and found page after a delay
        setTimeout(() => {
          navigate("/LostAndFound");
          console.log("Redirecting to /lost-and-found...");
        }, 2000);
      } else {
        console.error("Failed to submit the report. Server response:", data);
        toast.error("Failed to submit the report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(`Failed to submit report: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Report Lost/Found Item
            </h1>
          </div>

          {/* Form content */}
          <div
            className="px-6 py-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 180px)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <SelectField
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    { value: "lost", label: "Lost Item" },
                    { value: "found", label: "Found Item" },
                  ]}
                />
                <InputField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief title of the item"
                />
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
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]`}
                  placeholder="Provide a detailed description of the item..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where was it lost/found?"
                />
                <InputField
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Images
                </label>
                <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Item ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/80 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8533] font-medium transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00] focus:ring-opacity-50 transition-colors`}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
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
      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default LostAndFoundForm;
