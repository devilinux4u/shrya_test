const express = require('express');
const multer = require('multer');
const router = express.Router();
const { sequelize } = require('../../db/sequelize'); // Import sequelize instance
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the uploads directory
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
      vehicleType,
      brand,
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
      !vehicleType ||
      !brand ||
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

    // Collect the file paths from multer
    const images = req.files ? req.files.map((file) => file.filename) : [];

    // Convert the images array to a comma-separated string for storage in the database
    const imagesString = images.join(',');

    // Raw SQL INSERT query
    const query = `
      INSERT INTO VehicleWishlists (
        purpose, vehicleType, brand, model, vehicleName, year, color, budget, duration, kmRun, ownership, fuelType, description, images
      ) VALUES (
        :purpose, :vehicleType, :brand, :model, :vehicleName, :year, :color, :budget, :duration, :kmRun, :ownership, :fuelType, :description, :images
      )
    `;

    // Execute the query
    const [results, metadata] = await sequelize.query(query, {
      replacements: {
        purpose,
        vehicleType,
        brand,
        model,
        vehicleName,
        year: parseInt(year), // Ensure year is an integer
        color,
        budget: parseFloat(budget), // Ensure budget is a float
        duration,
        kmRun: parseInt(kmRun), // Ensure kmRun is an integer
        ownership,
        fuelType,
        description,
        images: imagesString, // Use the comma-separated string of file paths
      },
      type: sequelize.QueryTypes.INSERT,
    });

    // Return a success response with a `success` property
    return res.status(201).json({
      success: true, // Add this property
      message: 'Wishlist item created successfully',
      data: {
        id: results, // The ID of the newly inserted record
        images: images, // Return the uploaded file paths
      },
    });
  } catch (error) {
    console.error('Error submitting wishlist:', error);
    return res.status(500).json({ 
      success: false, // Add this property
      message: 'Internal server error', 
      error: error.message 
    });
  }
});
module.exports = router;