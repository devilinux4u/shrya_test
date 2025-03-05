const express = require('express')
const router = express.Router()
const multer = require("multer");
const { sequelize, vehicles, v_img } = require('../db/sequelize')
const fs = require('fs')
const path = require('path')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/addVehicle', upload.array('images'), async (req, res) => {
    try {
        const { ownership, mileage, seats, engineCC, title, make, model, year, type, color, totalKm, fuelType, transmission, price, description, id } = req.body;
        // Create vehicle entry in the database
        const vehicle = await vehicles.create({
            uid: id,
            title,
            make,
            model,
            year,
            type,
            color,
            km: totalKm,
            fuel: fuelType,
            trans: transmission,
            price,
            des: description,
            own: ownership,
            mile: mileage,
            seat: seats,
            cc: engineCC,
        });
     
        // Define the image folder path
        const imageFolder = path.join(__dirname, '../uploads', id);
     
        // Create folder if it doesn't exist
        if (!fs.existsSync(imageFolder)) {
            fs.mkdirSync(imageFolder, { recursive: true });
        }
     
        // Save images to local storage and database
        if (req.files) {
            for (let file of req.files) {
                const imagePath = path.join(imageFolder, file.originalname);
     
                // Save image as a file
                fs.writeFileSync(imagePath, file.buffer);
     
                // Save image reference in DB
                await v_img.create({
                    vehicleId: vehicle.id,
                    imagePath, // Store image path instead of binary data
                });
            }
        }
     
        res.json({ success: true, msg: 'Vehicle added successfully!' });
     } catch (error) {
        console.error('Error during vehicle creation or image handling:', error);
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
     }
     
});


// Route to Fetch Vehicle with Images
router.get("/vehicles/random", async (req, res) => {
    try {
        const vehicless = await vehicles.findOne({
            order: sequelize.literal("RAND()"),
            include: [{ model: v_img, attributes: ["id", "image"] }]
        });

        if (!vehicless) {
            return res.status(404).json({ success: false, msg: "No vehicle found" });
        }

        // Convert BLOBs to Base64
        const formattedVehicle = {
            ...vehicless.toJSON(),
            images: vehicless.vehicle_images.map(img => ({
                id: img.id,
                image: `data:image/jpeg;base64,${img.image.toString("base64")}`
            }))
        };

        res.json({ success: true, msg: formattedVehicle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }

});

router.get("/vehicles/three", async (req, res) => {
    try {
        const vehicless = await vehicles.findAll({
            order: sequelize.literal("RAND()"),
            limit: 3, // Fetch 3 random vehicles
            include: [{ model: v_img, attributes: ["id", "image"] }]
        });

        if (!vehicless || vehicless.length === 0) {
            return res.status(404).json({ success: false, msg: "No vehicles found" });
        }

        // Convert BLOBs to Base64
        const formattedVehicles = vehicless.map(vehicle => ({
            ...vehicle.toJSON(),
            images: vehicle.vehicle_images.map(img => ({
                id: img.id,
                image: `data:image/jpeg;base64,${img.image.toString("base64")}`
            }))
        }));

        res.json({ success: true, msg: formattedVehicles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }

});

router.get("/vehicles/all", async (req, res) => {
    try {
        const vehicless = await vehicles.findAll({
            order: sequelize.literal("RAND()"),
            include: [{ model: v_img, attributes: ["id", "image"] }]
        });

        if (!vehicless || vehicless.length === 0) {
            return res.status(404).json({ success: false, msg: "No vehicles found" });
        }

        // Convert BLOBs to Base64
        const formattedVehicles = vehicless.map(vehicle => ({
            ...vehicle.toJSON(),
            images: vehicle.vehicle_images.map(img => ({
                id: img.id,
                image: `data:image/jpeg;base64,${img.image.toString("base64")}`
            }))
        }));

        res.json({ success: true, msg: formattedVehicles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }

});

router.get("/vehicles/one/:vid", async (req, res) => {
    try {
        const vehicleId = req.params.vid;

        const vehicle = await vehicles.findOne({
            where: { id: vehicleId },
            include: [{ model: v_img, attributes: ["id", "image"] }]
        });

        if (!vehicle) {
            return res.status(404).json({ success: false, msg: "Vehicle not found" });
        }

        const formattedVehicle = {
            ...vehicle.toJSON(),
            images: vehicle.vehicle_images.map(img => ({
                id: img.id,
                image: `data:image/jpeg;base64,${img.image.toString("base64")}`
            }))
        };


        res.json({ success: true, msg: formattedVehicle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }


});


module.exports = router;