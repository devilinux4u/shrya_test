"use client";

import { useState, useEffect } from "react";
import {
  Search,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  FileText,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Car,
  CreditCardIcon as CardIcon,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/transaction");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "cancelled":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "khalti":
        return <CreditCard className="w-5 h-5" />;
      case "paypal":
        return <span className="font-bold">Rs.</span>;
      case "bank_transfer":
        return <ArrowUpRight className="w-5 h-5" />;
      default:
        return <span className="font-bold">Rs.</span>;
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

  // Calculate total amounts
  const totalAmount = transactions
    .filter((trx) => trx.status === "paid")
    .reduce((sum, trx) => sum + (trx.amount || 0), 0);

  const pendingAmount = transactions
    .filter((trx) => trx.status === "pending")
    .reduce((sum, trx) => sum + (trx.amount || 0), 0);

  const cancelledAmount = transactions
    .filter((trx) => trx.status === "cancelled")
    .reduce((sum, trx) => sum + (trx.amount || 0), 0);

  const filteredTransactions = transactions.filter((transaction) => {
    const customer = transaction.Booking?.User?.fname?.toLowerCase() || "";
    const matchesSearch = customer.includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || transaction.type === filterType;

    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;

    const transactionDate = new Date(transaction.createdAt);
    const matchesDate =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate);

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}, ${hh}:${min}:${ss}`;
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 ml-0 md:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <div className="border-l-4 border-[#ff6b00] pl-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Transactions
            </h1>
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Transaction Management
          </h1>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500">Total Transactions</h3>
                <div className="p-3 bg-[#4F46E5]/10 rounded-full">
                  <DollarSign className="w-6 h-6 text-[#4F46E5]" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">
                Rs. {totalAmount.toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                {transactions.length} transactions
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500">Pending Transactions</h3>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ArrowDownRight className="w-6 h-6 text-yellow-800" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">
                Rs. {pendingAmount.toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                {transactions.filter((trx) => trx.status === "pending").length}{" "}
                transactions
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500">Cancelled Transactions</h3>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="w-6 h-6 text-red-800" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">
                Rs. {cancelledAmount.toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                {
                  transactions.filter((trx) => trx.status === "cancelled")
                    .length
                }{" "}
                transactions
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id || Math.random()}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.id ? transaction.id : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.Booking?.User?.fname || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.Booking?.User?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {transaction.amount?.toLocaleString() || "0"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status?.toUpperCase() || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center text-sm px-2 py-1 rounded-full ${getPaymentMethodStyle(
                          transaction.method
                        )}`}
                      >
                        {getPaymentMethodIcon(transaction.method)}
                        <span className="ml-2">
                          {transaction.method || "N/A"}
                          {transaction.cardLast4 &&
                            ` (*${transaction.cardLast4})`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        {transaction.status === "completed" && (
                          <button className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                            <RefreshCcw className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Component */}
        {filteredTransactions.length > 0 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border-r border-gray-200 flex items-center ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 border-r border-gray-200 ${
                      currentPage === number
                        ? "bg-orange-500 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 flex items-center ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Improved Transaction Detail Modal */}
        {selectedTransaction && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTransaction(null)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Transaction ID and Status */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div
                      className={`p-3 rounded-full ${
                        selectedTransaction.status === "paid" ||
                        selectedTransaction.status === "completed"
                          ? "bg-green-100"
                          : selectedTransaction.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {getStatusIcon(selectedTransaction.status)}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Transaction #{selectedTransaction.id}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          selectedTransaction.status
                        )}`}
                      >
                        {selectedTransaction.status?.toUpperCase() || "N/A"}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDateTime(selectedTransaction.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    Customer Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {selectedTransaction.Booking?.User?.fname || "N/A"}{" "}
                        {selectedTransaction.Booking?.User?.lname || ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-medium">
                          {selectedTransaction.Booking?.User?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-medium">
                          {selectedTransaction.Booking?.User?.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Vehicle & Rental Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Car className="w-5 h-5 mr-2 text-gray-500" />
                    Vehicle & Rental Details
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">
                        {selectedTransaction.Booking?.Rental?.RentVehicle
                          ?.make || "N/A"}{" "}
                        {selectedTransaction.Booking?.Rental?.RentVehicle
                          ?.model || ""}{" "}
                        (
                        {selectedTransaction.Booking?.Rental?.RentVehicle
                          ?.year || ""}
                        )
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">License Plate</p>
                      <p className="font-medium">
                        {selectedTransaction.Booking?.Rental?.RentVehicle
                          ?.numberPlate || "N/A"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <p className="font-medium">
                            {selectedTransaction.Booking?.Rental?.startDate
                              ? formatDate(
                                  selectedTransaction.Booking.Rental.startDate
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <p className="font-medium">
                            {selectedTransaction.Booking?.Rental?.endDate
                              ? formatDate(
                                  selectedTransaction.Booking.Rental.endDate
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Rental Duration</p>
                      <p className="font-medium">
                        {selectedTransaction.Booking?.Rental?.totalDays || "0"}{" "}
                        days
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-medium">
                        {selectedTransaction.Booking?.pickupLocation || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Drop-off Location</p>
                      <p className="font-medium">
                        {selectedTransaction.Booking?.dropoffLocation || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Payment Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CardIcon className="w-5 h-5 mr-2 text-gray-500" />
                    Payment Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <div className="flex items-center">
                        {getPaymentMethodIcon(selectedTransaction.method)}
                        <p className="font-medium ml-2">
                          {selectedTransaction.method || "N/A"}
                          {selectedTransaction.cardLast4 &&
                            ` (*${selectedTransaction.cardLast4})`}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                      <p className="text-base font-semibold">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">
                        Rs.{" "}
                        {selectedTransaction.amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes or Booking Details */}
              {selectedTransaction.Booking?.notes && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Notes
                  </h3>
                  <p className="text-gray-700">
                    {selectedTransaction.Booking.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
