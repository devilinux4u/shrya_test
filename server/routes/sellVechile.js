const express = require('express')
const router = express.Router()
const multer = require("multer");
const { vehicles } = require('../db/sequelize')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addVehicle', upload.single("images"), async (req, res) => {

    console.log(req.body);

    try {
        const { uid, title, make, model, year, type, color, km, fuel, trans, price, des } = req.body;

        // Create vehicle entry
        const vehicle = await Vehicle.create({
            uid, title, make, model, year, type, color, km, fuel, trans, price, des, image: req.file.buffer
        });

        res.json({ success: true, msg: "Vehicle added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});


module.exports = router;