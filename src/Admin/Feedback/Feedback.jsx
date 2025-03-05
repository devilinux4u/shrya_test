"use client";

import { useState, useEffect } from "react";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format the date as "yyyy-mm-dd"
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:3000/contact"); // Fetch messages from backend
        const data = await response.json();
        setFeedbacks(data); // Set fetched data as feedbacks
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
    setSelectedFeedback(feedback);
  };

  const handleCloseDetails = () => {
    setSelectedFeedback(null);
  };

  const handleDelete = (id) => {
    setFeedbackToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      await fetch(`http://localhost:3000/contact/${feedbackToDelete}`, {
        method: "DELETE",
      });

      setFeedbacks(
        feedbacks.filter((feedback) => feedback.id !== feedbackToDelete)
      );

      if (selectedFeedback && selectedFeedback.id === feedbackToDelete) {
        setSelectedFeedback(null);
      }

      setIsDeleteModalOpen(false);
      setFeedbackToDelete(null);
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    }
  };

  const filteredFeedbacks =
    filter === "all"
      ? feedbacks.sort((a, b) => new Date(b.date) - new Date(a.date))
      : feedbacks
          .filter((feedback) => feedback.status === filter)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

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
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this feedback? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
