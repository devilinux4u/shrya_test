import { useState, useEffect, useRef } from "react";
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
      { title: "Appointments", path: "/admin/appointments" },
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
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  // Check if the current path matches a menu item or submenu item
  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (submenu) =>
    submenu.some((item) => location.pathname === item.path);

  // Initialize sidebar state and detect mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-open on tablet and desktop
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        // Check if the click is not on the toggle button (which has its own handler)
        const toggleButton = document.getElementById("sidebar-toggle");
        if (!toggleButton.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleLogout = () => {
    // Delete cookies
    Cookies.remove("sauto");
    // Navigate to login page
    navigate("/Login");
  };

  // Handle navigation click - close sidebar on mobile
  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        className="fixed top-4 right-4 z-40 p-2 rounded-md bg-white text-black shadow-md hover:bg-gray-100 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-gray-300"
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
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 w-[280px] sm:w-[320px] md:w-[280px] lg:w-64 transition-all duration-300 ease-in-out transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          bg-white dark:bg-gray-900 text-gray-800 dark:text-white
          shadow-lg overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-primary-600 dark:bg-gray-800">
          <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
            Shreya Auto
          </h1>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-primary-700 dark:hover:bg-gray-700 text-white md:hidden focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className="h-[calc(100%-4rem)] flex flex-col">
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <nav className="p-3">
              {menuItems.map((item, index) => (
                <div key={index} className="mb-1">
                  {item.submenu ? (
                    <div>
                      <button
                        className={`flex items-center w-full px-4 py-3 rounded-md transition-colors
                          ${
                            isSubmenuActive(item.submenu)
                              ? "bg-primary-100 dark:bg-gray-800 text-primary-700 dark:text-white font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={() => toggleSubmenu(index)}
                        aria-expanded={openSubmenu === index}
                      >
                        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
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
                              className={`block px-4 py-2.5 rounded-md text-sm transition-colors
                                ${
                                  isActive(subItem.path)
                                    ? "bg-primary-50 dark:bg-gray-700 text-primary-700 dark:text-white font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                }`}
                              onClick={handleNavClick}
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
                      className={`flex items-center px-4 py-3 rounded-md transition-colors
                        ${
                          isActive(item.path)
                            ? "bg-primary-100 dark:bg-gray-800 text-primary-700 dark:text-white font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      onClick={handleNavClick}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Margin for Desktop */}
      <div className="md:pl-[280px] lg:pl-64 transition-all duration-300"></div>
    </>
  );
}
