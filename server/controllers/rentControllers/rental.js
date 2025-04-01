const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { rental, vehicles, users } = require("../../db/sequelize");

// Configure file upload
const uploadDir = path.join(__dirname, '../../uploads/licenses');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `license-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create rental (with optional license image)
router.post('/', upload.single('licenseImage'), async (req, res) => {
  try {
    console.log('Received payload:', req.body); // Log incoming data

    // Convert string values to proper types
    const rentalData = {
      userId: parseInt(req.body.userId),
      vehicleId: req.body.vehicleId.startsWith('v') 
                ? parseInt(req.body.vehicleId.substring(1))
                : parseInt(req.body.vehicleId),
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      pickupDate: new Date(`${req.body.pickupDate}T${req.body.pickupTime}`),
      pickupTime: req.body.pickupTime,
      returnDate: new Date(`${req.body.returnDate}T${req.body.returnTime}`),
      returnTime: req.body.returnTime,
      rentalType: req.body.rentalType || 'day',
      driveOption: req.body.driveOption || 'selfDrive',
      paymentMethod: req.body.paymentMethod || 'payLater',
      totalAmount: parseFloat(req.body.totalAmount),
      rentalDuration: parseInt(req.body.rentalDuration),
      status: req.body.status || 'confirmed',
      licenseImageUrl: req.file ? `/uploads/licenses/${req.file.filename}` : null
    };

    const newRental = await rental.create(rentalData);
    res.status(201).json(newRental);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
// Get rental by ID
router.get('/:id', async (req, res) => {
  try {
    const rentalRecord = await rental.findByPk(req.params.id, {
      include: [
        { model: users, as: 'user' },
        { model: vehicles, as: 'vehicle' }
      ]
    });

    if (!rentalRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'Rental not found' 
      });
    }

    res.json({ 
      success: true, 
      data: rentalRecord 
    });

  } catch (error) {
    console.error('Error fetching rental:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch rental' 
    });
  }
});

module.exports = router;