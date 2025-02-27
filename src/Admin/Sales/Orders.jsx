"use client"

import { useState } from "react"
import { Search, Eye, Download, Car, Calendar, DollarSign, User, Clock, XCircle } from "lucide-react"

// Mock data for orders
const initialOrders = [
  {
    id: "ORD-2024-001",
    type: "purchase",
    customer: "John Doe",
    vehicle: "Tesla Model 3",
    amount: 45000,
    status: "completed",
    date: "2024-02-20",
    paymentStatus: "paid",
  },
  {
    id: "RNT-2024-001",
    type: "rental",
    customer: "Jane Smith",
    vehicle: "BMW X5",
    amount: 150,
    status: "active",
    date: "2024-02-21",
    returnDate: "2024-02-25",
    paymentStatus: "paid",
  },
  {
    id: "ORD-2024-002",
    type: "purchase",
    customer: "Mike Johnson",
    vehicle: "Ford Mustang",
    amount: 35000,
    status: "pending",
    date: "2024-02-22",
    paymentStatus: "pending",
  },
  {
    id: "RNT-2024-002",
    type: "rental",
    customer: "Sarah Williams",
    vehicle: "Mercedes C-Class",
    amount: 200,
    status: "completed",
    date: "2024-02-19",
    returnDate: "2024-02-21",
    paymentStatus: "paid",
  },
]

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || order.type === filterType
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    // Add ml-64 to offset the fixed sidebar
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      {/* Add padding inside this container */}
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Orders Management</h1>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="purchase">Purchase</option>
                <option value="rental">Rental</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-[#4F46E5] hover:bg-gray-100 rounded-lg">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{order.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="w-4 h-4" />
                    <span>{order.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Rs. {order.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{order.date}</span>
                  </div>
                  {order.type === "rental" && order.returnDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Return: {order.returnDate}</span>
                    </div>
                  )}
                </div>

                {/* Order Type Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.type === "rental" ? "bg-[#4F46E5]/10 text-[#4F46E5]" : "bg-[#DC2626]/10 text-[#DC2626]"
                    }`}
                  >
                    {order.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500 mt-1">View and manage order information</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                    <p className="text-lg font-medium text-gray-900">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="text-lg font-medium text-gray-900">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Vehicle</h3>
                    <p className="text-lg font-medium text-gray-900">{selectedOrder.vehicle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                    <p className="text-lg font-medium text-gray-900">Rs. {selectedOrder.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                    <p className="text-lg font-medium text-gray-900">{selectedOrder.date}</p>
                  </div>
                  {selectedOrder.type === "rental" && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Return Date</h3>
                      <p className="text-lg font-medium text-gray-900">{selectedOrder.returnDate}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] font-medium">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

