"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Key,
  Search,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
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
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [theme, setTheme] = useState("system");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if the current path matches a menu item or submenu item
  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (submenu) =>
    submenu.some((item) => location.pathname === item.path);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle theme detection and changes
  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Set initial theme state
    if (theme === "system") {
      setIsDarkMode(prefersDark);
    } else {
      setIsDarkMode(theme === "dark");
    }

    // Listen for changes in system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (theme === "system") {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const toggleTheme = () => {
    const newTheme =
      theme === "system"
        ? isDarkMode
          ? "light"
          : "dark"
        : theme === "dark"
        ? "light"
        : "dark";

    setTheme(newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  const handleLogout = () => {
    // Delete cookies
    Cookies.remove("sauto");
    // Navigate to login page
    navigate("/Login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-primary-700 text-white lg:hidden"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 transition-transform duration-300 ease-in-out transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:w-64
          bg-white dark:bg-gray-900 text-gray-800 dark:text-white
          shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-primary-600 dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-white">Shreya Auto</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary-700 dark:hover:bg-gray-700 text-white"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          <nav className="mt-4 px-2">
            {menuItems.map((item, index) => (
              <div key={index} className="mb-1">
                {item.submenu ? (
                  <div>
                    <button
                      className={`flex items-center w-full px-4 py-2.5 rounded-md transition-colors
                        ${
                          isSubmenuActive(item.submenu)
                            ? "bg-primary-100 dark:bg-gray-800 text-primary-700 dark:text-white font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      onClick={() => toggleSubmenu(index)}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                          openSubmenu === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openSubmenu === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="pl-4 pr-2 py-1 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`block px-4 py-2 rounded-md text-sm transition-colors
                              ${
                                isActive(subItem.path)
                                  ? "bg-primary-50 dark:bg-gray-700 text-primary-700 dark:text-white font-medium"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                              }`}
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                setIsSidebarOpen(false);
                              }
                            }}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2.5 rounded-md transition-colors
                      ${
                        isActive(item.path)
                          ? "bg-primary-100 dark:bg-gray-800 text-primary-700 dark:text-white font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
