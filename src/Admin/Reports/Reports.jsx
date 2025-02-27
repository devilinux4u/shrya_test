"use client"

import { useState } from "react"
import {
  Download,
  FileText,
  Calendar,
  Clock,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Car,
  DollarSign,
  CheckCircle,
  PenToolIcon as Tool,
} from "lucide-react"

// Mock data for reports
const initialReports = {
  salesReport: {
    totalSales: 125000,
    totalOrders: 450,
    averageOrderValue: 277.78,
    topSellingVehicles: [
      { name: "Tesla Model 3", sales: 45, revenue: 22500 },
      { name: "BMW X5", sales: 38, revenue: 19000 },
      { name: "Mercedes C-Class", sales: 32, revenue: 16000 },
    ],
    monthlySales: [
      { month: "Jan", amount: 18500 },
      { month: "Feb", amount: 21000 },
      { month: "Mar", amount: 19500 },
      { month: "Apr", amount: 22500 },
      { month: "May", amount: 20500 },
      { month: "Jun", amount: 23000 },
    ],
  },
  rentalReport: {
    totalRentals: 850,
    activeRentals: 120,
    averageDuration: 5.2,
    utilization: 78,
    popularCategories: [
      { category: "SUV", count: 320, percentage: 38 },
      { category: "Sedan", count: 280, percentage: 33 },
      { category: "Sports", count: 150, percentage: 18 },
      { category: "Electric", count: 100, percentage: 11 },
    ],
  },
  inventoryReport: {
    totalVehicles: 200,
    availableVehicles: 145,
    maintenanceCount: 15,
    reservedCount: 40,
    categoryBreakdown: [
      { category: "SUV", count: 75, status: { available: 55, reserved: 15, maintenance: 5 } },
      { category: "Sedan", count: 65, status: { available: 48, reserved: 12, maintenance: 5 } },
      { category: "Sports", count: 35, status: { available: 25, reserved: 8, maintenance: 2 } },
      { category: "Electric", count: 25, status: { available: 17, reserved: 5, maintenance: 3 } },
    ],
  },
}

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30")
  const [reportType, setReportType] = useState("sales")
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    email: "",
    frequency: "weekly",
    format: "pdf",
  })

  const handleScheduleSubmit = (e) => {
    e.preventDefault()
    console.log("Scheduling report:", scheduleForm)
    setShowSchedule(false)
  }

  const getReportContent = () => {
    switch (reportType) {
      case "sales":
        return (
          <div className="space-y-6">
            {/* Sales Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      ${initialReports.salesReport.totalSales.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-800">{initialReports.salesReport.totalOrders}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Order Value</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      ${initialReports.salesReport.averageOrderValue}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales Trend</h3>
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  {initialReports.salesReport.monthlySales.map((month, index) => (
                    <div key={month.month} className="flex flex-col items-center gap-2 w-1/6">
                      <div
                        style={{ height: `${(month.amount / 25000) * 100}%` }}
                        className="w-8 bg-blue-500 rounded-t"
                      />
                      <span className="text-xs text-gray-600">{month.month}</span>
                      <span className="text-xs font-medium text-gray-800">${(month.amount / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Selling Vehicles */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Vehicles</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-4">Vehicle</th>
                      <th className="pb-4">Sales</th>
                      <th className="pb-4">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialReports.salesReport.topSellingVehicles.map((vehicle, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-4">
                          <span className="font-medium text-gray-800">{vehicle.name}</span>
                        </td>
                        <td className="py-4">{vehicle.sales}</td>
                        <td className="py-4">${vehicle.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case "rentals":
        return (
          <div className="space-y-6">
            {/* Rentals Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Rentals</p>
                    <h3 className="text-2xl font-bold text-gray-800">{initialReports.rentalReport.totalRentals}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Rentals</p>
                    <h3 className="text-2xl font-bold text-gray-800">{initialReports.rentalReport.activeRentals}</h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Duration (Days)</p>
                    <h3 className="text-2xl font-bold text-gray-800">{initialReports.rentalReport.averageDuration}</h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Utilization Rate</p>
                    <h3 className="text-2xl font-bold text-gray-800">{initialReports.rentalReport.utilization}%</h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
              <div className="space-y-4">
                {initialReports.rentalReport.popularCategories.map((category) => (
                  <div key={category.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{category.category}</span>
                      <span className="text-gray-800 font-medium">{category.count} rentals</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div style={{ width: `${category.percentage}%` }} className="bg-blue-500 h-2 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "inventory":
        return (
          <div className="space-y-6">
            {/* Inventory Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Vehicles</p>
                    <h3 className="text-2xl font-bold text-gray-800">{initialReports.inventoryReport.totalVehicles}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {initialReports.inventoryReport.availableVehicles}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Maintenance</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {initialReports.inventoryReport.maintenanceCount}
                    </h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Tool className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reserved</p>
                    <h3 className="text-2xl font-bold text-gray-800">{initialReports.inventoryReport.reservedCount}</h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Total</th>
                      <th className="pb-4">Available</th>
                      <th className="pb-4">Reserved</th>
                      <th className="pb-4">Maintenance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialReports.inventoryReport.categoryBreakdown.map((category) => (
                      <tr key={category.category} className="border-t">
                        <td className="py-4">
                          <span className="font-medium text-gray-800">{category.category}</span>
                        </td>
                        <td className="py-4">{category.count}</td>
                        <td className="py-4">{category.status.available}</td>
                        <td className="py-4">{category.status.reserved}</td>
                        <td className="py-4">{category.status.maintenance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 ml-64 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600">Generate and analyze detailed reports</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="lastYear">Last year</option>
            <option value="custom">Custom Range</option>
          </select>

          <button
            onClick={() => setShowSchedule(true)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            Schedule Report
          </button>

          <div className="relative">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setReportType("sales")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            reportType === "sales"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          <DollarSign className="w-5 h-5" />
          Sales Report
        </button>

        <button
          onClick={() => setReportType("rentals")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            reportType === "rentals"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          <Car className="w-5 h-5" />
          Rental Report
        </button>

        <button
          onClick={() => setReportType("inventory")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            reportType === "inventory"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Inventory Report
        </button>
      </div>

      {/* Report Content */}
      {getReportContent()}

      {/* Schedule Report Modal */}
      {showSchedule && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowSchedule(false)}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule Report</h2>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={scheduleForm.email}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={scheduleForm.frequency}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Format</label>
                <select
                  value={scheduleForm.format}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, format: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSchedule(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

