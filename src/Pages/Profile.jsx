"use client"

import { useState, useRef, useEffect } from "react"
import { Mail, Phone, Calendar, Edit, Camera, Trash2, Upload, Save, X } from "lucide-react"

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    username: "johndoe123",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "January 2022",
    avatar: "/placeholder.svg?height=200&width=200",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const fileInputRef = useRef(null)
  const photoOptionsRef = useRef(null)

  // Close photo options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (photoOptionsRef.current && !photoOptionsRef.current.contains(event.target)) {
        setShowPhotoOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    console.log("Saving profile:", user)
    setIsEditing(false)
  }

  const handleAvatarClick = () => {
    setShowPhotoOptions(!showPhotoOptions)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
    setShowPhotoOptions(false)
  }

  const handleDeletePhoto = () => {
    setUser((prevUser) => ({
      ...prevUser,
      avatar: "/placeholder.svg?height=200&width=200",
    }))
    setShowPhotoOptions(false)
  }

  const handleUploadPhoto = () => {
    fileInputRef.current.click()
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header with Background */}
        <div className="relative h-36 sm:h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          {/* Edit/Save Button - Absolute Position */}
          <div className="absolute top-4 right-4 z-10">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                  aria-label="Cancel editing"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center justify-center p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                  aria-label="Save profile"
                >
                  <Save className="h-5 w-5 text-green-600" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center justify-center p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                aria-label="Edit profile"
              >
                <Edit className="h-5 w-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
          {/* Avatar - Positioned to overlap the header */}
          <div className="relative -mt-20 sm:-mt-24 flex justify-center" ref={photoOptionsRef}>
            <div className="relative">
              <img
                className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer transition-transform hover:scale-105"
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                onClick={handleAvatarClick}
              />
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Change profile picture"
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
              {showPhotoOptions && (
                <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-xl z-10 -left-4 transform translate-y-2 border border-gray-100">
                  <div className="py-1">
                    <button
                      onClick={handleUploadPhoto}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="inline-block w-4 h-4 mr-3 text-blue-500" />
                      Upload new photo
                    </button>
                    <button
                      onClick={handleDeletePhoto}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      <Trash2 className="inline-block w-4 h-4 mr-3" />
                      Delete photo
                    </button>
                  </div>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          {/* User Name and Username */}
          <div className="mt-4 sm:mt-6 text-center">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-200 text-center w-full sm:w-2/3 mx-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{user.name}</h1>
            )}
            {isEditing ? (
              <div className="mt-2">
                <div className="flex items-center justify-center">
                  <span className="text-gray-500 mr-1">@</span>
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                    className="text-base sm:text-lg text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200 text-center w-full sm:w-2/3 mx-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <p className="text-base sm:text-lg text-gray-600 mt-2">@{user.username}</p>
            )}
          </div>

          {/* Contact Info Card */}
          <div className="mt-8 bg-gray-50 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <Mail className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="w-full text-sm sm:text-base text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-600 truncate">{user.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <Phone className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      className="w-full text-sm sm:text-base text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-600 truncate">{user.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center bg-white p-3 rounded-lg shadow-sm md:col-span-2">
                <Calendar className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-1">Member Since</p>
                  <p className="text-sm sm:text-base text-gray-600">{user.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit/Save Button - Mobile Friendly Bottom Button */}
          <div className="mt-8 sm:hidden">
            <button
              onClick={isEditing ? handleSaveProfile : handleEditToggle}
              className="w-full flex justify-center items-center px-6 py-3 rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="h-5 w-5 mr-2" /> Save Profile
                </>
              ) : (
                <>
                  <Edit className="h-5 w-5 mr-2" /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

