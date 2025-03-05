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
import {
  Car,
  Users,
  DollarSign,
  ShoppingCart,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Wallet,
  Building,
  TrendingUp,
  ChevronDown,
  Eye,
  Plus,
  ArrowRight,
  Download,
  Filter,
  Heart,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const handleTotalUsers = () => {
    navigate("/admin/users");
  };

  const handleAddVehicle = () => {
    navigate("/admin/addnewvehicles");
  };

  const handleAddRentalVehicle = () => {
    navigate("/admin/addvehicle");
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
    navigate("/admin/lostand");
  };

  const [notifications] = useState([
    { id: 1, type: "lost", message: "New lost item reported: iPhone 12" },
    { id: 2, type: "inquiry", message: "New inquiry for Toyota Camry" },
    { id: 3, type: "found", message: "Item claimed: Designer sunglasses" },
    { id: 4, type: "inquiry", message: "Rental inquiry for Tesla Model 3" },
    { id: 5, type: "lost", message: "New lost item reported: Car keys" },
  ]);

  // Mock data for bookings
  const [bookings, setBookings] = useState({
    total: 245,
    completed: 180,
    active: 30,
    pending: 15,
    cancelled: 20,
  });

  // Mock data for wishlist and lost & found
  const [wishlist, setWishlist] = useState({
    total: 320,
  });

  const [lostAndFound, setLostAndFound] = useState({
    total: 85,
    lost: 45,
    found: 40,
  });

  // Mock data for transactions
  const [transactions, setTransactions] = useState([
    {
      id: "TRX-001",
      customer: { name: "John Doe", email: "john@example.com" },
      amount: 25000,
      status: "completed",
      method: "cash",
      date: "2023-05-15T10:30:00",
    },
    {
      id: "TRX-002",
      customer: { name: "Jane Smith", email: "jane@example.com" },
      amount: 15000,
      status: "pending",
      method: "khalti",
      date: "2023-05-16T14:20:00",
    },
    {
      id: "TRX-003",
      customer: { name: "Robert Johnson", email: "robert@example.com" },
      amount: 45000,
      status: "completed",
      method: "bank_transfer",
      date: "2023-05-17T09:15:00",
    },
    {
      id: "TRX-004",
      customer: { name: "Emily Davis", email: "emily@example.com" },
      amount: 8000,
      status: "cancelled",
      method: "cash",
      date: "2023-05-18T16:45:00",
    },
    {
      id: "TRX-005",
      customer: { name: "Michael Wilson", email: "michael@example.com" },
      amount: 12000,
      status: "completed",
      method: "khalti",
      date: "2023-05-19T11:30:00",
    },
  ]);

  const vehicleData = {
    labels: ["Listed", "Sold", "Rented", "Exchanged"],
    datasets: [
      {
        label: "Total Vehicles",
        data: [150, 80, 60, 30],
        backgroundColor: ["#6366F1", "#10B981", "#F59E0B", "#3B82F6"],
        barThickness: 40,
        borderRadius: 6,
      },
    ],
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [30000, 35000, 28000, 38000, 40000, 35000],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Rentals",
        data: [15000, 18000, 20000, 22000, 25000, 23000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
        fill: true,
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
          boxWidth: 6,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        displayColors: false,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
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
        return "bg-green-100 text-green-800";
      case "khalti":
        return "bg-purple-100 text-purple-800";
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

  return (
    <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4 sm:p-6 md:p-8">
        {/* Header with gradient underline */}
        <div className="mb-8">
          <div className="flex items-center border-l-4 border-indigo-500 pl-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back to your dashboard
              </p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-400 mt-4 rounded-full w-full max-w-md" />
        </div>

        {/* Main Stats - Asymmetric grid: 2-1-1 layout */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-6">
            <StatCard
              title="Total Users"
              onClick={handleTotalUsers}
              value="1,280"
              icon={<Users className="w-5 h-5 text-indigo-600" />}
              bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100"
              borderColor="border-indigo-200"
              iconBg="bg-indigo-100"
              buttonText="View Users"
              buttonColor="bg-indigo-600"
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <StatCard
              title="Vehicles for Sale"
              onClick={handleAddVehicle} // Pass the new handler
              value="180"
              icon={<Car className="w-5 h-5 text-green-600" />}
              bgColor="bg-gradient-to-br from-green-50 to-emerald-100"
              borderColor="border-green-200"
              iconBg="bg-green-100"
              buttonText="Add Vehicle"
              buttonColor="bg-green-600"
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <StatCard
              title="Rental Vehicles"
              onClick={handleAddRentalVehicle} // Pass the new handler
              value="140"
              icon={<Car className="w-5 h-5 text-purple-600" />}
              bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
              borderColor="border-purple-200"
              iconBg="bg-purple-100"
              buttonText="Add Vehicle"
              buttonColor="bg-purple-600"
            />
          </div>
          <div className="col-span-12">
            <StatCard
              title="Total Earnings"
              onClick={handleViewTransactions} // Pass the new handler
              value="$152,000"
              icon={<DollarSign className="w-5 h-5 text-blue-600" />}
              bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
              borderColor="border-blue-200"
              iconBg="bg-blue-100"
              buttonText="View Transactions"
              buttonColor="bg-blue-600"
            />
          </div>
        </div>

        {/* Status Grid with Wishlist and Lost & Found */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-3">
            <SimpleBookingCard
              title="Total Bookings"
              onClick={handleViewActiveRentals} // Pass the new handler
              value={bookings.total}
              icon={<Calendar className="w-5 h-5 text-blue-600" />}
              bgColor="bg-white"
              iconBg="bg-blue-100"
              borderColor="border-blue-200"
              buttonText="View All"
              buttonColor="bg-blue-600"
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <SimpleBookingCard
              title="Total Wishlist"
              onClick={handleViewWishlist} // Pass the new handler
              value={wishlist.total}
              icon={<Heart className="w-5 h-5 text-pink-600" />}
              bgColor="bg-white"
              iconBg="bg-pink-100"
              borderColor="border-pink-200"
              buttonText="View All"
              buttonColor="bg-pink-600"
            />
          </div>
          <div className="col-span-6 md:col-span-3">
            <SimpleOngoingBookingCard
              active={bookings.active}
              pending={bookings.pending}
              buttonColor="bg-yellow-600"
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <LostAndFoundCard
              total={lostAndFound.total}
              lost={lostAndFound.lost}
              found={lostAndFound.found}
              onClick={handleLostAndFound} // Pass the new handler
            />
          </div>
        </div>

        {/* Recent Transactions - Full Width */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <p className="text-sm text-gray-500">Latest payment activities</p>
            </div>
            <button
              onClick={() => navigate("/admin/transactions")} // Updated navigation
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center"
            >
              View All
              <TrendingUp className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.customer.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.customer.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {transaction.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getPaymentMethodStyle(
                          transaction.method
                        )}`}
                      >
                        <span className="mr-1">
                          {getPaymentMethodIcon(transaction.method)}
                        </span>
                        {getPaymentMethodName(transaction.method)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDateTime(transaction.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
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
  buttonText,
  buttonColor,
  onClick, // Add onClick prop
}) {
  return (
    <div
      className={`p-6 rounded-xl shadow-sm ${bgColor} border ${borderColor} hover:shadow-md transition-all h-full`}
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
          onClick={onClick} // Attach the onClick handler
          className={`mt-4 px-4 py-2 ${buttonColor} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center w-full md:w-auto`}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-1" />
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
  buttonText,
  buttonColor,
  onClick, // Add onClick prop
}) {
  return (
    <div
      className={`p-6 rounded-xl shadow-sm ${bgColor} border ${borderColor} hover:shadow-md transition-all h-full`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <div className={`p-2 ${iconBg} rounded-lg`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="w-full h-1 bg-gray-100 rounded-full mt-4">
        <div
          className={`h-1 ${iconBg.replace("bg-", "bg-")} rounded-full`}
          style={{ width: "70%" }}
        ></div>
      </div>
      {buttonText && (
        <button
          onClick={onClick} // Attach the onClick handler
          className={`mt-4 px-4 py-2 ${buttonColor} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center w-full`}
        >
          {buttonText}
          <Eye className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>
  );
}

function SimpleOngoingBookingCard({
  active,
  pending,
  buttonText,
  buttonColor,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-700">Ongoing</p>
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Clock className="w-5 h-5 text-yellow-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{active + pending}</p>
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <div>
          <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-1"></span>
          Active: {active}
        </div>
        <div>
          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
          Pending: {pending}
        </div>
      </div>
      {buttonText && (
        <button
          className={`mt-4 px-4 py-2 ${buttonColor} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center w-full`}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>
  );
}

// New Lost and Found Card Component
function LostAndFoundCard({ total, lost, found }) {
  const navigate = useNavigate(); // Ensure navigate is accessible here

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-200 hover:shadow-md transition-all h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-700">Lost & Found</p>
        <div className="p-2 bg-teal-100 rounded-lg">
          <Search className="w-5 h-5 text-teal-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{total}</p>
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <div>
          <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-1"></span>
          Lost: {lost}
        </div>
        <div>
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          Found: {found}
        </div>
      </div>
      <button
        onClick={() => navigate("/admin/lostandfound")} // Corrected navigation path
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center w-full"
      >
        View All
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  chart,
  buttonText,
  buttonIcon,
  buttonColor,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {buttonText && (
          <button
            className={`px-4 py-2 ${buttonColor} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center`}
          >
            {buttonText}
            {buttonIcon}
          </button>
        )}
      </div>
      <div className="h-64">{chart}</div>
    </div>
  );
}
