import React from "react";
import { Car, Users, Award, ThumbsUp, MapPin, Sparkles } from "lucide-react";
import Logo from "../assets/Logo.png";

const ValueCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative w-[200px] h-[100px]">
              <img
                src={Logo} // Replace with the correct path to your logo
                alt="Shreya Auto Enterprises Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About <span className="text-[#ff6b00]">Shreya Auto Enterprises</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing the automotive industry in Kathmandu with quality service and customer care.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Shreya Auto Enterprises is a well-known car dealership located at Pragati Marga, Kathmandu. We have built
            our reputation on providing quality service and exceptional customer care.
          </p>
          <p className="text-gray-600">
            As we look to the future, we're expanding our services by building an innovative online vehicle rental and
            eCommerce platform. This digital transformation will allow us to streamline our operations and offer our
            clients a simple way to rent, purchase, or swap vehicles.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <ValueCard
            icon={<Car className="h-12 w-12 text-[#ff6b00]" />}
            title="Quality Vehicles"
            description="Premium selection of vehicles ensuring highest standards of quality and reliability."
          />
          <ValueCard
            icon={<Users className="h-12 w-12 text-[#ff6b00]" />}
            title="Customer Care"
            description="Dedicated to providing exceptional service and support to all our clients."
          />
          <ValueCard
            icon={<Award className="h-12 w-12 text-[#ff6b00]" />}
            title="Innovation"
            description="Embracing digital transformation for an unmatched customer experience."
          />
          <ValueCard
            icon={<ThumbsUp className="h-12 w-12 text-[#ff6b00]" />}
            title="Integrity"
            description="Building trust through transparent and honest business practices."
          />
        </div>

        {/* Location and Contact Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-[#ff6b00] mr-3" />
                <h3 className="text-2xl font-semibold">Visit Us</h3>
              </div>
              <div className="text-gray-600 space-y-2">
                <p className="font-semibold">Shreya Auto Enterprises</p>
                <p>Pragati Marga, Kathmandu</p>
                <p>Nepal</p>
              </div>
              <a
                href="https://www.google.com/maps/dir//Shreya+Auto+Enterprises,Pragati+Marga,Kathmandu,Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#ff6b00] hover:underline mt-4"
              >
                Get Directions
                <MapPin className="h-4 w-4 ml-1" />
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBBlcytxntTu86mWsz5Wcjapk1w9wvPl9w&q=Pragati+Marga,+Kathmandu,+Nepal`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Shreya Auto Enterprises Location"
      />
            </div>
          </div>
        </div>

        {/* Future Features Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-[#ff6b00] mr-2" />
                <h3 className="text-xl font-semibold">New Features</h3>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                <li>Online vehicle rental platform</li>
                <li>Wishlist management system</li>
                <li>Test ride scheduling</li>
                <li>Vehicle purchase and swap options</li>
                <li>Enhanced customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;