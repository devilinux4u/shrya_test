"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  Car,
  Users,
  DollarSign,
  ShoppingCart,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement
);

export default function Dashboard() {
  const [notifications] = useState([
    { id: 1, type: "lost", message: "New lost item reported: iPhone 12" },
    { id: 2, type: "inquiry", message: "New inquiry for Toyota Camry" },
    { id: 3, type: "found", message: "Item claimed: Designer sunglasses" },
    { id: 4, type: "inquiry", message: "Rental inquiry for Tesla Model 3" },
    { id: 5, type: "lost", message: "New lost item reported: Car keys" },
  ]);

  const vehicleData = {
    labels: ["Listed", "Sold", "Rented", "Exchanged"],
    datasets: [
      {
        label: "Total Vehicles",
        data: [150, 80, 60, 30],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"],
        barThickness: 40,
      },
    ],
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [30000, 35000, 28000, 38000, 40000, 35000],
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.4,
      },
      {
        label: "Rentals",
        data: [15000, 18000, 20000, 22000, 25000, 23000],
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <div className="border-l-4 border-[#ff6b00] pl-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <OverviewCard
            title="Total Users"
            value="1,280"
            icon={<Users className="w-6 h-6 text-blue-600" />}
            change={-2.5}
            iconBg="bg-blue-100"
          />
          <OverviewCard
            title="Total Vehicles"
            value="320"
            icon={<Car className="w-6 h-6 text-purple-600" />}
            change={5.2}
            iconBg="bg-purple-100"
          />
          <OverviewCard
            title="Transactions"
            value="96"
            icon={<ShoppingCart className="w-6 h-6 text-orange-600" />}
            change={8.1}
            iconBg="bg-orange-100"
          />
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <EarningSummaryCard
            title="Total Earnings"
            value="$152,000"
            icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          />
          <EarningSummaryCard
            title="Sales Earnings"
            value="$98,500"
            icon={<ShoppingCart className="w-6 h-6 text-green-600" />}
          />
          <EarningSummaryCard
            title="Rental Earnings"
            value="$53,500"
            icon={<Calendar className="w-6 h-6 text-purple-600" />}
          />
        </div>

        {/* Booking Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <BookingOverviewCard title="Total Bookings" value="245" />
          <BookingOverviewCard title="Completed" value="180" />
          <BookingOverviewCard title="Ongoing" value="45" />
          <BookingOverviewCard title="Cancelled" value="20" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Vehicle Overview</h2>
            <div className="h-[300px]">
              <Bar data={vehicleData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Revenue Insights</h2>
            <div className="h-[300px]">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Transactions and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {[
                { type: "Sale", item: "Toyota Camry", amount: "$25,000" },
                { type: "Rental", item: "Tesla Model 3", amount: "$150/day" },
                {
                  type: "Exchange",
                  item: "Honda Civic for Ford Focus",
                  amount: "Even Exchange",
                },
                { type: "Sale", item: "BMW X5", amount: "$45,000" },
                { type: "Rental", item: "Chevrolet Malibu", amount: "$80/day" },
              ].map((transaction, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{transaction.type}</p>
                    <p className="text-sm text-gray-600">{transaction.item}</p>
                  </div>
                  <p className="font-semibold">{transaction.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 border-b pb-2"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium">
                      {notification.type === "lost"
                        ? "Lost Item"
                        : notification.type === "found"
                        ? "Found Item"
                        : "New Inquiry"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep all the helper components exactly the same
function OverviewCard({ title, value, icon, change, iconBg }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
      </div>
      <div
        className={`flex items-center mt-4 ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <ArrowUp className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 mr-1" />
        )}
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
}

function EarningSummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
      </div>
    </div>
  );
}

function BookingOverviewCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
