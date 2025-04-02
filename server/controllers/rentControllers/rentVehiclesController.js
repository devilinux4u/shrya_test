const express = require('express');
const router = express.Router();
const { RentalAllVehicles, RentalAllVehicleImages, sequelize } = require('../../db/sequelize'); // Import rental & sequelize
const { Sequelize } = require('sequelize'); // Import Sequelize instance

// Route to get one random rental vehicle
router.get('/ran1', async (req, res) => {
    try {
        const randomVehicle = await RentalAllVehicles.findOne({
            include: [
                {
                    model: RentalAllVehicleImages,
                    as: 'rentVehicleImages' // Match this with your association alias
                }
            ],

            order: [Sequelize.literal('RAND()')]
            ,
        });

        if (!randomVehicle) return res.status(404).json({ message: 'No data found' });

        console.log(randomVehicle)

        res.json(randomVehicle);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to get six random rental vehicles
router.get('/ran6', async (req, res) => {
    try {
        const randomVehicles = await RentalAllVehicles.findAll(
            {
                include: [
                    {
                        model: RentalAllVehicleImages,
                        as: 'rentVehicleImages' // Match this with your association alias
                    }
                ],
                order: [Sequelize.literal('RAND()')], limit: 6
            });

        if (!randomVehicles.length) return res.status(404).json({ message: 'No data found' });
        res.json(randomVehicles);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Route to get all rental vehicles
router.get('/all', async (req, res) => {
    try {
        const allVehicles = await RentalAllVehicles.findAll({
            include: [
                {
                    model: RentalAllVehicleImages,
                    as: 'rentVehicleImages' // Match this with your association alias
                }
            ],
    });
        res.json(allVehicles);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
