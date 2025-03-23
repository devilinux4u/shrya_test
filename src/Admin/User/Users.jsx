"use client"

import { useState } from "react"
import { Search, UserPlus, Trash2, User, UsersIcon, XCircle, CheckCircle, AlertTriangle, Eye, Edit } from "lucide-react"
import { format, subMonths, subYears } from "date-fns" // Import date-fns for date manipulation

// Mock data based on your database structure
const initialUsers = [
  {
    id: 4,
    fname: "test",
    uname: "test2",
    email: "prabeshshrestha4693@gmail.com",
    num: "987654322",
    profile: null,
    createdAt: "2025-03-12 17:13:17",
  },
  {
    id: 8,
    fname: "Prabesh Shrestha",
    uname: "Prabesh100",
    email: "sthaprabe20@gmail.com",
    num: "9813245282",
    profile: "/uploads/profile/1742488365626-07564df3-461f-4b70-...",
    createdAt: "2025-03-18 15:57:10",
  },
]

export default function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    fname: "",
    uname: "",
    email: "",
    num: "",
    password: "", // Removed profile field
  })
  const [dateFilter, setDateFilter] = useState("all")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    const newUserData = {
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      ...newUser,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    }
    setUsers([...users, newUserData])
    setShowAddUser(false)
    setNewUser({ fname: "", uname: "", email: "", num: "", password: "" }) // Removed profile reset
  }

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id))
    setShowDeleteConfirm(null)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.num.includes(searchTerm)

    const userDate = new Date(user.createdAt)
    let matchesDate = true

    if (dateFilter === "lastMonth") {
      matchesDate = userDate >= subMonths(new Date(), 1)
    } else if (dateFilter === "lastYear") {
      matchesDate = userDate >= subYears(new Date(), 1)
    } else if (dateFilter === "custom") {
      const startDate = new Date(customDateRange.start)
      const endDate = new Date(customDateRange.end)
      matchesDate = userDate >= startDate && userDate <= endDate
    }

    return matchesSearch && matchesDate
  })

  return (
    <div className="min-h-screen bg-gray-100 ml-64 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">User Management</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <UsersIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{users.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="lastMonth">Joined Last Month</option>
              <option value="lastYear">Joined Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            {dateFilter === "custom" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            <button
              onClick={() => setShowAddUser(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">@{user.uname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.num}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => alert("Edit functionality would go here")}
                        className="text-green-600 hover:text-green-900"
                        title="Edit User"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
              <button onClick={() => setShowAddUser(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.fname}
                  onChange={(e) => setNewUser({ ...newUser, fname: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  required
                  value={newUser.uname}
                  onChange={(e) => setNewUser({ ...newUser, uname: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newUser.num}
                  onChange={(e) => setNewUser({ ...newUser, num: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                  {selectedUser.profile ? (
                    <img
                      src={selectedUser.profile || "/placeholder.svg"}
                      alt={selectedUser.fname}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=128&width=128"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-center">{selectedUser.fname}</h3>
              </div>

              {/* User Details */}
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="text-gray-800">{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-gray-800">@{selectedUser.uname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800">{selectedUser.num}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="text-gray-800">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => alert("Edit functionality would go here")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">Delete User</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

