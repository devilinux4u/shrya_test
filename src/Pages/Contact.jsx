import {
  MapPin,
  Phone,
  Mail,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  MessageSquare,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
      name: e.target.fullName.value,
      email: e.target.email.value,
      phno: e.target.phone.value,
      msg: e.target.message.value,
    };

    // Validate form data
    if (!formData.name || !formData.email || !formData.phno || !formData.msg) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.msg);
        // Reset the form after successful submission
        e.target.reset();
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      toast.error("Error while sending message");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Contact <span className="text-[#ff6b00]">Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-[#ff6b00]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Visit Us</h3>
                  <p className="text-gray-600">
                    Shreya Auto Enterprises
                    <br />
                    Bishalnagar-5, Kathmandu,
                    <br />
                    Nepal
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-[#ff6b00]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-gray-600">+977-9841594067</p>
                  <p className="text-gray-600">01-4541713</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-[#ff6b00]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-gray-600">
                    shreyaauto.enterprises@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-8">
              <MessageSquare className="h-8 w-8 text-[#ff6b00]" />
              <h2 className="text-2xl font-bold">Send us a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#ff6b00] focus:border-[#ff6b00] outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#ff6b00] focus:border-[#ff6b00] outline-none transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#ff6b00] focus:border-[#ff6b00] outline-none transition"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#ff6b00] focus:border-[#ff6b00] outline-none transition"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#ff6b00] text-white py-3 px-6 rounded-lg hover:bg-[#ff8533] transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>

            {/* Social Media Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-orange-100 p-3 rounded-full hover:bg-orange-200 transition-colors"
                >
                  <Facebook className="h-6 w-6 text-[#ff6b00]" />
                </a>
                <a
                  href="#"
                  className="bg-orange-100 p-3 rounded-full hover:bg-orange-200 transition-colors"
                >
                  <Instagram className="h-6 w-6 text-[#ff6b00]" />
                </a>
                <a
                  href="#"
                  className="bg-orange-100 p-3 rounded-full hover:bg-orange-200 transition-colors"
                >
                  <Linkedin className="h-6 w-6 text-[#ff6b00]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contact;
