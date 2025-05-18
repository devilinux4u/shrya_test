const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { LostAndFound, LostAndFoundImage, users } = require("../../Database/Sequelize"); 

// Configure storage for uploaded files
const uploadDir = path.join(__dirname, '../../uploads/lostAndFound');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
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
    const { id, type, title, description, location, vehicleModel, vehicleMake, numberPlate, date } = req.body;

    // Create a new LostAndFound record
    const newReport = await LostAndFound.create({
      uid: id,
      type,
      title,
      description,
      location,
      model: vehicleModel,
      make: vehicleMake,
      nplate: numberPlate,
      date,
    });

    // Save each image into LostAndFoundImage table
    const imagePromises = req.files.map((file) => {
      return LostAndFoundImage.create({
        imageUrl: `/uploads/lostAndFound/${file.filename}`,
        lostAndFoundId: newReport.id,
      });
    });

    await Promise.all(imagePromises);

    res.status(201).json({ 
      success: true, 
      message: "Report and images submitted successfully!", 
      data: newReport 
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ success: false, message: "Failed to submit report", error: error.message });
  }
});

// GET all Lost & Found entries with images
router.get("/all", async (req, res) => {
  try {
    const reports = await LostAndFound.findAll({
      where: { status: "active" },
      include: [
        {
          model: LostAndFoundImage,
          as: "images",
        },
        {
          model: users,
          as: "user",
          attributes: ['fname', 'num', 'id'], 
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching Lost & Found reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports", error: error.message });
  }
});

router.get("/admin/all", async (req, res) => {
  try {
    const reports = await LostAndFound.findAll({
      include: [
        {
          model: LostAndFoundImage,
          as: "images",
        },
        {
          model: users,
          as: "user",
          attributes: ['fname', 'num', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching Lost & Found reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports", error: error.message });
  }
});

router.get("/all2/:id", async (req, res) => {
  try {
    const reports = await LostAndFound.findAll({
      where: { uid: req.params.id },
      include: [
        {
          model: LostAndFoundImage,
          as: "images",
        },
        {
          model: users,
          as: "user",
          attributes: ['fname', 'num'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching Lost & Found reports:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reports", error: error.message });
  }
});

// PUT route to mark a report as resolved
router.put("/resolve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the item
    const report = await LostAndFound.findByPk(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Update the status to 'resolved'
    report.status = "resolved";
    await report.save();

    res.status(200).json({ success: true, message: "Item marked as resolved", data: report });
  } catch (error) {
    console.error("Error updating item status:", error);
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
});

// PUT route to edit a Lost & Found report
router.put("/edit/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, description, location, date, type, vehicleMake, vehicleModel, numberPlate } = req.body;

    // Find the item
    const report = await LostAndFound.findByPk(itemId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Update the fields
    report.title = title || report.title;
    report.description = description || report.description;
    report.location = location || report.location;
    report.date = date || report.date;
    report.type = type || report.type;
    report.make = vehicleMake || report.make;
    report.model = vehicleModel || report.model;
    report.nplate = numberPlate || report.nplate;

    await report.save();

    res.status(200).json({ success: true, message: "Item updated successfully", data: report });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, message: "Failed to update item", error: error.message });
  }
});

// DELETE route to delete a Lost & Found report
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the item
    const report = await LostAndFound.findByPk(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Delete associated images
    await LostAndFoundImage.destroy({ where: { lostAndFoundId: id } });

    // Delete the item
    await report.destroy();

    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Failed to delete item", error: error.message });
  }
});

module.exports = router;