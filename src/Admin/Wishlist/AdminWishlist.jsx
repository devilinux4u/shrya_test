"use client";

import { useState } from "react";
import { Heart, TrendingUp, Users, ShoppingCart, Download, ArrowUpRight, ArrowDownRight, Car } from "lucide-react";

// Mock data for wishlist analytics
const initialData = {
  overview: {
    totalWishlists: 1200,
    activeUsers: 850,
    conversionRate: 15,
    averageItemsPerList: 3,
  },
  monthlyTrends: [
    { month: "Jan", wishlists: 200, conversions: 30 },
    { month: "Feb", wishlists: 300, conversions: 45 },
    { month: "Mar", wishlists: 400, conversions: 60 },
    { month: "Apr", wishlists: 500, conversions: 75 },
    { month: "May", wishlists: 600, conversions: 90 },
    { month: "Jun", wishlists: 700, conversions: 105 },
  ],
  categoryAnalysis: [
    { category: "Sedans", count: 350, percentage: 30 },
    { category: "SUVs", count: 500, percentage: 45 },
    { category: "Trucks", count: 250, percentage: 25 },
  ],
  popularVehicles: [
    {
      id: 1,
      name: "Tesla Model S",
      image: "/tesla-model-s.jpg",
      wishlistCount: 120,
      conversionRate: 20,
      trend: "up",
    },
    {
      id: 2,
      name: "Ford F-150",
      image: "/ford-f150.jpg",
      wishlistCount: 90,
      conversionRate: 15,
      trend: "down",
    },
    {
      id: 3,
      name: "Toyota Camry",
      image: "/toyota-camry.jpg",
      wishlistCount: 80,
      conversionRate: 10,
      trend: "up",
    },
  ],
};

export default function AdminWishlist() {
  const [dateRange, setDateRange] = useState("last30");
  const [data, setData] = useState(initialData);

  // Calculate max values for chart scaling
  const maxWishlists = Math.max(...data.monthlyTrends.map((item) => item.wishlists));
  const maxConversions = Math.max(...data.monthlyTrends.map((item) => item.conversions));

  return (
    <div className="min-h-screen bg-gray-100 ml-64 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Wishlist</h1>
          <p className="text-gray-600">Track wishlist performance and user engagement</p>
        </div>

        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="lastYear">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Wishlists</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.overview.totalWishlists}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">12% increase</span>
          </div>
        </div>
      </div>


      {/* Popular Vehicles */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Wishlisted Vehicles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-4">Vehicle</th>
                <th className="pb-4">Wishlist Count</th>
                <th className="pb-4">Conversion Rate</th>
                <th className="pb-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.popularVehicles.map((vehicle, index) => (
                <tr key={index} className="border-t">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-800">{vehicle.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-medium text-gray-800">{vehicle.wishlistCount}</span>
                  </td>
                  <td className="py-4">
                    <span className="font-medium text-gray-800">{vehicle.conversionRate}%</span>
                  </td>
                  <td className="py-4">
                    {vehicle.trend === "up" ? (
                      <div className="flex items-center text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm">Increasing</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                        <span className="text-sm">Decreasing</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}