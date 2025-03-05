const express = require('express')
const router = express.Router()
const multer = require("multer");
const { sequelize, vehicles, v_img, users } = require('../../db/sequelize')
const fs = require('fs')
const path = require('path')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const upload = require('../uploads');


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
        const imageFolder = path.join(__dirname, '../uploads', vehicle.id.toString());

        // Create folder if it doesn't exist
        if (!fs.existsSync(imageFolder)) {
            fs.mkdirSync(imageFolder, { recursive: true });
        }

        let savedImages = [];
        
        // Save images to local storage and database
        if (req.files) {
            for (let file of req.files) {
                const imagePath = path.join(imageFolder, file.originalname);
                
                // Move image to the folder
                fs.writeFileSync(imagePath, file.buffer);

                // Store only the relative path in the DB
                const relativePath = `/uploads/${vehicle.id}/${file.originalname}`;

                await v_img.create({
                    vehicleId: vehicle.id,
                    image: relativePath, // Store relative path
                });

                savedImages.push(relativePath);
            }
        }

        res.json({ success: true, msg: 'Vehicle added successfully!', images: savedImages });
    } catch (error) {
        console.error('Error during vehicle creation or image handling:', error);
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
});
 

// Route to Fetch Vehicle with Images
router.get("/vehicles/random", async (req, res) => {
    try {
        const vehicleData = await vehicles.findOne({
            where: { status: "available" },
            order: sequelize.literal("RAND()"),
            include: [{ model: v_img, attributes: ["id", "image"] }]
        });

        if (!vehicleData) {
            return res.status(404).json({ success: false, msg: "No vehicle found" });
        }

        // Convert BLOBs to Base64
        const formattedVehicle = {
            ...vehicleData.toJSON(),
            images: vehicleData.SellVehicleImages.map(img => ({
                id: img.id,
                image: img.image
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
        const vehicleData = await vehicles.findAll({
            where: { status: "available" },
            order: sequelize.literal("RAND()"),
            limit: 3, // Fetch 3 random vehicles
            include: [{ model: v_img, attributes: ["id", "image"] }]
        });

        if (!vehicleData || vehicleData.length === 0) {
            return res.status(404).json({ success: false, msg: "No vehicles found" });
        }

        // Convert BLOBs to Base64
        const formattedVehicles = vehicleData.map(vehicle => ({
            ...vehicle.toJSON(),
            images: vehicle.SellVehicleImages.map(img => ({
                id: img.id,
                image: img.image
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
        const vehicleData = await vehicles.findAll({
            where: { status: "available" },
            order: sequelize.literal("RAND()"),
            include: [
                { model: v_img, 
                    attributes: ["id", "image"] 
                },
                {
                    model: users,
                    as: "user",
                    attributes: ["uname"] // Only fetch the fname field
                }]
        });

        if (!vehicleData || vehicleData.length === 0) {
            return res.status(404).json({ success: false, msg: "No vehicles found" });
        }

        // Convert BLOBs to Base64
        const formattedVehicles = vehicleData.map(vehicle => ({
            ...vehicle.toJSON(),
            images: vehicle.SellVehicleImages.map(img => ({
                id: img.id,
                image: img.image
            }))
        }));

        res.json({ success: true, msg: formattedVehicles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }

});

// same as above for admin
router.get("/vehicles/admin/all", async (req, res) => {
    try {
        const vehicleData = await vehicles.findAll({
            order: sequelize.literal("RAND()"),
            include: [
                { model: v_img, attributes: ["id", "image"] },
                {
                    model: users,
                    as: "user",
                    attributes: ["fname"] // Fetch fname instead of uname
                }
            ]
        });

        if (!vehicleData || vehicleData.length === 0) {
            return res.status(404).json({ success: false, msg: "No vehicles found" });
        }

        const formattedVehicles = vehicleData.map(vehicle => ({
            ...vehicle.toJSON(),
            images: vehicle.SellVehicleImages.map(img => ({
                id: img.id,
                image: img.image
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
            include: [
                {
                    model: v_img,
                    attributes: ["id", "image"]
                },
                {
                    model: users,
                    as: "user",
                    attributes: ["id", "fname", "uname", "email", "num"] // Include user ID
                }
            ]
        });

        if (!vehicle) {
            return res.status(404).json({ success: false, msg: "Vehicle not found" });
        }

        const formattedVehicle = {
            ...vehicle.toJSON(),
            images: vehicle.SellVehicleImages.map(img => ({
                id: img.id,
                image: img.image
            }))
        };


        res.json({ success: true, msg: formattedVehicle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }


});



// DELETE route to remove a vehicle by ID
router.delete("/vehicles/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the vehicle by ID
      const vehicle = await vehicles.findByPk(id);
  
      if (!vehicle) {
        return res.status(404).json({ success: false, message: "Vehicle not found" });
      }
  
      // Delete the vehicle
      await vehicle.destroy();
  
      res.json({ success: true, message: "Vehicle deleted successfully" });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ success: false, message: "Failed to delete vehicle", error: error.message });
    }
  });
  

// PUT route to update a vehicle by ID
router.put("/vehicles/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Find the vehicle by ID
        const vehicle = await vehicles.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        // Update the vehicle with new data
        await vehicle.update(updatedData);

        res.json({ success: true, message: "Vehicle updated successfully", data: vehicle });
    } catch (error) {
        console.error("Error updating vehicle:", error);
        res.status(500).json({ success: false, message: "Failed to update vehicle", error: error.message });
    }
});


// PUT route to mark a vechile as sold
router.put("/vehicles/sold/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the item
      const report = await vehicles.findByPk(id);
      if (!report) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }
  
      // Update the status to 'resolved'
      report.status = "sold";
      await report.save();
  
      res.status(200).json({ success: true, message: "Item marked as resolved", data: report });
    } catch (error) {
      console.error("Error updating item status:", error);
      res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
    }
  });




//Route to get mySales vechile
router.get("/vehicles/user/all/:uid", async (req, res) => {
    try {
        const userId = req.params.uid;

        // Changed from findOne to findAll to get all user vehicles
        const vehicleData = await vehicles.findAll({
            where: { uid: userId },
            include: [
                {
                    model: v_img,
                    attributes: ["id", "image"]
                },
            ]
        });

        if (!vehicleData || vehicleData.length === 0) {
            return res.status(404).json({ success: false, msg: "No vehicles found for this user" });
        }

        // Format all vehicles
        const formattedVehicles = vehicleData.map(vehicle => ({
            ...vehicle.toJSON(),
            images: vehicle.SellVehicleImages.map(img => ({
                id: img.id,
                image: img.image
            }))
        }));

        res.json({ success: true, data: formattedVehicles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

router.get("/book/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const vehicle = await vehicles.findByPk(id, {
        include: [
          { model: v_img, attributes: ["id", "image"] },
          { model: users, as: "user", attributes: ["fname", "email", "num"] },
        ],
      });
  
      if (!vehicle) {
        return res.status(404).json({ success: false, message: "Vehicle not found" });
      }
  
      res.json({ success: true, message: "Booking page placeholder", data: vehicle });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

module.exports = router;