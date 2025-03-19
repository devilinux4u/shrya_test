import React, { useEffect, useRef, useState } from "react";
import { Car, Users, Award, ThumbsUp, Navigation } from 'lucide-react';
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
  
  const storeLocation = { lat: 27.7172, lng: 85.3240 };

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBCu4eVybLtNvvDgV6kNr71qy5o33Dh2yE", 
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
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
          map: newMap,
          suppressMarkers: false,
        });

        setMap(newMap);
        setDirectionsService(newDirectionsService);
        setDirectionsRenderer(newDirectionsRenderer);
      }
    }).catch(err => {
      console.error("Error loading Google Maps:", err);
      setError("Failed to load Google Maps. Please try again later.");
    });
  }, []);

  const getDirections = () => {
    if (!directionsService || !directionsRenderer) {
      setError("Maps service is not available. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Calculate route
          directionsService.route(
            {
              origin: origin,
              destination: storeLocation,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              setIsLoading(false);
              
              if (status === "OK") {
                directionsRenderer.setDirections(response);
              } else {
                setError("Could not calculate directions. Please try again.");
                console.error("Directions request failed due to " + status);
              }
            }
          );
        },
        (error) => {
          setIsLoading(false);
          console.error("Error getting user location:", error);
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setError("Location access was denied. Please enable location services to get directions.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable. Please try again later.");
              break;
            case error.TIMEOUT:
              setError("The request to get your location timed out. Please try again.");
              break;
            default:
              setError("An unknown error occurred while trying to get your location.");
              break;
          }
        }
      );
    } else {
      setIsLoading(false);
      setError("Geolocation is not supported by your browser. Please use the external Google Maps link.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative w-[200px] h-[100px]">
              <img
                src={Logo || "/placeholder.svg"}
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
              
              <div className="mt-4 text-center flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={getDirections}
                  className="inline-flex items-center px-6 py-2 text-white bg-[#ff6b00] rounded-lg shadow-md hover:bg-[#e65a00] transition-colors"
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Get Directions
                </button>
                
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=27.7172,85.3240"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 text-[#ff6b00] border border-[#ff6b00] rounded-lg shadow-md hover:bg-[#fff8f5] transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <strong>Address:</strong> Pragati Marga, Kathmandu, Nepal
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> +977-1-1234567
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> info@shreyaauto.com
                </p>
                <p className="text-gray-600">
                  <strong>Hours:</strong> Mon-Sat: 9 AM - 6 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;