import Thar from "../assets/Thar.png";
import Mazda from "../assets/Mazda.png";

export default function UserSalesList() {
    const handleSellVehicle = () => {
        navigate('/SellVehicle');
      };
    const listings = [
      {
        brand: "MAZDA",
        model: "MAZDA6",
        year: "2024",
        mileage: "18000 Km",
        price: "1,900,000",
        status: "sold",
        image: Mazda
      },
      {
        brand: "MAHINDRA",
        model: "THAR",
        year: "2023",
        mileage: "8000 Km",
        price: "20,000,000",
        status: "pending",
        image: Thar
      },
      {
        brand: "MAZDA",
        model: "MAZDA6",
        year: "2024",
        mileage: "18000 Km",
        price: "1,900,000",
        status: "sold",
        image: Mazda
      },
      {
        brand: "MAHINDRA",
        model: "THAR",
        year: "2023",
        mileage: "8000 Km",
        price: "20,000,000",
        status: "pending",
        image: Thar
      },
    ]
  
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">
            Your <span className="text-[#D35400]">List</span>
          </h1>
          <button onClick={handleSellVehicle} className="bg-[#D35400] text-white px-6 py-2 rounded-lg hover:bg-[#A04000] transition-colors">
            Sell a Car
          </button>
        </div>
  
        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {listings.map((listing, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="relative">
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={`${listing.brand} ${listing.model}`}
                  className="w-full h-48 object-contain mb-4"
                />
                <div
                  className={`absolute top-0 right-0 ${
                    listing.status === "sold" ? "bg-red-500" : "bg-green-500"
                  } text-white px-4 py-1 rounded-bl-lg font-bold transform rotate-0`}
                >
                  {listing.status === "sold" ? "SOLD" : "PENDING"}
                </div>
              </div>
  
              <div className="space-y-2">
                <div>
                  <h3 className="text-red-600 font-medium">{listing.brand}</h3>
                  <p className="text-gray-500 text-xl">{listing.model}</p>
                </div>
  
                <div className="flex justify-between items-center text-gray-600">
                  <span>{listing.year}</span>
                  <span>{listing.mileage}</span>
                </div>
  
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Rs. {listing.price}</span>
                  <button className="bg-[#6366f1] text-white px-4 py-2 rounded-lg hover:bg-[#5558e6] transition-colors">
                    Remove Listing
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  