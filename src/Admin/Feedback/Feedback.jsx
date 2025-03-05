"use client";

import { useState, useEffect } from "react";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState("all");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format the date as "yyyy-mm-dd"
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:3000/contact"); // Fetch messages from backend
        const data = await response.json();
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ); // Sort by date descending
        setFeedbacks(sortedData); // Use the sorted data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedbacks");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleFeedbackClick = async (feedback) => {
    if (feedback.status === "new") {
      try {
        await fetch(`http://localhost:3000/contact/${feedback.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }),
        });
        setFeedbacks(
          feedbacks.map((fb) =>
            fb.id === feedback.id ? { ...fb, status: "read" } : fb
          )
        );
      } catch (err) {
        console.error("Failed to update feedback status:", err);
      }
    }
    setSelectedFeedback({ ...feedback, status: "read" });
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
    Array.isArray(feedbacks) && feedbacks.length > 0
      ? filter === "all"
        ? feedbacks
        : feedbacks.filter((feedback) => feedback.status === filter)
      : []; // Default to an empty array if feedbacks is not valid

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
      <div className="p-8">
        <div className="font-sans text-gray-800 max-w-7xl mx-auto">
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
                      <span>{formatDate(feedback.date)}</span>{" "}
                      {/* Format the date */}
                    </div>
                    <p className="text-sm text-gray-600 m-0 line-clamp-2">
                      {feedback.msg}
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
                      {selectedFeedback.name}
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
                      <span className="font-semibold mr-1">Email:</span>
                      <span className="text-gray-700">
                        {selectedFeedback.email}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold mr-1">Phone:</span>
                      <span className="text-gray-700">
                        {selectedFeedback.phno}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold mr-1">Date:</span>
                      <span className="text-gray-700">
                        {formatDate(selectedFeedback.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow text-base leading-relaxed">
                    <p>{selectedFeedback.msg}</p>
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
    </div>
  );
};

export default Feedback;
