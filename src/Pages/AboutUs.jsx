import React, { useEffect, useRef, useState } from "react";
import {
  Car,
  Users,
  Award,
  ThumbsUp,
  Navigation,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { Loader } from "@googlemaps/js-api-loader";

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
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const storeLocation = { lat: 27.721255435875104, lng: 85.33757349099218 };

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBCu4eVybLtNvvDgV6kNr71qy5o33Dh2yE",
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current) {
          // Initialize the map
          const newMap = new google.maps.Map(mapRef.current, {
            center: storeLocation,
            zoom: 15,
          });

          // Add marker for the store
          new google.maps.Marker({
            position: storeLocation,
            map: newMap,
            title: "Shreya Auto Enterprises",
          });

          // Initialize directions service and renderer
          const newDirectionsService = new google.maps.DirectionsService();
          const newDirectionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
          });

          setMap(newMap);
          setDirectionsService(newDirectionsService);
          setDirectionsRenderer(newDirectionsRenderer);
        }
      })
      .catch((err) => {
        console.error("Error loading Google Maps:", err);
        setError("Failed to load Google Maps. Please try again later.");
      });
  }, []);

  const getDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = `${position.coords.latitude},${position.coords.longitude}`;
          const destination = `${storeLocation.lat},${storeLocation.lng}`;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

          // Open Google Maps in a new tab
          window.open(googleMapsUrl, "_blank");
        },
        (error) => {
          console.error("Error getting user location:", error);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError(
                "Location access was denied. Please enable location services to get directions."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setError(
                "Location information is unavailable. Please try again later."
              );
              break;
            case error.TIMEOUT:
              setError(
                "The request to get your location timed out. Please try again."
              );
              break;
            default:
              setError(
                "An unknown error occurred while trying to get your location."
              );
              break;
          }
        }
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Please use the external Google Maps link."
      );
    }
  };

  const resetMap = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    if (map) {
      map.setCenter(storeLocation);
      map.setZoom(15);

      new google.maps.Marker({
        position: storeLocation,
        map: map,
        title: "Shreya Auto Enterprises",
      });
    }
    setShowDirections(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-9 max-w-7xl mx-auto">
        {/* Logo and Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About{" "}
            <span className="text-[#ff6b00]">Shreya Auto Enterprises</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing the automotive industry in Kathmandu with quality
            service and customer care.
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="relative w-[300px] h-[150px]">
            <img
              src={Logo || "/placeholder.svg"}
              alt="Shreya Auto Enterprises Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Shreya Auto Enterprises is a well-known car dealership located at
            Pragati Marga, Kathmandu. We have built our reputation on providing
            quality service and exceptional customer care.
          </p>
          <p className="text-gray-600">
            As we look to the future, we're expanding our services by building
            an innovative online vehicle rental and eCommerce platform. This
            digital transformation will allow us to streamline our operations
            and offer our clients a simple way to rent, purchase, or swap
            vehicles.
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
            {/* Google Maps */}
            <div className="h-[400px] rounded-lg overflow-hidden shadow-md w-full relative">
              <div ref={mapRef} className="w-full h-full" />

              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b00] mx-auto"></div>
                    <p className="mt-2">Getting directions...</p>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
                  {error}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <div className="flex items-start space-x-4 mb-4">
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
              <div className="flex items-start space-x-4 mb-4">
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
              <div className="flex items-start space-x-4 mb-6">
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

              {/* Buttons */}
              <div className="flex flex-col space-y-4">
                <button
                  onClick={showDirections ? resetMap : getDirections}
                  className={`inline-flex items-center justify-center px-6 py-2 rounded-lg shadow-md transition-colors ${
                    showDirections
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-[#ff6b00] text-white hover:bg-[#e65a00]"
                  }`}
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  {showDirections ? "Reset Map" : "Get Directions"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
