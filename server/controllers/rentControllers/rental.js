require('dotenv').config();

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("../../db/sequelize"); // Import the entire db object
var request = require('request');


// =============================================
// FILE UPLOAD CONFIGURATION
// =============================================
const uploadDir = path.join(__dirname, '../../uploads/licenses');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
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

// =============================================
// HELPER FUNCTIONS
// =============================================
async function getVehicle(vehicleId) {
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }

  const rawId = parseInt(vehicleId.toString().replace(/^[rv]/, ''));
  if (isNaN(rawId)) {
    throw new Error('Invalid vehicle ID format');
  }

  // Check if it's a rental vehicle
  if (vehicleId.toString().startsWith('r')) {
    const vehicle = await db.Vehicle.findByPk(rawId);
    if (!vehicle) throw new Error(`Rental vehicle with ID ${vehicleId} not found`);
    return { vehicle, isRental: true };
  }

  // Check regular vehicles first
  const vehicle = await db.vehicles.findByPk(rawId);
  if (vehicle) return { vehicle, isRental: false };

  // Fallback to rental vehicles if not found in regular vehicles
  const rentalVehicle = await db.RentalAllVehicles.findByPk(rawId);
  if (rentalVehicle) return { vehicle: rentalVehicle, isRental: true };

  throw new Error(`Vehicle with ID ${vehicleId} not found`);
}

// =============================================
// ROUTES
// =============================================

router.post('/', upload.single('licenseImage'), async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.vehicleId || !req.body.userId) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID and User ID are required'
      });
    }

    // Get vehicle
    const { vehicle, isRental } = await getVehicle(req.body.vehicleId);

    // Prepare rental data
    const rentalData = {
      userId: req.body.userId,
      vehicleId: req.body.vehicleId,
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation || req.body.pickupLocation,
      pickupDate: req.body.pickupDate,
      pickupTime: req.body.pickupTime || '12:00',
      returnDate: req.body.returnDate,
      returnTime: req.body.returnTime || '12:00',
      rentalType: req.body.rentalType || 'day',
      driveOption: req.body.driveOption || 'selfDrive',
      paymentMethod: req.body.paymentMethod || 'payLater',
      totalAmount: parseFloat(req.body.totalAmount) || 0,
      rentalDuration: parseInt(req.body.rentalDuration) || 1,
      status: req.body.paymentMethod === 'payLater' ? 'active' : 'not_paid',
      licenseImageUrl: req.file ? `/uploads/licenses/${req.file.filename}` : null,
    };

    if (req.body.paymentMethod == 'payLater') {
      // Create rental
      const newRental = await db.rental.create(rentalData);

      await db.Transaction.create({
        bookingId: newRental.id,
        pidx: null,
        amount: rentalData.totalAmount,
        status: 'pending',
        method: 'cash'
      });


      res.status(201).json({
        success: true,
        data: {
          ...newRental.toJSON(),
          vehicle: vehicle
        }
      });
    }
    else {

      const newRental = await db.rental.create(rentalData);

      var options = {
        'method': 'POST',
        'url': 'https://dev.khalti.com/api/v2/epayment/initiate/',
        'headers': {
          'Authorization': `key ${process.env.KHALTI_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "return_url": "http://localhost:5173/payment-verify",
          "website_url": "http://localhost:5173/",
          "amount": rentalData.totalAmount * 100,
          "purchase_order_id": `vid-${rentalData.vehicleId}`,
          "purchase_order_name": `for-${rentalData.vehicleId}`,
        })

      };
      request(options, async function (error, response) {
        if (error) throw new Error(error);
        console.log(JSON.parse(response.body));

        await db.Transaction.create({
          bookingId: newRental.id,
          pidx: JSON.parse(response.body).pidx,
          amount: rentalData.totalAmount,
          status: 'pending',
          method: 'khalti'
        });

        res.status(201).json({
          success: true,
          data: JSON.parse(response.body),
        });
      });
    }

  } catch (error) {
    console.error('Rental creation error:', error);

    // Clean up uploaded file if error occurred
    if (req.file) {
      fs.unlink(req.file.path, () => { });
    }

    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rentalRecord = await db.rental.findByPk(req.params.id, {
      include: [
        { model: db.users, as: 'user' }
      ]
    });

    if (!rentalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Parse metadata
    const metadata = rentalRecord.metadata ? JSON.parse(rentalRecord.metadata) : {};
    const isRental = metadata.vehicleType === 'rental';

    // Get vehicle
    const VehicleModel = isRental ? db.RentalAllVehicles : db.vehicles;
    const vehicle = await VehicleModel.findByPk(rentalRecord.vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Associated vehicle not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...rentalRecord.toJSON(),
        vehicle: vehicle
      }
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