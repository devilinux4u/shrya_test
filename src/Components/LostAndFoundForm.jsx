"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { useNavigate } from "react-router-dom"

const LostAndFoundForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    location: "",
    date: "",
    category: "",
    name: "",
    phone: "",
    email: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Report Lost/Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="type" className="block text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
          >
            <option value="lost">Lost Item</option>
            <option value="found">Found Item</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            placeholder="Brief title of the item"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            placeholder="Detailed description of the item..."
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            placeholder="Where was it lost/found?"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Upload Image</label>
          <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition flex flex-col items-center justify-center">
            <Camera className="h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
            <input type="file" className="hidden" accept="image/*" multiple />
          </div>
        </div>

        <div className="flex justify-end gap-2 sm:gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  )
}

export default LostAndFoundForm

