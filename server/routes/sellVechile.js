const express = require('express')
const router = express.Router()
const multer = require("multer");
const { vehicles, v_img } = require('../db/sequelize')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/addVehicle', upload.array("images", 5), async (req, res) => {

    console.log(req.body);

    try {
        const { uid, title, make, model, year, type, color, km, fuel, trans, price, des } = req.body;

        // Create vehicle entry
        const vehicle = await vehicles.create({
            uid, title, make, model, year, type, color, km, fuel, trans, price, des
        });

        // Save images as BLOBs
        if (req.files) {
            for (let file of req.files) {
                await v_img.create({
                    vehicleId: vehicle.id,
                    image: file.buffer  // Store image as binary
                });
            }
        }

        res.json({ success: true, msg: "Vehicle added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});


// Route to Fetch Vehicle with Images
router.get("/vehicles", async (req, res) => {
    try {
        const vehicless = await vehicles.findAll({
            include: [{ model: v_img, attributes: ["id", "image"] }]
        });

        // Convert BLOBs to Base64
        const formattedVehicles = vehicless.map(vehicle => ({
            ...vehicle.toJSON(),
            images: vehicle.vehicle_images.map(img => ({
                id: img.id,
                image: `data:image/jpeg;base64,${img.image.toString("base64")}`
            }))
        }));

        res.json(formattedVehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;