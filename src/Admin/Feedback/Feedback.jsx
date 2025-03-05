"use client";

import { useState, useEffect } from "react";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState("all");

  // Mock data - replace with your actual API call
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/feedbacks');
        // const data = await response.json();

        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phoneNumber: "123-456-7890",
            message:
              "I found it difficult to navigate through the product catalog. The search functionality is not working properly.",
            date: "2023-05-15",
            status: "new",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            phoneNumber: "987-654-3210",
            message:
              "I just wanted to thank your team for the excellent support I received yesterday. The representative was very helpful and solved my issue quickly.",
            date: "2023-05-14",
            status: "read",
          },
          {
            id: 3,
            name: "Mike Johnson",
            email: "mike@example.com",
            phoneNumber: "456-789-0123",
            message:
              "It would be great if you could add a dark mode option to the application. It would help reduce eye strain when using the app at night.",
            date: "2023-05-13",
            status: "new",
          },
          {
            id: 4,
            name: "Sarah Williams",
            email: "sarah@example.com",
            phoneNumber: "789-012-3456",
            message:
              "The checkout process freezes when I try to use PayPal as a payment method. I had to refresh the page multiple times to complete my purchase.",
            date: "2023-05-12",
            status: "read",
          },
          {
            id: 5,
            name: "David Brown",
            email: "david@example.com",
            phoneNumber: "012-345-6789",
            message:
              "The mobile app would benefit from having a remember me option on the login screen. Currently, I have to enter my credentials every time I open the app.",
            date: "2023-05-11",
            status: "read",
          },
        ];

        setFeedbacks(mockData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedbacks");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleFeedbackClick = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleCloseDetails = () => {
    setSelectedFeedback(null);
  };

  const handleMarkAsRead = (id) => {
    setFeedbacks(
      feedbacks.map((feedback) =>
        feedback.id === id ? { ...feedback, status: "read" } : feedback
      )
    );

    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback({ ...selectedFeedback, status: "read" });
    }
  };

  const handleDelete = (id) => {
    setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));

    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback(null);
    }
  };

  const filteredFeedbacks =
    filter === "all"
      ? feedbacks
      : feedbacks.filter((feedback) => feedback.status === filter);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Loading feedbacks...
      </div>
    );
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="flex-1 ml-64 min-h-screen bg-gray-50">
      <div className="p-5 font-sans text-gray-800 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-700 m-0">
            User Feedback Management
          </h1>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === "new"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setFilter("new")}
            >
              New
            </button>
            <button
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === "read"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setFilter("read")}
            >
              Read
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-120px)] min-h-[500px]">
          <div className="bg-white rounded-lg shadow-md p-5 overflow-y-auto lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mt-0 mb-4">
              Feedbacks ({filteredFeedbacks.length})
            </h2>
            {filteredFeedbacks.length === 0 ? (
              <p className="text-gray-500 text-center py-5">
                No feedbacks found
              </p>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-md mb-3 cursor-pointer transition-all ${
                    feedback.status === "new"
                      ? "border-l-4 border-red-500"
                      : "border-l-4 border-transparent"
                  } ${
                    selectedFeedback?.id === feedback.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleFeedbackClick(feedback)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-base font-semibold m-0">
                      {feedback.name}
                    </h3>
                    {feedback.status === "new" && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>{feedback.email}</span>
                    <span>{feedback.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 m-0 line-clamp-2">
                    {feedback.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <div
            className={`fixed inset-0 lg:static lg:col-span-2 bg-white rounded-lg shadow-md p-5 flex flex-col overflow-y-auto transition-transform duration-300 z-50 lg:z-auto ${
              selectedFeedback
                ? "translate-y-0 lg:translate-x-0 opacity-100"
                : "translate-y-full lg:translate-y-0 lg:translate-x-full opacity-0 lg:opacity-100"
            }`}
          >
            {selectedFeedback ? (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-gray-700 m-0">
                    Feedback Details
                  </h2>
                  <button
                    className="bg-transparent border-none text-2xl text-gray-500 cursor-pointer"
                    onClick={handleCloseDetails}
                  >
                    ×
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md mb-5">
                  <div className="mb-2">
                    <span className="font-semibold mr-1">Name:</span>
                    <span className="text-gray-700">
                      {selectedFeedback.name}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold mr-1">Email:</span>
                    <span className="text-gray-700">
                      {selectedFeedback.email}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold mr-1">Phone:</span>
                    <span className="text-gray-700">
                      {selectedFeedback.phoneNumber}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold mr-1">Date:</span>
                    <span className="text-gray-700">
                      {selectedFeedback.date}
                    </span>
                  </div>
                </div>
                <div className="flex-grow text-base leading-relaxed">
                  <p>{selectedFeedback.message}</p>
                </div>
                <div className="flex justify-end gap-3 mt-5 flex-wrap">
                  {selectedFeedback.status === "new" && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      onClick={() => handleMarkAsRead(selectedFeedback.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    onClick={() => handleDelete(selectedFeedback.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                <p>Select a feedback to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
