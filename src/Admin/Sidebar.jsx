"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  DollarSign,
  Key,
  Search,
  Heart,
  Menu,
} from "lucide-react";
import Cookies from "js-cookie";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Vehicle Management",
    icon: Car,
    submenu: [
      { title: "All Vehicles", path: "/admin/vehicles" },
      { title: "Add New Vehicle", path: "/admin/addnewvehicles" },
    ],
  },

  {
    title: "Rentals",
    icon: Key,
    submenu: [
      { title: "Add Vehicle", path: "/admin/addvehicle" },
      { title: "All Vehicles", path: "/admin/allvehicles" },
      { title: "Active Rentals", path: "/admin/activerentals" },
      { title: "Rental History", path: "/admin/rentalhistory" },
    ],
  },
  {
    title: "Transactions",
    icon: Settings,
    path: "/admin/transactions",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Lost and Found",
    icon: Search,
    path: "/admin/lostandfound",
  },
  {
    title: "Wishlist",
    icon: Heart,
    path: "/admin/adminwishlist",
  },
  {
    title: "Feedback",
    icon: FileText,
    path: "/admin/feedback",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleLogout = () => {
    // Delete cookies
    Cookies.remove("sauto"); // Replace "your_cookie_name" with your actual cookie key(s)
    // Navigate to login page
    navigate("/Login");
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <h1 className="text-2xl font-bold">Shreya Auto</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => toggleSubmenu(index)}
                  >
                    <item.icon className="w-5 h-5 mr-4" />
                    {item.title}
                    <ChevronDown
                      className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                        openSubmenu === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSubmenu === index && (
                    <div className="bg-gray-800 py-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white pl-14"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <item.icon className="w-5 h-5 mr-4" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
