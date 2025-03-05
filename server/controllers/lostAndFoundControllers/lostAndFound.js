const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { LostAndFound } = require("../../db/sequelize"); // Adjust the path as needed; // Ensure the correct path to your models

// Configure storage for uploaded files
const uploadDir = path.join(__dirname, '../../uploads/lostAndFound');
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

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize Multer
const upload = multer({ storage, fileFilter });

// Handle POST request for form submission
router.post("/", upload.array("images"), async (req, res) => {
  try {
    // Log uploaded files to confirm Multer is processing them
    console.log("Uploaded files:", req.files); // <-- Add this line here

    const { type, title, description, location, date } = req.body;

    // Get the file paths of uploaded images
    const images = req.files.map((file) => file.path);

    console.log("File paths:", images); // Log file paths

    // Create a new LostAndFound record in the database
    const newReport = await LostAndFound.create({
      type,
      title,
      description,
      location,
      date,
      images,
    });

    res.status(201).json({ success: true, message: "Report submitted successfully!", data: newReport });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ success: false, message: "Failed to submit report", error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const reports = await LostAndFound.findAll({
      attributes: ['id', 'type', 'title', 'description', 'location', 'date', 'images'], // Specify fields to return
      order: [['date', 'DESC']], // Sort by date in descending order
    });
    res.json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports", error: error.message });
  }
});

module.exports = router;