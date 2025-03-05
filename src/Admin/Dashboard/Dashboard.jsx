"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Car,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CreditCard,
  Wallet,
  Building,
  TrendingUp,
  Eye,
  ArrowRight,
  Heart,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // State for all data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalSellVehicles: 0,
    totalRentalVehicles: 0,
    totalBookings: 0,
    activeBookings: 0,
    pendingBookings: 0,
    totalLost: 0,
    totalFound: 0,
    recentTransactions: [],
    totalEarnings: 0,
    topSellingModels: [],
    wishlistStatus: [],
    bookingStatusOverview: [],
  });

  const [loading, setLoading] = useState(true);

  // Theme colors
  const primaryBlue = "#2563EB"; // Blue-600
  const primaryOrange = "#F97316"; // Orange-500

  // Colors for wishlist chart - defined outside the component to be consistent
  const wishlistColors = {
    Available: "#10B981", // Green
    Pending: "#F59E0B", // Amber
    Cancelled: "#EF4444", // Red
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:3000/dashboard/summary");
        const data = await response.json();

        console.log("Dashboard Data:", data);

        setDashboardData({
          totalUsers: data.totalUsers,
          totalSellVehicles: data.totalSellVehicles,
          totalRentalVehicles: data.totalRentalVehicles,
          totalBookings: data.totalBookings,
          activeBookings: data.activeBookings,
          pendingBookings: data.pendingBookings,
          lateBookings: data.lateBookings,
          pendingBookings: data.pendingBookings || 0,
          totalLost: data.totalLost,
          totalFound: data.totalFound,
          recentTransactions: data.recentTransactions,
          totalEarnings: data.totalEarnings,
          topSellingModels: data.topSellingModels || [
            { model: "Toyota Corolla", sales: 15 },
            { model: "Honda Civic", sales: 12 },
            { model: "Ford Mustang", sales: 8 },
            { model: "Tesla Model 3", sales: 6 },
            { model: "BMW X5", sales: 5 },
          ],
          wishlistStatus: data.wishlistStatus || [
            { name: "Available", value: 12, color: wishlistColors.Available },
            { name: "Pending", value: 5, color: wishlistColors.Pending },
            { name: "Cancelled", value: 3, color: wishlistColors.Cancelled },
          ],
          bookingStatusOverview: data.overview || [
            { status: "Pending", count: 10 },
            { status: "Active", count: 15 },
            { status: "Late", count: 5 },
            { status: "Cancelled", count: 3 },
            { status: "Completed", count: 20 },
            { status: "Completed Late", count: 2 },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTotalUsers = () => {
    navigate("/admin/users");
  };

  const handleAddVehicle = () => {
    navigate("/admin/vehicles");
  };

  const handleAddRentalVehicle = () => {
    navigate("/admin/allvehicles");
  };

  const handleViewTransactions = () => {
    navigate("/admin/transactions");
  };

  const handleViewActiveRentals = () => {
    navigate("/admin/activerentals");
  };

  const handleViewWishlist = () => {
    navigate("/admin/adminwishlist");
  };

  const handleLostAndFound = () => {
    navigate("/admin/lostandfound");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodStyle = (method) => {
    switch (method) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "khalti":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "khalti":
        return <CreditCard className="w-4 h-4" />;
      case "cash":
        return <Wallet className="w-4 h-4" />;
      case "bank_transfer":
        return <Building className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "cash":
        return "Cash";
      case "khalti":
        return "Khalti";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return (
          method.charAt(0).toUpperCase() + method.slice(1).replace("_", " ")
        );
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}, ${hh}:${min}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString() || 0}`;
  };

  if (loading) {
    return (
      <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center border-l-4 border-orange-500 pl-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back to your dashboard
              </p>
            </div>
          </div>
          <div className="h-1 bg-orange-500 mt-4 rounded-full w-full max-w-md" />
        </div>

        {/* Main Stats - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="sm:col-span-2">
            <StatCard
              title="Total Users"
              onClick={handleTotalUsers}
              value={dashboardData.totalUsers.toLocaleString()}
              icon={<Users className="w-5 h-5 text-blue-600" />}
              bgColor="bg-white"
              borderColor="border-gray-200"
              iconBg="bg-blue-100"
            />
          </div>
          <div className="col-span-1">
            <StatCard
              title="Vehicles for Sale"
              onClick={handleAddVehicle}
              value={dashboardData.totalSellVehicles.toLocaleString()}
              icon={<Car className="w-5 h-5 text-orange-500" />}
              bgColor="bg-white"
              borderColor="border-gray-200"
              iconBg="bg-orange-100"
              buttonText="Add Vehicle"
              buttonColor="bg-orange-500"
            />
          </div>
          <div className="col-span-1">
            <StatCard
              title="Rental Vehicles"
              onClick={handleAddRentalVehicle}
              value={dashboardData.totalRentalVehicles.toLocaleString()}
              icon={<Car className="w-5 h-5 text-blue-600" />}
              bgColor="bg-white"
              borderColor="border-gray-200"
              iconBg="bg-blue-100"
              buttonText="Add Vehicle"
              buttonColor="bg-blue-600"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Rental Booking Status Overview
                </h2>
                <p className="text-sm text-gray-500">
                  Overview of booking statuses
                </p>
              </div>
            </div>
            <div className="h-[300px]">
              <BookingStatusBarChart
                data={dashboardData.bookingStatusOverview}
                primaryColor={primaryBlue}
              />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Wishlist Status
                </h2>
                <p className="text-sm text-gray-500">
                  Distribution of wishlist vehicle statuses
                </p>
              </div>
              <button
                onClick={handleViewWishlist}
                className="px-4 py-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium flex items-center"
              >
                Details
                <Heart className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="h-[300px]">
              <WishlistPieChart
                data={dashboardData.wishlistStatus}
                colors={wishlistColors}
              />
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="col-span-1 sm:col-span-2">
            <SimpleOngoingBookingCard
              active={dashboardData.activeBookings}
              pending={dashboardData.pendingBookings}
              late={
                dashboardData.bookingStatusOverview.find(
                  (status) => status.status === "Late"
                )?.count || 0
              }
              activeColor="bg-blue-600"
              pendingColor="bg-orange-400"
              lateColor="bg-red-500"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <LostAndFoundCard
              total={dashboardData.totalLost + dashboardData.totalFound}
              lost={dashboardData.totalLost}
              found={dashboardData.totalFound}
              onClick={handleLostAndFound}
              lostColor="bg-orange-500"
              foundColor="bg-blue-500"
            />
          </div>
        </div>

        {/* Recent Transactions - Full Width */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
                <span className="text-sm text-gray-500 block sm:inline sm:ml-4">
                  Total Earnings:{" "}
                  <span className="font-bold text-gray-900">
                    {formatCurrency(dashboardData.totalEarnings)}
                  </span>
                </span>
              </h2>
              <p className="text-sm text-gray-500">Latest payment activities</p>
            </div>
            <button
              onClick={handleViewTransactions}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center"
            >
              View All
              <TrendingUp className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <div className="inline-block min-w-full align-middle px-4 sm:px-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {dashboardData.recentTransactions?.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.id}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Rs. {transaction.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getPaymentMethodStyle(
                            transaction.method || "cash"
                          )}`}
                        >
                          <span className="mr-1">
                            {getPaymentMethodIcon(transaction.method || "cash")}
                          </span>
                          {getPaymentMethodName(transaction.method || "cash")}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDateTime(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            transaction.status || "completed"
                          )}`}
                        >
                          {(transaction.status || "completed")
                            .charAt(0)
                            .toUpperCase() +
                            (transaction.status || "completed").slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced card components
function StatCard({
  title,
  value,
  icon,
  bgColor,
  borderColor,
  iconBg,
  onClick,
  buttonText,
  buttonColor,
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-6 rounded-xl shadow-sm ${bgColor} border ${borderColor} hover:shadow-md transition-all h-full cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconBg} shadow-sm`}>{icon}</div>
      </div>
      {buttonText && (
        <button
          className={`mt-4 px-3 py-1 text-xs font-medium text-white rounded-lg ${buttonColor} hover:opacity-90 transition-opacity`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

function SimpleBookingCard({
  title,
  value,
  icon,
  bgColor,
  iconBg,
  borderColor,
  onClick,
  progressColor,
  progressPercentage,
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-6 rounded-xl shadow-sm ${bgColor} border ${borderColor} hover:shadow-md transition-all h-full cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <div className={`p-2 ${iconBg} rounded-lg`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="w-full h-1 bg-gray-100 rounded-full mt-4">
        <div
          className={`h-1 ${progressColor} rounded-full`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function SimpleOngoingBookingCard({
  active,
  pending,
  late,
  activeColor,
  pendingColor,
  lateColor,
}) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-700">Ongoing</p>
        <div className="p-2 bg-orange-100 rounded-lg">
          <Clock className="w-5 h-5 text-orange-500" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {active + pending + late}
      </p>
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <div>
          <span
            className={`inline-block w-2 h-2 ${activeColor} rounded-full mr-1`}
          ></span>
          Active: {active}
        </div>
        <div>
          <span
            className={`inline-block w-2 h-2 ${pendingColor} rounded-full mr-1`}
          ></span>
          Pending: {pending}
        </div>
        <div>
          <span
            className={`inline-block w-2 h-2 ${lateColor} rounded-full mr-1`}
          ></span>
          Late: {late}
        </div>
      </div>
    </div>
  );
}

// Lost and Found Card Component
function LostAndFoundCard({
  total,
  lost,
  found,
  onClick,
  lostColor,
  foundColor,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all h-full cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-700">Lost & Found</p>
        <div className="p-2 bg-blue-100 rounded-lg">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{total}</p>
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <div>
          <span
            className={`inline-block w-2 h-2 ${lostColor} rounded-full mr-1`}
          ></span>
          Lost: {lost}
        </div>
        <div>
          <span
            className={`inline-block w-2 h-2 ${foundColor} rounded-full mr-1`}
          ></span>
          Found: {found}
        </div>
      </div>
    </div>
  );
}

function HorizontalBarChart({ data, primaryColor }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="model"
          tick={{ fontSize: 12 }}
          width={80}
        />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            padding: "10px",
            fontSize: "12px",
            color: "white",
          }}
          itemStyle={{ color: "white" }}
          labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
        />
        <Bar
          dataKey="sales"
          fill={primaryColor}
          radius={[0, 4, 4, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function WishlistPieChart({ data, colors }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            color: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          itemStyle={{ color: "white" }}
          formatter={(value, name) => [`${value} vehicles`, name]}
        />
        <RechartsLegend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            fontSize: "13px",
            paddingTop: "20px",
            fontWeight: "500",
          }}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Booking Status Bar Chart Component
function BookingStatusBarChart({ data, primaryColor }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="status" tick={{ fontSize: 12 }} />
        <YAxis />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            padding: "10px",
            fontSize: "12px",
            color: "white",
          }}
          itemStyle={{ color: "white" }}
          labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
        />
        <Bar
          dataKey="count"
          fill={primaryColor}
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
