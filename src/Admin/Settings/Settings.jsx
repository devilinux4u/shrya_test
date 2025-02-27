"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  KeyRound,
  Users,
  Search,
  Heart,
  FileText,
  DollarSign,
  SettingsIcon,
  LogOut,
  ChevronDown,
  Bell,
  Mail,
  User,
} from "lucide-react"

export default function Settings() {
  const [activeMenu, setActiveMenu] = useState("general")

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    {
      icon: Car,
      label: "Vehicle Management",
      submenu: [
        { label: "All Vehicles", href: "/vehicles" },
        { label: "Categories", href: "/categories" },
        { label: "Maintenance", href: "/maintenance" },
      ],
    },
    {
      icon: ShoppingCart,
      label: "Sales",
      submenu: [
        { label: "Orders", href: "/orders" },
        { label: "Transactions", href: "/transactions" },
      ],
    },
    {
      icon: KeyRound,
      label: "Rentals",
      submenu: [
        { label: "Active Rentals", href: "/active-rentals" },
        { label: "Rental History", href: "/rental-history" },
        { label: "Rental Settings", href: "/rental-settings" },
      ],
    },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Search, label: "Lost and Found", href: "/lost-and-found" },
    { icon: Heart, label: "Wishlist Analytics", href: "/wishlist-analytics" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: DollarSign, label: "Financial", href: "/financial" },
    { icon: SettingsIcon, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <div key={index} className="px-4 py-2">
              {item.submenu ? (
                <div>
                  <button className="flex items-center w-full text-gray-700 hover:text-blue-600 font-medium">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </button>
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <a
                        key={subIndex}
                        href={subItem.href}
                        className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a href={item.href} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </a>
              )}
            </div>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-red-600 font-medium">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  <Bell className="w-6 h-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <Mail className="w-6 h-6" />
                </button>
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>
              </div>
            </div>
            <nav className="-mb-px flex space-x-8">
              {["general", "security", "notifications", "billing", "integrations"].map((menu) => (
                <button
                  key={menu}
                  onClick={() => setActiveMenu(menu)}
                  className={`${
                    activeMenu === menu
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {menu}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Settings Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeMenu === "general" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="Vehicle Rental Co."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="contact@vehiclerental.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="09:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="18:00"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Days</label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <button
                        key={day}
                        className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeMenu === "security" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "notifications" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { title: "New Bookings", description: "Receive notifications for new vehicle bookings" },
                    { title: "Booking Updates", description: "Receive notifications when bookings are modified" },
                    { title: "Marketing Updates", description: "Receive updates about new features and promotions" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" defaultChecked={index < 2} />
                          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                          <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeMenu === "billing" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gray-200 rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/24</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 focus:outline-none">Remove</button>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none">
                    + Add Payment Method
                  </button>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Premium Plan - Monthly</p>
                      <p className="text-sm text-gray-500">Jan 1, 2024</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">$99.00</p>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Premium Plan - Monthly</p>
                      <p className="text-sm text-gray-500">Dec 1, 2023</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">$99.00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "integrations" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Services</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Google Calendar</p>
                        <p className="text-sm text-gray-500">Sync your bookings with Google Calendar</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                      Connect
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Stripe</p>
                        <p className="text-sm text-gray-500">Process payments securely</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                      Connected
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

