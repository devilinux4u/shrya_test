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

  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [wishlistStatus, setWishlistStatus] = useState([]);
  const [lostAndFound, setLostAndFound] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [topSellingModels, setTopSellingModels] = useState([]);

  useEffect(() => {
    // Fetch notifications
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));

    // Fetch bookings
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));

    // Fetch wishlist
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => setWishlist(data))
      .catch((err) => console.error("Error fetching wishlist:", err));

    // Fetch wishlist status
    fetch("/api/wishlist/status")
      .then((res) => res.json())
      .then((data) => setWishlistStatus(data))
      .catch((err) => console.error("Error fetching wishlist status:", err));

    // Fetch lost and found
    fetch("/api/lostandfound")
      .then((res) => res.json())
      .then((data) => setLostAndFound(data))
      .catch((err) => console.error("Error fetching lost and found:", err));

    // Fetch transactions
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Error fetching transactions:", err));

    // Fetch top-selling models
    fetch("/api/topsellingmodels")
      .then((res) => res.json())
      .then((data) => setTopSellingModels(data))
      .catch((err) => console.error("Error fetching top-selling models:", err));
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
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-blue-50 text-blue-600";
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

  const getPaymentMethodStyle = (method) => {
    switch (method) {
      case "cash":
        return "bg-blue-100 text-blue-800";
      case "khalti":
        return "bg-orange-100 text-orange-800";
      case "bank_transfer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  // Theme colors
  const primaryBlue = "#2563EB"; // Blue-600
  const primaryOrange = "#F97316"; // Orange-500

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
              value="1,280"
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
              value="180"
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
              value="140"
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
                  Top Selling Models
                </h2>
                <p className="text-sm text-gray-500">
                  Best performing vehicles
                </p>
              </div>
            </div>
            <div className="h-[300px]">
              <HorizontalBarChart
                data={topSellingModels}
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
              <WishlistPieChart data={wishlistStatus} />
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="col-span-1">
            <SimpleBookingCard
              title="Total Bookings"
              onClick={handleViewActiveRentals}
              value={bookings.total}
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
              bgColor="bg-white"
              iconBg="bg-blue-100"
              borderColor="border-gray-200"
              progressColor="bg-blue-600"
            />
          </div>
          <div className="col-span-1">
            <SimpleOngoingBookingCard
              active={bookings.active}
              pending={bookings.pending}
              activeColor="bg-blue-600"
              pendingColor="bg-orange-400"
            />
          </div>
          <div className="col-span-1">
            <LostAndFoundCard
              total={lostAndFound.total}
              lost={lostAndFound.lost}
              found={lostAndFound.found}
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
                  <span className="font-bold text-gray-900">$152,000</span>
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
                      Customer
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
                  {transactions.map((transaction) => (
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
                          {transaction.customer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.customer.email}
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
                            transaction.method
                          )}`}
                        >
                          <span className="mr-1">
                            {getPaymentMethodIcon(transaction.method)}
                          </span>
                          {getPaymentMethodName(transaction.method)}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDateTime(transaction.date)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
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
          style={{ width: "70%" }}
        ></div>
      </div>
    </div>
  );
}

function SimpleOngoingBookingCard({
  active,
  pending,
  activeColor,
  pendingColor,
}) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-700">Ongoing</p>
        <div className="p-2 bg-orange-100 rounded-lg">
          <Clock className="w-5 h-5 text-orange-500" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{active + pending}</p>
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
      </div>
    </div>
  );
}

// New Lost and Found Card Component
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

function WishlistPieChart({ data }) {
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
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
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
