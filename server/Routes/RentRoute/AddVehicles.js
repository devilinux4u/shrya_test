const multer = require('multer');
const path = require('path');
const { RentalAllVehicles, RentalAllVehicleImages } = require('../../Database/Sequelize');
const fs = require('fs');

// Configure upload directory
const uploadDir = path.join(__dirname, '../../uploads/rental-vehicles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `rental-vehicle-${Date.now()}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, png, gif, webp) are allowed!'), false);
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10
  }
}).array('images', 10);

const validateVehicleData = (data) => {
  const errors = [];
  
  // Required fields
  const requiredFields = {
    make: 'Make is required',
    model: 'Model is required',
    year: 'Year is required',
    numberPlate: 'Number plate is required',
    description: 'Description is required',
    seats: 'Seat count is required',
    doors: 'Door count is required',
    transmission: 'Transmission type is required',
    fuel: 'Fuel type is required',
    engine: 'Engine info is required',
    power: 'Power is required',
    mileage: 'Mileage is required'
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!data[field]) {
      errors.push(message);
    }
  }

  // Validate year
  if (data.year && (isNaN(data.year) || data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
    errors.push('Invalid year');
  }

  // Validate prices
  const priceFields = ['hour', 'day', 'week', 'month'];
  for (const field of priceFields) {
    const price = data[`price_${field}`];
    if (!price || isNaN(price)) {
      errors.push(`Price per ${field} must be a number`);
    } else if (parseFloat(price) <= 0) {
      errors.push(`Price per ${field} must be greater than 0`);
    }
  }

  return errors;
};

const addVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      // Handle upload errors
      if (err) {
        console.error('Upload error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large (max 10MB)'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files (max 10)'
          });
        }
        if (err.message.includes('image files')) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        return res.status(500).json({
          success: false,
          message: 'File upload failed'
        });
      }

      // Validate input data
      const validationErrors = validateVehicleData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      // Process and save vehicle data
      const vehicle = await RentalAllVehicles.create({
        make: req.body.make,
        model: req.body.model,
        year: parseInt(req.body.year),
        numberPlate: req.body.numberPlate,
        priceHour: parseFloat(req.body.price_hour),
        priceDay: parseFloat(req.body.price_day),
        priceWeek: parseFloat(req.body.price_week),
        priceMonth: parseFloat(req.body.price_month),
        seats: parseInt(req.body.seats),
        doors: parseInt(req.body.doors),
        transmission: req.body.transmission,
        fuelType: req.body.fuel,
        mileage: parseInt(req.body.mileage),
        engine: req.body.engine,
        power: parseInt(req.body.power),
        features: req.body.features,
        description: req.body.description,
        status: 'available'
      });

      // Save images
      let savedImages = [];
      if (req.files && req.files.length > 0) {
        savedImages = await Promise.all(
          req.files.map(file => 
            RentalAllVehicleImages.create({
              vehicleId: vehicle.id,
              image: `/uploads/rental-vehicles/${file.filename}`
            })
          )
        );
      }

      // Successful response
      return res.status(201).json({
        success: true,
        message: 'Rental vehicle added successfully',
        data: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          numberPlate: vehicle.numberPlate,
          imageCount: savedImages.length
        }
      });

    } catch (error) {
      console.error('Error in addVehicle:', error);
      
      // Handle specific Sequelize errors
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => err.message)
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Duplicate entry',
          errors: error.errors.map(err => `${err.path} already exists`)
        });
      }

      // Generic error response
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
};

module.exports = addVehicle;