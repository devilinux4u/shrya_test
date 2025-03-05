const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { rental, rentl_Vimg, vehicles, users } = require("../../db/sequelize");

// Image routes
router.get("/:id", async (req, res) => {
  try {
    const image = await rentl_Vimg.findByPk(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    const imagePath = path.join(__dirname, '..', image.imageUrl);
    if (!fs.existsSync(imagePath)) return res.status(404).json({ success: false, message: "File not found" });
    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const image = await rentl_Vimg.findByPk(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    const imagePath = path.join(__dirname, '..', image.imageUrl);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    await image.destroy();
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
});

// Rental routes
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
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', upload.single('licenseImage'), async (req, res) => {
  try {
    const vehicleId = req.body.vehicleId.toString().startsWith('v') 
      ? parseInt(req.body.vehicleId.substring(1))
      : parseInt(req.body.vehicleId);

    // Verify vehicle exists
    const vehicle = await vehicles.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Specified vehicle does not exist'
      });
    }

    // Verify user exists
    const user = await users.findByPk(parseInt(req.body.userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create rental
    const newRental = await rental.create({
      userId: user.id,
      vehicleId: vehicle.id,
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      pickupDate: new Date(`${req.body.pickupDate}T${req.body.pickupTime}`),
      pickupTime: req.body.pickupTime,
      returnDate: new Date(`${req.body.returnDate}T${req.body.returnTime}`),
      returnTime: req.body.returnTime,
      rentalType: req.body.rentalType,
      driveOption: req.body.driveOption,
      paymentMethod: req.body.paymentMethod,
      totalAmount: parseFloat(req.body.totalAmount),
      rentalDuration: parseInt(req.body.rentalDuration),
      status: 'confirmed' // Changed from 'pending' to match model default
    });

    // Handle license image
    if (req.file && req.body.driveOption === 'selfDrive') {
      await rentl_Vimg.create({
        imageUrl: `/uploads/licenses/${req.file.filename}`,
        rentalId: newRental.id,
        imageType: 'license'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Rental created successfully',
      rentalId: newRental.id
    });

  } catch (error) {
    console.error('Rental error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

module.exports = router;