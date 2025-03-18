const express = require('express');
const multer = require('multer');
const router = express.Router();
const { sequelize } = require("../../db/sequelize"); // Import the sequelize instance
const VehicleWishlist = sequelize.models.VehicleWishlist;
const path = require('path');
const fs = require('fs');

// Ensure the uploads/wishlist directory exists
const uploadDir = path.join(__dirname, '../../uploads/wishlist');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the uploads/wishlist directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Allow the file
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false); // Reject the file
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).array('images[]', 10); // Max 10 files

router.post('/wishlistForm', upload, async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    // Destructure data from the request body
    const {
      purpose,
      model,
      vehicleName,
      year,
      color,
      budget,
      duration,
      kmRun,
      ownership,
      fuelType,
      description,
    } = req.body;

    // Validate required fields
    if (
      !purpose ||
      !model ||
      !vehicleName ||
      !year ||
      !color ||
      !budget ||
      !kmRun ||
      !ownership ||
      !fuelType
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Collect the file paths from multer and provide the full location
    const images = req.files
      ? req.files.map((file) => path.join(uploadDir, file.filename)) // Full path to the uploaded file
      : [];

    // Create a new wishlist item using Sequelize's .create() method
    const newWishlist = await VehicleWishlist.create({
      purpose,
      model,
      vehicleName,
      year: parseInt(year),
      color,
      budget: parseFloat(budget),
      duration: purpose === 'rent' ? duration : null, // Only include duration for rental
      kmRun: parseInt(kmRun),
      ownership,
      fuelType,
      description,
      images,
      // No need to pass 'status' as it will use the default value
    });

    // Return a success response
    return res.status(201).json({
      success: true,
      message: 'Wishlist item created successfully',
      data: newWishlist, // Return the newly created wishlist item
    });
  } catch (error) {
    console.error('Error submitting wishlist:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});
module.exports = router;